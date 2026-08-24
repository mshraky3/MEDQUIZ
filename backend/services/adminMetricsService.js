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
// is_admin_created excluded deliberately: admin grants, temp-link invites and
// admin-created accounts all carry subscription_status='active' plus a real
// expiry, so without this they were counted as PAYING subscribers on the
// dashboard while also being counted again under admin_created below. They are
// access, not revenue — SQL_HAS_ACCESS picks them up on its own arm.
//
// The `prefix` form exists for queries that join accounts under an alias. It is
// the reason /admin/stats can splice the predicate instead of restating it as
// `a.subscription_status = 'active' AND ...` — which is exactly how the
// per-track subscriber count drifted from the headline one.
export const activeSubscriberSql = (prefix = '') =>
    `${prefix}subscription_status = 'active' AND ${prefix}subscription_expiry_date > NOW()
    AND ${prefix}is_admin_created = FALSE`;
export const SQL_ACTIVE_SUBSCRIBER = activeSubscriberSql();

// Access granted by an admin (panel grant, temp-link invite, admin-created
// account) that has not lapsed. The OTHER half of SQL_ACTIVE_SUBSCRIBER:
// together they cover everyone sitting on a live term, and any surface showing
// one without the other reports comped accounts as customers.
export const adminGrantedSql = (prefix = '') =>
    `${prefix}is_admin_created = TRUE
    AND (${prefix}subscription_expiry_date IS NULL OR ${prefix}subscription_expiry_date > NOW())`;
export const SQL_ADMIN_GRANTED = adminGrantedSql();
// is_admin_created is a TIMED grant, not a permanent one (see
// checkSubscriptionAccess in paymentService.js), so it only counts as access
// while its expiry is in the future. The NULL-expiry arm mirrors the safety
// valve in that function: nothing creates such a row any more, but one that
// exists still has access and must be counted as such, or the dashboard would
// report a student as lapsed while the app still lets them in.
export const SQL_HAS_ACCESS = `((${SQL_ACTIVE_SUBSCRIBER})
    OR grandfathered_at IS NOT NULL
    OR (${SQL_ADMIN_GRANTED}))`;
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
    // Both counts computed in SQL — this used to fetch every "tried" account's
    // id (a number that grows with the whole userbase) just to count them and
    // intersect with payerAccountIds in JS. Passing that set into the query
    // as an array lets COUNT(*) FILTER do the intersection instead.
    const { rows } = await db.query(`
        SELECT
            COUNT(*)::int AS total_tried,
            COUNT(*) FILTER (WHERE a.id = ANY($1::int[]))::int AS tried_to_paid
          FROM accounts a
         WHERE a.free_questions_used > 0
            OR EXISTS (SELECT 1 FROM trial_grants g WHERE g.account_id = a.id)
    `, [[...payerAccountIds]]);
    const totalTried = rows[0]?.total_tried ?? 0;
    const triedToPaid = rows[0]?.tried_to_paid ?? 0;
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

// ─────────────────────────────────────────────────────────────────────────────
// Learning behaviour.
//
// Everything below reads tables the admin panel has never surfaced —
// principally user_question_attempts, which holds one row per answer with its
// timing and is by some distance the richest thing in the database. Every
// query here is only ever called from GET /admin/behavior, which is on-demand:
// none of it belongs on /admin/stats, whose two-minute poll would run these
// aggregations continuously for no one.
//
// Day/hour bucketing adds INTERVAL '3 hours' throughout, matching dailySignups
// and dailyActiveUsers above — timestamps are stored TZ-less in UTC and Riyadh
// is a fixed UTC+3 with no DST, so this is the Saudi calendar day regardless of
// what the server session timezone happens to be. Getting this wrong would put
// a 9pm study session on the wrong day and shift the whole hour-of-day chart.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The questions students get wrong most often, among those answered enough
 * times for the rate to mean anything.
 *
 * This is a content-quality instrument as much as a difficulty one: a question
 * almost everyone misses is usually either genuinely hard or quietly miskeyed,
 * and the second kind currently only surfaces if a student bothers to report
 * it. avgSeconds separates the two — a question people answer fast and get
 * wrong reads as misleading, one they answer slowly and get wrong reads as hard.
 *
 * minAttempts keeps a question answered twice, wrongly, out of the top of a
 * list sorted by percentage.
 */
