/**
 * User journey audit — read-only.
 * ------------------------------------------------------------------
 * Answers: how often do people log in, did the 2026-07-12 paywall suppress
 * activity, does the 1-hour free trial (shipped 2026-07-17) convert or
 * cause drop-off, and how do paying customers behave afterwards.
 *
 * Every query in this file is SELECT-only — enforced at runtime by
 * `ro()` below, which refuses anything that doesn't start with SELECT/WITH.
 * No INSERT/UPDATE/DELETE, no transactions, nothing here can change data.
 *
 * Money and subscription predicates are never redefined here — they are
 * imported from services/adminMetricsService.js and services/accountingService.js,
 * the same functions /admin/stats and /api/accounting/summary use. If this
 * report's numbers ever disagree with the admin panel, one of the two has a
 * bug; they must not be allowed to drift by having two definitions of
 * "active subscriber" or "net revenue".
 *
 * Usage (from backend/):
 *   node scripts/journeyAudit.js
 *
 * Output: backend/exports/journey-audit-<YYYY-MM-DD>.md (+ console summary)
 */
import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchPaidEvents, summarize } from '../services/accountingService.js';
import {
    subscriptionSnapshot, conversionSnapshot, userSnapshot,
    activeUserSnapshot, revenueSnapshot,
} from '../services/adminMetricsService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = new pg.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT || 5432,
    ssl: { rejectUnauthorized: false },
    max: 3,
});

/** Read-only guard: refuses anything that isn't a SELECT/WITH statement. */
async function ro(sql, params = []) {
    const head = sql.trim().slice(0, 10).toUpperCase();
    if (!head.startsWith('SELECT') && !head.startsWith('WITH')) {
        throw new Error(`journeyAudit: refused non-SELECT statement: ${sql.slice(0, 60)}`);
    }
    return db.query(sql, params);
}

const n = (v) => parseInt(v, 10) || 0;
const num = (v) => Number(v) || 0;
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);
const fmtPct = (a, b) => { const p = pct(a, b); return p === null ? 'n/a' : `${p}%`; };
const sar = (halalas) => (num(halalas) / 100).toFixed(2);

function table(headers, rows) {
    const head = `| ${headers.join(' | ')} |`;
    const sep = `| ${headers.map(() => '---').join(' | ')} |`;
    const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
    return `${head}\n${sep}\n${body}`;
}

const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const report = [];
const log = (s = '') => { report.push(s); console.log(s); };
const heading = (s) => log(`\n## ${s}\n`);

/** Runs a section, isolating failures so one bad query doesn't kill the report. */
async function section(title, fn) {
    heading(title);
    try {
        await fn();
    } catch (err) {
        log(`⚠️ Section failed: ${err.message}`);
        console.error(err);
    }
}

