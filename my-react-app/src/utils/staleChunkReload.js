/**
 * Stale-chunk recovery.
 * ------------------------------------------------------------------
 * Every deploy renames the hashed asset files (Login-B7khGjG6.css → ...).
 * A phone that loaded the app before the deploy still holds the OLD entry
 * script; its next lazy route navigation requests chunk files that no longer
 * exist and fails with errors like "Unable to preload CSS for ...". The fix
 * is simply reloading the page — the fresh HTML references the new hashes.
 *
 * reloadOnceForStaleChunk() performs that reload at most once per minute per
 * tab, so a genuinely broken asset (user offline, CDN outage) falls through
 * to the normal error UI instead of looping forever.
 */

import { markNavigatingAway } from './navigationState.js';

const STALE_CHUNK_PATTERNS = [
    'unable to preload css',
    'failed to fetch dynamically imported module',
    'error loading dynamically imported module',
    'importing a module script failed',
    'chunkloaderror',
    'loading chunk',
    // Safari/WebKit phrasing for the same failure: a lazy-loaded chunk
    // resolved to something without a usable default export (stale asset
    // hash after a deploy, or a 404 page served in place of the JS module).
    '_result.default',
    // The same failure again, as V8 phrases it once react-dom is MINIFIED.
    // '_result' is a local inside React's lazy resolver, so the production
    // build reports only the property being read — which is why the pattern
    // above missed it and a stale /admin chunk surfaced as a CRITICAL alert
    // plus a dead error page instead of the one-line reload it needed.
    //
    // Every route in this app is React.lazy (see main.jsx), and reading
    // '.default' off undefined is what module interop does, not application
    // code — so this is a safe thing to treat as a stale chunk. And it is
    // self-limiting either way: reloadOnceForStaleChunk() reloads at most
    // once per minute per tab, so a genuine bug that happened to match falls
    // through to the normal error UI on the second occurrence rather than
    // looping.
    "cannot read properties of undefined (reading 'default')",
    // Safari and Firefox wording for the identical read. Both are anchored on
    // the 'default' property specifically — Safari's bare "undefined is not an
    // object (evaluating ...)" prefix matches every undefined property access
    // in the app and must NOT be used on its own, or a genuine bug anywhere
    // would be silently answered with a page reload.
    ".default')",
    'can\'t access property "default"',
];

export function isStaleChunkError(message) {
    if (!message) return false;
    const msg = String(message).toLowerCase();
    return STALE_CHUNK_PATTERNS.some((p) => msg.includes(p));
}

const RELOAD_KEY = 'stale-chunk-reload-at';
const RELOAD_COOLDOWN_MS = 60 * 1000;

export function reloadOnceForStaleChunk() {
    let last = 0;
    try {
        last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    } catch (e) {
        // Storage unavailable (private mode) — still reload, just without the
        // loop guard; the cooldown is only a safety net.
    }
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch (e) {
        // Ignore — see above.
    }
    // Same reason as the session-expiry redirect in apiClient.js: reloading
    // aborts every in-flight request, and each abort looks like "Network Error"
    // to axios. Say so before it happens, not after (pagehide is too late).
    markNavigatingAway();
    window.location.reload();
    return true;
}
