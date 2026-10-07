/**
 * Golden Months — the dated bonus-time offer (four months bought = five credited).
 *
 * Run with `npm test`. The rules that matter, because they decide how long a
 * paying student keeps access:
 *   - the bonus is judged by when the payment was CREATED, with a grace after
 *     the deadline, and never applies to any other plan;
 *   - the price a checkout charges and verifies is not touched at all;
 *   - it reaches the real activation path (a fake db stands in for Postgres);
 *   - receipts state the months actually credited.
 */
process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const {
    GOLDEN_MONTHS, isGoldenLive, displayBonusMonths, bonusMonthsFor, getGoldenInfo,
} = await import('./goldenMonths.js');
const {
    PLANS, computeNewExpiry, listPlansForDisplay, minAcceptableHalalas, effectivePriceHalalas,
    activateSubscriptionFromPayment,
} = await import('./paymentService.js');
const { describeTerm, arTerm } = await import('./invoiceService.js');
const { settleEvent } = await import('./accountingService.js');

const { startsAtMs, endsAtMs, graceMs } = GOLDEN_MONTHS;

// Production ends the National Day price offer with NATIONAL_DAY_OFFER_ENDS_AT (1 Oct, Vercel env);
// the test environment has no env, so mirror it. These tests are about the bonus, at base prices.
const { NATIONAL_DAY_OFFER } = await import('./paymentService.js');
NATIONAL_DAY_OFFER.endsAtMs = Date.parse('2026-10-01T23:59:59+03:00');
const DAY = 24 * 60 * 60 * 1000;
const inside = startsAtMs + 5 * DAY;

test('the window is Thu 8 Oct to Sun 8 Nov 2026, Riyadh time', () => {
    assert.equal(startsAtMs, Date.parse('2026-10-08T00:00:00+03:00'));
    assert.equal(endsAtMs, Date.parse('2026-11-08T23:59:59+03:00'));
});

test('only the four-month plan gets a bonus, and only inside the window', () => {
    assert.equal(bonusMonthsFor('four_month', inside), 1);
    for (const id of ['monthly', 'annual', 'group_3', 'group_5', undefined, null, 'toString']) {
        assert.equal(bonusMonthsFor(id, inside), 0, String(id));
    }
    assert.equal(bonusMonthsFor('four_month', startsAtMs - 1), 0, 'before the start');
    assert.equal(bonusMonthsFor('four_month', startsAtMs), 1, 'at the start');
    assert.equal(bonusMonthsFor('four_month', endsAtMs), 1, 'at the deadline');
});

test('a payment created before the deadline still gets its month while it is verified late (grace)', () => {
    assert.equal(bonusMonthsFor('four_month', endsAtMs + graceMs), 1);
    assert.equal(bonusMonthsFor('four_month', endsAtMs + graceMs + 1), 0, 'a page left open next day gets nothing');
    // What visitors see has no grace: the offer is off the moment the deadline passes.
    assert.equal(isGoldenLive(endsAtMs), true);
    assert.equal(isGoldenLive(endsAtMs + 1), false);
    assert.equal(displayBonusMonths('four_month', endsAtMs + 1), 0);
});

test('the price is untouched: nothing in the price path knows about the offer', () => {
    const p = PLANS.four_month;
    assert.equal(p.priceHalalas, 12900);
    assert.equal(effectivePriceHalalas(p, inside), 12900);
    assert.equal(minAcceptableHalalas(p, inside), 12900);
    assert.equal(PLANS.monthly.priceHalalas, 5000);
});

test('/config plans carry bonusMonths for display only while live, with the same price', () => {
    const live = listPlansForDisplay('individual', inside);
    const four = live.find((p) => p.id === 'four_month');
    assert.equal(four.bonusMonths, 1);
    assert.equal(four.priceHalalas, 12900);
    assert.equal(four.offerId, undefined, 'must not look like the price offer to the pages');
    for (const p of live.filter((x) => x.id !== 'four_month')) assert.equal(p.bonusMonths, undefined, p.id);
    for (const p of listPlansForDisplay('individual', endsAtMs + 1)) assert.equal(p.bonusMonths, undefined, p.id);
    for (const p of listPlansForDisplay('group', inside)) assert.equal(p.bonusMonths, undefined, p.id);
});

test('getGoldenInfo is null when off and carries the server clock when on', () => {
    assert.equal(getGoldenInfo(startsAtMs - 1), null);
    assert.equal(getGoldenInfo(endsAtMs + 1), null);
    const info = getGoldenInfo(inside);
    assert.equal(info.id, 'golden_months_2026');
    assert.equal(info.active, true);
    assert.equal(info.now, inside);
    assert.equal(info.endsAt, new Date(endsAtMs).toISOString());
    assert.deepEqual(info.bonusMonths, { four_month: 1 });
});

