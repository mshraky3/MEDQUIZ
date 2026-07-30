/**
 * Accounting — the single source of truth for money.
 *
 * Every figure the owner sees (admin dashboard, accounting page, the 2-day
 * PDF report, the customer's invoice) is derived here, so gross/fee/net can
 * never disagree between two screens.
 *
 * ── Why the old fee estimate was wrong ────────────────────────────────────
 * It computed `amount × percent × (1 + VAT)` and ignored Moyasar's FIXED
 * per-transaction component. Checked against the real fees Moyasar reported
 * on live payments:
 *
 *   mada,  99.00 SAR → reported 2.29 SAR;  old estimate 1.14 SAR  (−50%)
 *   visa,  99.00 SAR → reported 4.28 SAR;  old estimate 3.13 SAR  (−27%)
 *
 * The gap was exactly 1.15 SAR on every transaction — the 1 SAR fixed fee
 * plus VAT on it. With the fixed component included the model reproduces both
 * reported fees to the halala:
 *
 *   mada: (9900 × 1.00%  + 100) × 1.15 = 228.85 → 229   ✓ reported 229
 *   visa: (9900 × 2.75%  + 100) × 1.15 = 428.09 → 428   ✓ reported 428
 *
 * A reported fee from Moyasar is always preferred; the model is only used
 * when the gateway hasn't given us one, and such rows are flagged `estimated`
 * so they can be marked in reports.
 *
 * ── fee = 0 ───────────────────────────────────────────────────────────────
 * Moyasar returns `fee: 0` on some payments (older ones in this account).
 * Zero is NOT "this transaction was free" — it means the fee had not been
 * settled when we captured the payload. Those are treated as unreported and
 * estimated, which is why `estimated` matters: it is the difference between a
 * figure from the gateway and a figure we computed.
 */

const HALALA = 100;

/** Percent-of-amount component, per card scheme. Env-overridable. */
function schemePercent(company) {
    const mada = Number(process.env.MOYASAR_MADA_FEE_PERCENT || 1.0);
    const card = Number(process.env.MOYASAR_CARD_FEE_PERCENT || 2.75);
    return String(company || '').toLowerCase() === 'mada' ? mada : card;
}

/** Fixed per-transaction component, in halalas (Moyasar charges 1 SAR). */
function fixedFeeHalalas() {
    return Number(process.env.MOYASAR_FIXED_FEE_HALALAS ?? 100);
}

/** VAT applied on top of the gateway fee (15% in KSA). */
function feeVatPercent() {
    return Number(process.env.MOYASAR_FEE_VAT_PERCENT || 15);
}

/**
 * Gateway fee in halalas for one payment.
 *
 * @param {object} rawPayment - the Moyasar payment object
 * @param {number} amountHalalas - gross amount
 * @returns {{feeHalalas:number, estimated:boolean, basis:string}}
 */
export function computeFee(rawPayment, amountHalalas) {
    const reported = Number(rawPayment?.fee);
    if (Number.isFinite(reported) && reported > 0) {
        return { feeHalalas: Math.round(reported), estimated: false, basis: 'reported' };
    }

    const company = rawPayment?.source?.company;
    const pct = schemePercent(company);
    const fixed = fixedFeeHalalas();
    const vat = feeVatPercent();
    const feeHalalas = Math.round((amountHalalas * (pct / 100) + fixed) * (1 + vat / 100));
    return {
        feeHalalas,
        estimated: true,
        basis: `${pct}% + ${(fixed / HALALA).toFixed(2)} SAR, +${vat}% VAT`,
    };
}

/**
 * How much of this payment was refunded, in halalas.
 * Moyasar reports `refunded` as a halala amount (0 when none).
 */
export function refundedHalalas(rawPayment) {
    const r = Number(rawPayment?.refunded);
    return Number.isFinite(r) && r > 0 ? Math.round(r) : 0;
}

/**
 * Normalize one `payment_events` row into the figures every report uses.
 *
 * `net` is what actually reaches the bank: gross, minus the gateway fee,
 * minus anything refunded. Refunds were previously ignored entirely, which
 * would have overstated revenue the first time one happened.
 */
