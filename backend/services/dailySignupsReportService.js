/**
 * "SQB daily" digest (formerly the Daily Signups Report; the file keeps its name because the cron route and the
 * dedupe table are unchanged). Since 2026-11-09 this one mail also carries payments, question reports, the integrity
 * check and filtered error noise: see dailyDigestService.js. The signup part below is unchanged.
 *
 * Original description of the signup part:
 * ------------------------------------------------------------------
 * Once a day, near the end of the Saudi business day, emails the owner a
 * single summary of new users: how many joined, broken down by HOW they
 * joined (Google, email OTP, admin-created, temp-link invite, group seat),
 * plus quick context (total users to date, how today compares to the
 * 7-day average).
 *
 * This replaces what used to be N separate "Admin Account Created" /
 * "Access granted" / "Account Created via Temp Link" emails — one per
 * account — with one digest. Those per-account emails still fire (an admin
 * creating an account is still worth an immediate confirmation), but this is
 * the "how is growth actually going today" read, in one place.
 *
 * Chart: an inline-CSS horizontal bar chart, not an image. Email clients
 * strip <script> and often block remote images by default (which would show
 * as broken/blank until the user clicks "load images") — a table of colored
 * <div> widths degrades to plain numbers at worst and renders identically
 * everywhere at best. Same reasoning as the plain-HTML summary tables in
 * subscriptionReportService.js, which this file's structure mirrors.
 *
 * Scheduling: NOT one of Vercel's two Hobby-plan cron slots (both already
 * spoken for — see backend/vercel.json). Called from GitHub Actions
 * (.github/workflows/cron.yml), which has no slot limit, at 21:05 UTC
 * (00:05 AST), just after the Saudi day ends, and reports that finished day.
 * (Until 2026-10-09 it ran at 20:00 UTC and counted a UTC day, so it cut off
 * the last hours of the Saudi evening and could be misread as a full day.)
 */

import { sendMail } from './mailer.js';
import { OWNER_EMAIL } from '../config/recipients.js';
import { collectDigestExtras, renderDailyDigest } from './dailyDigestService.js';

const REPORT_RECIPIENT = OWNER_EMAIL;

// Matches the CASE in ensureOAuthColumns() (app.js) exactly — that is the
// single source of truth for what signup_method values can exist. Order here
// is display order in the chart, most-common-in-practice first.
const SIGNUP_METHOD_LABELS = {
    email_otp: 'Email',
    google: 'Google',
    admin: 'Admin-created',
    temp_link: 'Temp-link invite',
    group_seat: 'Group seat',
};
// Anything not in the map above (a signup_method value added later and not
// yet taught to this report, or a legacy NULL that predates the backfill)
// falls back to this rather than being silently dropped from the chart —
// dropping it would make "new users today" in the chart disagree with the
// headline count right above it.
const OTHER_LABEL = 'Other';

let _logTableReady = null;
function ensureReportLog(db) {
    if (_logTableReady) return _logTableReady;
    _logTableReady = db.query(`
        CREATE TABLE IF NOT EXISTS daily_signups_report_log (
            id            BIGSERIAL PRIMARY KEY,
            report_date   DATE NOT NULL UNIQUE,
            new_signups   INT  NOT NULL DEFAULT 0,
            sent_to       TEXT NOT NULL,
            sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `).catch((err) => {
        _logTableReady = null; // retry on next invocation
        throw err;
    });
    return _logTableReady;
}

const AST_OFFSET_MS = 3 * 3600 * 1000; // Saudi time, UTC+3, no DST

/** Saudi calendar date (YYYY-MM-DD) of an instant. */
export function astDateTag(instant) {
    return new Date(instant.getTime() + AST_OFFSET_MS).toISOString().slice(0, 10);
}

/** The Saudi calendar day `dateTag` as a half-open UTC range [start, end). */
export function astDayRange(dateTag) {
    const start = new Date(`${dateTag}T00:00:00+03:00`);
    return { start, end: new Date(start.getTime() + 24 * 3600 * 1000) };
}

/** Latest Saudi day that has fully ended at `now` (always yesterday, Saudi time). */
export function lastCompletedAstDay(now = new Date()) {
    return astDateTag(new Date(now.getTime() - 24 * 3600 * 1000));
}

/**
 * Build and email the report for the given day.
 * @param {import('pg').Pool} db
 * @param {{ reportDate?: Date, record?: boolean }} opts
 */
