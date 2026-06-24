/**
 * Payment Service — Moyasar integration
 * ------------------------------------------------------------------
 * One-time annual subscription (100 SAR / year) via the Moyasar
 * embedded payment form (Moyasar.js). The browser creates the payment
 * with the PUBLISHABLE key; this server then VERIFIES it with the
 * SECRET key before granting access — the client's word is never trusted.
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

const MOYASAR_API = 'https://api.moyasar.com/v1';

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

/** Annual subscription price in halalas (1 SAR = 100 halalas). */
export function getPriceHalalas() {
    return Number(process.env.SUBSCRIPTION_PRICE_HALALAS || 0);
}

/** Currency code for the subscription (default SAR). */
export function getCurrency() {
    return process.env.SUBSCRIPTION_CURRENCY || 'SAR';
}

/**
 * Decide whether an account may access paid features.
 * While enforcement is disabled, everyone is allowed.
 *
 *   - allow if is_admin_created (admin-exempt)
 *   - allow if grandfathered_at is set (pre-rollout users)
 *   - allow if subscription_status='active' AND expiry in the future
 *   - otherwise deny (subscription_required)
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
    const active = account.subscription_status === 'active';
    const notExpired = account.subscription_expiry_date
        ? new Date(account.subscription_expiry_date).getTime() > Date.now()
        : false;
    if (active && notExpired) {
        return { allowed: true, reason: 'active_subscription' };
    }
    return { allowed: false, reason: 'subscription_required' };
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

/** New expiry = one year from max(now, current expiry) so renewals stack. */
function computeNewExpiry(currentExpiry) {
    const base = currentExpiry && new Date(currentExpiry).getTime() > Date.now()
        ? new Date(currentExpiry)
        : new Date();
    const next = new Date(base);
    next.setFullYear(next.getFullYear() + 1);
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
 */
export async function activateSubscriptionFromPayment(db, accountId, payment, eventType = 'payment_paid') {
    const gatewayRef = payment?.id || null;

    if (gatewayRef) {
        const existing = await db.query(
            `SELECT id FROM payment_events
             WHERE gateway_ref = $1 AND status = 'paid' LIMIT 1`,
            [gatewayRef]
        );
        if (existing.rows.length > 0) {
            return { activated: false, alreadyProcessed: true };
        }
    }

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

    const newExpiry = computeNewExpiry(account.subscription_expiry_date);

    await db.query(
        `UPDATE accounts
            SET subscription_status = 'active',
                subscription_expiry_date = $1
          WHERE id = $2`,
        [newExpiry, accountId]
    );

    await db.query(
        `INSERT INTO payment_events
            (account_id, event_type, gateway, gateway_ref, amount_halalas, currency, status, raw_payload)
         VALUES ($1, $2, 'moyasar', $3, $4, $5, $6, $7)`,
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

    return { activated: true, expiryDate: newExpiry };
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

    const expected = getPriceHalalas();
    if (expected && Number(payment.amount) < expected) {
        return { success: false, reason: 'amount_mismatch', amount: payment.amount };
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
    const result = await activateSubscriptionFromPayment(db, accountId, payment, 'payment_paid');
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

    const expected = getPriceHalalas();
    if (expected && Number(payment.amount) < expected) {
        return { handled: false, reason: 'amount_mismatch' };
    }

    const result = await activateSubscriptionFromPayment(db, accountId, payment, 'payment_paid');
    return { handled: true, ...result };
}
