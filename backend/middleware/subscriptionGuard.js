/**
 * subscriptionGuard middleware
 * ------------------------------------------------------------------
 * Express middleware that enforces subscription access on protected
 * routes — but ONLY when PAYMENT_ENFORCEMENT_ENABLED === "true".
 *
 * While the flag is disabled (the default) it is a transparent pass-through,
 * preserving the "free for all" behavior.
 *
 * MUST run after requireSession. The account is resolved from the SESSION
 * username (already validated against accounts.session_token), never from a
 * client-supplied userId — otherwise an unpaid user could borrow another
 * account's id to slip past the paywall.
 *
 *   app.get('/api/questions', requireSession, subscriptionGuard(db), handler);
 *
 * @param {import('pg').Pool} db - the shared PostgreSQL pool
 */
import { isPaymentEnforcementEnabled, checkSubscriptionAccess } from '../services/paymentService.js';

export function subscriptionGuard(db) {
    return async function (req, res, next) {
        // Disabled => everyone passes (current behavior, zero overhead).
        if (!isPaymentEnforcementEnabled()) return next();

        try {
            // Same identity source requireSession validated.
            const username = req.query.username || req.body?.username;
            if (!username) {
                return res.status(401).json({ message: 'Session credentials required for access check' });
            }

            const result = await db.query(
                `SELECT id, subscription_status, subscription_expiry_date,
                        is_admin_created, grandfathered_at
                 FROM accounts WHERE username = $1`,
                [username]
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