export async function hardestQuestions(db, { limit = 20, minAttempts = 15 } = {}) {
    const { rows } = await db.query(`
        SELECT q.id,
               LEFT(q.question_text, 160)                              AS question_text,
               q.question_type,
               q.source,
               q.track,
               COUNT(*)::int                                          AS attempts,
               COUNT(DISTINCT a.user_id)::int                         AS users,
               ROUND(100.0 * COUNT(*) FILTER (WHERE a.is_correct) / COUNT(*), 1)::float AS pct_correct,
               ROUND(AVG(a.time_taken)::numeric, 1)::float            AS avg_seconds
        FROM user_question_attempts a
        JOIN questions q ON q.id = a.question_id
        GROUP BY q.id, q.question_text, q.question_type, q.source, q.track
        HAVING COUNT(*) >= $2
        ORDER BY pct_correct ASC, attempts DESC
        LIMIT $1
    `, [limit, minAttempts]).catch(() => ({ rows: [] }));
    return rows;
}

/**
 * For one question, how the answers split across the options — i.e. which
 * distractor is doing the damage.
 *
 * selected_option stores the option TEXT, not an index (see the ILIKE
 * comparison in the admin question search), so the grouping is by value. A
 * single dominant wrong answer usually means the distractor is defensible and
 * the explanation needs to address it by name; an even spread means guessing.
 */
export async function questionAnswerSpread(db, questionId) {
    const { rows } = await db.query(`
        SELECT a.selected_option,
               COUNT(*)::int AS n,
               BOOL_OR(a.is_correct) AS is_correct
        FROM user_question_attempts a
        WHERE a.question_id = $1 AND a.selected_option IS NOT NULL
        GROUP BY a.selected_option
        ORDER BY n DESC
    `, [questionId]).catch(() => ({ rows: [] }));
    return rows;
}

/**
 * How long answers take, as buckets.
 *
 * The tail is the interesting half. A pile-up under 5 seconds is people
 * clicking through without reading — which inflates every accuracy number
 * elsewhere on the dashboard — and a fat tail past two minutes points at
 * questions whose stem is too long to work through in exam conditions.
 */
export async function answerTimeDistribution(db) {
    const { rows } = await db.query(`
        SELECT bucket, COUNT(*)::int AS n FROM (
            SELECT CASE
                     WHEN time_taken < 5   THEN '0-5s'
                     WHEN time_taken < 15  THEN '5-15s'
                     WHEN time_taken < 30  THEN '15-30s'
                     WHEN time_taken < 60  THEN '30-60s'
                     WHEN time_taken < 120 THEN '1-2m'
                     ELSE '2m+'
                   END AS bucket
            FROM user_question_attempts
            WHERE time_taken IS NOT NULL AND time_taken >= 0
        ) b
        GROUP BY bucket
    `).catch(() => ({ rows: [] }));
    // Fixed order — GROUP BY returns buckets alphabetically, which would put
    // '0-5s' next to '1-2m' and draw the histogram out of sequence.
    const ORDER = ['0-5s', '5-15s', '15-30s', '30-60s', '1-2m', '2m+'];
    const byBucket = Object.fromEntries(rows.map((r) => [r.bucket, r.n]));
    return ORDER.map((bucket) => ({ bucket, n: byBucket[bucket] || 0 }));
}

/**
 * How much of the question bank is actually being reached, per track and
 * specialty.
 *
 * Answers the content-planning question directly: a specialty at 90% consumed
 * needs new questions before subscribers run dry, and one at 5% is either
 * undiscoverable in the UI or nobody's priority. Counts DISTINCT questions ever
 * answered by anyone, not attempts.
 */
