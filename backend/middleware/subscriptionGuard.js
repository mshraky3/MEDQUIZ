/**
 * Access guards
 * ------------------------------------------------------------------
 * Two Express middleware factories, both no-ops while
 * PAYMENT_ENFORCEMENT_ENABLED !== "true" (the default), preserving the
 * "free for all" behavior.
 *
 *   quizAccessGuard(db)   — may this account start a quiz? Paid accounts are
 *                           unlimited; free accounts spend from a lifetime
 *                           allowance of 40 answered questions. Attaches
 *                           req.quizAccess = { remaining, reason } so the
 *                           handler can clamp how many questions it serves.
 *
 *   subscriptionGuard(db) — paid-only. For features that have no free slice
 *                           at all (the whole-specialty final quiz).
 *
 * NEITHER of these may be used to gate logging in, analytics, or the account
 * pages. A free-tier user keeps their account forever — that is the whole
 * point of the free tier, and the reason the old trial was replaced.
 *
 * MUST run after requireSession. The account is resolved from the SESSION
 * username (already validated against accounts.session_token), never from a
 * client-supplied userId — otherwise an unpaid user could borrow another
 * account's id to slip past the paywall.
 *
 *   app.get('/api/questions', requireSession, quizAccessGuard(db), handler);
 *
 * @param {import('pg').Pool} db - the shared PostgreSQL pool
 */
import {
    isPaymentEnforcementEnabled,
    checkSubscriptionAccess,
    checkQuizAccess,
    FREE_QUESTION_ALLOWANCE,
} from '../services/paymentService.js';
import { recordFunnelEvent } from '../routes/funnel.js';

const ACCOUNT_FIELDS = `id, subscription_status, subscription_expiry_date,
                        is_admin_created, grandfathered_at, free_questions_used`;

/** Look up the session's account, or null. Shared by both guards. */
async function loadAccount(db, username) {
    const result = await db.query(
        `SELECT ${ACCOUNT_FIELDS} FROM accounts WHERE username = $1`,
        [username]
    );
    return result.rows[0] || null;
}

/**
 * Fire-and-forget paywall funnel event. Deliberately server-side: a client
 * could suppress the beacon, and this IS the real gate.
 */
function recordPaywallHit(db, account, reason, req) {
    recordFunnelEvent(db, {
        accountId: account?.id ?? null,
        event: 'paywall_hit',
        props: { reason, path: req.originalUrl },
    }).catch(() => {});
}

/** Quiz entitlement. Allows free accounts while they still have allowance. */
export function quizAccessGuard(db) {
    return async function (req, res, next) {
        if (!isPaymentEnforcementEnabled()) {
            req.quizAccess = { allowed: true, remaining: Infinity, reason: 'enforcement_disabled' };
            return next();
        }

        try {
            // Same identity source requireSession validated.
            const username = req.query.username || req.body?.username;
            if (!username) {
                return res.status(401).json({ message: 'Session credentials required for access check' });
            }

            const account = await loadAccount(db, username);
            const access = checkQuizAccess(account);
            req.quizAccess = access;

            if (!access.allowed) {
                recordPaywallHit(db, account, access.reason, req);
                return res.status(402).json({
                    success: false,
                    expired: true,
                    reason: access.reason,
                    remaining: 0,
                    allowance: FREE_QUESTION_ALLOWANCE,
                    message: access.reason === 'free_allowance_exhausted'
                        ? `You have used all ${FREE_QUESTION_ALLOWANCE} of your free questions. Subscribe to keep practising — your account, your progress and the free lessons stay open.`
                        : 'An active subscription is required to access this feature.',
                });
            }
            return next();
        } catch (error) {
            console.error('[quizAccessGuard] error:', error);
            return res.status(500).json({ message: 'Access check failed' });
        }
    };
}

/** Paid-only. No free slice — used by the final-quiz routes. */
export function subscriptionGuard(db) {
    return async function (req, res, next) {
        if (!isPaymentEnforcementEnabled()) return next();

        try {
            const username = req.query.username || req.body?.username;
            if (!username) {
                return res.status(401).json({ message: 'Session credentials required for access check' });
            }

            const account = await loadAccount(db, username);
            const { allowed, reason } = checkSubscriptionAccess(account);
            if (!allowed) {
                recordPaywallHit(db, account, reason, req);
                return res.status(402).json({
                    success: false,
                    expired: true,
                    reason,
                    message: 'This is a subscriber feature. Subscribe to unlock it.',
                });
            }
            return next();
        } catch (error) {
            console.error('[subscriptionGuard] error:', error);
            return res.status(500).json({ message: 'Subscription check failed' });
        }
    };
}
