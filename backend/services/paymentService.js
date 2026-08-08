/**
 * Payment Service — Moyasar integration
 * ------------------------------------------------------------------
 * One-time subscriptions — three individual terms and two group plans, see
 * PLANS below — via the Moyasar embedded payment form (Moyasar.js). NOTHING
 * renews automatically; every plan is a single charge that grants a fixed
 * window. The browser creates the payment with the PUBLISHABLE key; this
 * server then VERIFIES it with the SECRET key before granting access — the
 * client's word is never trusted.
 *
 * Moyasar references:
 *   Fetch payment : GET https://api.moyasar.com/v1/payments/:id  (HTTP Basic auth, secret key)
 *   Webhooks      : payload includes a top-level `secret_token` to authenticate the call
 *   Docs          : https://docs.moyasar.com/
 *
 * Everything here is gated by PAYMENT_ENFORCEMENT_ENABLED. While that flag
 * is "false" the platform stays 100% free and no Moyasar calls are made.
 */

import axios from 'axios';
import crypto from 'crypto';
import { sendMail } from './mailer.js';
import { computeFee, settleEvent } from './accountingService.js';
import { sendInvoiceEmail } from './invoiceService.js';
import { trackLabelAr, normalizeTrack } from '../config/tracks.js';
import { OWNER_EMAIL } from '../config/recipients.js';

const MOYASAR_API = 'https://api.moyasar.com/v1';

// ── Owner notification: "payment received" ─────────────────────────────
// Sent the moment a subscription payment is confirmed (webhook or /verify).
// Recipient lives in config/recipients.js — one inbox for all owner mail.

const sarFmt = (halalas) => (Number(halalas || 0) / 100).toFixed(2);

/**
 * Fire-and-forget email to the owner when money actually arrives.
 * Never throws — a mail failure must not break payment activation.
 */
async function notifyPaymentReceived(db, accountId, payment, expiryDate) {
    try {
        const acct = await db.query(
            'SELECT email, track FROM accounts WHERE id = $1', [accountId]
        );
        const who = acct.rows[0]?.email || `Account #${accountId}`;
        // Which student population this sale came from — the two tracks are
        // sold from the same page, so the track is the only thing that tells
        // medical and nursing revenue apart in the inbox.
        const trackKey = normalizeTrack(acct.rows[0]?.track);
        const trackName = `${trackLabelAr(trackKey)} / ${trackKey}`;
        const gross = Number(payment?.amount) || 0;
        const { feeHalalas, estimated } = computeFee(payment, gross);
        const net = gross - feeHalalas;
        const card = payment?.source?.company ? String(payment.source.company).toUpperCase() : '—';

        await sendMail({
            event: 'medqize.owner.payment_received',
            name: 'SQB Payments',
            to: OWNER_EMAIL,
            subject: `💰 Payment received — ${sarFmt(gross)} SAR from ${who} [${trackKey}]`,
            text: `Payment received\nFrom: ${who}\nTrack: ${trackName}\nGross: ${sarFmt(gross)} SAR\nFee${estimated ? ' (est.)' : ''}: ${sarFmt(feeHalalas)} SAR\nNet: ${sarFmt(net)} SAR\nCard: ${card}\nSubscription until: ${new Date(expiryDate).toISOString().slice(0, 10)}\nMoyasar ref: ${payment?.id || '—'}`,
            html: `
              <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto">
                <div style="background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:16px 22px;border-radius:10px 10px 0 0">
                  <h2 style="margin:0;font-size:17px">💰 Payment received — ${sarFmt(gross)} SAR</h2>
                </div>
                <div style="border:1px solid #e5e7eb;border-top:none;padding:16px 22px;border-radius:0 0 10px 10px;font-size:14px">
                  <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:5px 0;color:#374151">Subscriber</td><td style="font-weight:bold">${who}</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Track</td><td style="font-weight:bold">${trackName}</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Gross</td><td style="font-weight:bold">${sarFmt(gross)} SAR</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Fee${estimated ? ' (estimated)' : ''}</td><td>${sarFmt(feeHalalas)} SAR</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Net</td><td style="font-weight:bold;color:#059669">${sarFmt(net)} SAR</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Card</td><td>${card}</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Active until</td><td>${new Date(expiryDate).toISOString().slice(0, 10)}</td></tr>
                    <tr><td style="padding:5px 0;color:#374151">Moyasar ref</td><td style="font-family:monospace;font-size:12px">${payment?.id || '—'}</td></tr>
                  </table>
                </div>
              </div>`,
        });
    } catch (err) {
        console.error('[payment] owner notification email failed:', err.message);
    }
}

