/**
 * checkQuizAccess — the free-tier entitlement rules.
 *
 * Run with `npm test` (node's built-in runner, no dependencies).
 *
 * This is the only piece of the paywall that decides anything, and it decides
 * it for real money, so it is worth pinning down. The cases below are the ones
 * that actually matter in production:
 *
 *   - a fetched-then-abandoned quiz must cost the student NOTHING (the change
 *     this file was written for), and
 *   - a free account still must not be able to farm the bank by fetching
 *     questions and never answering them.
 *
 * Those two pull in opposite directions; the last test walks the abuse loop to
 * exhaustion and asserts it terminates.
 *
 * The env flag is set before the import because paymentService reads it at
 * call time via isPaymentEnforcementEnabled() — with enforcement off every
 * answer is "unlimited" and none of this would be exercised.
 */
process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';

import test from 'node:test';
import assert from 'node:assert/strict';

const { checkQuizAccess, FREE_QUESTION_ALLOWANCE, FREE_UNANSWERED_CAP } =
    await import('./paymentService.js');

/** A metered free-tier account that has answered `used` and been served `served`. */
const free = (used, served) => ({
    subscription_status: 'free',
    subscription_expiry_date: null,
    is_admin_created: false,
    grandfathered_at: null,
    free_questions_used: used,
    free_questions_served: served,
});

/** Just the decision, without the reason-free extras. */
const decide = (account) => {
    const a = checkQuizAccess(account);
    return { allowed: a.allowed, remaining: a.remaining, servable: a.servable, reason: a.reason };
};

test('a new free account gets the whole allowance', () => {
    assert.deepEqual(decide(free(0, 0)), {
        allowed: true, remaining: 40, servable: 40, reason: 'free_allowance',
    });
});

test('questions fetched and never answered do not touch the budget', () => {
    // The regression this whole change exists to prevent: five of the seventeen
    // accounts that exhausted their allowance had no completed session at all.
    assert.deepEqual(decide(free(0, 10)), {
        allowed: true, remaining: 40, servable: 30, reason: 'free_allowance',
    });
});

test('answering is what spends the budget', () => {
    assert.deepEqual(decide(free(10, 10)), {
        allowed: true, remaining: 30, servable: 30, reason: 'free_allowance',
    });
});

test('an account holding a full cap of unanswered questions is paused, not billed', () => {
    assert.deepEqual(decide(free(0, FREE_UNANSWERED_CAP)), {
        allowed: false, remaining: 40, servable: 0, reason: 'unanswered_backlog',
    });
});

test('answering some of the backlog lifts the pause', () => {
    assert.deepEqual(decide(free(20, 40)), {
        allowed: true, remaining: 20, servable: 20, reason: 'free_allowance',
    });
});

test('a genuinely spent allowance is still the paywall', () => {
    assert.deepEqual(decide(free(FREE_QUESTION_ALLOWANCE, FREE_QUESTION_ALLOWANCE)), {
        allowed: false, remaining: 0, servable: 0, reason: 'free_allowance_exhausted',
    });
});

test('exhausted outranks backlog when both are true', () => {
    // Reason ordering matters: the client shows a different screen for each,
    // and only one of them is allowed to ask for money.
    assert.equal(decide(free(40, 80)).reason, 'free_allowance_exhausted');
});

test('a row written before the served column existed is never locked out', () => {
    const legacyRow = { ...free(10, 10), free_questions_served: undefined };
    assert.deepEqual(decide(legacyRow), {
        allowed: true, remaining: 30, servable: 30, reason: 'free_allowance',
    });
});

test('a served counter behind the used one cannot manufacture extra room', () => {
    assert.deepEqual(decide(free(30, 0)), {
        allowed: true, remaining: 10, servable: 10, reason: 'free_allowance',
    });
});

test('a paying account is unlimited whatever the counters say', () => {
    const paid = {
        subscription_status: 'active',
        subscription_expiry_date: new Date(Date.now() + 86400000).toISOString(),
        is_admin_created: false,
        grandfathered_at: null,
        free_questions_used: 0,
        free_questions_served: 999,
    };
    const a = decide(paid);
    assert.equal(a.allowed, true);
    assert.equal(a.remaining, Infinity);
    assert.equal(a.servable, Infinity);
});

