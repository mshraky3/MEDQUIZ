/**
 * The renewal ladder.
 *
 * Worth pinning in a test rather than trusting to reading, because the ladder
 * spans both sides of the expiry date and the arithmetic changes sign halfway
 * through. The interesting failures are all off-by-one: a rung that fires
 * twice, a rung that never fires, or the whole sequence firing once per
 * account instead of once per term.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { RENEWAL_STAGES, dueRenewalStage } from './lifecycleJobs.js';

/** What the job does with one row: send when the due rung is ahead of the stored one. */
const wouldSend = (daysToExpiry, storedStage) => {
    const due = dueRenewalStage(daysToExpiry);
    if (due == null) return null;
    if (storedStage != null && storedStage >= due) return null;
    return due;
};

test('the ladder has three rungs, descending', () => {
    assert.deepEqual(RENEWAL_STAGES.map((s) => s.id), [1, 2, 3]);
    const thresholds = RENEWAL_STAGES.map((s) => s.at);
    assert.deepEqual(thresholds, [7, 1, -3]);
    for (let i = 1; i < thresholds.length; i++) {
        assert.ok(thresholds[i] < thresholds[i - 1], 'thresholds must descend');
    }
});

test('nothing is due while the subscription has more than a week left', () => {
    for (const days of [365, 90, 30, 8]) {
        assert.equal(dueRenewalStage(days), null, `${days} days out should be quiet`);
    }
});

test('rung 1 opens at seven days and stays open until the last day', () => {
    for (const days of [7, 6, 5, 4, 3, 2]) {
        assert.equal(dueRenewalStage(days), 1, `${days} days out is rung 1`);
    }
});

test('rung 2 is the day before and the day of', () => {
    assert.equal(dueRenewalStage(1), 2);
    assert.equal(dueRenewalStage(0), 2);
});

test('rung 3 waits three days past the expiry', () => {
    // One and two days after expiry are deliberately silent: the student may
    // not have noticed yet, and the whole argument of rung 3 is that they have.
    assert.equal(dueRenewalStage(-1), 2);
    assert.equal(dueRenewalStage(-2), 2);
    assert.equal(dueRenewalStage(-3), 3);
    assert.equal(dueRenewalStage(-10), 3);
});

test('each rung sends exactly once, however often the job runs', () => {
    let stored = null;
    const sent = [];
    // An hourly job walking a subscription from a week out to a week lapsed.
    for (const days of [7, 7, 6, 5, 4, 3, 2, 1, 1, 0, -1, -2, -3, -4, -5, -6, -7]) {
        const due = wouldSend(days, stored);
        if (due != null) {
            sent.push(due);
            stored = due;
        }
    }
    assert.deepEqual(sent, [1, 2, 3], 'three emails, in order, no repeats');
});

test('a subscription that starts inside the window does not get the rungs it missed', () => {
    // Someone whose first run is caught at two days out gets rung 1's content
    // once and then rung 2 — not a burst of everything below them.
    let stored = null;
    const sent = [];
    for (const days of [2, 1, -3]) {
        const due = wouldSend(days, stored);
        if (due != null) { sent.push(due); stored = due; }
    }
    assert.deepEqual(sent, [1, 2, 3]);
});

test('renewing mid-sequence restarts the ladder for the new term', () => {
    // Rung 1 went out, then they renewed. paymentService sets the stage back to
    // NULL, so the far-future expiry is quiet and the next term mails again.
    let stored = wouldSend(5, null);
    assert.equal(stored, 1);

    stored = null;                                  // the reset on activation
    assert.equal(wouldSend(120, stored), null);     // quiet for the new term
    assert.equal(wouldSend(7, stored), 1);          // and rung 1 comes round again
});

test('without the reset, a renewing customer would never hear from us again', () => {
    // The failure this guards against, stated as a test so the reset in
    // paymentService cannot be removed as "an unused line".
    const carriedOver = 3;
    assert.equal(wouldSend(7, carriedOver), null);
    assert.equal(wouldSend(1, carriedOver), null);
    assert.equal(wouldSend(-3, carriedOver), null);
});

test('a lapsed account already at rung 3 is never mailed again', () => {
    for (const days of [-3, -10, -29]) {
        assert.equal(wouldSend(days, 3), null);
    }
});

test('non-numeric input is quiet rather than throwing', () => {
    for (const bad of [null, undefined, NaN, 'soon']) {
        assert.equal(dueRenewalStage(bad), null);
    }
});
