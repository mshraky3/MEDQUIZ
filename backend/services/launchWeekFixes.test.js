/**
 * Launch-week fixes (27 Nov 2026):
 *  - the "free questions used up" mail takes its prices from the live plan list;
 *  - the Telegram cleanup sets aside posts the Bot API refuses to delete.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.TELEGRAM_BOT_TOKEN = 'test-token';
process.env.EMAIL_GATEWAY_MODE = 'on';
process.env.EMAIL_GATEWAY_URL = 'https://gateway.example.test';
process.env.EMAIL_GATEWAY_KEY = 'ek_test';
delete process.env.TELEGRAM_API_ID;
delete process.env.TELEGRAM_API_HASH;
delete process.env.TELEGRAM_USER_SESSION;

// stubbed before the mailer loads: nothing leaves the process
const sent = [];
globalThis.fetch = async (url, init) => {
    sent.push(JSON.parse(init.body));
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true }) };
};

const { individualPriceLines, sendTrialEndedEmail } = await import('./userEmailService.js');
const { PLANS, NATIONAL_DAY_OFFER, listPlansForDisplay } = await import('./paymentService.js');
const { runMessageCleanupJob } = await import('./telegramJobs.js');
const { default: axios } = await import('axios');

/** Run `fn` with the offer block set to a known window and prices, then put it back. */
function withOffer(window, fn) {
    const saved = { ...NATIONAL_DAY_OFFER };
    Object.assign(NATIONAL_DAY_OFFER, window);
    try {
        return fn();
    } finally {
        Object.assign(NATIONAL_DAY_OFFER, saved);
    }
}

const OFFER = {
    startsAtMs: Date.parse('2030-11-20T00:00:00+03:00'),
    endsAtMs: Date.parse('2030-12-01T23:59:59+03:00'),
    prices: { four_month: 10900, annual: 19900 },
};
const DURING = Date.parse('2030-11-25T12:00:00+03:00');
const AFTER = Date.parse('2030-12-03T12:00:00+03:00');
const sar = (h) => String(h / 100);

test('free-limit mail: during an offer it shows the offer prices, the end date and the regular prices', () => {
    withOffer(OFFER, () => {
        const en = individualPriceLines('en', DURING);
        assert.equal(en.prices, `SAR ${sar(PLANS.monthly.priceHalalas)} a month · 109 for four months · 199 for a year`);
        assert.match(en.offer, /ends on 1 December \(Riyadh time\)/);
        assert.ok(en.offer.includes(`${sar(PLANS.four_month.priceHalalas)} for four months`));
        assert.ok(en.offer.includes(`${sar(PLANS.annual.priceHalalas)} for a year`));

        const ar = individualPriceLines('ar', DURING);
        assert.match(ar.prices, /109 لأربعة أشهر · 199 للسنة/);
        assert.match(ar.offer, /ديسمبر/);
        // the mail quotes exactly what the checkout charges
        for (const plan of listPlansForDisplay('individual', DURING)) {
            assert.ok(ar.prices.includes(sar(plan.priceHalalas)), plan.id);
        }
    });
});

test('free-limit mail: after the offer it shows the base prices and no offer line', () => {
    withOffer(OFFER, () => {
        const { prices, offer } = individualPriceLines('en', AFTER);
        assert.equal(offer, '');
        assert.equal(prices, `SAR ${sar(PLANS.monthly.priceHalalas)} a month · ${sar(PLANS.four_month.priceHalalas)} for four months · ${sar(PLANS.annual.priceHalalas)} for a year`);
    });
});

test('free-limit mail: an offer with no end date says limited time, not a made-up date', () => {
    withOffer({ ...OFFER, endsAtMs: null }, () => {
        assert.match(individualPriceLines('en', DURING).offer, /for a limited time/);
    });
});

test('free-limit mail: the rendered mail carries the live prices', async () => {
    const saved = { ...NATIONAL_DAY_OFFER };
    Object.assign(NATIONAL_DAY_OFFER, OFFER);
    try {
        await sendTrialEndedEmail('student@example.test', 'student', 'medical', {}, { lang: 'en', nowMs: DURING });
        await sendTrialEndedEmail('student@example.test', 'student', 'medical', {}, { lang: 'en', nowMs: AFTER });
    } finally {
        Object.assign(NATIONAL_DAY_OFFER, saved);
    }
    assert.equal(sent.length, 2);
    assert.match(sent[0].html, /109 for four months · 199 for a year/);
    assert.match(sent[0].html, /Regular price:/);
    assert.ok(sent[1].html.includes(`${sar(PLANS.annual.priceHalalas)} for a year`));
    assert.doesNotMatch(sent[1].html, /Regular price|199 for a year/);
});

function cleanupDb(rows) {
    const writes = [];
    return {
        writes,
        query: async (sql, params) => {
            if (/^\s*SELECT/i.test(sql)) return { rows };
            writes.push({ sql, id: params[0] });
            return { rows: [] };
        },
    };
}

/** Answer deleteMessage per message id without touching the network. */
async function withTelegram(replies, fn) {
    const real = axios.post;
    const calls = [];
    axios.post = async (url, payload) => {
        calls.push({ url, payload });
        const description = replies[payload.message_id];
        if (!description) return { data: { ok: true, result: true } };
        const err = new Error('Request failed with status code 400');
        err.response = { data: { ok: false, description } };
        throw err;
    };
    try {
        return await fn(calls);
    } finally {
        axios.post = real;
    }
}

const old = new Date(Date.now() - 20 * 86_400_000);
const young = new Date(Date.now() - 3_600_000);
const row = (id, created_at) => ({ id, chat_id: '@channel', message_id: id, created_at });

test('cleanup: a post the Bot API can never delete is set aside, and the next ones are processed', async () => {
    const db = cleanupDb([row(1, old), row(2, old), row(3, young)]);
    const result = await withTelegram({ 1: "Bad Request: message can't be deleted" }, async (calls) => {
        const r = await runMessageCleanupJob(db);
        assert.equal(calls.length, 3);
        assert.ok(calls.every((c) => c.url.endsWith('/deleteMessage')));
        return r;
    });
    assert.deepEqual({ deleted: result.deleted, parked: result.parked, errors: result.errors }, { deleted: 2, parked: 1, errors: [] });
    const parked = db.writes.find((w) => w.id === 1);
    assert.match(parked.sql, /UPDATE telegram_sent_messages SET delete_after = delete_after \+ INTERVAL '100 years'/);
    assert.equal(db.writes.filter((w) => /^\s*DELETE/i.test(w.sql)).length, 2);
});

test('cleanup: a young post refused, or any other error, stays due for a retry', async () => {
    const db = cleanupDb([row(1, young), row(2, old)]);
    const result = await withTelegram({
        1: "Bad Request: message can't be deleted",
        2: 'Too Many Requests: retry after 5',
    }, () => runMessageCleanupJob(db));
    assert.equal(result.parked, 0);
    assert.equal(result.errors.length, 2);
    assert.equal(db.writes.length, 0);
});
