/**
 * Payment Service — Moyasar integration (STUB)
 * ------------------------------------------------------------------
 * Architectural scaffold for a FUTURE paid subscription rollout.
 *
 * IMPORTANT: Payment processing is DISABLED. While
 * PAYMENT_ENFORCEMENT_ENABLED !== "true" every function here either
 * short-circuits to "free access" or throws PaymentDisabledError.
 * No live Moyasar API calls are made anywhere in this module.
 *
 * Moyasar API reference (for the implementer, NOT used yet):
 *   https://docs.moyasar.com/
 *   Webhooks: https://docs.moyasar.com/webhooks
 *
 * When activating later:
 *   1. Populate MOYASAR_SECRET_KEY / MOYASAR_WEBHOOK_SECRET in env.
 *   2. Set PAYMENT_ENFORCEMENT_ENABLED=true.
 *   3. Replace the stub bodies below with real Moyasar SDK / REST calls.
 */

import crypto from 'crypto';

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
 * Decide whether an account may access paid features.
 * While enforcement is disabled, everyone is allowed.
 *
 * Future logic (enforcement enabled):
 *   - allow if is_admin_created (admin-exempt)
 *   - allow if grandfathered_at is set (pre-rollout users)
 *   - allow if subscription_status='active' AND expiry in the future
 *   - otherwise deny
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
 * Create a Moyasar customer record for an account. (STUB)
 * @returns {Promise<{ customerId: string }>}
 */
export async function createCustomer(accountId, email) {
    if (!isPaymentEnforcementEnabled()) {
        throw new PaymentDisabledError();
    }
    // TODO(payments): call Moyasar to create/lookup a customer and persist
    // the returned id in accounts.payment_gateway_customer_id.
    console.log(`[paymentService] createCustomer stub for account=${accountId} email=${email}`);
    throw new Error('createCustomer not implemented — Moyasar integration pending.');
}

/**
 * Create an annual subscription for a customer. (STUB)
 * @returns {Promise<{ subscriptionId: string, invoiceUrl: string }>}
 */
export async function createSubscription(customerId) {
    if (!isPaymentEnforcementEnabled()) {
        throw new PaymentDisabledError();
    }
    // TODO(payments): create a Moyasar invoice for SUBSCRIPTION_PRICE_HALALAS.
    console.log(`[paymentService] createSubscription stub for customer=${customerId}`);
    throw new Error('createSubscription not implemented — Moyasar integration pending.');
}

/**
 * Verify a Moyasar webhook signature using HMAC-SHA256.
 * Moyasar signs the raw request body with the shared webhook secret.
 *
 * @param {Buffer|string} rawBody - the raw, unparsed request body
 * @param {string} signatureHeader - value of the signature header
 * @returns {boolean}
 */
export function verifyWebhookSignature(rawBody, signatureHeader) {
    const secret = process.env.MOYASAR_WEBHOOK_SECRET;
    if (!secret || !signatureHeader) return false;

    const expected = crypto
        .createHmac('sha256', secret)
        .update(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'))
        .digest('hex');

    // Constant-time comparison to avoid timing attacks.
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(String(signatureHeader), 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

/**
 * Process an incoming Moyasar webhook event. (STUB)
 * Signature MUST be verified by the caller before invoking this.
 *
 * @param {object} payload - parsed webhook JSON
 * @returns {Promise<{ handled: boolean }>}
 */
export async function handleWebhookEvent(payload) {
    if (!isPaymentEnforcementEnabled()) {
        throw new PaymentDisabledError();
    }
    // TODO(payments): persist to payment_events, then update the related
    // account's subscription_status / subscription_expiry_date based on
    // payload.type (e.g. 'payment_paid', 'subscription_canceled').
    console.log('[paymentService] handleWebhookEvent stub:', payload?.type);
    return { handled: false };
}
