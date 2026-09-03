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
import { logger } from '../utils/observability.js';
import {
    isPaymentEnforcementEnabled,
    listPlansForDisplay,
    getCurrency,
    verifyWebhookToken,
    handleWebhookEvent,
    verifyAndActivate,
    checkQuizAccess,
    FREE_QUESTION_ALLOWANCE,
} from '../services/paymentService.js';

const router = express.Router();

/**
 * Session guard for routes that return a specific user's data, mirroring the
 * pattern in routes/summaries.js: Bearer token (or query/body fallback) is
 * checked against accounts.session_token.
 */
async function resolveSession(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const username = req.query.username || req.body?.username;
    const sessionToken = bearerToken || req.query.sessionToken || req.body?.sessionToken;
    if (!username || !sessionToken) {
        return res.status(401).json({ success: false, message: 'Missing session credentials' });
    }
    try {
        const r = await req.db.query(
            'SELECT id, session_token FROM accounts WHERE username = $1',
            [username]
        );
        if (!r.rows.length || r.rows[0].session_token !== sessionToken) {
            return res.status(401).json({ success: false, message: 'Session invalid or expired' });
        }
        req.accountId = r.rows[0].id;
        next();
    } catch (err) {
        logger.error('[payment] session check failed:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/** As above, plus: the :userId in the path must be the session's own account. */
async function requireOwnSession(req, res, next) {
    resolveSession(req, res, () => {
        if (String(req.accountId) !== String(req.params.userId)) {
            return res.status(403).json({ success: false, message: 'Cannot view another account\'s subscription status.' });
        }
        next();
    });
}

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
 *
 * Returns a plan ladder (not one price) so the price pickers can render.
 * `plans` carries {id, kind, months, seats, priceHalalas} for each tier.
 *
 * ?kind=individual (default) — the three personal terms, for /subscribe.
 * ?kind=group                — the two multi-seat plans, for /groups.
 * ?kind=all                  — everything, for admin tooling.
 *
 * The default is `individual` on purpose: a group plan must never appear in
 * the ordinary checkout, where nothing explains the invite links.
 */
router.get('/config', (req, res) => {
    const enabled = isPaymentEnforcementEnabled();
    const kind = ['individual', 'group', 'all'].includes(req.query.kind)
        ? req.query.kind
        : 'individual';
    res.json({
        enabled,
        currency: getCurrency(),
        kind,
        plans: listPlansForDisplay(kind),
        publishableKey: enabled ? (process.env.MOYASAR_PUBLISHABLE_KEY || null) : null,
    });
});

/**
 * POST /api/payment/verify   { paymentId, userId }
 * Called by the frontend callback page after Moyasar redirects back. Verifies
 * the payment server-side (secret key) and activates the subscription.
 */
router.post('/verify', requirePaymentEnabled, resolveSession, async (req, res) => {
    try {
        const { paymentId } = req.body || {};
        if (!paymentId) {
            return res.status(400).json({ success: false, message: 'paymentId is required.' });
        }

        // The account comes from the validated session, never from the body.
        // Previously this route was unauthenticated and trusted a client-sent
        // userId: safe in practice only because every real payment carries
        // metadata.account_id, but a payment created without that metadata
        // would have activated whichever account the caller named.
        const result = await verifyAndActivate(req.db, paymentId, req.accountId);
        if (!result.success) {
            // Payment did not check out (not paid / wrong amount / wrong account).
            return res.status(402).json(result);
        }
        return res.json(result);
    } catch (error) {
        logger.error('[payment/verify] error:', error);
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
        logger.error('[payment/webhook] error:', error);
        // 500 lets Moyasar retry transient failures.
        return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
    }
});

/**
 * GET /api/payment/status/:userId
 * Current subscription state for a user.
 */
router.get('/status/:userId', requirePaymentEnabled, requireOwnSession, async (req, res) => {
    try {
        const { userId } = req.params;
        const r = await req.db.query(
            `SELECT id, subscription_status, subscription_expiry_date,
                    is_admin_created, grandfathered_at, free_questions_used,
                    free_questions_served
             FROM accounts WHERE id = $1`,
            [userId]
        );
        if (r.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const a = r.rows[0];
        const quiz = checkQuizAccess(a);
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
            // null = unlimited (paid, admin-created or grandfathered).
            freeQuestionsRemaining: Number.isFinite(quiz.remaining) ? quiz.remaining : null,
            allowance: FREE_QUESTION_ALLOWANCE,
            // Nothing renews automatically — every plan is a single charge.
            autoRenew: false,
            isAdminCreated: a.is_admin_created,
            grandfathered: !!a.grandfathered_at,
        });
    } catch (error) {
        logger.error('[payment/status] error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch subscription status.' });
    }
});

export default router;
