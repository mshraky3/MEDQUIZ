/**
 * Admin metrics — the single source of truth for every number the admin
 * panel shows outside the per-payment ledger detail.
 *
 * Money NEVER gets its own SQL again. It always composes fetchPaidEvents +
 * summarize from accountingService.js, which is already the canonical ledger
 * (deduped by gateway_ref, test payments excluded, fees + refunds applied).
 * Before this file, /admin/stats summed payment_events directly — counting
 * test payments and duplicate webhook rows, ignoring fees and refunds — so it
 * disagreed with /api/accounting/summary. That bug is why this file exists.
 *
 * Every other "two definitions of the same thing" bug (trial→paid rate,
 * active-subscriber predicate) is fixed the same way: one function, one
 * predicate, imported everywhere it's needed.
 */

import { fetchPaidEvents, summarize } from './accountingService.js';
import { FREE_QUESTION_ALLOWANCE } from './paymentService.js';

/** Month key (YYYY-MM) in Riyadh time — KSA is a fixed UTC+3, no DST. */
export function riyadhMonthKey(date) {
    const d = new Date(new Date(date).getTime() + 3 * 3600 * 1000);
    return d.toISOString().slice(0, 7);
}

// ── Shared SQL predicates ───────────────────────────────────────────────────
// Exported as strings so every query that needs "is this account a paying
// subscriber" splices in the exact same condition. A predicate defined twice
// is how the dashboard and analytics page disagreed before.
export const SQL_ACTIVE_SUBSCRIBER = `subscription_status = 'active' AND subscription_expiry_date > NOW()`;
export const SQL_HAS_ACCESS = `((${SQL_ACTIVE_SUBSCRIBER}) OR grandfathered_at IS NOT NULL OR is_admin_created = TRUE)`;
// The free tier replaced the timed trial on 2026-08-08. "Still trying" means a
// non-paying account with allowance left; "used up" is the conversion moment
// the old SQL_ACTIVE_TRIAL / trial_expired pair used to mark.
export const SQL_FREE_TIER = `NOT ${SQL_HAS_ACCESS}`;
export const SQL_FREE_TRYING = `${SQL_FREE_TIER} AND free_questions_used < ${FREE_QUESTION_ALLOWANCE}`;
export const SQL_FREE_EXHAUSTED = `${SQL_FREE_TIER} AND free_questions_used >= ${FREE_QUESTION_ALLOWANCE}`;

/**
 * Revenue snapshot — wraps the canonical ledger. Every money figure the admin
 * panel displays (dashboard headline, growth page, accounting page) comes
 * from this function so they can never disagree.
 */
export async function revenueSnapshot(db, { from = null, to = null } = {}) {
    const rows = await fetchPaidEvents(db, { from, to });
    const totals = summarize(rows);

    const dayMap = new Map();
    const monthMap = new Map();
    for (const r of rows) {
        const dayKey = new Date(new Date(r.receivedAt).getTime() + 3 * 3600 * 1000)
            .toISOString().slice(0, 10);
        if (!dayMap.has(dayKey)) dayMap.set(dayKey, { date: dayKey, count: 0, netHalalas: 0, grossHalalas: 0 });
        const d = dayMap.get(dayKey);
        d.count += 1; d.netHalalas += r.netHalalas; d.grossHalalas += r.grossHalalas;

        const monthKey = riyadhMonthKey(r.receivedAt);
        if (!monthMap.has(monthKey)) monthMap.set(monthKey, { month: monthKey, count: 0, netHalalas: 0, grossHalalas: 0 });
        const m = monthMap.get(monthKey);
        m.count += 1; m.netHalalas += r.netHalalas; m.grossHalalas += r.grossHalalas;
    }

    const thisMonthKey = riyadhMonthKey(new Date());
    const lastMonthKey = riyadhMonthKey(new Date(Date.now() - 30 * 86400000));

    const payerAccountIds = new Set(
        rows.map((r) => r.accountId).filter((id) => id != null)
    );

    return {
        ...totals,
        payerAccountIds,
        distinctPayers: payerAccountIds.size,
        recentPayments: rows.slice(-10).reverse().map((r) => ({
            receivedAt: r.receivedAt,
            amountSar: r.grossHalalas / 100,
            netSar: r.netHalalas / 100,
            currency: r.currency,
            username: r.subscriber,
        })),
        byDay: [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
        byMonth: [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month)),
        thisMonthNetHalalas: monthMap.get(thisMonthKey)?.netHalalas || 0,
        lastMonthNetHalalas: monthMap.get(lastMonthKey)?.netHalalas || 0,
    };
}

