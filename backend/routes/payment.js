/**
 * Payment Routes — Moyasar integration (STUB)
 * ------------------------------------------------------------------
 * All endpoints are gated behind the PAYMENT_ENFORCEMENT_ENABLED flag.
 * While the flag is "false" (the default), every endpoint responds with
 * 503 and a clear "disabled" message — NO payment processing occurs.
 *
 * Mounted in app.js as:  app.use('/api/payment', paymentRoutes)
 *
 * The route handler expects `req.db` (the pg Pool) to be attached by a
 * small middleware at mount time, mirroring the other route modules.
 */

import express from 'express';
import {
    isPaymentEnforcementEnabled,
    verifyWebhookSignature,
    handleWebhookEvent,
} from '../services/paymentService.js';

const router = express.Router();

const DISABLED_RESPONSE = {
    success: false,
    enabled: false,
    message: 'Payment enforcement is currently disabled. All accounts are free.',
};

/** Guard: short-circuit every payment route while enforcement is disabled. */
function requirePaymentEnabled(req, res, next) {
    if (!isPaymentEnforcementEnabled()) {
        return res.status(503).json(DISABLED_RESPONSE);
    }
    next();
}

/**
 * GET /api/payment/config
 * Lightweight, always-available status probe (does NOT leak secrets).
 * Useful for the frontend to decide whether to render payment UI.
 */
router.get('/config', (req, res) => {
    res.json({
        enabled: isPaymentEnforcementEnabled(),
        currency: process.env.SUBSCRIPTION_CURRENCY || 'SAR',
        priceHalalas: Number(process.env.SUBSCRIPTION_PRICE_HALALAS || 0),
        // Publishable key is safe to expose to the client by design.
        publishableKey: isPaymentEnforcementEnabled()
            ? (process.env.MOYASAR_PUBLISHABLE_KEY || null)
            : null,
    });
});

/**
 * POST /api/payment/webhook
 * Moyasar webhook receiver (STUB). Verifies signature, then delegates.
 * NOTE: requires the raw body for signature verification — when enabled,
 * mount express.raw() for this path in app.js before express.json().
 */
router.post('/webhook', requirePaymentEnabled, async (req, res) => {
    try {
        const signature = req.headers['x-moyasar-signature'] || req.headers['moyasar-signature'];
        const rawBody = req.rawBody || JSON.stringify(req.body || {});

        if (!verifyWebhookSignature(rawBody, signature)) {
            return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
        }

        const result = await handleWebhookEvent(req.body);
        res.status(200).json({ success: true, handled: result.handled });
    } catch (error) {
        console.error('[payment/webhook] error:', error);
        res.status(error.statusCode || 500).json({ success: false, message: 'Webhook processing failed' });
    }
});

/**
 * GET /api/payment/status/:userId
 * Returns the subscription status for a user (STUB while disabled).
 */
router.get('/status/:userId', requirePaymentEnabled, async (req, res) => {
    // TODO(payments): read accounts.subscription_status for :userId.
    res.status(501).json({ success: false, message: 'Subscription status not implemented yet.' });
});

/**
 * POST /api/payment/initialize
 * Begin a subscription payment flow (STUB). Would create a Moyasar invoice
 * and return a hosted payment URL.
 */
router.post('/initialize', requirePaymentEnabled, async (req, res) => {
    res.status(501).json({ success: false, message: 'Payment initialization not implemented yet.' });
});

/**
 * POST /api/payment/callback
 * Post-payment redirect handler (STUB).
 */
router.post('/callback', requirePaymentEnabled, async (req, res) => {
    res.status(501).json({ success: false, message: 'Payment callback not implemented yet.' });
});

export default router;
