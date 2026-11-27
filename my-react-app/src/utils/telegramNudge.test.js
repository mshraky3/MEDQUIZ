import test from 'node:test';
import assert from 'node:assert/strict';

// safeStorage looks for window when it loads, so the stub comes first.
const store = new Map();
let broken = false;
const guard = () => { if (broken) throw new Error('storage blocked'); };
globalThis.window = {
    localStorage: {
        getItem: (key) => { guard(); return store.has(key) ? store.get(key) : null; },
        setItem: (key, value) => { guard(); store.set(key, String(value)); },
        removeItem: (key) => { guard(); store.delete(key); },
    },
};

const load = (tag) => import(`./telegramNudge.js?${tag}`);

test('offers the student\'s own track, and nothing without a student or once done', async () => {
    const { telegramNudgeTrack } = await load('track');
    assert.equal(telegramNudgeTrack({ user: { track: 'nursing' }, done: false }), 'nursing');
    assert.equal(telegramNudgeTrack({ user: { track: 'dental' }, done: false }), 'dental');
    assert.equal(telegramNudgeTrack({ user: {}, done: false }), 'medical');
    assert.equal(telegramNudgeTrack({ user: null, done: false }), null);
    assert.equal(telegramNudgeTrack({ user: { track: 'nursing' }, done: true }), null);
});

test('dismissing or clicking is remembered in this browser, across reloads', async () => {
    store.clear();
    const first = await load('first');
    assert.equal(first.isTelegramNudgeDone(), false);
    first.markTelegramNudgeDone();
    assert.equal(first.isTelegramNudgeDone(), true);
    assert.equal(store.get(first.TELEGRAM_NUDGE_KEY), '1');
    const afterReload = await load('reload');
    assert.equal(afterReload.isTelegramNudgeDone(), true);
});

test('blocked storage never throws, and a dismissal still holds until reload', async () => {
    store.clear();
    broken = true;
    try {
        const nudge = await load('blocked');
        assert.equal(nudge.isTelegramNudgeDone(), false);
        assert.doesNotThrow(() => nudge.markTelegramNudgeDone());
        assert.equal(nudge.isTelegramNudgeDone(), true);
    } finally {
        broken = false;
    }
});