export class PaymentDisabledError extends Error {
    constructor(message = 'Payment enforcement is currently disabled.') {
        super(message);
        this.name = 'PaymentDisabledError';
        this.statusCode = 503;
    }
}

/** Master feature flag. Defaults to disabled (free access for all). */
export function isPaymentEnforcementEnabled() {
    return process.env.PAYMENT_ENFORCEMENT_ENABLED === 'true';
}

/**
 * The subscription ladder. `id` is the value stored in payment.metadata.plan
 * and is what verifyAndActivate/handleWebhookEvent trust to know the expected
 * price, how many months to grant, AND how many accounts the payment buys —
 * never a single global "expected amount" (that bug would reject any payment
 * that wasn't exactly one hardcoded price while Moyasar still took the money).
 *
 *   kind  'individual' — one payment, one account (the payer's own).
 *         'group'      — one payment, `seats` accounts: the payer's own is
 *                        seat 1, and seats 2..N become single-use invite links
 *                        (see subscription_groups / group_seats). Every seat
 *                        shares one end date, `months` from the purchase.
 *
 * No plan renews automatically — there is no tokenisation and no recurring
 * charge anywhere in this integration. That is a promise made in the UI and in
 * the Terms, so do not add `save_card` to the checkout without changing both.
 */
export const PLANS = {
    monthly: {
        id: 'monthly',
        kind: 'individual',
        months: 1,
        seats: 1,
        priceHalalas: Number(process.env.PLAN_MONTHLY_PRICE_HALALAS || 5000),
    },
    four_month: {
        id: 'four_month',
        kind: 'individual',
        months: 4,
        seats: 1,
        priceHalalas: Number(process.env.PLAN_4MONTH_PRICE_HALALAS || 12900),
    },
    annual: {
        id: 'annual',
        kind: 'individual',
        months: 12,
        seats: 1,
        priceHalalas: Number(process.env.PLAN_ANNUAL_PRICE_HALALAS || 30000),
    },
    group_3: {
        id: 'group_3',
        kind: 'group',
        months: 4,
        seats: 3,
        priceHalalas: Number(process.env.PLAN_GROUP3_PRICE_HALALAS || 25000),
    },
    group_5: {
        id: 'group_5',
        kind: 'group',
        months: 4,
        seats: 5,
        priceHalalas: Number(process.env.PLAN_GROUP5_PRICE_HALALAS || 29900),
    },
};

/** Look up a plan by its metadata id, or null if it isn't one of ours. */
export function getPlan(planId) {
    return Object.prototype.hasOwnProperty.call(PLANS, planId) ? PLANS[planId] : null;
}

/**
 * Plans for the /config probe the frontend price pickers read.
 *
 * The filter is deliberate rather than incidental: /subscribe must never show
 * group cards (they have their own page, which explains the seat links before
 * anyone pays) and /groups must never show individual ones. Subscribe.jsx also
 * happens to skip any plan with no i18n copy entry, but that is an accident of
 * that component — never rely on it as the filter.
 *
 * @param {'individual'|'group'|'all'} [kind='all']
 */
export function listPlans(kind = 'all') {
    const all = Object.values(PLANS);
    return kind === 'all' ? all : all.filter((p) => p.kind === kind);
}

/** True when this plan buys more than one account. */
export function isGroupPlan(plan) {
    return Boolean(plan) && plan.kind === 'group' && Number(plan.seats) > 1;
}

/** Currency code for the subscription (default SAR). */
export function getCurrency() {
    return process.env.SUBSCRIPTION_CURRENCY || 'SAR';
}

/**
 * How many questions a non-paying account may ever answer. A LIFETIME budget,
 * not a window — see checkQuizAccess.
 */
export const FREE_QUESTION_ALLOWANCE = Number(process.env.FREE_QUESTION_ALLOWANCE || 40);

