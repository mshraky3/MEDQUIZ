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

        trackFunnel('landing_view', {
            referrer: document.referrer ? document.referrer.slice(0, 300) : null,
            landingPath: window.location.pathname,
            ...utm,
        });
    } catch (_) {
        /* ignore — attribution is best-effort and must never affect the page */
    }
}
