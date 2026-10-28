/**
 * One free month for a student who signs in from the Android app (PROPOSAL, OFF BY DEFAULT).
 *
 * Nothing here runs unless APP_FREE_MONTH_ENABLED is exactly "true" on the server, so
 * the code can be deployed before the owner decides (policy wording, see
 * SQB/mobile/docs/FREE-MONTH-DESIGN.md). It does not touch PLANS, prices or any PLAN_*
 * variable: it reuses the month arithmetic (computeNewExpiry) and the same audit
 * table as admin grants (payment_events), with status 'granted' so no money query
 * ever counts it as revenue.
 *
 * Rules (all checked inside one transaction, with the account row locked, so two
 * simultaneous requests cannot both grant):
 *   - once per account, ever (a payment_events row with event_type 'app_free_month');
 *   - only a verified email (free signup already verifies it by code);
 *   - never for an account that pays or ever paid (status 'paid' row), is
 *     grandfathered, already holds an admin/seat grant, or has a live subscription;
 *   - the platform marker is only a request: it is NOT proof of an install (the body
 *     value can be sent by anyone). The real limit is "one per verified account".
 */
import { computeNewExpiry, getCurrency } from './paymentService.js';

export const APP_FREE_MONTH_EVENT = 'app_free_month';
export const APP_FREE_MONTHS = 1;
export const APP_PLATFORM_MARKER = 'android-app';

export function isAppFreeMonthEnabled() {
    return process.env.APP_FREE_MONTH_ENABLED === 'true';
}

/**
 * Pure rule check. `history` is the account's payment_events rows reduced to
 * { event_type, status }.
 * @returns {{ eligible: boolean, reason: string }}
 */
export function evaluateAppFreeMonth(account, history = [], nowMs = Date.now()) {
    if (!account) return { eligible: false, reason: 'account_not_found' };
    if (!account.email_verified) return { eligible: false, reason: 'email_not_verified' };
    if (history.some((h) => h.event_type === APP_FREE_MONTH_EVENT)) return { eligible: false, reason: 'already_redeemed' };
    if (history.some((h) => h.status === 'paid')) return { eligible: false, reason: 'has_paid' };
    if (account.grandfathered_at) return { eligible: false, reason: 'grandfathered' };
    if (account.is_admin_created) return { eligible: false, reason: 'already_granted' };
    const live = account.subscription_status === 'active'
        && account.subscription_expiry_date
        && new Date(account.subscription_expiry_date).getTime() > nowMs;
    if (live) return { eligible: false, reason: 'active_subscription' };
    return { eligible: true, reason: 'eligible' };
}

/**
 * Redeem the month. Never throws for an ineligible account: it returns
 * { granted: false, reason } so the app can stay silent.
 */
export async function redeemAppFreeMonth(db, accountId, { platform } = {}) {
    if (platform !== APP_PLATFORM_MARKER) return { granted: false, reason: 'not_from_app' };

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const { rows } = await client.query(
            `SELECT id, email_verified, subscription_status, subscription_expiry_date,
                    is_admin_created, grandfathered_at
               FROM accounts WHERE id = $1 FOR UPDATE`,
            [accountId]
        );
        const account = rows[0];
        const history = account
            ? (await client.query(
                `SELECT event_type, status FROM payment_events
                  WHERE account_id = $1 AND (event_type = $2 OR status = 'paid')`,
                [accountId, APP_FREE_MONTH_EVENT]
            )).rows
            : [];

        const verdict = evaluateAppFreeMonth(account, history);
        if (!verdict.eligible) {
            await client.query('ROLLBACK');
            return { granted: false, reason: verdict.reason };
        }

        const newExpiry = computeNewExpiry(null, { months: APP_FREE_MONTHS });
        await client.query(
            `UPDATE accounts
                SET subscription_status = 'active',
                    subscription_expiry_date = $1,
                    is_admin_created = TRUE,
                    renewal_reminder_stage = NULL
              WHERE id = $2`,
            [newExpiry, accountId]
        );
        await client.query(
            `INSERT INTO payment_events
                (account_id, event_type, gateway, gateway_ref, amount_halalas, currency, status, raw_payload)
             VALUES ($1, $2, 'app', $3, 0, $4, 'granted', $5)`,
            [
                accountId,
                APP_FREE_MONTH_EVENT,
                `${APP_FREE_MONTH_EVENT}_${accountId}`,
                getCurrency(),
                JSON.stringify({ months: APP_FREE_MONTHS, platform, new_expiry: newExpiry }),
            ]
        );
        await client.query('COMMIT');
        return { granted: true, reason: 'granted', months: APP_FREE_MONTHS, expiresAt: newExpiry };
    } catch (err) {
        try { await client.query('ROLLBACK'); } catch { /* connection already gone */ }
        throw err;
    } finally {
        client.release();
    }
}