test('computeNewExpiry credits 5 months inside the window, 4 outside, and none for admin grants', () => {
    const month = (d) => d.getFullYear() * 12 + d.getMonth();
    const now = new Date();
    const at = (planId, atMs) => month(computeNewExpiry(null, { id: planId, months: planId === 'four_month' ? 4 : 1 }, atMs)) - month(now);
    assert.equal(at('four_month', inside), 5);
    assert.equal(at('four_month', startsAtMs - DAY), 4);
    assert.equal(at('four_month', endsAtMs + graceMs + DAY), 4);
    assert.equal(at('monthly', inside), 1);
    // Admin grants pass `{ months }` with no id and no payment.
    assert.equal(month(computeNewExpiry(null, { months: 4 }, inside)) - month(now), 4);
    // Stacks on a running subscription like any renewal.
    const running = new Date(Date.now() + 30 * DAY);
    const stacked = computeNewExpiry(running, PLANS.four_month, inside);
    const expected = new Date(running); expected.setMonth(expected.getMonth() + 5);
    assert.equal(stacked.getTime(), expected.getTime());
});

test('activation grants the bonus judged by the PAYMENT time, through the real code path', async () => {
    const run = async (createdAt) => {
        let updated = null;
        const client = {
            async query(sql, params) {
                if (/SELECT id, subscription_expiry_date FROM accounts/.test(sql)) {
                    return { rows: [{ id: 7, subscription_expiry_date: null }] };
                }
                if (/INSERT INTO payment_events/.test(sql)) return { rows: [{ id: 1 }] };
                if (/UPDATE accounts/.test(sql)) updated = params[0];
                return { rows: [] };
            },
            release() {},
        };
        const db = { connect: async () => client, query: async () => ({ rows: [] }) };
        const payment = { id: `pay_${createdAt}`, amount: 12900, currency: 'SAR', status: 'paid', created_at: createdAt, metadata: { plan: 'four_month' } };
        const out = await activateSubscriptionFromPayment(db, 7, payment, 'payment_paid', PLANS.four_month);
        assert.equal(out.activated, true);
        return updated;
    };
    const monthsAhead = (d) => (d.getFullYear() * 12 + d.getMonth()) - (new Date().getFullYear() * 12 + new Date().getMonth());
    assert.equal(monthsAhead(await run(new Date(inside).toISOString())), 5, 'in window');
    assert.equal(monthsAhead(await run(new Date(startsAtMs - DAY).toISOString())), 4, 'before the window');
    assert.equal(monthsAhead(await run(new Date(endsAtMs + graceMs + DAY).toISOString())), 4, 'after the window');
});

test('receipts say the months actually credited', () => {
    const settled = (planId, atMs) => settleEvent({
        id: 1, account_id: 1, gateway_ref: 'abc-123', amount_halalas: 12900, currency: 'SAR',
        received_at: new Date(atMs), email: 'a@b.c',
        raw_payload: { created_at: new Date(atMs).toISOString(), metadata: { plan: planId }, source: { type: 'creditcard', company: 'mada' } },
    });
    assert.match(describeTerm(settled('four_month', inside)).title, /5 months full access/);
    assert.match(describeTerm(settled('four_month', startsAtMs - DAY)).title, /4 months full access/);
    assert.match(describeTerm(settled('monthly', inside)).title, /1 month full access/);
    assert.match(arTerm(settled('four_month', inside)), /خمسة أشهر/);
    assert.match(arTerm(settled('four_month', startsAtMs - DAY)), /أربعة أشهر/);
    // No creation time on an old record: never guess a bonus.
    assert.match(describeTerm({ planId: 'four_month' }).title, /4 months full access/);
});

test('GOLDEN_MONTHS_ENDS_AT overrides the deadline; junk falls back to the default, never to forever', async () => {
    const saved = { s: process.env.GOLDEN_MONTHS_STARTS_AT, e: process.env.GOLDEN_MONTHS_ENDS_AT };
    try {
        process.env.GOLDEN_MONTHS_ENDS_AT = '2026-11-15T23:59:59+03:00';
        const withDate = await import('./goldenMonths.js?override');
        assert.equal(withDate.GOLDEN_MONTHS.endsAtMs, Date.parse('2026-11-15T23:59:59+03:00'));
        process.env.GOLDEN_MONTHS_ENDS_AT = 'not a date';
        const junk = await import('./goldenMonths.js?junk');
        assert.equal(junk.GOLDEN_MONTHS.endsAtMs, endsAtMs);
    } finally {
        for (const [k, v] of [['GOLDEN_MONTHS_STARTS_AT', saved.s], ['GOLDEN_MONTHS_ENDS_AT', saved.e]]) {
            if (v === undefined) delete process.env[k]; else process.env[k] = v;
        }
    }
});

test('wiring: activation passes the payment time to computeNewExpiry (mutation guard)', () => {
    const src = fs.readFileSync(new URL('./paymentService.js', import.meta.url), 'utf8');
    assert.match(src, /computeNewExpiry\(account\.subscription_expiry_date, plan, paymentInstantMs\(payment\)\)/);
    const route = fs.readFileSync(new URL('../routes/payment.js', import.meta.url), 'utf8');
    assert.match(route, /goldenMonths: getGoldenInfo\(\)/);
});