export function settleEvent(row) {
    const raw = row.raw_payload || {};
    const gross = Number(row.amount_halalas) || 0;
    const { feeHalalas, estimated, basis } = computeFee(raw, gross);
    const refunded = refundedHalalas(raw);

    return {
        eventId: row.id,
        accountId: row.account_id ?? null,
        // metadata survives account deletion (account_id is ON DELETE SET NULL),
        // so it is the only way to attribute an orphaned payment.
        metadataAccountId: raw?.metadata?.account_id ?? null,
        gatewayRef: row.gateway_ref,
        receivedAt: row.received_at,
        subscriber: row.email || row.username || null,
        track: row.track || null,
        currency: row.currency || 'SAR',
        company: raw?.source?.company || null,
        method: raw?.source?.type || null,
        grossHalalas: gross,
        feeHalalas,
        refundedHalalas: refunded,
        netHalalas: gross - feeHalalas - refunded,
        estimated,
        feeBasis: basis,
        isRefunded: refunded > 0,
    };
}

/** Roll a list of settled events into totals. */
export function summarize(settled) {
    return settled.reduce((t, r) => ({
        count: t.count + 1,
        refundCount: t.refundCount + (r.isRefunded ? 1 : 0),
        estimatedCount: t.estimatedCount + (r.estimated ? 1 : 0),
        grossHalalas: t.grossHalalas + r.grossHalalas,
        feeHalalas: t.feeHalalas + r.feeHalalas,
        refundedHalalas: t.refundedHalalas + r.refundedHalalas,
        netHalalas: t.netHalalas + r.netHalalas,
    }), {
        count: 0, refundCount: 0, estimatedCount: 0,
        grossHalalas: 0, feeHalalas: 0, refundedHalalas: 0, netHalalas: 0,
    });
}

/**
 * The canonical query for paid payments. Used by the accounting page, the
 * PDF report and the dashboard so all three count exactly the same rows.
 *
 * DISTINCT ON (gateway_ref) is deliberate: activation is idempotent but the
 * check-then-insert is not atomic, so a webhook and a /verify landing at the
 * same instant could each write a row for one payment. Collapsing by gateway
 * reference means a duplicate can never inflate revenue.
 */
export async function fetchPaidEvents(db, { from = null, to = null } = {}) {
    const conds = [`pe.status = 'paid'`];
    const params = [];
    if (from) { params.push(from); conds.push(`pe.received_at > $${params.length}`); }
    if (to) { params.push(to); conds.push(`pe.received_at <= $${params.length}`); }

    const { rows } = await db.query(`
        SELECT DISTINCT ON (pe.gateway_ref)
               pe.id, pe.account_id, pe.gateway_ref, pe.amount_halalas,
               pe.currency, pe.received_at, pe.raw_payload,
               a.username, a.email, a.track
          FROM payment_events pe
          LEFT JOIN accounts a ON a.id = pe.account_id
         WHERE ${conds.join(' AND ')}
         ORDER BY pe.gateway_ref, pe.received_at ASC
    `, params);

    return rows
        .map(settleEvent)
        .sort((x, y) => new Date(x.receivedAt) - new Date(y.receivedAt));
}

/** halalas → "12.34" */
export const sar = (halalas) => (Number(halalas || 0) / 100).toFixed(2);

/**
 * VAT position on the subscription price itself (separate from VAT on the
 * gateway fee, which is already inside `feeHalalas`).
 *
 * Only meaningful once the business is VAT-registered. Set BUSINESS_VAT_NUMBER
 * to switch invoices and the accounting page to a VAT-inclusive breakdown;
 * until then the price is reported as-is with no VAT line, because claiming
 * VAT on an invoice without a registration number would be wrong.
 */
export function vatConfig() {
    const number = process.env.BUSINESS_VAT_NUMBER || null;
    const percent = Number(process.env.BUSINESS_VAT_PERCENT || 15);
    return { registered: !!number, number, percent };
}

/**
 * Split a VAT-inclusive gross into net + VAT. Returns nulls when the business
 * is not VAT-registered, so callers render no VAT line at all.
 */
export function splitVat(grossHalalas) {
    const { registered, percent } = vatConfig();
    if (!registered) return { netHalalas: null, vatHalalas: null, percent: null };
    const net = Math.round(grossHalalas / (1 + percent / 100));
    return { netHalalas: net, vatHalalas: grossHalalas - net, percent };
}
