/**
 * Daily Signups Report
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
 * (.github/workflows/cron.yml), which has no slot limit, at 20:00 UTC
 * (23:00 AST) — a real end-of-day send, not a next-morning one.
 */

import { sendMail } from './mailer.js';
import { OWNER_EMAIL } from '../config/recipients.js';

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
const SIGNUP_METHOD_COLORS = {
    email_otp: '#0e7490',
    google: '#4285F4',
    admin: '#7c3aed',
    temp_link: '#d97706',
    group_seat: '#059669',
};
// Anything not in the map above (a signup_method value added later and not
// yet taught to this report, or a legacy NULL that predates the backfill)
// falls back to this rather than being silently dropped from the chart —
// dropping it would make "new users today" in the chart disagree with the
// headline count right above it.
const OTHER_LABEL = 'Other';
const OTHER_COLOR = '#6b7280';

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

function fmtDate(d) {
    return new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

/** One CSS bar-chart row: label, count, and a width-proportional bar. */
function chartRow(label, count, maxCount, color) {
    const pct = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 4 : 0) : 0;
    return `
        <tr>
          <td style="padding:4px 10px 4px 0;font-size:13px;color:#374151;white-space:nowrap;width:1%">${label}</td>
          <td style="padding:4px 0;width:100%">
            <div style="background:#f1f5f9;border-radius:4px;overflow:hidden;height:18px">
              <div style="background:${color};width:${pct}%;height:18px;border-radius:4px"></div>
            </div>
          </td>
          <td style="padding:4px 0 4px 10px;font-size:13px;font-weight:bold;color:#111827;text-align:right;white-space:nowrap;width:1%">${count}</td>
        </tr>`;
}

/**
 * Build and email the report for the given day.
 * @param {import('pg').Pool} db
 * @param {{ reportDate?: Date, record?: boolean }} opts
 */
export async function sendDailySignupsReport(db, opts = {}) {
    await ensureReportLog(db);
    const reportDate = opts.reportDate || new Date();
    const dateTag = reportDate.toISOString().slice(0, 10);
    const record = opts.record !== false;

    const dayStart = new Date(`${dateTag}T00:00:00.000Z`);
    const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);

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
    const vsAvgPct = weekAvg > 0 ? Math.round(((newSignups - weekAvg) / weekAvg) * 100) : null;

    // Known methods first (in the fixed display order above), then anything
    // unrecognised collapsed into one "Other" row rather than one row per
    // stray value — a NULL from a pre-backfill row and a future new method
    // shouldn't each get their own bar.
    const knownRows = Object.entries(SIGNUP_METHOD_LABELS)
        .map(([method, label]) => ({ method, label, count: byMethod[method] || 0, color: SIGNUP_METHOD_COLORS[method] }));
    const otherCount = Object.entries(byMethod)
        .filter(([method]) => !(method in SIGNUP_METHOD_LABELS))
        .reduce((sum, [, n]) => sum + n, 0);
    const chartData = otherCount > 0
        ? [...knownRows, { method: 'other', label: OTHER_LABEL, count: otherCount, color: OTHER_COLOR }]
        : knownRows;
    const maxCount = Math.max(...chartData.map((r) => r.count), 1);

    const chartHtml = chartData.some((r) => r.count > 0)
        ? `<table style="width:100%;border-collapse:collapse">
             ${chartData.map((r) => chartRow(r.label, r.count, maxCount, r.color)).join('')}
           </table>`
        : `<p style="color:#6b7280;font-size:13px;margin:0">No new signups today.</p>`;

    const vsAvgHtml = vsAvgPct === null
        ? ''
        : `<span style="color:${vsAvgPct >= 0 ? '#059669' : '#b91c1c'}">${vsAvgPct >= 0 ? '+' : ''}${vsAvgPct}% vs 7-day avg</span>`;

    const summaryHtml = `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:18px 22px;border-radius:10px 10px 0 0">
            <h2 style="margin:0;font-size:18px">🌱 Daily Signups — ${dateTag}</h2>
            <p style="margin:6px 0 0;font-size:12px;opacity:.85">${fmtDate(dayStart)} → ${fmtDate(dayEnd)}</p>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:18px 22px;border-radius:0 0 10px 10px">
            <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:16px">
              <tr><td style="padding:6px 0;color:#374151">New signups today</td><td style="text-align:left;font-weight:bold;font-size:20px">${newSignups}</td></tr>
              <tr><td style="padding:6px 0;color:#374151">Total users to date</td><td style="text-align:left;font-weight:bold">${totalUsers}</td></tr>
              <tr><td style="padding:6px 0;color:#374151">7-day daily average</td><td style="text-align:left;font-weight:bold">${weekAvg.toFixed(1)} ${vsAvgHtml}</td></tr>
            </table>
            <h3 style="margin:0 0 8px;font-size:13px;color:#059669">By how they joined</h3>
            ${chartHtml}
            <p style="font-size:12px;color:#6b7280;margin-top:16px">Full per-account detail is on the admin dashboard's Users page.</p>
          </div>
        </div>`;

    const textLines = [
        `New signups today: ${newSignups}`,
        `Total users to date: ${totalUsers}`,
        `7-day daily average: ${weekAvg.toFixed(1)}${vsAvgPct !== null ? ` (${vsAvgPct >= 0 ? '+' : ''}${vsAvgPct}% vs today)` : ''}`,
        '',
        'By how they joined:',
        ...chartData.map((r) => `  ${r.label}: ${r.count}`),
    ];

    await sendMail({
        event: 'medqize.owner.daily_signups_report',
        name: 'SQB Reports',
        to: REPORT_RECIPIENT,
        subject: `🌱 Daily Signups — ${newSignups} new user${newSignups === 1 ? '' : 's'} — ${dateTag}`,
        text: textLines.join('\n'),
        html: summaryHtml,
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

    return { sent: true, recipient: REPORT_RECIPIENT, newSignups, totalUsers, byMethod, reportDate: dateTag };
}

/**
 * Called from the scheduler: sends once per calendar date (UTC), even if the
 * caller fires more than once that day — the ON CONFLICT upsert above means a
 * duplicate call updates the same row's numbers rather than sending twice,
 * but this check skips the network call and DB write entirely when nothing
 * would change other than the timestamp.
 */
export async function maybeSendDailySignupsReport(db, opts = {}) {
    await ensureReportLog(db);
    const reportDate = opts.reportDate || new Date();
    const dateTag = reportDate.toISOString().slice(0, 10);
    const { rows } = await db.query(
        `SELECT 1 FROM daily_signups_report_log WHERE report_date = $1`,
        [dateTag]
    );
    if (rows.length && !opts.force) {
        return { sent: false, reason: 'already_sent_today', reportDate: dateTag };
    }
    return sendDailySignupsReport(db, { ...opts, reportDate });
}