async function main() {
    log(`# User journey audit — ${new Date().toISOString().slice(0, 10)}`);
    log(`\nRead-only report. Every query is a SELECT against production; nothing here writes.`);

    // ── A0 — cohort boundary ────────────────────────────────────────────────
    let cutover = null;
    await section('A0 — Cohort boundary (free era vs paid era)', async () => {
        const { rows: migs } = await ro(
            `SELECT name, applied_at FROM schema_migrations
              WHERE name IN ('001_grandfather_existing', '002_grandfather_all_current')
              ORDER BY applied_at`
        );
        if (migs.length === 0) {
            log('⚠️ No schema_migrations rows found — falling back to the earliest trial_grants.granted_at as the cutover.');
            const { rows } = await ro(`SELECT MIN(granted_at) AS m FROM trial_grants`);
            cutover = rows[0]?.m || null;
        } else {
            cutover = migs[0].applied_at;
            log(table(['migration', 'applied_at'], migs.map((m) => [m.name, m.applied_at.toISOString()])));
        }
        log(`\n**Cutover (free era ends / paid era begins): ${cutover ? new Date(cutover).toISOString() : 'UNKNOWN'}**`);
        log('Every PRE/POST split below uses this timestamp against `accounts.created_at`.');

        const { rows: wipe } = await ro(`
            SELECT
                COUNT(*) FILTER (WHERE grandfathered_at IS NOT NULL) AS grandfathered_now,
                COUNT(*) FILTER (WHERE free_era_notice_sent_at IS NOT NULL) AS notified,
                COUNT(*) FILTER (WHERE subscription_status = 'free' AND free_era_notice_sent_at IS NOT NULL) AS revoked_and_notified
            FROM accounts
        `);
        const w = wipe[0];
        log(`\ngrandfathered_at IS NOT NULL: ${n(w.grandfathered_now)} · notified of end-of-free-era: ${n(w.notified)} · revoked+notified: ${n(w.revoked_and_notified)}`);
        if (n(w.grandfathered_now) === 0 && n(w.notified) > 0) {
            log('⚠️ `endFreeEraCampaign.js --execute` appears to have run: `grandfathered_at` has been wiped for the accounts it targeted. Cohort assignment below relies on `created_at`, not `grandfathered_at`, so it is unaffected — but any query elsewhere that reads `grandfathered_at` to mean "was free-era" will undercount.');
        }
    });
    if (!cutover) {
        log('\n\n🛑 Cannot establish a cutover timestamp — aborting PRE/POST-dependent sections.');
        await db.end();
        return;
    }

    // ── A1 — signup funnel ──────────────────────────────────────────────────
    await section('A1 — Signup funnel (OTP)', async () => {
        log('Caveat: `signup_otps` has no `purpose` column — it is shared by signup AND password-reset codes, so "OTPs sent" below is not purely signup intent. Treat the verification rate as directional, not exact.\n');

        const { rows: totals } = await ro(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE used) AS used FROM signup_otps`);
        const t = totals[0];
        log(`OTPs sent: ${n(t.total)} · marked used: ${n(t.used)} · used rate: ${fmtPct(n(t.used), n(t.total))}`);

        const { rows: perEmail } = await ro(`
            SELECT AVG(cnt)::numeric(10,2) AS avg_sends, MAX(cnt) AS max_sends,
                   COUNT(*) FILTER (WHERE cnt > 1) AS emails_with_repeat_sends,
                   COUNT(*) AS distinct_emails
            FROM (SELECT email, COUNT(*) AS cnt FROM signup_otps GROUP BY email) s
        `);
        const pe = perEmail[0];
        log(`Distinct emails requesting a code: ${n(pe.distinct_emails)} · avg sends/email: ${pe.avg_sends} · max: ${n(pe.max_sends)} · emails needing >1 send: ${n(pe.emails_with_repeat_sends)} (${fmtPct(n(pe.emails_with_repeat_sends), n(pe.distinct_emails))}) — a proxy for OTP-email deliverability pain.`);

        const { rows: matched } = await ro(`
            SELECT COUNT(DISTINCT so.email) AS emails_verified, COUNT(DISTINCT a.id) AS matched_accounts
            FROM signup_otps so JOIN accounts a ON a.email = so.email
            WHERE so.used = TRUE
        `);
        const m = matched[0];
        log(`Emails with a used code that match an account: ${n(m.matched_accounts)} / ${n(m.emails_verified)} verified emails.`);

        const { rows: unverified } = await ro(`SELECT COUNT(*) AS c FROM accounts WHERE email_verified = FALSE`);
        log(`Accounts with email_verified = FALSE: ${n(unverified[0].c)}.`);
    });

    // ── A2 — login frequency and retention ──────────────────────────────────
    await section('A2 — Login frequency and retention', async () => {
        const { rows: buckets } = await ro(`
            WITH counts AS (
                SELECT a.id, a.created_at, COUNT(lh.id) AS logins
                FROM accounts a LEFT JOIN login_history lh ON lh.user_id = a.id
                WHERE NOT a.is_admin_created
                GROUP BY a.id, a.created_at
            )
            SELECT
                CASE WHEN created_at < $1 THEN 'PRE' ELSE 'POST' END AS cohort,
                CASE WHEN logins = 0 THEN '0'
                     WHEN logins = 1 THEN '1'
                     WHEN logins BETWEEN 2 AND 3 THEN '2-3'
                     WHEN logins BETWEEN 4 AND 10 THEN '4-10'
                     ELSE '11+' END AS bucket,
                COUNT(*) AS accounts
            FROM counts GROUP BY 1, 2
        `, [cutover]);
        const bucketOrder = { '0': 0, '1': 1, '2-3': 2, '4-10': 3, '11+': 4 };
        buckets.sort((a, b) => a.cohort.localeCompare(b.cohort) || bucketOrder[a.bucket] - bucketOrder[b.bucket]);
        log('Logins per account, PRE vs POST cutover:\n');
        log(table(['cohort', 'logins', 'accounts'], buckets.map((r) => [r.cohort, r.bucket, n(r.accounts)])));

        const { rows: oad } = await ro(`
            SELECT COUNT(*) FILTER (WHERE logins = 1) AS one_and_done,
                   COUNT(*) FILTER (WHERE logins >= 1) AS has_any_login,
                   COUNT(*) AS total_post
            FROM (
                SELECT a.id, COUNT(lh.id) AS logins
                FROM accounts a LEFT JOIN login_history lh ON lh.user_id = a.id
                WHERE a.created_at >= $1 AND NOT a.is_admin_created
                GROUP BY a.id
            ) x
        `, [cutover]);
        const o = oad[0];
        log(`\nPOST cohort one-and-done rate (exactly 1 login ever, i.e. only the signup auto-login): ${n(o.one_and_done)} / ${n(o.total_post)} accounts (${fmtPct(n(o.one_and_done), n(o.total_post))}). Of those who ever logged in at all: ${fmtPct(n(o.one_and_done), n(o.has_any_login))}.`);

        const { rows: ret } = await ro(`
            WITH accs AS (
                SELECT id, created_at, CASE WHEN created_at < $1 THEN 'PRE' ELSE 'POST' END AS cohort
                FROM accounts WHERE NOT is_admin_created
            ),
            horizons AS (SELECT * FROM (VALUES (1),(3),(7),(14),(30)) AS h(days))
            SELECT a.cohort, h.days,
                COUNT(*) FILTER (WHERE NOW() - a.created_at >= (h.days || ' days')::interval) AS eligible,
                COUNT(*) FILTER (
                    WHERE NOW() - a.created_at >= (h.days || ' days')::interval
                      AND EXISTS (SELECT 1 FROM login_history lh WHERE lh.user_id = a.id
                                   AND lh.login_time >= a.created_at + (h.days || ' days')::interval)
                ) AS retained
            FROM accs a CROSS JOIN horizons h
            GROUP BY 1, 2 ORDER BY 1, 2
        `, [cutover]);
        log('\nRetention — % of eligible accounts with a login at least N days after signup (cumulative "returned by day N"):\n');
        log(table(['cohort', 'day', 'eligible', 'retained', 'rate'],
            ret.map((r) => [r.cohort, n(r.days), n(r.eligible), n(r.retained), fmtPct(n(r.retained), n(r.eligible))])));

        const { rows: gap } = await ro(`
            WITH gaps AS (
                SELECT user_id, login_time,
                    EXTRACT(EPOCH FROM (login_time - LAG(login_time) OVER (PARTITION BY user_id ORDER BY login_time))) / 86400.0 AS gap_days
                FROM login_history
            )
            SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY gap_days) AS median_gap_days
            FROM gaps WHERE gap_days IS NOT NULL
        `);
        log(`\nMedian days between consecutive logins (users with 2+ logins): ${gap[0].median_gap_days ? num(gap[0].median_gap_days).toFixed(1) : 'n/a'}`);

        const { rows: pw } = await ro(`
            SELECT
                COUNT(DISTINCT a.id) AS accounts_pre_existing,
                COUNT(lh.id) FILTER (WHERE lh.login_time >= $1::timestamptz - INTERVAL '30 days' AND lh.login_time < $1) AS logins_before,
                COUNT(lh.id) FILTER (WHERE lh.login_time >= $1 AND lh.login_time < $1::timestamptz + INTERVAL '30 days') AS logins_after,
                COUNT(DISTINCT lh.user_id) FILTER (WHERE lh.login_time >= $1::timestamptz - INTERVAL '30 days' AND lh.login_time < $1) AS distinct_before,
                COUNT(DISTINCT lh.user_id) FILTER (WHERE lh.login_time >= $1 AND lh.login_time < $1::timestamptz + INTERVAL '30 days') AS distinct_after
            FROM accounts a LEFT JOIN login_history lh ON lh.user_id = a.id
            WHERE a.created_at < $1 AND NOT a.is_admin_created
        `, [cutover]);
        const p = pw[0];
        log(`\nPaywall effect, same-user basis (accounts that existed before the cutover, ${n(p.accounts_pre_existing)} accounts):`);
        log(`  30 days before cutover: ${n(p.logins_before)} logins from ${n(p.distinct_before)} distinct users`);
        log(`  30 days after cutover:  ${n(p.logins_after)} logins from ${n(p.distinct_after)} distinct users`);
        log(`  Note: A6 gives the confounded all-users before/after view — read this row instead for the isolated paywall effect.`);
    });

    // ── A3 — the 1-hour trial ───────────────────────────────────────────────
    let trialRows = [];
    let payerIdToFirstPaidAt = new Map();
    await section('A3 — The 1-hour trial', async () => {
        const revenue = await revenueSnapshot(db, {});
        const paidRows = await fetchPaidEvents(db, {});
        for (const r of paidRows) {
            if (r.accountId == null) continue;
            const existing = payerIdToFirstPaidAt.get(r.accountId);
            if (!existing || new Date(r.receivedAt) < new Date(existing)) {
                payerIdToFirstPaidAt.set(r.accountId, r.receivedAt);
            }
        }
        const payerIds = revenue.payerAccountIds;

        const { rows } = await ro(`
            SELECT
                tg.id, tg.account_id, tg.granted_at, tg.expires_at,
                EXTRACT(HOUR FROM tg.granted_at + INTERVAL '3 hours')::int AS grant_hour_riyadh,
                EXTRACT(DOW  FROM tg.granted_at + INTERVAL '3 hours')::int AS grant_dow_riyadh,
                EXISTS (SELECT 1 FROM login_history lh WHERE lh.user_id = tg.account_id
                         AND lh.login_time BETWEEN tg.granted_at AND tg.expires_at) AS logged_in,
                EXISTS (SELECT 1 FROM login_history lh WHERE lh.user_id = tg.account_id
                         AND lh.login_time > tg.expires_at) AS returned_after,
                (SELECT COUNT(*) FROM user_quiz_sessions qs WHERE qs.user_id = tg.account_id
                   AND qs.start_time BETWEEN tg.granted_at AND tg.expires_at) AS quiz_sessions_started,
                (SELECT COUNT(*) FROM user_quiz_sessions qs WHERE qs.user_id = tg.account_id
                   AND qs.start_time BETWEEN tg.granted_at AND tg.expires_at AND qs.end_time IS NOT NULL) AS quiz_sessions_completed,
                (SELECT COALESCE(SUM(qs.total_questions), 0) FROM user_quiz_sessions qs WHERE qs.user_id = tg.account_id
                   AND qs.start_time BETWEEN tg.granted_at AND tg.expires_at) AS questions_in_sessions,
                (SELECT MAX(lh.login_time) FROM login_history lh WHERE lh.user_id = tg.account_id
                   AND lh.login_time BETWEEN tg.granted_at AND tg.expires_at) AS last_login_in_window,
                (SELECT MAX(qs.start_time) FROM user_quiz_sessions qs WHERE qs.user_id = tg.account_id
                   AND qs.start_time BETWEEN tg.granted_at AND tg.expires_at) AS last_quiz_in_window
            FROM trial_grants tg
            WHERE tg.account_id IS NOT NULL
            ORDER BY tg.granted_at
        `);
        trialRows = rows;

        const withPaid = rows.map((r) => {
            const lastActivity = [r.granted_at, r.last_login_in_window, r.last_quiz_in_window]
                .filter(Boolean).map((d) => new Date(d).getTime())
                .reduce((a, b) => Math.max(a, b), new Date(r.granted_at).getTime());
            const minutesUsed = Math.min(60, Math.round((lastActivity - new Date(r.granted_at).getTime()) / 60000));
            const paid = payerIds.has(r.account_id);
            const paidAt = payerIdToFirstPaidAt.get(r.account_id) || null;
            let paidTiming = null;
            if (paid && paidAt) {
                const expiresMs = new Date(r.expires_at).getTime();
                const paidMs = new Date(paidAt).getTime();
                const diffH = (paidMs - expiresMs) / 3600000;
                paidTiming = diffH <= 0 ? 'during_the_hour' : diffH <= 24 ? 'lt_24h' : diffH <= 24 * 7 ? 'lt_7d' : 'gt_7d';
            }
            return { ...r, minutesUsed, paid, paidTiming };
        });

        const total = withPaid.length;
        const loggedIn = withPaid.filter((r) => r.logged_in).length;
        const started = withPaid.filter((r) => n(r.quiz_sessions_started) > 0).length;
        const completed = withPaid.filter((r) => n(r.quiz_sessions_completed) > 0).length;
        const returned = withPaid.filter((r) => r.returned_after).length;
        const paidCount = withPaid.filter((r) => r.paid).length;

        log(`Trials granted: ${total}\n`);
        log('Funnel:\n');
        log(table(['step', 'count', '% of trials granted'], [
            ['granted', total, '100%'],
            ['logged in during the hour', loggedIn, fmtPct(loggedIn, total)],
            ['started a quiz', started, fmtPct(started, total)],
            ['completed a quiz', completed, fmtPct(completed, total)],
            ['returned after expiry', returned, fmtPct(returned, total)],
            ['paid', paidCount, fmtPct(paidCount, total)],
        ]));

        const avgMinutesUsed = total ? (withPaid.reduce((s, r) => s + r.minutesUsed, 0) / total).toFixed(1) : 'n/a';
        const medianMinutesUsed = (() => {
            const sorted = withPaid.map((r) => r.minutesUsed).sort((a, b) => a - b);
            if (!sorted.length) return 'n/a';
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
        })();
        log(`\nMinutes of the 60-minute trial actually used — avg: ${avgMinutesUsed} · median: ${medianMinutesUsed}`);

        const paidTimingCounts = { during_the_hour: 0, lt_24h: 0, lt_7d: 0, gt_7d: 0 };
        for (const r of withPaid) if (r.paidTiming) paidTimingCounts[r.paidTiming]++;
        log('\nWhen payers paid, relative to trial expiry:\n');
        log(table(['timing', 'count'], Object.entries(paidTimingCounts)));

        const qBuckets = { '0': [0, 0], '1-10': [0, 0], '11-30': [0, 0], '31+': [0, 0] };
        for (const r of withPaid) {
            const qN = n(r.questions_in_sessions);
            const key = qN === 0 ? '0' : qN <= 10 ? '1-10' : qN <= 30 ? '11-30' : '31+';
            qBuckets[key][0]++;
            if (r.paid) qBuckets[key][1]++;
        }
        log('\nConversion by questions answered during the trial hour (this decides whether the hour is too short):\n');
        log(table(['questions answered', 'trials', 'paid', 'conversion'],
            Object.entries(qBuckets).map(([k, [t, p]]) => [k, t, p, fmtPct(p, t)])));

        const hourBuckets = new Map();
        for (const r of withPaid) {
            const h = n(r.grant_hour_riyadh);
            if (!hourBuckets.has(h)) hourBuckets.set(h, [0, 0]);
            const b = hourBuckets.get(h);
            b[0]++; if (r.paid) b[1]++;
        }
        log('\nConversion by hour-of-day of the grant (Riyadh time) — tests whether the 1-hour wall clock is the wrong mechanism:\n');
        log(table(['hour', 'trials', 'paid', 'conversion'],
            [...hourBuckets.entries()].sort((a, b) => a[0] - b[0])
                .map(([h, [t, p]]) => [String(h).padStart(2, '0') + ':00', t, p, fmtPct(p, t)])));

        const dowBuckets = new Map();
        for (const r of withPaid) {
            const d = n(r.grant_dow_riyadh);
            if (!dowBuckets.has(d)) dowBuckets.set(d, [0, 0]);
            const b = dowBuckets.get(d);
            b[0]++; if (r.paid) b[1]++;
        }
        log('\nConversion by day-of-week of the grant (Riyadh time):\n');
        log(table(['day', 'trials', 'paid', 'conversion'],
            [...dowBuckets.entries()].sort((a, b) => a[0] - b[0])
                .map(([d, [t, p]]) => [DOW_NAMES[d] || d, t, p, fmtPct(p, t)])));
    });

    // ── A4 — post-payment behaviour and long-term value ─────────────────────
    await section('A4 — Post-payment behaviour and long-term value', async () => {
        const revenue = await revenueSnapshot(db, {});
        const paidRows = await fetchPaidEvents(db, {});
        const firstPaidByAccount = new Map();
        for (const r of paidRows) {
            if (r.accountId == null) continue;
            const existing = firstPaidByAccount.get(r.accountId);
            if (!existing || new Date(r.receivedAt) < new Date(existing)) firstPaidByAccount.set(r.accountId, r.receivedAt);
        }
        const accountIds = [...firstPaidByAccount.keys()];
        const paidAts = accountIds.map((id) => firstPaidByAccount.get(id));

        if (accountIds.length > 0) {
            const { rows: payerRows } = await ro(`
                SELECT p.account_id, p.paid_at,
                    (SELECT COUNT(*) FROM login_history lh WHERE lh.user_id = p.account_id AND lh.login_time > p.paid_at) AS logins_after,
                    (SELECT COUNT(*) FROM user_quiz_sessions qs WHERE qs.user_id = p.account_id AND qs.start_time > p.paid_at) AS quizzes_after,
                    (SELECT MAX(lh.login_time) FROM login_history lh WHERE lh.user_id = p.account_id) AS last_login_ever,
                    a.email, a.username
                FROM unnest($1::int[], $2::timestamptz[]) AS p(account_id, paid_at)
                JOIN accounts a ON a.id = p.account_id
            `, [accountIds, paidAts]);

            const neverLoggedInAfter = payerRows.filter((r) => n(r.logins_after) === 0);
            log(`Paying customers: ${payerRows.length}`);
            log(`Never logged in after paying (refund risk — the 14-day refund window makes this time-sensitive): ${neverLoggedInAfter.length} (${fmtPct(neverLoggedInAfter.length, payerRows.length)})\n`);
            if (neverLoggedInAfter.length) {
                log(table(['email/username', 'paid_at'],
                    neverLoggedInAfter.slice(0, 20).map((r) => [r.email || r.username, new Date(r.paid_at).toISOString().slice(0, 10)])));
                if (neverLoggedInAfter.length > 20) log(`\n… ${neverLoggedInAfter.length - 20} more.`);
            }

            const now = Date.now();
            const daysSinceLastLoginBuckets = { '0-7d': 0, '8-30d': 0, '31-90d': 0, '90d+': 0, 'never': 0 };
            for (const r of payerRows) {
                if (!r.last_login_ever) { daysSinceLastLoginBuckets.never++; continue; }
                const days = (now - new Date(r.last_login_ever).getTime()) / 86400000;
                if (days <= 7) daysSinceLastLoginBuckets['0-7d']++;
                else if (days <= 30) daysSinceLastLoginBuckets['8-30d']++;
                else if (days <= 90) daysSinceLastLoginBuckets['31-90d']++;
                else daysSinceLastLoginBuckets['90d+']++;
            }
            log('\nDays since last login, payers:\n');
            log(table(['days since last login', 'payers'], Object.entries(daysSinceLastLoginBuckets)));
        } else {
            log('No payers yet.');
        }

        const { rows: cohortActivity } = await ro(`
            SELECT
                CASE
                    WHEN a.id = ANY($1::int[]) THEN 'PAID'
                    WHEN EXISTS (SELECT 1 FROM trial_grants tg WHERE tg.account_id = a.id AND tg.expires_at < NOW()) THEN 'TRIAL_EXPIRED_UNCONVERTED'
                    WHEN a.grandfathered_at IS NOT NULL THEN 'GRANDFATHERED'
                    ELSE 'OTHER'
                END AS cohort,
                COUNT(*) AS accounts,
                COUNT(*) FILTER (WHERE a.logged_date > NOW() - INTERVAL '7 days') AS active_7d,
                COUNT(*) FILTER (WHERE a.logged_date > NOW() - INTERVAL '30 days') AS active_30d
            FROM accounts a
            WHERE NOT a.is_admin_created
            GROUP BY 1
            ORDER BY 1
        `, [accountIds.length ? accountIds : [0]]);
        log('\nCurrent-activity snapshot by cohort:\n');
        log(table(['cohort', 'accounts', 'active last 7d', 'active last 30d'],
            cohortActivity.map((r) => [r.cohort, n(r.accounts), `${n(r.active_7d)} (${fmtPct(n(r.active_7d), n(r.accounts))})`, `${n(r.active_30d)} (${fmtPct(n(r.active_30d), n(r.accounts))})`])));

        const sub = await subscriptionSnapshot(db);
        log(`\nExpiring soon (no auto-renew — every one of these is a manual re-sell): 7 days: ${n(sub.expiring_7d)} · 30 days: ${n(sub.expiring_30d)}`);

        log(`\nRevenue (canonical ledger): gross ${sar(revenue.grossHalalas)} SAR · fees ${sar(revenue.feeHalalas)} SAR · refunded ${sar(revenue.refundedHalalas)} SAR (${revenue.refundCount} refund(s)) · net ${sar(revenue.netHalalas)} SAR · distinct payers: ${revenue.distinctPayers}`);
    });

    // ── A5 — engagement mix ─────────────────────────────────────────────────
    await section('A5 — Engagement mix (page_engagement)', async () => {
        log('Caveat: `page_engagement` is lazily created on first write and only records logged-in users — it has no history before its first row and cannot see the landing page.\n');
        try {
            const { rows } = await ro(`
                SELECT a.track,
                       CASE WHEN a.created_at < $1 THEN 'PRE' ELSE 'POST' END AS cohort,
                       pe.section,
                       SUM(pe.seconds) AS seconds,
                       SUM(pe.views) AS views,
                       COUNT(DISTINCT pe.user_id) AS users
                FROM page_engagement pe JOIN accounts a ON a.id = pe.user_id
                GROUP BY 1, 2, 3 ORDER BY 1, 2, 3
            `, [cutover]);
            if (!rows.length) { log('No rows yet.'); return; }
            log(table(['track', 'cohort', 'section', 'seconds', 'views', 'distinct users'],
                rows.map((r) => [r.track, r.cohort, r.section, n(r.seconds), n(r.views), n(r.users)])));
        } catch (err) {
            if (err.code === '42P01') log('`page_engagement` table does not exist yet (no engagement data has been ingested).');
            else throw err;
        }
    });

    // ── A6 — platform level, before vs after ────────────────────────────────
    await section('A6 — Platform level, before vs after (confounded — read alongside A2\'s same-user comparison)', async () => {
        log('This view mixes the paywall effect with the free-era-revoke campaign and with seasonal/exam-window timing. It is directional context, not proof of the paywall\'s effect — use A2\'s same-user comparison for that.\n');

        const cutoverWeek = new Date(cutover);
        cutoverWeek.setUTCHours(0, 0, 0, 0);

        const { rows: signups } = await ro(`
            SELECT date_trunc('week', created_at + interval '3 hours')::date AS week, COUNT(*) AS signups
            FROM accounts WHERE NOT is_admin_created GROUP BY 1 ORDER BY 1
        `);
        const { rows: actives } = await ro(`
            SELECT date_trunc('week', login_time + interval '3 hours')::date AS week, COUNT(DISTINCT user_id) AS active_users
            FROM login_history GROUP BY 1 ORDER BY 1
        `);
        const { rows: sessions } = await ro(`
            SELECT date_trunc('week', start_time + interval '3 hours')::date AS week, COUNT(*) AS sessions
            FROM user_quiz_sessions GROUP BY 1 ORDER BY 1
        `);

        const weeks = new Map();
        const mark = (w) => {
            const key = new Date(w).toISOString().slice(0, 10);
            if (!weeks.has(key)) weeks.set(key, { week: key, signups: 0, active_users: 0, sessions: 0 });
            return weeks.get(key);
        };
        signups.forEach((r) => { mark(r.week).signups = n(r.signups); });
        actives.forEach((r) => { mark(r.week).active_users = n(r.active_users); });
        sessions.forEach((r) => { mark(r.week).sessions = n(r.sessions); });

        const sorted = [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
        log(table(['week', 'signups', 'active users', 'quiz sessions'],
            sorted.map((w) => [
                w.week === cutoverWeek.toISOString().slice(0, 10) ? `**${w.week} ← cutover week**` : w.week,
                w.signups, w.active_users, w.sessions,
            ])));
    });

    // ── Admin-panel cross-check numbers ─────────────────────────────────────
    await section('Cross-check — must match the live admin panel', async () => {
        const revenue = await revenueSnapshot(db, {});
        const conv = await conversionSnapshot(db, revenue.payerAccountIds);
        const sub = await subscriptionSnapshot(db);
        const users = await userSnapshot(db);
        const active = await activeUserSnapshot(db);

        log('These numbers must equal what `/admin/stats` and `/api/accounting/summary` show right now. If they don\'t, investigate before trusting either.\n');
        log(table(['metric', 'value'], [
            ['Net revenue (SAR)', sar(revenue.netHalalas)],
            ['Gross revenue (SAR)', sar(revenue.grossHalalas)],
            ['Distinct payers', revenue.distinctPayers],
            ['Total trials granted', conv.totalTrialsGranted],
            ['Trial → paid', conv.trialToPaid],
            ['Trial conversion rate', `${conv.trialConversionRate}%`],
            ['Active subscribers', n(sub.active_subscribers)],
            ['Trial active now', n(sub.trial_active)],
            ['Trial expired, unconverted', n(sub.trial_expired_unconverted)],
            ['Grandfathered', n(sub.grandfathered)],
            ['Total users', users.totalUsers],
            ['DAU', active.dau], ['WAU', active.wau], ['MAU', active.mau],
        ]));
    });

    // ── write file ───────────────────────────────────────────────────────────
    const dir = path.join(__dirname, '..', 'exports');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const file = path.join(dir, `journey-audit-${stamp}.md`);
    fs.writeFileSync(file, report.join('\n'), 'utf8');
    console.log(`\n\nReport written to ${file}`);

    await db.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