test('a grandfathered account is unlimited even with a spent counter', () => {
    const a = decide({ ...free(40, 40), grandfathered_at: new Date().toISOString() });
    assert.equal(a.allowed, true);
    assert.equal(a.remaining, Infinity);
});

test('fetch-and-abandon farming terminates at the allowance', () => {
    // The property the old spend-on-serve rule gave us for free, and the reason
    // the serve path still writes a counter. Fetch the maximum, never answer,
    // repeat — this must stop, and it must stop at no more than the allowance
    // the account was entitled to in the first place.
    let served = 0;
    const used = 0;
    let harvested = 0;

    for (let round = 0; round < 100; round += 1) {
        const access = checkQuizAccess(free(used, served));
        if (!access.allowed) {
            assert.equal(access.reason, 'unanswered_backlog');
            break;
        }
        const batch = Math.min(10, access.servable);
        assert.ok(batch > 0, 'an allowed request must be able to serve something');
        served += batch;
        harvested += batch;
    }

    assert.equal(harvested, FREE_QUESTION_ALLOWANCE);
    assert.equal(checkQuizAccess(free(used, served)).allowed, false);
});


// ── National Day offer ────────────────────────────────────────────────────
//
// The offer moves real money in two directions — what the checkout charges and
// what verification is willing to accept — so the boundaries are pinned: the
// instant it opens, the instant it closes, and the grace window after it in
// which a checkout opened in time must still be honoured.
//
// The shipped offer has NO end date yet (the owner will supply it), so the
// default state under test is open-ended. Every test about a deadline sets a
// fixture one with testWithEnd and puts the open-ended state back afterwards.

const {
    PLANS, NATIONAL_DAY_OFFER, isOfferLive, effectivePriceHalalas,
    minAcceptableHalalas, paymentInstantMs, getOfferInfo, listPlansForDisplay,
} = await import('./paymentService.js');

const { startsAtMs, graceMs } = NATIONAL_DAY_OFFER;
const ENDS = Date.parse('2026-09-26T23:59:59+03:00'); // a fixture deadline, not the shipped state
const DURING = startsAtMs + 60 * 60 * 1000;           // an hour into the window
const JUST_AFTER = ENDS + 60 * 1000;                  // a minute past the deadline, inside grace
const LONG_AFTER = ENDS + graceMs + 60 * 1000;        // past deadline AND grace
const BEFORE = startsAtMs - 60 * 1000;

/** Runs `fn` with a deadline set, then restores the shipped open-ended state. */
const withEnd = async (fn) => {
    const saved = NATIONAL_DAY_OFFER.endsAtMs;
    NATIONAL_DAY_OFFER.endsAtMs = ENDS;
    try { return await fn(); } finally { NATIONAL_DAY_OFFER.endsAtMs = saved; }
};
const testWithEnd = (name, fn) => test(name, () => withEnd(fn));

const byId = (plans) => Object.fromEntries(plans.map((p) => [p.id, p]));

test('the offer prices are the announced ones: 96 / 196, groups 196 / 296', () => {
    assert.equal(NATIONAL_DAY_OFFER.prices.four_month, 9600);
    assert.equal(NATIONAL_DAY_OFFER.prices.annual, 19600);
    assert.equal(NATIONAL_DAY_OFFER.prices.group_3, 19600);
    assert.equal(NATIONAL_DAY_OFFER.prices.group_5, 29600);
});

testWithEnd('the window is open from its first instant to its last, and shut outside it', () => {
    assert.equal(isOfferLive(BEFORE), false);
    assert.equal(isOfferLive(startsAtMs), true);
    assert.equal(isOfferLive(ENDS), true);
    assert.equal(isOfferLive(ENDS + 1), false);
});

testWithEnd('the monthly plan is never on offer, at any time', () => {
    for (const at of [BEFORE, DURING, JUST_AFTER, LONG_AFTER]) {
        assert.equal(effectivePriceHalalas(PLANS.monthly, at), PLANS.monthly.priceHalalas);
        assert.equal(minAcceptableHalalas(PLANS.monthly, at), PLANS.monthly.priceHalalas);
    }
    const monthly = byId(listPlansForDisplay('all', DURING)).monthly;
    assert.equal(monthly.offerId, undefined);
    assert.equal(monthly.priceHalalas, PLANS.monthly.priceHalalas);
});

