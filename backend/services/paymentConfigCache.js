/**
 * Cache policy for GET /api/payment/config?kind=all (optimization program, change C2).
 *
 * The landing page calls this on every visit (js/nationalDay.js loadPublicConfig) to learn
 * whether a price offer or the Golden Months bonus is on. The response is the same for every
 * visitor (no session, cookie or Authorization input; everything comes from env/constants and
 * the clock), the function does no database work, and since 1 Oct 2026 `offer` and
 * `goldenMonths` are null. So while NOTHING is on sale (and nothing is about to start) Vercel's
 * CDN may answer it for a few minutes instead of invoking the function on every visit.
 *
 * Never cached: while an offer or Golden Months is live (a stale `offer` would advertise a price
 * the server stopped honouring), and in the window just before a scheduled start, so a dated
 * offer never appears late. Only the landing probe (`kind=all`) is cached; the checkout and
 * /groups probes (`individual`, `group`) stay no-store.
 */
export const CONFIG_S_MAXAGE = 300;
export const CONFIG_SWR = 60;
// Longer than s-maxage + stale-while-revalidate: a copy stored before this window opens has
// expired before the start time arrives.
export const CONFIG_START_GUARD_MS = (CONFIG_S_MAXAGE + CONFIG_SWR + 240) * 1000;

/**
 * @param {{kind: string, offer: object|null, goldenMonths: object|null, nowMs: number,
 *          startsAtMs?: Array<number|null|undefined>}} input  startsAtMs: start instants of every
 *          dated offer (price offer, Golden Months), live or not.
 * @returns {{header: string, shared: boolean}} shared = a CDN may store it (then the body must be
 *          visitor- and origin-independent).
 */
export function paymentConfigCachePolicy({ kind, offer, goldenMonths, nowMs, startsAtMs = [] }) {
    const noStore = { header: 'no-store', shared: false };
    if (kind !== 'all') return noStore;
    if (offer != null || goldenMonths != null) return noStore;
    for (const s of startsAtMs) {
        if (typeof s === 'number' && Number.isFinite(s) && s > nowMs && s - nowMs < CONFIG_START_GUARD_MS) return noStore;
    }
    return {
        header: `public, s-maxage=${CONFIG_S_MAXAGE}, stale-while-revalidate=${CONFIG_SWR}`,
        shared: true,
    };
}
