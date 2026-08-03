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
