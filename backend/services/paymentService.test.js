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