test('during the window every offered plan is charged its offer price', () => {
    const shown = byId(listPlansForDisplay('all', DURING));
    assert.equal(shown.four_month.priceHalalas, 9600);
    assert.equal(shown.annual.priceHalalas, 19600);
    assert.equal(shown.group_3.priceHalalas, 19600);
    assert.equal(shown.group_5.priceHalalas, 29600);
    for (const id of ['four_month', 'annual', 'group_3', 'group_5']) {
        assert.equal(shown[id].offerId, NATIONAL_DAY_OFFER.id, id);
        assert.equal(shown[id].regularPriceHalalas, PLANS[id].priceHalalas, id);
    }
});

test('the struck-through "was" price is the real base price, never the old 200 anchor', () => {
    const shown = byId(listPlansForDisplay('all', DURING));
    assert.equal(shown.four_month.compareAtHalalas, PLANS.four_month.priceHalalas);
    assert.equal(shown.annual.compareAtHalalas, PLANS.annual.priceHalalas);
});

test('a 3-riyal cut is not advertised as a discount', () => {
    // group_5 goes 299 -> 296: it takes the new price but draws no "was".
    const g5 = byId(listPlansForDisplay('group', DURING)).group_5;
    assert.equal(g5.priceHalalas, 29600);
    assert.equal(g5.compareAtHalalas, 0);
});

test('a group is compared against the individual price of TODAY', () => {
    const during = byId(listPlansForDisplay('group', DURING));
    assert.equal(during.group_3.compareToHalalas, 9600);
    assert.equal(during.group_5.compareToHalalas, 9600);
    // and every seat really is cheaper than buying alone, at every group size
    for (const g of Object.values(during)) {
        assert.ok(g.priceHalalas / g.seats < g.compareToHalalas, `${g.id} per seat`);
    }
});

testWithEnd('outside the window the ladder is exactly the base ladder', () => {
    for (const at of [BEFORE, LONG_AFTER]) {
        const shown = byId(listPlansForDisplay('all', at));
        for (const id of Object.keys(PLANS)) {
            assert.equal(shown[id].priceHalalas, PLANS[id].priceHalalas, id);
            assert.equal(shown[id].offerId, undefined, id);
        }
        // four_month keeps its own pre-existing compare-at once the offer is gone
        assert.equal(shown.four_month.compareAtHalalas, PLANS.four_month.compareAtHalalas);
    }
});

test('building the display list never mutates the plans verification reads', () => {
    const before = JSON.stringify(PLANS);
    listPlansForDisplay('all', DURING);
    listPlansForDisplay('group', DURING);
    assert.equal(JSON.stringify(PLANS), before);
});

test('a payment made at the offer price is honoured while the offer is on', () => {
    assert.equal(minAcceptableHalalas(PLANS.four_month, DURING), 9600);
    assert.equal(minAcceptableHalalas(PLANS.annual, DURING), 19600);
    assert.equal(minAcceptableHalalas(PLANS.group_3, DURING), 19600);
    assert.equal(minAcceptableHalalas(PLANS.group_5, DURING), 29600);
});

testWithEnd('a checkout opened before the deadline is still honoured just after it', () => {
    // The failure this guards: charged 96, refused activation.
    assert.equal(minAcceptableHalalas(PLANS.four_month, JUST_AFTER), 9600);
    assert.equal(minAcceptableHalalas(PLANS.annual, JUST_AFTER), 19600);
});

testWithEnd('the offer price cannot be reached from a page left open past the grace window', () => {
    assert.equal(minAcceptableHalalas(PLANS.four_month, LONG_AFTER), PLANS.four_month.priceHalalas);
    assert.equal(minAcceptableHalalas(PLANS.annual, LONG_AFTER), PLANS.annual.priceHalalas);
});

test('a payment created before the offer opened is held to the base price', () => {
    assert.equal(minAcceptableHalalas(PLANS.four_month, BEFORE), PLANS.four_month.priceHalalas);
});

test('an under-paid payment is still refused during the offer', () => {
    // The floor moved down to the offer price, not to zero: tampering with the
    // client-side amount must keep failing.
    const floor = minAcceptableHalalas(PLANS.four_month, DURING);
    assert.ok(5000 < floor);
    assert.ok(9599 < floor);
    assert.ok(!(9600 < floor));
});