/** Subscription/access snapshot — one definition of "active", used everywhere. */
export async function subscriptionSnapshot(db) {
    const { rows } = await db.query(`
        SELECT
            COUNT(*) FILTER (WHERE ${SQL_ACTIVE_SUBSCRIBER}) AS active_subscribers,
            COUNT(*) FILTER (WHERE ${SQL_FREE_TRYING}) AS free_trying,
            COUNT(*) FILTER (WHERE ${SQL_FREE_EXHAUSTED}) AS free_exhausted_unconverted,
            COUNT(*) FILTER (WHERE ${SQL_FREE_TIER} AND free_questions_used = 0) AS free_never_started,
            COUNT(*) FILTER (WHERE grandfathered_at IS NOT NULL) AS grandfathered,
            COUNT(*) FILTER (WHERE is_admin_created = true) AS admin_created,
            COUNT(*) FILTER (WHERE ${SQL_ACTIVE_SUBSCRIBER} AND subscription_expiry_date <= NOW() + INTERVAL '7 days') AS expiring_7d,
            COUNT(*) FILTER (WHERE ${SQL_ACTIVE_SUBSCRIBER} AND subscription_expiry_date <= NOW() + INTERVAL '30 days') AS expiring_30d
        FROM accounts
    `);
    return rows[0] || {};
}

/**
 * Tried → paid conversion — the single definition. An account counts as
 * "converted" when it actually TRIED the product and then appears as a payer in
 * the deduped, live-only revenue ledger (payerAccountIds, from revenueSnapshot).
 * Membership of the ledger, not current subscription_status: someone who paid
 * once and later lapsed still converted.
 *
 * "Tried" spans both eras deliberately — a trial_grants row (the retired 1-hour
 * trial) or at least one question spent from the free allowance. Dropping the
 * historical trial cohort would make the rate jump overnight for no real reason.
 */
export async function conversionSnapshot(db, payerAccountIds) {
    const { rows } = await db.query(`
        SELECT a.id
          FROM accounts a
         WHERE a.free_questions_used > 0
            OR EXISTS (SELECT 1 FROM trial_grants g WHERE g.account_id = a.id)
    `);
    const triedAccountIds = rows.map((r) => r.id);
    const totalTried = triedAccountIds.length;
    const triedToPaid = triedAccountIds.filter((id) => payerAccountIds.has(id)).length;
    const conversionRate = totalTried > 0
        ? Math.round((triedToPaid / totalTried) * 1000) / 10
        : 0;
    return { totalTried, triedToPaid, conversionRate };
}

/**
 * Paid but no access — accounts with a REAL payment yet locked out.
 *
 * `livemode IS DISTINCT FROM FALSE` is the same filter the ledger uses and is
 * not optional: without it this counted Moyasar TEST payments as money and
 * reported a paying customer locked out when no money had ever moved. That
 * false positive is exactly the class of bug this service exists to prevent —
 * every money predicate must agree with accountingService.fetchPaidEvents().
 */
export async function paidButInactiveCount(db) {
    const { rows } = await db.query(`
        SELECT COUNT(*) AS n FROM accounts a
        WHERE EXISTS (SELECT 1 FROM payment_events pe
                      WHERE pe.account_id = a.id AND pe.status = 'paid'
                        AND pe.livemode IS DISTINCT FROM FALSE)
          AND NOT ${SQL_HAS_ACCESS}
    `);
    return parseInt(rows[0]?.n) || 0;
}

