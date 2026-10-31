import test from 'node:test';
import assert from 'node:assert/strict';
import { addMonthsClamped } from './addMonths.js';

const ymd = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate()];

test('31 Oct + 1 month is 30 Nov, not 1 Dec', () => {
    assert.deepEqual(ymd(addMonthsClamped(new Date(2026, 9, 31), 1)), [2026, 11, 30]);
});

test('31 Jan + 1 month is the last day of Feb (28, and 29 in a leap year)', () => {
    assert.deepEqual(ymd(addMonthsClamped(new Date(2027, 0, 31), 1)), [2027, 2, 28]);
    assert.deepEqual(ymd(addMonthsClamped(new Date(2028, 0, 31), 1)), [2028, 2, 29]);
});

test('29 Feb leap day + 12 months is 28 Feb; + 48 months is 29 Feb', () => {
    assert.deepEqual(ymd(addMonthsClamped(new Date(2028, 1, 29), 12)), [2029, 2, 28]);
    assert.deepEqual(ymd(addMonthsClamped(new Date(2028, 1, 29), 48)), [2032, 2, 29]);
});

test('normal dates behave exactly like setMonth, and crossing a year works', () => {
    for (const [y, m, dd, add] of [[2026, 4, 15, 1], [2026, 10, 15, 4], [2026, 0, 1, 5], [2026, 11, 31, 1], [2026, 6, 31, 5]]) {
        const a = new Date(y, m, dd, 13, 45, 7);
        const expected = new Date(a);
        expected.setMonth(expected.getMonth() + add);
        // Only compare where setMonth does not overflow.
        if (expected.getDate() === a.getDate()) {
            assert.equal(addMonthsClamped(a, add).getTime(), expected.getTime());
        }
    }
    assert.deepEqual(ymd(addMonthsClamped(new Date(2026, 11, 31), 2)), [2027, 2, 28]);
});

test('keeps time of day and does not mutate its argument', () => {
    const src = new Date(2026, 9, 31, 22, 30, 15);
    const out = addMonthsClamped(src, 1);
    assert.equal(src.getMonth(), 9);
    assert.deepEqual([out.getHours(), out.getMinutes(), out.getSeconds()], [22, 30, 15]);
});
