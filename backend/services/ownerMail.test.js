import test from 'node:test';
import assert from 'node:assert/strict';
import { renderOwnerMail, esc, ADMIN_LINKS } from './ownerMail.js';
import {
    evaluateIntegrity, renderIntegrityMail, integrityHeadline, ACKNOWLEDGED_CASES, INTEGRITY_CHECKS,
} from './integrityChecks.js';
import { renderDailyDigest, collectDigestExtras } from './dailyDigestService.js';
import { junkClientReportReason, sendErrorNotification, generateEmailHtml } from './errorNotificationService.js';
import { checkSchemaVersion, newGuardState, VersionCheckSkipped, RETRY_AFTER_MS } from '../utils/bootstrapGuard.js';
import { sendWithRetry, recordOwnerMail, withinTime, PAYMENT_MAIL_TRACKING_SINCE } from './paymentMailTracking.js';
import { buildPaymentReceivedMail } from './paymentService.js';
import { buildContactMail, buildSuggestionMail } from './ownerMailTemplates.js';
import { buildQuestionReportMail } from '../routes/question-reports.js';

// ── shared layout ───────────────────────────────────────────────────────────
test('layout: the plain-text part is stable (snapshot)', () => {
    const { text } = renderOwnerMail({
        status: 'ok',
        title: 'Demo',
        headline: 'All good.',
        sections: [{ title: 'Numbers', rows: [['Signups', '3'], ['Payments', 'none']] }],
        action: { label: 'Open', url: ADMIN_LINKS.overview },
    });
    assert.equal(text, [
        'SQB - Demo [ALL GOOD]',
        '',
        'All good.',
        '',
        'NUMBERS',
        '  Signups: 3',
        '  Payments: none',
        '',
        'NOTHING TO DO',
        '',
        'Open: https://www.smle-question-bank.com/admin',
        '',
        '--',
        'Sent automatically by the SQB server to you only. Nothing was changed by this mail.',
    ].join('\n'));
});

test('layout: html is 600 px, table based, has dark-mode rules, no images, escapes visitor text', () => {
    const { html } = renderOwnerMail({
        status: 'attention', title: 'T', headline: '<script>alert(1)</script>',
        sections: [{ quote: 'مرحبا <b>x</b>' }, { rows: [['a', '"q" & <i>']] }],
    });
    assert.match(html, /width="600"/);
    assert.match(html, /prefers-color-scheme: dark/);
    assert.doesNotMatch(html, /<img/i);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;/);
    assert.match(html, /dir="auto"/); // Arabic renders right-to-left on its own
    assert.equal(esc('<&">'), '&lt;&amp;&quot;&gt;');
});

test('layout: every status has its own strip colour and a todo box says what to do', () => {
    const colours = ['ok', 'attention', 'urgent', 'info'].map((st) => renderOwnerMail({ status: st, title: 'x', headline: 'h' }).html.match(/bgcolor="(#[0-9a-f]+)"/)[1]);
    assert.equal(new Set(colours).size, 4);
    const withTodo = renderOwnerMail({ status: 'urgent', title: 'x', headline: 'h', todo: 'Call me.' });
    assert.match(withTodo.text, /WHAT TO DO\n {2}Call me\./);
});

test('every admin link points at a page that exists', () => {
    const real = ['/admin', '/admin/growth', '/admin/accounting', '/admin/users', '/admin/reports'];
    for (const url of Object.values(ADMIN_LINKS)) {
        assert.ok(url.startsWith('https://www.smle-question-bank.com'));
        assert.ok(real.includes(url.replace('https://www.smle-question-bank.com', '')), url);
    }
});

// ── integrity: acknowledged list ────────────────────────────────────────────
const totalsRow = (id) => ({ user_id: 1, session_id: id, stored_total: 150, rows: 125, stored_correct: 1, rows_correct: 1 });
const foundTotals = (...ids) => [{ name: 'session_totals_differ', title: 't', urgent: false, rows: ids.map(totalsRow) }];