/** Users overview — counts, no per-track breakdown (see trackSnapshot for that). */
export async function userSnapshot(db) {
    const [totalRes, activeRes, weekRes, monthRes, todayRes, onlineRes] = await Promise.all([
        db.query('SELECT COUNT(*) AS count FROM accounts'),
        db.query(`SELECT COUNT(*) AS count FROM accounts WHERE logged_date > NOW() - INTERVAL '7 days'`),
        db.query(`SELECT COUNT(*) AS count FROM accounts WHERE created_at > NOW() - INTERVAL '7 days'`),
        db.query(`SELECT COUNT(*) AS count FROM accounts WHERE created_at > NOW() - INTERVAL '30 days'`),
        db.query(`SELECT COUNT(*) AS count FROM accounts WHERE created_at > NOW() - INTERVAL '24 hours'`),
        db.query(`SELECT COUNT(*) AS count FROM accounts WHERE logged = true AND logged_date > NOW() - INTERVAL '30 minutes'`),
    ]);
    return {
        totalUsers: parseInt(totalRes.rows[0]?.count) || 0,
        activeUsers: parseInt(activeRes.rows[0]?.count) || 0,
        newUsersWeek: parseInt(weekRes.rows[0]?.count) || 0,
        newUsersMonth: parseInt(monthRes.rows[0]?.count) || 0,
        newUsersToday: parseInt(todayRes.rows[0]?.count) || 0,
        onlineNow: parseInt(onlineRes.rows[0]?.count) || 0,
    };
}

/** Daily active users (DAU/WAU/MAU) — one definition, from login_history. */
export async function activeUserSnapshot(db) {
    const { rows } = await db.query(`
        SELECT
            COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '1 day') AS dau,
            COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '7 days') AS wau,
            COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '30 days') AS mau
        FROM login_history
    `);
    const r = rows[0] || {};
    return {
        dau: parseInt(r.dau) || 0,
        wau: parseInt(r.wau) || 0,
        mau: parseInt(r.mau) || 0,
    };
}

/**
 * Daily new-user signups, gap-filled so days with zero signups render as
 * zero-height bars instead of missing entirely. Riyadh calendar day
 * (`created_at + 3 hours`) so "today" matches what the owner sees.
 */
export async function dailySignups(db, { from, to }) {
    const { rows } = await db.query(`
        WITH days AS (SELECT generate_series($1::date, $2::date, '1 day')::date AS d),
             s AS (
                 SELECT (created_at + INTERVAL '3 hours')::date AS d, COUNT(*)::int AS n
                 FROM accounts
                 WHERE created_at IS NOT NULL
                   AND (created_at + INTERVAL '3 hours')::date BETWEEN $1::date AND $2::date
                 GROUP BY 1
             )
        SELECT to_char(days.d, 'YYYY-MM-DD') AS date, COALESCE(s.n, 0) AS signups
        FROM days LEFT JOIN s ON s.d = days.d ORDER BY days.d
    `, [from, to]);
    return rows;
}

/**
 * Daily distinct active users (logged in that day), gap-filled. Riyadh
 * calendar day, same convention as dailySignups.
 */
export async function dailyActiveUsers(db, { from, to }) {
    const { rows } = await db.query(`
        WITH days AS (SELECT generate_series($1::date, $2::date, '1 day')::date AS d),
             l AS (
                 SELECT (login_time + INTERVAL '3 hours')::date AS d,
                        COUNT(DISTINCT user_id)::int AS active_users
                 FROM login_history
                 WHERE (login_time + INTERVAL '3 hours')::date BETWEEN $1::date AND $2::date
                 GROUP BY 1
             )
        SELECT to_char(days.d, 'YYYY-MM-DD') AS date, COALESCE(l.active_users, 0) AS active_users
        FROM days LEFT JOIN l ON l.d = days.d ORDER BY days.d
    `, [from, to]);
    return rows;
}

/**
 * Funnel event counts — landing → signup → trial → paywall → subscribe →
 * payment. The counterpart to page_engagement (logged-in only): this is what
 * makes the pre-account part of the journey visible at all.
 */
export async function funnelSnapshot(db, { days = 30 } = {}) {
    const { rows } = await db.query(`
        SELECT event, COUNT(*)::int AS count,
               COUNT(DISTINCT COALESCE(account_id::text, anon_id))::int AS distinct_actors
          FROM funnel_events
         WHERE created_at >= NOW() - ($1 || ' days')::interval
         GROUP BY event
         ORDER BY count DESC
    `, [days]).catch(() => ({ rows: [] }));
    return { days, events: rows };
}

/** Open (unresolved) question reports — surfaced on the "needs attention" panel. */
export async function openReportsCount(db) {
    const { rows } = await db.query(
        `SELECT COUNT(*) AS n FROM question_reports WHERE status = 'pending'`
    ).catch(() => ({ rows: [{ n: 0 }] }));
    return parseInt(rows[0]?.n) || 0;
}
