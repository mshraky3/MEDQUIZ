/**
 * ── Golden Months (الأشهر الذهبية) — a dated BONUS-TIME offer ────────────────
 *
 * October–December is when most SMLE/SNLE candidates sit the exam. While the
 * window is open, a four-month purchase is credited FIVE months. The price does
 * not change: 129 stays 129, the monthly and annual plans are untouched, and the
 * group plans are not in the offer. Extra access costs nothing to give, keeps
 * the 129 price as the anchor, and cannot pull a 129 buyer down to a cheaper
 * plan — which is why the owner chose time over a discount (2026-10-07).
 *
 * This is deliberately separate from NATIONAL_DAY_OFFER in paymentService.js,
 * which is a price offer, is over, and stays inert. Nothing here touches PLANS,
 * the PLAN_* env vars, or the amount a checkout charges or verifies.
 *
 * WHO DECIDES THE BONUS. The server, at activation, judged by when the payment
 * was CREATED (`atMs`), not when we happen to verify it: a webhook can arrive
 * minutes late and a payment made in time must still get its month. The
 * deadline has `graceMs` of slack for the same reason as the price offer (a
 * card form opened before the deadline). The browser only displays it.
 *
 * ENDS BY ITSELF. The window is constants plus two optional env overrides, read
 * once at boot (set on the Vercel `medquiz` project, then redeploy):
 *   GOLDEN_MONTHS_STARTS_AT / GOLDEN_MONTHS_ENDS_AT   ISO instant with +03:00.
 * A past ENDS_AT closes the offer at once. There is no open-ended mode: a
 * missing or junk ENDS_AT falls back to the default end date, never to "forever".
 *
 * Pure module (no imports) so invoiceService can use it without a cycle.
 * Record and revert guide: docs/GOLDEN_MONTHS_OFFER_2026-10.md.
 */

const isoInstant = (raw, fallbackIso) => {
    const ms = Date.parse(raw || '');
    return Number.isFinite(ms) ? ms : Date.parse(fallbackIso);
};

export const GOLDEN_MONTHS = {
    id: 'golden_months_2026',
    // Riyadh time (UTC+3): opens at the start of Tue 13 Oct, closes at the end of Sun 8 Nov.
    startsAtMs: isoInstant(process.env.GOLDEN_MONTHS_STARTS_AT, '2026-10-13T00:00:00+03:00'),
    endsAtMs: isoInstant(process.env.GOLDEN_MONTHS_ENDS_AT, '2026-11-08T23:59:59+03:00'),
    // Six hours, same reasoning as NATIONAL_DAY_OFFER.graceMs: money taken must
    // never mean access refused. Short enough that a page left open overnight
    // cannot reach the bonus the next day.
    graceMs: 6 * 60 * 60 * 1000,
    // Extra months credited per plan id. Only the four-month plan.
    bonusMonths: { four_month: 1 },
};

/** True while the offer is on sale (what visitors see). `nowMs` is injectable for tests. */
export function isGoldenLive(nowMs = Date.now()) {
    return nowMs >= GOLDEN_MONTHS.startsAtMs && nowMs <= GOLDEN_MONTHS.endsAtMs;
}

/** Bonus months a plan shows right now (0 when the offer is off or does not cover it). */
export function displayBonusMonths(planId, nowMs = Date.now()) {
    return isGoldenLive(nowMs) ? (GOLDEN_MONTHS.bonusMonths[planId] || 0) : 0;
}

/**
 * Bonus months to CREDIT for a payment created at `atMs`: honoured from the
 * start until `graceMs` after the deadline. 0 for any plan the offer does not
 * cover (including a missing id, so admin grants never pick one up).
 */
export function bonusMonthsFor(planId, atMs = Date.now()) {
    const { startsAtMs, endsAtMs, graceMs, bonusMonths } = GOLDEN_MONTHS;
    if (atMs < startsAtMs || atMs > endsAtMs + graceMs) return 0;
    return Object.prototype.hasOwnProperty.call(bonusMonths, planId) ? bonusMonths[planId] : 0;
}

/** The offer as the frontend needs it, or null when it is not on sale. `now` is the server clock. */
export function getGoldenInfo(nowMs = Date.now()) {
    if (!isGoldenLive(nowMs)) return null;
    return {
        id: GOLDEN_MONTHS.id,
        active: true,
        startsAt: new Date(GOLDEN_MONTHS.startsAtMs).toISOString(),
        endsAt: new Date(GOLDEN_MONTHS.endsAtMs).toISOString(),
        now: nowMs,
        bonusMonths: { ...GOLDEN_MONTHS.bonusMonths },
    };
}