test('integrity: the two known closed cases never turn the headline amber', () => {
    assert.deepEqual(ACKNOWLEDGED_CASES.map((c) => c.sessionId).sort(), [1551, 1554]);
    const ev = evaluateIntegrity(foundTotals(1554, 1551));
    assert.equal(ev.status, 'ok');
    assert.equal(ev.openCount, 0);
    assert.equal(ev.knownCount, 2);
    assert.match(integrityHeadline(ev), /^All good/);
    const known = ev.checks.find((c) => c.checkName === 'session_totals_differ');
    assert.equal(known.state, 'known');
    assert.match(known.detail, /Known and closed: session 1554: 25 answers lost on 7 Nov/);
    assert.equal(ev.checks.length, 5); // all five questions are always listed
});

test('integrity: a NEW session with a different total is attention, and says what to do', () => {
    const ev = evaluateIntegrity(foundTotals(1554, 1700));
    assert.equal(ev.status, 'attention');
    assert.equal(ev.openCount, 1);
    const mail = renderIntegrityMail(foundTotals(1700));
    assert.equal(mail.urgent, false);
    assert.match(mail.text, /session_id=1700/);
    assert.match(mail.text, /WHAT TO DO/);
});

test('integrity: answers that are not an option are URGENT and name the repair playbook', () => {
    const found = [{ name: 'attempt_not_an_option', title: 't', urgent: true, rows: [{ user_id: 5, session_id: 1560, n: 3 }] }];
    const mail = renderIntegrityMail(found, new Date('2026-11-10T00:05:00Z'));
    assert.equal(mail.urgent, true);
    assert.match(mail.subject, /^SQB URGENT/);
    assert.match(mail.text, /prevention-2026-11-04\/repair-playbook\.md/);
});

test('integrity: a clean run is "All good" with no todo', () => {
    const ev = evaluateIntegrity([]);
    assert.equal(ev.status, 'ok');
    assert.match(renderIntegrityMail([]).text, /NOTHING TO DO/);
    assert.equal(INTEGRITY_CHECKS.length, 5);
});

// ── daily digest ────────────────────────────────────────────────────────────
const baseData = () => ({
    dateTag: '2026-11-09', partial: false, newSignups: 0, totalUsers: 612, weekAvg: 3.4, vsAvgPct: -100,
    signupLines: [['Email', 0], ['Google', 0]],
    payments: { count: 0, gross: 0, net: 0, withoutMail: [] },
    reports: [], integrity: evaluateIntegrity(foundTotals(1554)), errors: { ignored: 2, repeats: 5 }, problems: [],
});

test('digest: a quiet day is "All good", signups are one line, ignored errors are counted', () => {
    const d = renderDailyDigest(baseData());
    assert.equal(d.status, 'ok');
    assert.match(d.subject, /^SQB daily 2026-11-09: no new signups, no payments, no question reports/);
    assert.match(d.text, /New signups that day: 0/);
    assert.match(d.text, /Ignored as junk: 2/);
    assert.match(d.text, /Known and closed: session 1554/);
});

