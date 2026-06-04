/**
 * subscriptionGuard middleware (STUB / not yet applied)
 * ------------------------------------------------------------------
 * Express middleware that enforces subscription access on protected
 * routes — but ONLY when PAYMENT_ENFORCEMENT_ENABLED === "true".
 *
 * While the flag is disabled (the default) it is a transparent pass-through,
 * preserving today's "free for all" behavior.
 *
 * This middleware is intentionally NOT wired into any route yet. At
 * activation time, insert it into the chain after requireSession, e.g.:
 *
 *   app.get('/quiz-sessions/:userId', requireSession,
 *           subscriptionGuard(db), handler);
 *
 * @param {import('pg').Pool} db - the shared PostgreSQL pool
 */
import { isPaymentEnforcementEnabled, checkSubscriptionAccess } from '../services/paymentService.js';

export function subscriptionGuard(db) {
    return async function (req, res, next) {
        // Disabled => everyone passes (current behavior, zero overhead).
        if (!isPaymentEnforcementEnabled()) return next();

        try {
            const userId = req.body?.userId || req.query?.userId || req.params?.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User identification required for access check' });
            }

            const result = await db.query(
                `SELECT id, subscription_status, subscription_expiry_date,
                        is_admin_created, grandfathered_at
                 FROM accounts WHERE id = $1`,
                [userId]
            );
            const account = result.rows[0];

            const { allowed, reason } = checkSubscriptionAccess(account);
            if (!allowed) {
                return res.status(402).json({
                    success: false,
                    expired: reason === 'subscription_required',
                    reason,
                    message: 'An active subscription is required to access this feature.',
                });
            }
            return next();
        } catch (error) {
            console.error('[subscriptionGuard] error:', error);
            return res.status(500).json({ message: 'Subscription check failed' });
        }
    };
}
