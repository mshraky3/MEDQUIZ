/**
 * "SQB daily": the ONE scheduled mail the owner gets each night (00:05 Riyadh, for the Saudi day that just ended).
 * ------------------------------------------------------------------
 * Replaces two separate mails: the Daily Signups report and the integrity-check mail. It also carries the numbers
 * that used to need an instant mail each day to be noticed: payments, question reports, and error noise that was
 * filtered out. Instant mails that stay instant: payment received, contact form, suggestion, question report,
 * critical server error, and an URGENT integrity finding.
 *
 * Reads only existing tables. Every section is gathered on its own, so a failing query turns that one section into
 * "could not be read" (and the headline amber) instead of losing the whole mail.
 */
import { computeFee } from './accountingService.js';
import { runIntegrityChecks, evaluateIntegrity, integrityTodo, INTEGRITY_EXPLAINER } from './integrityChecks.js';
import { renderOwnerMail, ADMIN_LINKS } from './ownerMail.js';
import { PAYMENT_MAIL_TRACKING_SINCE } from './paymentMailTracking.js';
import { ERROR_IGNORED_BUCKET, ALERT_BUCKET } from './errorNotificationService.js';

const sar = (halalas) => (Number(halalas || 0) / 100).toFixed(2);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

async function safely(label, fn, problems) {
    try {
        return await fn();
    } catch (err) {
        problems.push(`${label}: could not be read (${String(err.message).slice(0, 80)})`);
        return null;
    }
}

/** Gathers everything the digest shows, besides the signup numbers the caller already has. */
export async function collectDigestExtras(db, dayStart, dayEnd, { runChecks = runIntegrityChecks } = {}) {
    const problems = [];

    const payments = await safely('Payments', async () => {
        const { rows } = await db.query(
            `SELECT id, gateway_ref, amount_halalas, raw_payload, received_at,
                    (raw_payload #>> '{_sqb,owner_mail_sent_at}') AS owner_mail_sent_at
               FROM payment_events
              WHERE status = 'paid' AND livemode IS DISTINCT FROM FALSE
                AND received_at >= $1::timestamptz AND received_at < $2::timestamptz
              ORDER BY id`,
            [dayStart, dayEnd]
        );
        let gross = 0;
        let fee = 0;
        for (const r of rows) {
            const g = Number(r.amount_halalas) || 0;
            gross += g;
            fee += computeFee(r.raw_payload || {}, g).feeHalalas;
        }
        const withoutMail = rows.filter((r) => !r.owner_mail_sent_at && new Date(r.received_at) >= PAYMENT_MAIL_TRACKING_SINCE);
        return { count: rows.length, gross, net: gross - fee, withoutMail: withoutMail.map((r) => ({ id: r.id, ref: String(r.gateway_ref || '').slice(0, 8), amount: Number(r.amount_halalas) || 0 })) };
    }, problems);

    const reports = await safely('Question reports', async () => {
        const { rows } = await db.query(
            `SELECT id FROM question_reports
              WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz ORDER BY id`,
            [dayStart, dayEnd]
        );
        return rows.map((r) => r.id);
    }, problems);

    const integrity = await safely('Integrity check', async () => evaluateIntegrity(await runChecks(db)), problems);

    const errors = await safely('Error alerts', async () => {
        const ignored = await db.query(
            `SELECT COALESCE(SUM(count), 0)::int AS n FROM rate_limit_hits
              WHERE bucket = $1 AND window_start >= $2::timestamptz AND window_start < $3::timestamptz`,
            [ERROR_IGNORED_BUCKET, dayStart, dayEnd]
        );
        const repeats = await db.query(
            `SELECT COALESCE(SUM(count - 1), 0)::int AS n FROM rate_limit_hits
              WHERE bucket = $1 AND identifier <> '__global__' AND count > 1
                AND window_start >= $2::timestamptz AND window_start < $3::timestamptz`,
            [ALERT_BUCKET, dayStart, dayEnd]
        );
        return { ignored: ignored.rows[0].n, repeats: repeats.rows[0].n };
    }, problems);

    return { payments, reports, integrity, errors, problems };
}