/**
 * Is this a PAYING (or exempt) account? Nothing more.
 *
 * This used to be the single gate for the whole product, which is why an
 * expired user was thrown out of their own account: one `false` here locked
 * the login, the analytics and the summaries along with the quiz. Access is
 * now two questions, and this is only the first:
 *
 *   checkSubscriptionAccess — may they use PAID features?
 *   checkQuizAccess         — may they start a quiz right now? (below)
 *
 * Everything else — logging in, reading their own analytics, the free lessons —
 * is available to every account forever and asks neither question.
 *
 *   - allow if is_admin_created (admin-exempt)
 *   - allow if grandfathered_at is set (pre-rollout users)
 *   - allow if subscription_status='active' AND expiry in the future
 *   - otherwise deny with 'free_tier'
 *
 * @param {object} account - row from the accounts table
 * @returns {{ allowed: boolean, reason: string }}
 */
export function checkSubscriptionAccess(account) {
    if (!isPaymentEnforcementEnabled()) {
        return { allowed: true, reason: 'enforcement_disabled' };
    }
    if (!account) {
        return { allowed: false, reason: 'account_not_found' };
    }
    if (account.is_admin_created) {
        return { allowed: true, reason: 'admin_exempt' };
    }
    if (account.grandfathered_at) {
        return { allowed: true, reason: 'grandfathered' };
    }
    const notExpired = account.subscription_expiry_date
        ? new Date(account.subscription_expiry_date).getTime() > Date.now()
        : false;
    if (account.subscription_status === 'active' && notExpired) {
        return { allowed: true, reason: 'active_subscription' };
    }
    return { allowed: false, reason: 'free_tier' };
}

/**
 * May this account START a quiz, and how many questions may it be served?
 *
 * Paid/exempt accounts are unlimited. Everyone else spends from a lifetime
 * allowance of FREE_QUESTION_ALLOWANCE answered questions — the replacement
 * for the old one-hour engaged-time trial, which had the fatal property of
 * locking a student out of the account we then tried to email them about.
 *
 * `remaining` is not advisory: GET /api/questions clamps its `limit` to it, so
 * a free user with 5 left cannot ask for 500 and walk away with 500.
 *
 * The counter is accounts.free_questions_used, incremented when a quiz is
 * SUBMITTED (POST /quiz-sessions). It is deliberately not derived from
 * user_question_progress — POST /api/reset-progress wipes that table on
 * demand, which would be an unlimited-refill button.
 *
 * @param {object} account - row from accounts, must include free_questions_used
 * @returns {{ allowed: boolean, remaining: number, reason: string }}
 */
export function checkQuizAccess(account) {
    if (!isPaymentEnforcementEnabled()) {
        return { allowed: true, remaining: Infinity, reason: 'enforcement_disabled' };
    }
    if (!account) {
        return { allowed: false, remaining: 0, reason: 'account_not_found' };
    }
    const paid = checkSubscriptionAccess(account);
    if (paid.allowed) {
        return { allowed: true, remaining: Infinity, reason: paid.reason };
    }
    const used = Number(account.free_questions_used) || 0;
    const remaining = Math.max(0, FREE_QUESTION_ALLOWANCE - used);
    return {
        allowed: remaining > 0,
        remaining,
        reason: remaining > 0 ? 'free_allowance' : 'free_allowance_exhausted',
    };
}

/**
 * Authenticate a Moyasar webhook by comparing the `secret_token` the gateway
 * includes in the JSON payload against our configured shared secret. Moyasar
 * does NOT use an HMAC header — the shared token is the documented mechanism.
 * Constant-time comparison avoids timing attacks.
 */
