/**
 * The arithmetic the price report prints.
 *
 * The SQL needs a database and is not covered here. These three helpers are,
 * because they are what turns counts into a sentence someone acts on: a
 * significance test that is wrong in the optimistic direction would let six
 * sales look like a decision, which is the exact failure this whole report
 * exists to prevent.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { twoProportionP, readableLadder, pct } from './priceTestReport.js';

/** Within tolerance of a value computed the long way. */
const close = (actual, expected, tol = 0.002) =>
    assert.ok(Math.abs(actual - expected) <= tol,
        `expected ≈${expected}, got ${actual}`);

test('the p-value matches the textbook two-proportion test', () => {
    // 50/100 vs 30/100: pooled .4, se .069282, z 2.8868, two-sided p .00389.
    close(twoProportionP(50, 100, 30, 100), 0.0039);
    // 12/200 vs 8/200: pooled .05, se .021794, z .9177, two-sided p .3588.
    close(twoProportionP(12, 200, 8, 200), 0.3588);
    // 10.0% against 12.8% on a thousand each: z 1.97, right on the .05 line,
    // which is where the approximation would show up if it were wrong.
    const p = twoProportionP(100, 1000, 128, 1000);
    assert.ok(p > 0.04 && p < 0.05, `expected a borderline p, got ${p}`);
});

test('identical rates are maximally unsurprising', () => {
    close(twoProportionP(20, 100, 20, 100), 1);
});

test('the sample sizes this business actually has do not reach significance', () => {
    // The real reason S5-01 is blocked, as a number: three sales against four,
    // on a hundred exposures each, is nowhere near a signal — and it is exactly
    // the comparison July and August would have invited.
    const p = twoProportionP(4, 100, 3, 100);
    assert.ok(p > 0.05, `4/100 vs 3/100 must not be significant, got p=${p}`);
});

test('degenerate inputs return null rather than NaN', () => {
    assert.equal(twoProportionP(0, 0, 1, 10), null);
    assert.equal(twoProportionP(1, 10, 0, 0), null);
    // Nobody bought in either arm: no rate to compare, and se is 0.
    assert.equal(twoProportionP(0, 50, 0, 50), null);
});

test('a ladder key reads back as prices', () => {
    assert.equal(
        readableLadder('annual:30000,four_month:12900,monthly:5000'),
        'annual 300 · four_month 129 · monthly 50'
    );
    assert.equal(readableLadder(null), '(none recorded)');
});

test('percentages of nothing print a dash, not NaN', () => {
    assert.equal(pct(0, 0), '—');
    assert.equal(pct(3, 8), '37.5%');
});