test('payment time comes from Moyasar, and falls back to now when it says nothing usable', () => {
    assert.equal(paymentInstantMs({ created_at: '2026-09-22T10:00:00.000Z' }), Date.parse('2026-09-22T10:00:00.000Z'));
    const now = Date.now();
    for (const bad of [{}, { created_at: 'not a date' }, { created_at: null }, null, undefined]) {
        const got = paymentInstantMs(bad);
        assert.ok(got >= now && got - now < 5000);
    }
});

testWithEnd('the offer probe is present while live and null when not', () => {
    const info = getOfferInfo(DURING);
    assert.equal(info.id, NATIONAL_DAY_OFFER.id);
    assert.equal(info.active, true);
    assert.equal(info.now, DURING);
    assert.equal(info.endsAt, new Date(ENDS).toISOString());
    assert.equal(getOfferInfo(BEFORE), null);
    assert.equal(getOfferInfo(JUST_AFTER), null);
});

test('the shipped offer has no end date, and none is invented', () => {
    assert.equal(NATIONAL_DAY_OFFER.endsAtMs, null);
});

test('with no end date the offer stays on, however late it is', () => {
    const YEARS_LATER = Date.parse('2030-01-01T00:00:00Z');
    assert.equal(isOfferLive(BEFORE), false, 'still not on before it opens');
    assert.equal(isOfferLive(DURING), true);
    assert.equal(isOfferLive(YEARS_LATER), true);
    assert.equal(minAcceptableHalalas(PLANS.four_month, YEARS_LATER), 9600);
    assert.equal(byId(listPlansForDisplay('all', YEARS_LATER)).annual.priceHalalas, 19600);
});

test('with no end date the probe carries a null deadline, so no page can show a countdown', () => {
    const info = getOfferInfo(DURING);
    assert.equal(info.active, true);
    assert.equal(info.endsAt, null);
});

test('NATIONAL_DAY_OFFER_ENDS_AT sets the deadline; junk in it leaves the offer open-ended', async () => {
    const saved = process.env.NATIONAL_DAY_OFFER_ENDS_AT;
    try {
        // A query string gives node a fresh instance of the module, which reads the env again.
        process.env.NATIONAL_DAY_OFFER_ENDS_AT = '2026-10-01T23:59:59+03:00';
        const withDate = await import('./paymentService.js?ends-set');
        assert.equal(withDate.NATIONAL_DAY_OFFER.endsAtMs, Date.parse('2026-10-01T23:59:59+03:00'));

        process.env.NATIONAL_DAY_OFFER_ENDS_AT = 'not a date';
        const junk = await import('./paymentService.js?ends-junk');
        assert.equal(junk.NATIONAL_DAY_OFFER.endsAtMs, null);
    } finally {
        if (saved === undefined) delete process.env.NATIONAL_DAY_OFFER_ENDS_AT;
        else process.env.NATIONAL_DAY_OFFER_ENDS_AT = saved;
    }
});

// ── The offer, through both doors into activation ─────────────────────────
//
// The pricing functions above are pure; what actually decides whether a
// customer who was charged gets their subscription is verifyAndActivate (the
// redirect) and handleWebhookEvent (the webhook). Both must apply the same
// floor. Moyasar is stubbed at axios, and the database is a tripwire: if a
// payment is accepted the code reaches it and the tripwire throws, so
// "rejects with REACHED_DB" reads as "passed the amount gate".

const { mock } = await import('node:test');
const axios = (await import('axios')).default;
const { verifyAndActivate, handleWebhookEvent } = await import('./paymentService.js');

process.env.MOYASAR_SECRET_KEY = 'sk_test_offer_wiring';

const tripwireDb = {
    query: async () => { throw new Error('REACHED_DB'); },
    connect: async () => { throw new Error('REACHED_DB'); },
};

const payment = (over = {}) => ({
    id: 'pay_offer_test',
    status: 'paid',
    currency: 'SAR',
    amount: 9600,
    created_at: new Date(DURING).toISOString(),
    metadata: { account_id: '7', plan: 'four_month', seats: '1' },
    ...over,
});

const stubMoyasar = (p) => mock.method(axios, 'get', async () => ({ status: 200, data: p }));