export async function sendDailySignupsReport(db, opts = {}) {
    await ensureReportLog(db);
    const now = new Date();
    // The report day is a Saudi calendar day (the owner's day), not a UTC one.
    // By default it is today so far (a preview); the scheduler passes the last
    // completed day. A day that has not ended yet is labelled PARTIAL everywhere
    // so a half-finished day can never be read as a full one.
    const dateTag = opts.day || astDateTag(now);
    const record = opts.record !== false;

    const { start: dayStart, end: dayEnd } = astDayRange(dateTag);
    const partial = dayEnd.getTime() > now.getTime();
    const dayWord = partial ? 'so far' : 'that day';

    const [byMethodRes, totalRes, weekRes] = await Promise.all([
        db.query(
            `SELECT COALESCE(signup_method, 'unknown') AS method, COUNT(*)::int AS n
               FROM accounts
              WHERE created_at >= $1 AND created_at < $2
              GROUP BY method`,
            [dayStart, dayEnd]
        ),
        db.query(`SELECT COUNT(*)::int AS n FROM accounts`),
        // 7-day average EXCLUDING today, so "today vs average" never compares
        // a full day against itself mid-count. $1 needs an explicit
        // ::timestamptz cast — without one, Postgres cannot resolve the type
        // of "$1 - INTERVAL '7 days'" from context alone and errors with
        // "operator does not exist: timestamp without time zone >= interval".
        db.query(
            `SELECT COUNT(*)::int AS n FROM accounts
              WHERE created_at >= $1::timestamptz - INTERVAL '7 days' AND created_at < $1::timestamptz`,
            [dayStart]
        ),
    ]);

    const byMethod = {};
    let newSignups = 0;
    for (const row of byMethodRes.rows) {
        byMethod[row.method] = row.n;
        newSignups += row.n;
    }
    const totalUsers = totalRes.rows[0].n;
    const weekAvg = weekRes.rows[0].n / 7;
    const vsAvgPct = !partial && weekAvg > 0 ? Math.round(((newSignups - weekAvg) / weekAvg) * 100) : null;

    // Known methods first (in the fixed display order above), then anything
    // unrecognised collapsed into one "Other" row rather than one row per
    // stray value — a NULL from a pre-backfill row and a future new method
    // shouldn't each get their own bar.
    const knownRows = Object.entries(SIGNUP_METHOD_LABELS)
        .map(([method, label]) => ({ method, label, count: byMethod[method] || 0 }));
    const otherCount = Object.entries(byMethod)
        .filter(([method]) => !(method in SIGNUP_METHOD_LABELS))
        .reduce((sum, [, n]) => sum + n, 0);
    const chartData = otherCount > 0
        ? [...knownRows, { method: 'other', label: OTHER_LABEL, count: otherCount }]
        : knownRows;
    const extras = await collectDigestExtras(db, dayStart, dayEnd);
    const digest = renderDailyDigest({
        dateTag, partial, newSignups, totalUsers, weekAvg, vsAvgPct,
        signupLines: chartData.map((r) => [r.label, r.count]),
        ...extras,
    });

    await sendMail({
        // Event name kept from the old Daily Signups report so the gateway's routing rules still apply.
        event: 'medqize.owner.daily_signups_report',
        name: 'SQB Reports',
        to: REPORT_RECIPIENT,
        subject: digest.subject,
        text: digest.text,
        html: digest.html,
    });

    if (record) {
        await db.query(
            `INSERT INTO daily_signups_report_log (report_date, new_signups, sent_to)
             VALUES ($1, $2, $3)
             ON CONFLICT (report_date) DO UPDATE SET
                new_signups = EXCLUDED.new_signups,
                sent_to = EXCLUDED.sent_to,
                sent_at = NOW()`,
            [dateTag, newSignups, REPORT_RECIPIENT]
        );
    }

    return { sent: true, recipient: REPORT_RECIPIENT, newSignups, totalUsers, byMethod, reportDate: dateTag, partial };
}

/**
 * Called from the scheduler: sends once per Saudi calendar date, always for the last COMPLETED day, even if the
 * caller fires more than once that day — the ON CONFLICT upsert above means a
 * duplicate call updates the same row's numbers rather than sending twice,
 * but this check skips the network call and DB write entirely when nothing
 * would change other than the timestamp.
 */
export async function maybeSendDailySignupsReport(db, opts = {}) {
    await ensureReportLog(db);
    // Always a day that has fully ended, so the scheduled email is never partial.
    const dateTag = opts.day || lastCompletedAstDay();
    const { rows } = await db.query(
        `SELECT 1 FROM daily_signups_report_log WHERE report_date = $1`,
        [dateTag]
    );
    if (rows.length && !opts.force) {
        return { sent: false, reason: 'already_sent_today', reportDate: dateTag };
    }
    return sendDailySignupsReport(db, { ...opts, day: dateTag });
}
