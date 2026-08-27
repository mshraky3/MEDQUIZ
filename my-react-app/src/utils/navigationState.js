/**
 * "Is this page on its way out?"
 *
 * One boolean, in its own module, because three unrelated files need it and two
 * of them already import each other (errorTracking ↔ staleChunkReload). Putting
 * it in either of those would close that cycle.
 *
 * WHY IT EXISTS AT ALL
 *
 * Assigning window.location — a redirect, a reload — makes the browser abort
 * every request the page still has in flight. Axios cannot tell those aborts
 * apart from the API being unreachable: both arrive as a bare "Network Error"
 * with no status and no response. So the app has to say, out of band, "that was
 * me leaving, not the server dying".
 *
 * TIMING IS THE WHOLE POINT. The browser's own 'pagehide'/'beforeunload' events
 * are not good enough on their own: the aborted requests' error callbacks run
 * in the current task, and those events fire afterwards — by which time the
 * reports have already been sent. Anything that navigates programmatically must
 * therefore call markNavigatingAway() SYNCHRONOUSLY, before the assignment.
 */

let navigatingAway = false;

/** Call immediately before assigning window.location (href / reload / replace). */
export function markNavigatingAway() {
    navigatingAway = true;
}

/** True once this page has committed to leaving. Never resets — the page dies. */
export function isNavigatingAway() {
    return navigatingAway;
}