test('verify: a four-month payment of 96 SAR made during the offer is accepted', async () => {
    const stub = stubMoyasar(payment());
    try {
        await assert.rejects(verifyAndActivate(tripwireDb, 'pay_offer_test', 7), /REACHED_DB/);
    } finally { stub.mock.restore(); }
});

testWithEnd('verify: the same 96 SAR is refused once the offer and its grace are long over', async () => {
    const stub = stubMoyasar(payment({ created_at: new Date(LONG_AFTER).toISOString() }));
    try {
        const r = await verifyAndActivate(tripwireDb, 'pay_offer_test', 7);
        assert.equal(r.success, false);
        assert.equal(r.reason, 'amount_mismatch');
        assert.equal(r.expected, PLANS.four_month.priceHalalas);
    } finally { stub.mock.restore(); }
});

testWithEnd('verify: a payment made just after the deadline, on a checkout opened in time, is still accepted', async () => {
    const stub = stubMoyasar(payment({ created_at: new Date(JUST_AFTER).toISOString() }));
    try {
        await assert.rejects(verifyAndActivate(tripwireDb, 'pay_offer_test', 7), /REACHED_DB/);
    } finally { stub.mock.restore(); }
});

test('verify: paying less than the offer price is refused during the offer', async () => {
    const stub = stubMoyasar(payment({ amount: 9599 }));
    try {
        const r = await verifyAndActivate(tripwireDb, 'pay_offer_test', 7);
        assert.equal(r.success, false);
        assert.equal(r.reason, 'amount_mismatch');
        assert.equal(r.expected, 9600);
    } finally { stub.mock.restore(); }
});

test('verify: the monthly price cannot be used to buy a four-month term, offer or not', async () => {
    const stub = stubMoyasar(payment({ amount: PLANS.monthly.priceHalalas }));
    try {
        const r = await verifyAndActivate(tripwireDb, 'pay_offer_test', 7);
        assert.equal(r.success, false);
        assert.equal(r.reason, 'amount_mismatch');
    } finally { stub.mock.restore(); }
});

test('verify: 196 SAR buys the annual plan during the offer, 195 does not', async () => {
    let stub = stubMoyasar(payment({ amount: 19600, metadata: { account_id: '7', plan: 'annual', seats: '1' } }));
    try {
        await assert.rejects(verifyAndActivate(tripwireDb, 'pay_offer_test', 7), /REACHED_DB/);
    } finally { stub.mock.restore(); }
    stub = stubMoyasar(payment({ amount: 19500, metadata: { account_id: '7', plan: 'annual', seats: '1' } }));
    try {
        const r = await verifyAndActivate(tripwireDb, 'pay_offer_test', 7);
        assert.equal(r.reason, 'amount_mismatch');
    } finally { stub.mock.restore(); }
});

test('webhook: applies the same floor as the redirect — accepted at the offer price', async () => {
    await assert.rejects(
        handleWebhookEvent(tripwireDb, { type: 'payment_paid', data: payment() }),
        /REACHED_DB/,
    );
});

testWithEnd('webhook: refuses an under-paid payment and one past the grace window', async () => {
    const under = await handleWebhookEvent(tripwireDb, { type: 'payment_paid', data: payment({ amount: 9599 }) });
    assert.deepEqual(under, { handled: false, reason: 'amount_mismatch' });
    const late = await handleWebhookEvent(tripwireDb, {
        type: 'payment_paid',
        data: payment({ created_at: new Date(LONG_AFTER).toISOString() }),
    });
    assert.deepEqual(late, { handled: false, reason: 'amount_mismatch' });
});

test('webhook: a group payment at 196 for three accounts is accepted, 250 is not needed', async () => {
    const g3 = payment({ amount: 19600, metadata: { account_id: '7', plan: 'group_3', seats: '3' } });
    await assert.rejects(handleWebhookEvent(tripwireDb, { type: 'payment_paid', data: g3 }), /REACHED_DB/);
    const cheap = payment({ amount: 19599, metadata: { account_id: '7', plan: 'group_3', seats: '3' } });
    assert.deepEqual(
        await handleWebhookEvent(tripwireDb, { type: 'payment_paid', data: cheap }),
        { handled: false, reason: 'amount_mismatch' },
    );
});