export async function bankCoverage(db) {
    const { rows } = await db.query(`
        SELECT q.track,
               q.question_type,
               COUNT(*)::int                                             AS questions,
               COUNT(*) FILTER (WHERE seen.question_id IS NOT NULL)::int AS reached
        FROM questions q
        LEFT JOIN (
            SELECT DISTINCT question_id FROM user_question_progress
        ) seen ON seen.question_id = q.id
        GROUP BY q.track, q.question_type
        ORDER BY q.track, questions DESC
    `).catch(() => ({ rows: [] }));
    return rows.map((r) => ({
        ...r,
        pctReached: r.questions > 0 ? Math.round((r.reached / r.questions) * 1000) / 10 : 0,
    }));
}

/**
 * When people study: quiz starts by day-of-week and hour, in Riyadh time.
 *
 * The practical use is scheduling — the daily Telegram post, lifecycle email
 * sends and maintenance windows are all currently set by guesswork. Returns a
 * flat list rather than a matrix so the client can shape it; dow is 0=Sunday,
 * matching Postgres EXTRACT(DOW) and the Saudi working week.
 */
export async function studyHeatmap(db, { days = 60 } = {}) {
    const { rows } = await db.query(`
        SELECT EXTRACT(DOW  FROM start_time + INTERVAL '3 hours')::int AS dow,
               EXTRACT(HOUR FROM start_time + INTERVAL '3 hours')::int AS hour,
               COUNT(*)::int AS n
        FROM user_quiz_sessions
        WHERE start_time >= NOW() - ($1 || ' days')::interval
        GROUP BY 1, 2
    `, [days]).catch(() => ({ rows: [] }));
    return rows;
}

/**
 * Weekly signup cohorts and how many of each came back in the weeks after.
 *
 * This is real retention, unlike the wowActiveRatio on the overview page —
 * that one compares two adjacent weeks of activity and can exceed 100%, which
 * is why it had to be renamed away from "retention". Here each cohort is fixed
 * at signup and followed forward, so week 0 is always close to 100% and the
 * decay after it is the number worth watching.
 *
 * Activity means a login, reusing the same framing as the new-vs-returning
 * chart on the growth page.
 */
export async function retentionCohorts(db, { weeks = 8 } = {}) {
    const { rows } = await db.query(`
        WITH cohort AS (
            SELECT id AS user_id,
                   DATE_TRUNC('week', created_at + INTERVAL '3 hours')::date AS cohort_week
            FROM accounts
            WHERE created_at >= NOW() - (($1 + 1) || ' weeks')::interval
        ),
        activity AS (
            SELECT DISTINCT c.user_id, c.cohort_week,
                   (DATE_TRUNC('week', l.login_time + INTERVAL '3 hours')::date
                    - c.cohort_week) / 7 AS week_index
            FROM cohort c
            JOIN login_history l ON l.user_id = c.user_id
            WHERE l.login_time >= c.cohort_week
        ),
        sizes AS (
            SELECT cohort_week, COUNT(*)::int AS cohort_size FROM cohort GROUP BY cohort_week
        )
        SELECT to_char(s.cohort_week, 'YYYY-MM-DD') AS cohort_week,
               s.cohort_size,
               a.week_index::int AS week_index,
               COUNT(a.user_id)::int AS active
        FROM sizes s
        LEFT JOIN activity a
               ON a.cohort_week = s.cohort_week
              AND a.week_index BETWEEN 0 AND $1
        GROUP BY s.cohort_week, s.cohort_size, a.week_index
        ORDER BY s.cohort_week, week_index
    `, [weeks]).catch(() => ({ rows: [] }));
    return rows;
}

/**
 * Which summaries get read, and how far.
 *
 * max_page_reached against the deck's page_count is a drop-off curve per deck:
 * a summary everyone opens and nobody finishes is either too long or front-
 * loaded with the wrong material. Nothing in the admin panel has ever shown
 * this — summaries are measured only by a raw view count.
 */