export function verifyWebhookToken(secretTokenFromPayload) {
    const secret = process.env.MOYASAR_WEBHOOK_SECRET;
    if (!secret || !secretTokenFromPayload) return false;
    const a = Buffer.from(String(secret), 'utf8');
    const b = Buffer.from(String(secretTokenFromPayload), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

/**
 * Fetch a single payment from Moyasar by id, authenticated with the SECRET key
 * (HTTP Basic auth: secret key as username, empty password).
 * @returns {Promise<object>} the Moyasar payment object
 */
export async function fetchMoyasarPayment(paymentId) {
    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
        const err = new Error('Payment verification is unavailable (MOYASAR_SECRET_KEY not configured).');
        err.statusCode = 503;
        throw err;
    }
    const resp = await axios.get(`${MOYASAR_API}/payments/${encodeURIComponent(paymentId)}`, {
        auth: { username: secretKey, password: '' },
        timeout: 15000,
        validateStatus: () => true,
    });
    if (resp.status === 404) {
        const err = new Error('Payment not found.');
        err.statusCode = 404;
        throw err;
    }
    if (resp.status >= 400) {
        const err = new Error(`Moyasar payment fetch failed (${resp.status}).`);
        err.statusCode = 502;
        throw err;
    }
    return resp.data;
}

/** New expiry = plan's term from max(now, current expiry) so renewals stack. */
function computeNewExpiry(currentExpiry, plan) {
    const base = currentExpiry && new Date(currentExpiry).getTime() > Date.now()
        ? new Date(currentExpiry)
        : new Date();
    const next = new Date(base);
    // Fall back to the SHORTEST term, never the longest: if a caller ever
    // reaches here without a plan it is a bug, and under-granting is a support
    // ticket while over-granting is a year of free access we cannot claw back.
    next.setMonth(next.getMonth() + (plan?.months || 1));
    return next;
}

/**
 * Activate (or extend) a subscription from a confirmed-paid Moyasar payment,
 * and append an audit row to payment_events. Idempotent: a payment id already
 * recorded as paid will NOT extend the subscription a second time (so the
 * /verify call and the webhook can both fire safely).
 *
 * @param {import('pg').Pool} db
 * @param {string|number} accountId
 * @param {object} payment - Moyasar payment object (status must be 'paid')
 * @param {string} eventType - e.g. 'payment_paid'
 * @param {object} plan - one of PLANS, decides how many months this grants
 */
export async function activateSubscriptionFromPayment(db, accountId, payment, eventType = 'payment_paid', plan = PLANS.annual) {
    const gatewayRef = payment?.id || null;

    const acctRes = await db.query(
        `SELECT id, subscription_expiry_date FROM accounts WHERE id = $1`,
        [accountId]
    );
    const account = acctRes.rows[0];
    if (!account) {
        const err = new Error('Account not found for activation.');
        err.statusCode = 404;
        throw err;
    }

    // ── Claim the payment atomically ──────────────────────────────────────
    // /verify (browser callback) and the webhook both call this, and they can
    // arrive at the same instant. A SELECT-then-INSERT check would let both
    // pass, extending the subscription twice and recording the money twice.
    // The INSERT itself is the lock: a partial unique index on
    // (gateway_ref) WHERE status='paid' means exactly one caller can insert,
    // and only that caller gets a row back and proceeds.
    const claim = await db.query(
        `INSERT INTO payment_events
            (account_id, event_type, gateway, gateway_ref, amount_halalas, currency, status, raw_payload)
         VALUES ($1, $2, 'moyasar', $3, $4, $5, $6, $7)
         ON CONFLICT (gateway_ref) WHERE status = 'paid' DO NOTHING
         RETURNING id`,
        [
            accountId,
            eventType,
            gatewayRef,
            payment?.amount ?? null,
            payment?.currency ?? getCurrency(),
            payment?.status ?? null,
            JSON.stringify(payment ?? {}),
        ]
    );

    if (claim.rows.length === 0) {
        // Someone else already processed this payment.
        return { activated: false, alreadyProcessed: true };
    }

    const newExpiry = computeNewExpiry(account.subscription_expiry_date, plan);

    await db.query(
        `UPDATE accounts
            SET subscription_status = 'active',
                subscription_expiry_date = $1
          WHERE id = $2`,
        [newExpiry, accountId]
    );

    // A group plan additionally mints the invite links for seats 2..N. The
    // buyer's own account (seat 1) was just activated above, so the group only
    // records it — there is no link to claim for yourself.
    let group = null;
    if (isGroupPlan(plan)) {
        group = await provisionGroup(db, accountId, plan, gatewayRef, newExpiry);
    }

    // Notifications run after the claim succeeded, so each fires exactly once
    // per payment. Both are best-effort: neither may undo a completed payment.
    const settled = settleEvent({
        id: claim.rows[0].id,
        account_id: accountId,
        gateway_ref: gatewayRef,
        amount_halalas: payment?.amount ?? 0,
        currency: payment?.currency ?? getCurrency(),
        received_at: new Date(),
        raw_payload: payment ?? {},
        username: null,
        email: null,
    });

    try {
        // The customer's own copy: their emailed PDF receipt.
        const who = await db.query(
            'SELECT email FROM accounts WHERE id = $1', [accountId]
        );
        settled.subscriber = who.rows[0]?.email || null;
        await sendInvoiceEmail(settled);
    } catch (err) {
        console.error('[payment] invoice email failed:', err.message);
    }

    // Tell the owner money arrived.
    await notifyPaymentReceived(db, accountId, payment, newExpiry);

    return {
        activated: true,
        expiryDate: newExpiry,
        invoiceFor: settled.gatewayRef,
        groupId: group?.id ?? null,
        seats: plan?.seats ?? 1,
    };
}

/**
 * Create the group row and its seats for a paid group plan.
 *
 * Seat 1 is the buyer, already active, and carries no token — you do not invite
 * yourself. Seats 2..N each get a 32-hex-character token from crypto, NOT the
 * 6 characters of Math.random() the admin temp links use: a seat here is worth
 * real money and a guessable one hands it away.
 *
 * ON CONFLICT (gateway_ref) DO NOTHING is a second belt to the payment_events
 * lock's braces — if this ever runs twice for one payment, the second run mints
 * nothing and returns the existing group instead of a duplicate set of links.
 *
 * @returns {Promise<{id: number, seats: number}|null>}
 */
async function provisionGroup(db, ownerAccountId, plan, gatewayRef, expiresAt) {
    const created = await db.query(
        `INSERT INTO subscription_groups
            (owner_account_id, plan_id, seats, months, gateway_ref, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (gateway_ref) DO NOTHING
         RETURNING id`,
        [ownerAccountId, plan.id, plan.seats, plan.months, gatewayRef, expiresAt]
    );
    if (created.rows.length === 0) {
        const existing = await db.query(
            'SELECT id, seats FROM subscription_groups WHERE gateway_ref = $1',
            [gatewayRef]
        );
        return existing.rows[0] || null;
    }
    const groupId = created.rows[0].id;

    // Seat 1: the buyer, pre-claimed.
    await db.query(
        `INSERT INTO group_seats (group_id, seat_index, token, claimed_by_account_id, claimed_at)
         VALUES ($1, 1, NULL, $2, NOW())`,
        [groupId, ownerAccountId]
    );
    // Seats 2..N: the shareable links.
    for (let seat = 2; seat <= plan.seats; seat++) {
        await db.query(
            `INSERT INTO group_seats (group_id, seat_index, token) VALUES ($1, $2, $3)`,
            [groupId, seat, crypto.randomBytes(16).toString('hex')]
        );
    }
    return { id: groupId, seats: plan.seats };
}

/**
 * Server-side verification of a completed payment, then activation.
 * Called by the frontend callback page (POST /api/payment/verify).
 *
 * @returns {Promise<{success:boolean, reason?:string, expiryDate?:Date}>}
 */
export async function verifyAndActivate(db, paymentId, userId) {
    if (!isPaymentEnforcementEnabled()) {
        throw new PaymentDisabledError();
    }

    const payment = await fetchMoyasarPayment(paymentId);

    if (payment.status !== 'paid') {
        return { success: false, reason: 'not_paid', status: payment.status };
    }

    // Which plan this payment claims to be for decides BOTH the expected price
    // and how many months to grant. A single global "expected amount" (the old
    // behavior) would reject every plan except whichever one happened to match
    // it — Moyasar keeps the money either way, so getting this plan-aware is
    // the one fix that must be right before any second price goes live.
    const plan = getPlan(payment.metadata?.plan);
    if (!plan) {
        return { success: false, reason: 'unknown_plan', plan: payment.metadata?.plan ?? null };
    }
    if (Number(payment.amount) < plan.priceHalalas) {
        return { success: false, reason: 'amount_mismatch', amount: payment.amount, expected: plan.priceHalalas };
    }
    if ((payment.currency || getCurrency()) !== getCurrency()) {
        return { success: false, reason: 'currency_mismatch', currency: payment.currency };
    }

    // Bind the payment to the account via metadata to stop a user from
    // claiming someone else's payment id.
    const metaAccount = payment.metadata?.account_id != null
        ? String(payment.metadata.account_id)
        : '';
    if (metaAccount && String(userId) && metaAccount !== String(userId)) {
        return { success: false, reason: 'account_mismatch' };
    }

    const accountId = metaAccount || userId;
    const result = await activateSubscriptionFromPayment(db, accountId, payment, 'payment_paid', plan);
    return { success: true, ...result };
}

/**
 * Process a Moyasar webhook event. The caller MUST have already verified the
 * payload's secret_token. Acts only on `payment_paid`; other events are logged
 * by the caller / ignored here.
 *
 * @param {import('pg').Pool} db
 * @param {object} payload - parsed webhook JSON ({ type, data, ... })
 */
export async function handleWebhookEvent(db, payload) {
    const type = payload?.type;
    const payment = payload?.data;

    // A refund must be reflected in the ledger. The payload we stored at
    // payment time is a snapshot and will never show a later refund on its
    // own, so refresh the stored row — otherwise accounting would keep
    // reporting refunded money as revenue for good.
    if (type === 'payment_refunded' || type === 'payment_voided') {
        const ref = payment?.id;
        if (!ref) return { handled: false, reason: 'no_payment_id' };
        const upd = await db.query(
            `UPDATE payment_events
                SET raw_payload = $1
              WHERE gateway_ref = $2 AND status = 'paid'
              RETURNING account_id`,
            [JSON.stringify(payment ?? {}), ref]
        );
        if (upd.rows.length === 0) {
            return { handled: false, reason: 'unknown_payment' };
        }
        // A full refund ends access; a partial one leaves the subscription be.
        const refunded = Number(payment?.refunded) || 0;
        const amount = Number(payment?.amount) || 0;
        if (amount > 0 && refunded >= amount) {
            await db.query(
                `UPDATE accounts
                    SET subscription_status = 'refunded',
                        subscription_expiry_date = NOW()
                  WHERE id = $1`,
                [upd.rows[0].account_id]
            );
            // A refunded GROUP payment must also end the seats it bought —
            // otherwise the money comes back and up to four other accounts keep
            // four months of access. Claimed seats expire now; unclaimed links
            // are deleted so they cannot be redeemed afterwards.
            await revokeGroupForPayment(db, ref);
        }
        return { handled: true, type, refundedHalalas: refunded };
    }

    if (type !== 'payment_paid') {
        return { handled: false, type: type || 'unknown' };
    }
    if (!payment || payment.status !== 'paid') {
        return { handled: false, reason: 'not_paid' };
    }

    const accountId = payment.metadata?.account_id;
    if (!accountId) {
        return { handled: false, reason: 'no_account_id' };
    }

    const plan = getPlan(payment.metadata?.plan);
    if (!plan) {
        return { handled: false, reason: 'unknown_plan' };
    }
    if (Number(payment.amount) < plan.priceHalalas) {
        return { handled: false, reason: 'amount_mismatch' };
    }

    const result = await activateSubscriptionFromPayment(db, accountId, payment, 'payment_paid', plan);
    return { handled: true, ...result };
}

/**
 * Undo a group purchase after a full refund: expire every claimed seat's
 * account and delete the links nobody used yet. The group row itself is kept
 * so the refund stays auditable — an empty seat list with a past expiry is a
 * clearer record than a missing group.
 *
 * Silent no-op when the payment was not a group plan.
 */
async function revokeGroupForPayment(db, gatewayRef) {
    const g = await db.query(
        'SELECT id FROM subscription_groups WHERE gateway_ref = $1',
        [gatewayRef]
    );
    if (g.rows.length === 0) return;
    const groupId = g.rows[0].id;

    await db.query(
        `UPDATE accounts
            SET subscription_expiry_date = NOW()
          WHERE id IN (
              SELECT claimed_by_account_id FROM group_seats
               WHERE group_id = $1 AND claimed_by_account_id IS NOT NULL
          )`,
        [groupId]
    );
    await db.query(
        `DELETE FROM group_seats WHERE group_id = $1 AND claimed_by_account_id IS NULL`,
        [groupId]
    );
    await db.query(
        `UPDATE subscription_groups SET expires_at = NOW() WHERE id = $1`,
        [groupId]
    );
}