/** Builds the mail. `data` = signup numbers + collectDigestExtras(). Pure: no database, no clock. */
export function renderDailyDigest(data) {
    const { dateTag, partial, newSignups, totalUsers, weekAvg, vsAvgPct, signupLines, payments, reports, integrity, errors, problems } = data;
    const dayWord = partial ? 'so far' : 'that day';

    // Verdict: urgent only when an integrity check is urgent; amber when anything needs a look.
    let status = 'ok';
    const attention = [];
    if (integrity?.status === 'urgent') status = 'urgent';
    else if (integrity?.status === 'attention') { status = 'attention'; attention.push('a quiz total does not match its saved answers'); }
    if (payments?.withoutMail?.length) { if (status === 'ok') status = 'attention'; attention.push(`${plural(payments.withoutMail.length, 'payment', 'payments')} without an owner mail`); }
    if (problems.length) { if (status === 'ok') status = 'attention'; attention.push('part of this report could not be read'); }

    const bits = [
        newSignups === 0 ? 'no new signups' : plural(newSignups, 'new signup', 'new signups'),
        payments ? (payments.count === 0 ? 'no payments' : `${plural(payments.count, 'payment', 'payments')} (${sar(payments.net)} SAR net)`) : null,
        reports ? (reports.length === 0 ? 'no question reports' : plural(reports.length, 'question report', 'question reports')) : null,
    ].filter(Boolean);
    const headline = status === 'urgent'
        ? `Urgent: saved answers may not match their questions. Day ${dateTag}.`
        : status === 'attention'
            ? `Needs a look: ${attention.join('; ')}. Day ${dateTag}: ${bits.join(', ')}.`
            : `All good. Day ${dateTag}: ${bits.join(', ')}.`;

    const sections = [];

    // 1. signups
    const signupRows = [[`New signups ${dayWord}`, String(newSignups), { bold: true }]];
    if (newSignups > 0) signupRows.push(...signupLines.filter(([, n]) => n > 0).map(([label, n]) => [`  of them ${label}`, String(n)]));
    signupRows.push(['Total users to date', String(totalUsers)]);
    signupRows.push(['7-day daily average', `${weekAvg.toFixed(1)}${vsAvgPct === null ? '' : ` (${vsAvgPct >= 0 ? '+' : ''}${vsAvgPct}% for this day)`}`]);
    sections.push({ title: 'New signups', rows: signupRows });

    // 2. payments
    if (payments) {
        const rows = [['Payments', payments.count === 0 ? 'none' : String(payments.count), { bold: true }]];
        if (payments.count > 0) { rows.push(['Gross', `${sar(payments.gross)} SAR`], ['Net after fees', `${sar(payments.net)} SAR`]); }
        if (payments.withoutMail.length) {
            rows.push(['Paid but NO owner mail', payments.withoutMail.map((p) => `#${p.id} (${p.ref}…, ${sar(p.amount)} SAR)`).join(', '), { bold: true }]);
        }
        sections.push({ title: 'Payments of the day', rows });
    }

    // 3. question reports
    if (reports) {
        sections.push({
            title: 'Question reports of the day',
            rows: [['Reports', reports.length === 0 ? 'none' : `${reports.length} (ids ${reports.slice(0, 10).map((i) => `#${i}`).join(', ')}${reports.length > 10 ? ', …' : ''})`, { bold: reports.length > 0 }]],
        });
    }

    // 4. integrity
    if (integrity) {
        sections.push({ title: 'Integrity check (last 2 days)', text: INTEGRITY_EXPLAINER });
        sections.push({ checks: integrity.checks });
    }

    // 5. error noise
    if (errors) {
        sections.push({
            title: 'Error alerts',
            rows: [
                ['Ignored as junk', String(errors.ignored)],
                ['Repeats held back', String(errors.repeats)],
            ],
        });
        sections.push({ text: 'Junk = browser reports with a very short message or nothing from our own code (extensions, bots, broken devices). Repeats = the same error inside one hour, mailed once. Real server errors still arrive at once as their own mail.' });
    }

    if (problems.length) sections.push({ title: 'Could not be read', list: problems });

    const todoParts = [];
    if (integrity && integrityTodo(integrity)) todoParts.push(integrityTodo(integrity));
    if (payments?.withoutMail?.length) todoParts.push('A payment was paid but its "Payment received" mail was not recorded as sent. The money and the student\'s access are fine; check Admin > Accounting, then ask for the mail to be re-checked if you need it.');
    if (problems.length) todoParts.push('If the missing part is still missing tomorrow, tell the developer session.');

    const mail = renderOwnerMail({
        status,
        title: 'SQB daily',
        headline,
        sections,
        todo: todoParts.length ? todoParts.join('\n') : null,
        action: { label: 'Open the admin panel', url: ADMIN_LINKS.overview },
        footer: `Saudi day ${dateTag}${partial ? ' (PARTIAL: the day is not finished)' : ''}. One mail a day replaces the old Daily Signups and Integrity mails. Payment, contact, suggestion, question-report and server-error mails still arrive at once.`,
    });
    const date = partial ? `${dateTag} (partial)` : dateTag;
    const tag = status === 'urgent' ? 'URGENT: ' : status === 'attention' ? 'Needs a look: ' : '';
    return { status, subject: `SQB daily ${date}: ${tag}${bits.join(', ')}`, text: mail.text, html: mail.html };
}
