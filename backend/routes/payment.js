/**
 * Payment Routes — Moyasar integration
 * ------------------------------------------------------------------
 * Gated behind PAYMENT_ENFORCEMENT_ENABLED. While disabled, every endpoint
 * (except the always-on /config probe) returns 503.
 *
 * Mounted in app.js as:  app.use('/api/payment', attachDb, paymentRoutes)
 * `req.db` (the pg Pool) is attached by a small middleware at mount time.
 */

import express from 'express';
import {
    isPaymentEnforcementEnabled,
    getPriceHalalas,
    getCurrency,
    verifyWebhookToken,
    handleWebhookEvent,
    verifyAndActivate,
} from '../services/paymentService.js';

const router = express.Router();

const DISABLED_RESPONSE = {
    success: false,
    enabled: false,
    message: 'Payment enforcement is currently disabled. All accounts are free.',
};

/** Guard: short-circuit payment routes while enforcement is disabled. */
function requirePaymentEnabled(req, res, next) {
    if (!isPaymentEnforcementEnabled()) {
        return res.status(503).json(DISABLED_RESPONSE);
    }
    next();
}

/**
 * GET /api/payment/config
 * Always-available probe for the frontend. The publishable key is safe to
 * expose by design; the secret key is never sent to the client.
 */
router.get('/config', (req, res) => {
    const enabled = isPaymentEnforcementEnabled();
    res.json({
        enabled,
        currency: getCurrency(),
        priceHalalas: getPriceHalalas(),
        publishableKey: enabled ? (process.env.MOYASAR_PUBLISHABLE_KEY || null) : null,
    });
});

/**
 * POST /api/payment/verify   { paymentId, userId }
 * Called by the frontend callback page after Moyasar redirects back. Verifies
 * the payment server-side (secret key) and activates the subscription.
 */
router.post('/verify', requirePaymentEnabled, async (req, res) => {
    try {
        const { paymentId, userId } = req.body || {};
        if (!paymentId || !userId) {
            return res.status(400).json({ success: false, message: 'paymentId and userId are required.' });
        }

        const result = await verifyAndActivate(req.db, paymentId, userId);
        if (!result.success) {
            // Payment did not check out (not paid / wrong amount / wrong account).
            return res.status(402).json(result);
        }
        return res.json(result);
    } catch (error) {
        console.error('[payment/verify] error:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Payment verification failed.',
        });
    }
});

/**
 * POST /api/payment/webhook
 * Moyasar webhook receiver. Authenticated by comparing payload.secret_token
 * against MOYASAR_WEBHOOK_SECRET (no raw body / HMAC needed for Moyasar).
 */
router.post('/webhook', requirePaymentEnabled, async (req, res) => {
    try {
        if (!verifyWebhookToken(req.body?.secret_token)) {
            return res.status(401).json({ success: false, message: 'Invalid webhook token.' });
        }
        const result = await handleWebhookEvent(req.db, req.body);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('[payment/webhook] error:', error);
        // 500 lets Moyasar retry transient failures.
        return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
    }
});

/**
 * GET /api/payment/status/:userId
 * Current subscription state for a user.
 */
router.get('/status/:userId', requirePaymentEnabled, async (req, res) => {
    try {
        const { userId } = req.params;
        const r = await req.db.query(
            `SELECT id, subscription_status, subscription_expiry_date,
                    is_admin_created, grandfathered_at
             FROM accounts WHERE id = $1`,
            [userId]
        );
        if (r.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const a = r.rows[0];
        let daysRemaining = null;
        if (a.subscription_expiry_date) {
            const ms = new Date(a.subscription_expiry_date).getTime() - Date.now();
            daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
        }
        return res.json({
            success: true,
            status: a.subscription_status,
            expiryDate: a.subscription_expiry_date,
            daysRemaining,
            isAdminCreated: a.is_admin_created,
            grandfathered: !!a.grandfathered_at,
        });
    } catch (error) {
        console.error('[payment/status] error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch subscription status.' });
    }
});

export default router;
