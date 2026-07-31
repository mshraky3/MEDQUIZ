/**
 * Time-on-section tracking.
 *
 * Measures how long a signed-in student actually spends in each part of the
 * product, so the admin dashboard can answer "do they use the question bank,
 * the summaries, or the analytics?". Quiz counts can't answer that: reading a
 * summary for twenty minutes leaves no trace anywhere else.
 *
 * Rules that keep the numbers honest:
 *  - Time only accrues while the tab is VISIBLE. Switching away pauses the
 *    clock; coming back resumes it. A backgrounded tab is not reading.
 *  - Nothing is sent for stays under 3 seconds — that's navigation, not use.
 *  - Idle time is capped server-side, so a laptop left open overnight can't
 *    drown out real signal.
 *  - Anonymous visitors are not tracked at all; there is no one to attribute
 *    the time to, and the landing page is not what this is measuring.
 *
 * Flushes happen on section change, on tab-hide, and on a slow interval, so
 * a closed laptop still reports what it had.
 */
import Globals from '../global.js';
import { safeGetItem } from './safeStorage.js';

const MIN_REPORTABLE_SECONDS = 3;
const FLUSH_INTERVAL_MS = 2 * 60 * 1000;

/** Map a pathname to one of the product areas worth telling apart. */
export function sectionForPath(pathname) {
    const p = (pathname || '').toLowerCase();
    if (p.startsWith('/quizs') || p.startsWith('/quiz/')) return 'quizzes';
    if (p.startsWith('/summaries')) return 'summaries';
    if (p.startsWith('/analysis') || p.startsWith('/wrong-questions')) return 'analytics';
    return 'other';
}

let current = null;        // section currently being timed
let accrued = 0;           // ms banked for `current` while visible
let since = 0;             // timestamp the visible clock started, 0 when paused
let flushTimer = null;

const now = () => Date.now();

function credentials() {
    try {
        const user = JSON.parse(safeGetItem('user') || 'null');
        const sessionToken = safeGetItem('sessionToken');
        if (!user?.username || !sessionToken) return null;
        return { username: user.username, sessionToken };
    } catch (_) {
        return null;
    }
}

/** Bank the time elapsed since the clock last started. */
function pause() {
    if (since) {
        accrued += now() - since;
        since = 0;
    }
}

function resume() {
    if (!since && current && document.visibilityState === 'visible') since = now();
}

/**
 * Send what we've banked and reset.
 *
 * `keepalive` (and sendBeacon on unload) is what makes the last section of a
 * visit count — a normal fetch is cancelled when the page goes away.
 */
function flush({ beacon = false } = {}) {
    pause();
    const seconds = Math.round(accrued / 1000);
    const section = current;
    accrued = 0;
    resume();

    if (!section || seconds < MIN_REPORTABLE_SECONDS) return;
    const creds = credentials();
    if (!creds) return;

    const url = `${Globals.URL}/api/engagement`;
    const payload = JSON.stringify({ ...creds, section, seconds });

    try {
        if (beacon && navigator.sendBeacon) {
            // Beacons can't set headers, which is why the route also accepts
            // the session token in the body.
            navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${creds.sessionToken}`,
            },
            body: payload,
            keepalive: true,
        }).catch(() => { /* telemetry must never surface to the student */ });
    } catch (_) {
        /* ignore */
    }
}

/** Called on every route change. Flushes the previous section first. */
export function trackSection(pathname) {
    const next = sectionForPath(pathname);
    if (next === current) return;
    if (current) flush();
    current = next;
    accrued = 0;
    since = 0;
    resume();
}

let started = false;

/** Wire up the visibility and unload listeners. Safe to call more than once. */
export function startEngagementTracking() {
    if (started || typeof document === 'undefined') return;
    started = true;

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') resume();
        else { pause(); flush({ beacon: true }); }
    });
    // pagehide covers the bfcache and mobile app-switch cases that
    // beforeunload misses entirely on iOS.
    window.addEventListener('pagehide', () => flush({ beacon: true }));

    flushTimer = setInterval(() => flush(), FLUSH_INTERVAL_MS);
}

export function stopEngagementTracking() {
    if (flushTimer) clearInterval(flushTimer);
    flushTimer = null;
    flush({ beacon: true });
    started = false;
    current = null;
}
