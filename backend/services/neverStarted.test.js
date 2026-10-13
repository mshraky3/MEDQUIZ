/**
 * The day-1 "your free questions are ready" nudge (lifecycleJobs.runNeverStartedJob)
 * and the Reply-To that campaign/lifecycle mail now carries (mailer.defaultReplyTo).
 *
 * The gateway is switched to `on` BEFORE the mailer is imported and fetch is
 * stubbed, so the real payload that would leave the process is captured.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.EMAIL_GATEWAY_MODE = 'on';
process.env.EMAIL_GATEWAY_URL = 'https://gateway.example.test';
process.env.EMAIL_GATEWAY_KEY = 'ek_test';
delete process.env.MAIL_REPLY_TO;

const sent = [];
globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true }) };
};

const { defaultReplyTo, SUPPORT_REPLY_TO } = await import('./mailer.js');
const { runNeverStartedJob, NEVER_STARTED_FROM } = await import('./lifecycleJobs.js');

const candidate = {
    id: 7, username: 'newstudent@example.test', email: 'newstudent@example.test',
    track: 'medical', preferred_lang: 'ar', allowance: 10,
};

function fakeDb(rows) {
    const queries = [];
    return {
        queries,
        query: async (sql, params) => {
            queries.push({ sql, params });
            return { rows: /^\s*SELECT/i.test(sql) ? rows : [], rowCount: rows.length };
        },
    };
}

test('Reply-To: lifecycle and broadcast mail get the support address, other mail none', () => {
    assert.equal(defaultReplyTo('medqize.lifecycle.never_started'), SUPPORT_REPLY_TO);
    assert.equal(defaultReplyTo('medqize.lifecycle.comeback'), SUPPORT_REPLY_TO);
    assert.equal(defaultReplyTo('medqize.broadcast.campaign'), SUPPORT_REPLY_TO);
    assert.equal(defaultReplyTo('medqize.otp.signup'), undefined);
    assert.equal(defaultReplyTo('medqize.owner.payment_received'), undefined);
    assert.equal(defaultReplyTo(undefined), undefined);
});

test('Reply-To: MAIL_REPLY_TO overrides the default', () => {
    process.env.MAIL_REPLY_TO = 'help@example.test';
    try {
        assert.equal(defaultReplyTo('medqize.lifecycle.welcome'), 'help@example.test');
    } finally {
        delete process.env.MAIL_REPLY_TO;
    }
});

test('never started: candidate query keeps every safety guard', async () => {
    const db = fakeDb([]);
    await runNeverStartedJob(db);
    const { sql, params } = db.queries[0];
    for (const guard of [
        'never_started_email_sent_at IS NULL',
        'free_questions_used',
        'user_quiz_sessions',
        'email_verified = TRUE',
        'email_opt_out',
        'is_admin_created = FALSE',
        'grandfathered_at IS NULL',
        'payment_events',
        "INTERVAL '20 hours'",
        "INTERVAL '10 days'",
    ]) {
        assert.ok(sql.includes(guard), `missing guard: ${guard}`);
    }
    assert.equal(params[1], NEVER_STARTED_FROM);
    assert.ok(Number.isFinite(Date.parse(NEVER_STARTED_FROM)), 'cutoff is a valid instant');
});

test('never started: sends one mail with Reply-To and the real allowance, then stamps the account', async () => {
    sent.length = 0;
    const db = fakeDb([candidate]);
    const r = await runNeverStartedJob(db);
    assert.equal(r.sent, 1);
    assert.deepEqual(r.errors, []);

    assert.equal(sent.length, 1);
    const mail = sent[0].body;
    assert.equal(sent[0].url, 'https://gateway.example.test/api/v1/send');
    assert.equal(mail.event, 'medqize.lifecycle.never_started');
    assert.equal(mail.replyTo, SUPPORT_REPLY_TO);
    assert.equal(mail.to, 'newstudent@example.test');
    assert.match(mail.html, /10 أسئلة مجانية/);
    assert.match(mail.html, /utm_campaign=free_start/);
    assert.ok(mail.html.includes(SUPPORT_REPLY_TO), 'names the support address as text too');
    assert.doesNotMatch(mail.html, /129|299|ريال|SAR/, 'no price in the first-session nudge');

    const stamp = db.queries.find((q) => /never_started_email_sent_at = NOW\(\)/.test(q.sql));
    assert.ok(stamp, 'the account is stamped after the send');
    assert.deepEqual(stamp.params, [7]);
});

test('never started: an English account gets the English subject', async () => {
    sent.length = 0;
    const db = fakeDb([{ ...candidate, preferred_lang: 'en', allowance: 40 }]);
    await runNeverStartedJob(db);
    assert.equal(sent[0].body.subject, 'Your free SQB questions are ready');
    assert.match(sent[0].body.html, /40 free questions/);
});

test('never started: a failed send is reported and the account is NOT stamped', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: false, status: 400, text: async () => '{"error":"bad"}' });
    try {
        const db = fakeDb([candidate]);
        const r = await runNeverStartedJob(db);
        assert.equal(r.sent, 0);
        assert.equal(r.errors.length, 1);
        assert.equal(db.queries.some((q) => /never_started_email_sent_at = NOW\(\)/.test(q.sql)), false);
    } finally {
        globalThis.fetch = realFetch;
    }
});
