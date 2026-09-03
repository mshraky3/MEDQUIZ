/**
 * Tests for the bits of the email service that are pure — the Arabic counting
 * helpers, and the one template that refuses to render without its number.
 *
 * Not the templates themselves: rendering one means stubbing the mail
 * transport, and the layout is shared with nine emails already in production.
 * What is worth pinning here is the counting, because Arabic gets it wrong in
 * a way that reads as broken rather than as a typo, and because every one of
 * these helpers exists to fix exactly that bug after it shipped once.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    arDays,
    arDaysCount,
    arQuestionsCount,
    arMonthsCount,
    normalizeLang,
    sendReactivationEmail,
} from './userEmailService.js';

test('arDays covers the four Arabic number buckets', () => {
    assert.equal(arDays(1), 'يوم');
    assert.equal(arDays(2), 'يومان');
    assert.equal(arDays(3), 'أيام');
    assert.equal(arDays(10), 'أيام');
    assert.equal(arDays(11), 'يوماً');
});

test('arDaysCount folds the count into the dual', () => {
    assert.equal(arDaysCount(1), '1 يوم');
    // The dual carries the number inside the word — "2 يومان" would be wrong.
    assert.equal(arDaysCount(2), 'يومان');
    assert.equal(arDaysCount(7), '7 أيام');
    assert.equal(arDaysCount(30), '30 يوماً');
});

test('arQuestionsCount counts questions the same way', () => {
    assert.equal(arQuestionsCount(1), 'سؤال واحد');
    assert.equal(arQuestionsCount(2), 'سؤالان');
    assert.equal(arQuestionsCount(3), '3 أسئلة');
    assert.equal(arQuestionsCount(10), '10 أسئلة');
    assert.equal(arQuestionsCount(11), '11 سؤالاً');
    assert.equal(arQuestionsCount(40), '40 سؤالاً');
});

test('arMonthsCount counts months the same way', () => {
    assert.equal(arMonthsCount(1), 'شهر');
    assert.equal(arMonthsCount(2), 'شهران');
    assert.equal(arMonthsCount(4), '4 أشهر');
    assert.equal(arMonthsCount(14), '14 شهراً');
});

test('normalizeLang falls back to Arabic for anything unrecognised', () => {
    assert.equal(normalizeLang('en'), 'en');
    assert.equal(normalizeLang('en-GB'), 'en');
    assert.equal(normalizeLang('EN'), 'en');
    assert.equal(normalizeLang('ar'), 'ar');
    assert.equal(normalizeLang(null), 'ar');
    assert.equal(normalizeLang('fr'), 'ar');
});

test('the reactivation email refuses to send without a real remaining count', async () => {
    // Its whole argument is "you still have N questions". Rendering it with
    // no N, or with zero, produces a bare "come back" — which is the kind of
    // mail this campaign exists instead of.
    for (const bad of [undefined, 0, -1, NaN, 'seven']) {
        await assert.rejects(
            () => sendReactivationEmail('a@b.c', 'Test', 'medical', { remaining: bad }),
            /positive `remaining`/,
            `remaining=${String(bad)} should have been refused`
        );
    }
});
