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

const STALE_CHUNK_PATTERNS = [
    'unable to preload css',
    'failed to fetch dynamically imported module',
    'error loading dynamically imported module',
    'importing a module script failed',
    'chunkloaderror',
    'loading chunk',
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
    window.location.reload();
    return true;
}