export async function summaryDropoff(db, { limit = 15 } = {}) {
    const { rows } = await db.query(`
        SELECT s.id,
               COALESCE(s.title_en, s.title) AS title,
               s.question_type,
               s.page_count,
               COUNT(p.user_id)::int                             AS readers,
               COUNT(*) FILTER (WHERE p.completed)::int          AS finished,
               ROUND(AVG(p.max_page_reached)::numeric, 1)::float AS avg_max_page
        FROM summaries s
        JOIN summary_progress p ON p.summary_id = s.id
        GROUP BY s.id, s.title, s.title_en, s.question_type, s.page_count
        ORDER BY readers DESC
        LIMIT $1
    `, [limit]).catch(() => ({ rows: [] }));
    return rows.map((r) => ({
        ...r,
        pctFinished: r.readers > 0 ? Math.round((r.finished / r.readers) * 1000) / 10 : 0,
        pctDepth: r.page_count > 0 ? Math.round((r.avg_max_page / r.page_count) * 1000) / 10 : 0,
    }));
}

/**
 * How accounts get opened — Google, the email OTP, an invite link, a group
 * seat, or an admin — as a total and as a weekly series.
 *
 * Reads accounts.signup_method, which every INSERT INTO accounts writes and a
 * one-time backfill filled in for older rows. Deliberately NOT derived from
 * google_id: that column is also set when an email-OTP account links Google at
 * a later sign-in, so using it would move part of the email cohort into the
 * Google one and overstate how well Google sign-in recruits.
 */
export async function signupMethodMix(db, { weeks = 12 } = {}) {
    const [totalsRes, trendRes] = await Promise.allSettled([
        db.query(`
            SELECT COALESCE(signup_method, 'unknown') AS method, COUNT(*)::int AS n
            FROM accounts GROUP BY 1 ORDER BY n DESC
        `),
        db.query(`
            SELECT to_char(DATE_TRUNC('week', created_at + INTERVAL '3 hours'), 'YYYY-MM-DD') AS week,
                   COALESCE(signup_method, 'unknown') AS method,
                   COUNT(*)::int AS n
            FROM accounts
            WHERE created_at >= NOW() - ($1 || ' weeks')::interval
            GROUP BY 1, 2
            ORDER BY 1
        `, [weeks]),
    ]);
    return {
        totals: totalsRes.status === 'fulfilled' ? totalsRes.value.rows : [],
        trend: trendRes.status === 'fulfilled' ? trendRes.value.rows : [],
    };
}

/**
 * Headline behaviour numbers for the KPI strip: how hard the bank is being
 * worked, how long an answer takes, and whether the goal/achievement features
 * anyone built are being used at all.
 */
export async function behaviourTotals(db) {
    const [attempts, sessions, goals, achievements] = await Promise.allSettled([
        db.query(`
            SELECT COUNT(*)::int AS attempts,
                   COUNT(DISTINCT user_id)::int AS answering_users,
                   ROUND(AVG(time_taken)::numeric, 1)::float AS avg_seconds,
                   ROUND(100.0 * COUNT(*) FILTER (WHERE is_correct) / NULLIF(COUNT(*), 0), 1)::float AS pct_correct
            FROM user_question_attempts
        `),
        db.query(`
            SELECT ROUND(AVG(total_questions)::numeric, 1)::float AS avg_questions,
                   ROUND(AVG(duration)::numeric, 0)::float        AS avg_duration,
                   COUNT(*) FILTER (WHERE device_type = 'mobile')::int AS mobile_sessions,
                   COUNT(*)::int AS sessions
            FROM user_quiz_sessions
        `),
        db.query(`SELECT COUNT(*)::int AS goals_set, COUNT(*) FILTER (WHERE achieved_at IS NOT NULL)::int AS achieved FROM user_goals`),
        db.query(`SELECT COUNT(DISTINCT user_id)::int AS users, COUNT(*)::int AS earned FROM user_achievements`),
    ]);
    const first = (r) => (r.status === 'fulfilled' ? r.value.rows[0] || {} : {});
    return {
        attempts: first(attempts),
        sessions: first(sessions),
        goals: first(goals),
        achievements: first(achievements),
    };
}
