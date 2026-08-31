/**
 * Client-side analytics — two channels.
 *
 * `safeTrack()` wraps @vercel/analytics with a try/catch, since a blocked
 * script (adblock, privacy mode) must never break the calling component.
 * Previously every caller re-implemented this same try/catch inline.
 *
 * `trackFunnel()` additionally beacons to our own POST /api/funnel. It exists
 * because Vercel Analytics events are unauthenticated and un-joinable to
 * `accounts` — they live only in the Vercel dashboard. This first-party copy
 * lands in Postgres (`funnel_events`) keyed by a stable anon_id, so a later
 * audit can join landing/signup/subscribe behaviour to trial_grants and
 * payment_events, the way logged-in behaviour already can.
 */
import { track as vercelTrack } from '@vercel/analytics';
import Globals from '../global.js';
import { safeGetItem, safeSetItem } from './safeStorage.js';

export function safeTrack(eventName, payload) {
    try {
        vercelTrack(eventName, payload);
    } catch (error) {
        console.debug('Analytics track skipped:', error);
    }
}

const ANON_ID_KEY = 'sqb_anon_id';

/** Stable per-browser id for pre-signup funnel events. Not tied to an account. */
function anonId() {
    try {
        let id = safeGetItem(ANON_ID_KEY);
        if (!id) {
            id = (crypto.randomUUID ? crypto.randomUUID() : `a${Date.now()}${Math.random().toString(16).slice(2)}`);
            safeSetItem(ANON_ID_KEY, id);
        }
        return id;
    } catch (_) {
        return null;
    }
}

/**
 * Beacon a funnel event to the server and mirror it to Vercel Analytics.
 * Best-effort and silent — a blocked or failed beacon must never affect the
 * page a student is using.
 */
export function trackFunnel(event, props = {}) {
    safeTrack(event, props);
    try {
        const url = `${Globals.URL}/api/funnel`;
        const payload = JSON.stringify({ anon_id: anonId(), event, props });
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
        } else {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true,
            }).catch(() => { /* telemetry must never surface to the student */ });
        }
    } catch (_) {
        /* ignore */
    }
}

const ATTRIBUTION_KEY = 'sqb_attribution_captured';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

/**
 * Referrer hosts worth naming, newest channel first.
 *
 * The assistants are here because they are already a channel: more visits
 * arrived from ChatGPT and Perplexity last month than from Bing. The raw
 * referrer was being stored, but counting a channel meant eyeballing free text
 * — so `landing_view` now carries a `channel` alongside it and the raw string
 * stays for anything this list gets wrong.
 *
 * Matched on the registrable host and its subdomains, so `www.perplexity.ai`
 * and `search.marginalia.nu` both resolve. Order matters only in that the
 * first match wins.
 */
const REFERRER_CHANNELS = [
    ['ai', ['chatgpt.com', 'openai.com', 'perplexity.ai', 'claude.ai', 'anthropic.com',
        'gemini.google.com', 'copilot.microsoft.com', 'you.com', 'phind.com', 'poe.com']],
    ['search', ['google.', 'bing.com', 'duckduckgo.com', 'yandex.', 'yahoo.', 'ecosia.org',
        'brave.com', 'search.marginalia.nu']],
    ['social', ['t.me', 'telegram.me', 'twitter.com', 'x.com', 'instagram.com', 'facebook.com',
        'linkedin.com', 'tiktok.com', 'snapchat.com', 'reddit.com', 'youtube.com']],
    ['chat', ['whatsapp.com', 'wa.me', 'wa.link']],
];

/**
 * Bucket a referrer into a channel.
 *
 * Returns 'direct' for no referrer, 'internal' for our own pages, and
 * 'other' for a host we do not recognise — never null, so a count of
 * landing_view events by channel always adds up to the total.
 *
 * A caveat worth remembering before trusting the 'ai' number: assistants that
 * open a link inside their own app often send no referrer at all, so this
 * undercounts them and inflates 'direct'. It is a floor, not a measurement.
 */
export function classifyReferrer(referrer, selfHost = '') {
    if (!referrer) return 'direct';
    let host;
    try {
        host = new URL(referrer).hostname.toLowerCase();
    } catch (_) {
        return 'other';
    }
    if (selfHost && (host === selfHost || host.endsWith(`.${selfHost}`))) return 'internal';
    for (const [channel, hosts] of REFERRER_CHANNELS) {
        // A trailing dot in the pattern ('google.') matches every ccTLD.
        if (hosts.some((h) => (h.endsWith('.')
            ? host === h.slice(0, -1) || host.includes(h)
            : host === h || host.endsWith(`.${h}`)))) {
            return channel;
        }
    }
    return 'other';
}

/**
 * Records where a visitor came from — once per browser, on their first ever
 * landing-page hit. Until this, there was no UTM capture and no
 * document.referrer capture anywhere in the frontend (see
 * MONETIZATION_ANALYSIS_2026-08.md §3.5), so signups had no attributable
 * cause and a single riyal spent on ads would have been untraceable.
 *
 * Deliberately fires only once (guarded by localStorage, the same mechanism
 * anonId() uses) rather than on every landing visit — a returning visitor
 * bouncing back to the landing page must never overwrite their true original
 * source with "referrer: smle-question-bank.com".
 */
export function captureLandingAttribution() {
    try {
        if (safeGetItem(ATTRIBUTION_KEY)) return;
        safeSetItem(ATTRIBUTION_KEY, '1');

        const params = new URLSearchParams(window.location.search);
        const utm = {};
        for (const key of UTM_PARAMS) {
            const value = params.get(key);
            if (value) utm[key] = value.slice(0, 200);
        }

        const referrer = document.referrer || '';
        trackFunnel('landing_view', {
            referrer: referrer ? referrer.slice(0, 300) : null,
            channel: classifyReferrer(referrer, window.location.hostname),
            landingPath: window.location.pathname,
            ...utm,
        });
    } catch (_) {
        /* ignore — attribution is best-effort and must never affect the page */
    }
}