test('digest: payments, reports, and a paid payment WITHOUT an owner mail turn it amber', () => {
    const data = baseData();
    data.newSignups = 4;
    data.payments = { count: 1, gross: 5000, net: 4700, withoutMail: [{ id: 60, ref: '5093e8fc', amount: 5000 }] };
    data.reports = [11, 12];
    const d = renderDailyDigest(data);
    assert.equal(d.status, 'attention');
    assert.match(d.text, /Paid but NO owner mail: #60 \(5093e8fc…, 50\.00 SAR\)/);
    assert.match(d.text, /ids #11, #12/);
    assert.match(d.text, /Net after fees: 47\.00 SAR/);
});

test('digest: an urgent integrity finding makes the whole digest urgent', () => {
    const data = baseData();
    data.integrity = evaluateIntegrity([{ name: 'question_key_not_an_option', title: 't', urgent: true, rows: [{ id: 9 }] }]);
    assert.equal(renderDailyDigest(data).status, 'urgent');
});

test('digest: a section that fails to load is named, never silently dropped', async () => {
    const db = { query: async (sql) => { if (/payment_events/.test(sql)) throw new Error('boom'); return { rows: [{ n: 0 }] }; } };
    const extras = await collectDigestExtras(db, new Date(), new Date(), { runChecks: async () => [] });
    assert.equal(extras.payments, null);
    assert.equal(extras.problems.length, 1);
    const d = renderDailyDigest({ ...baseData(), ...extras });
    assert.equal(d.status, 'attention');
    assert.match(d.text, /Payments: could not be read/);
});

test('digest: payments received before the tracking started are never flagged', async () => {
    const old = { id: 48, gateway_ref: '5093e8fc-x', amount_halalas: 5000, raw_payload: {}, received_at: new Date('2026-11-01T15:49:03Z'), owner_mail_sent_at: null };
    const fresh = { ...old, id: 60, received_at: new Date('2026-11-10T09:00:00Z') };
    const db = { query: async (sql) => (/payment_events/.test(sql) ? { rows: [old, fresh] } : { rows: [{ n: 0 }] }) };
    const extras = await collectDigestExtras(db, new Date(), new Date(), { runChecks: async () => [] });
    assert.deepEqual(extras.payments.withoutMail.map((p) => p.id), [60]);
    assert.ok(PAYMENT_MAIL_TRACKING_SINCE > old.received_at);
});

// ── junk client alerts ("Na") ───────────────────────────────────────────────
const NA_REPORT = {
    errorType: 'UNHANDLED_PROMISE_REJECTION', message: 'Na', endpoint: null, statusCode: 500, page: '/login',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) CriOS/120', stackTrace: undefined,
};
test('error filter: the 9 Nov example ("Na", iPad Chrome, /login) is ignored', () => {
    assert.equal(junkClientReportReason(NA_REPORT), 'short_message');
});
test('error filter: a long message with no frame from our bundle is ignored too', () => {
    const r = { ...NA_REPORT, message: 'Something odd happened', stackTrace: 'Error\n at chrome-extension://abc/inject.js:1:1' };
    assert.equal(junkClientReportReason(r), 'no_own_frame');
});
test('error filter: a real client error with our own frame is kept', () => {
    const r = { ...NA_REPORT, message: 'Cannot read properties of undefined', stackTrace: 'TypeError\n at https://www.smle-question-bank.com/assets/index-abc123.js:1:2' };
    assert.equal(junkClientReportReason(r), null);
});
test('error filter: server errors and API failures are never filtered', () => {
    assert.equal(junkClientReportReason({ errorType: 'DATABASE_ERROR', message: 'x', statusCode: 500 }), null);
    assert.equal(junkClientReportReason({ errorType: 'API_UNREACHABLE', message: 'Network error' }), null);
});
test('error filter: the junk report is not mailed (no mail path is reached)', async () => {
    const out = await sendErrorNotification({ ...NA_REPORT });
    assert.equal(out.success, false);
    assert.match(out.message, /Ignored: junk client report \(short_message\)/);
});
test('error mail uses the shared layout and escapes the stack', () => {
    const sev = { level: 'CRITICAL' };
    const { html, text } = generateEmailHtml({ errorType: 'DATABASE_ERROR', message: 'oops <b>', statusCode: 500, stackTrace: 'at <x>' }, sev, 'ERR-1', 2);
    assert.match(html, /width="600"/);
    assert.doesNotMatch(html, /<b>/);
    assert.match(text, /\[URGENT\]/);
    assert.match(text, /Repeats this hour: ×2/);
});

// ── cold-start guard ────────────────────────────────────────────────────────
test('bootstrap guard: current version -> skip, one query only', async () => {
    let calls = 0;
    const db = { query: async () => { calls++; return { rows: [{ version: 15 }] }; } };
    assert.equal(await checkSchemaVersion(db, 15, newGuardState()), 'current');
    assert.equal(calls, 1);
});
test('bootstrap guard: older version -> "behind" (only then may the DDL list run)', async () => {
    const db = { query: async () => ({ rows: [{ version: 14 }] }) };
    assert.equal(await checkSchemaVersion(db, 15, newGuardState()), 'behind');
});
test('bootstrap guard: a FAILED check (EMAXCONN) throws and never answers "behind"', async () => {
    const err = Object.assign(new Error('Max client connections reached'), { code: 'XX000' });
    const db = { query: async () => { throw err; } };
    await assert.rejects(checkSchemaVersion(db, 15, newGuardState()), VersionCheckSkipped);
});
test('bootstrap guard: after a failure the instance does not ask again for a while', async () => {
    let calls = 0;
    let t = 1_000_000;
    const db = { query: async () => { calls++; throw new Error('too many connections'); } };
    const state = newGuardState();
    await assert.rejects(checkSchemaVersion(db, 15, state, () => t), VersionCheckSkipped);
    await assert.rejects(checkSchemaVersion(db, 15, state, () => t + 1000), /recently failed/);
    assert.equal(calls, 1); // the second request cost no connection at all
    t += RETRY_AFTER_MS + 1;
    await assert.rejects(checkSchemaVersion(db, 15, state, () => t), VersionCheckSkipped);
    assert.equal(calls, 2); // a later request retried the check
});
test('bootstrap guard: a missing version table (new database) counts as "behind"', async () => {
    const seen = [];
    const db = { query: async (sql) => { seen.push(sql); if (/SELECT version/.test(sql)) throw Object.assign(new Error('no table'), { code: '42P01' }); return { rows: [] }; } };
    assert.equal(await checkSchemaVersion(db, 15, newGuardState()), 'behind');
    assert.ok(seen.some((q) => /CREATE TABLE IF NOT EXISTS schema_bootstrap_version/.test(q)));
});

// ── payment mail ────────────────────────────────────────────────────────────
test('payment mail: retries a rate-limited send, then succeeds', async () => {
    let n = 0;
    const waits = [];
    const r = await sendWithRetry(async () => { if (++n < 3) throw new Error('550 Too many requests, 10 per second'); }, { wait: async (ms) => waits.push(ms), log: { warn() {} } });
    assert.deepEqual(r, { ok: true, attempts: 3 });
    assert.equal(waits.length, 2);
});
test('payment mail: gives up loudly (result carries the error) after the last attempt', async () => {
    const r = await sendWithRetry(async () => { throw new Error('550 Too many requests'); }, { wait: async () => {}, log: { warn() {} } });
    assert.equal(r.ok, false);
    assert.equal(r.attempts, 3);
    assert.match(r.error, /550/);
});
test('payment mail: the outcome is written into payment_events.raw_payload._sqb', async () => {
    const calls = [];
    const db = { query: async (sql, params) => { calls.push({ sql, params }); } };
    await recordOwnerMail(db, 77, { ok: true, attempts: 2 }, new Date('2026-11-10T10:00:00Z'));
    assert.match(calls[0].sql, /UPDATE payment_events/);
    assert.equal(calls[0].params[0], 77);
    assert.match(calls[0].params[1], /owner_mail_sent_at/);
    await recordOwnerMail(db, 78, { ok: false, attempts: 3, error: 'x' });
    assert.match(calls[1].params[1], /owner_mail_error/);
});
test('payment mail: withinTime returns at the cap and never rejects', async () => {
    assert.equal(await withinTime(new Promise(() => {}), 20), 'timeout');
    assert.equal(await withinTime(Promise.reject(new Error('x')), 20), 'failed');
});
test('payment mail: new layout shows who, amount, net and links to Accounting', () => {
    const m = buildPaymentReceivedMail({ who: 'a@b.com', trackName: 'طبي / medical', trackKey: 'medical', gross: 5000, feeHalalas: 300, estimated: true, card: 'MADA', expiryDate: '2026-12-01T00:00:00Z', ref: 'abc' });
    assert.match(m.subject, /Payment received — 50\.00 SAR from a@b\.com \[medical\]/);
    assert.match(m.text, /Net: 47\.00 SAR/);
    assert.match(m.text, /smle-question-bank\.com\/admin\/accounting/);
});

// ── other owner mails ───────────────────────────────────────────────────────
test('contact, suggestion and question-report mails escape what visitors typed', () => {
    const c = buildContactMail({ name: '<b>Ali</b>', mobile: '05', username: 'u', senderTrack: 't', subject: 'S', message: '<img src=x>' });
    assert.doesNotMatch(c.html, /<img src=x>/);
    const s = buildSuggestionMail({ id: 3, category: 'bug', priority: 'high', title: 'T', description: '<script>', senderTrack: 't' });
    assert.doesNotMatch(s.html, /<script>/);
    const q = buildQuestionReportMail({ reportId: 9, userEmail: 'a@b.c', qTrack: 'medical', qTypeLabel: 'x', questionText: '<u>q</u>', reason: null });
    assert.match(q.text, /No reason was given\./);
    assert.match(q.html, /admin\/reports/);
});
