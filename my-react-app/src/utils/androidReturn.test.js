import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.window = {
    localStorage: {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => { store.set(k, String(v)); },
        removeItem: (k) => { store.delete(k); },
    },
};
globalThis.localStorage = globalThis.window.localStorage;

const {
    rememberAndroidReturn, hasAndroidReturn, takeAndroidReturn, clearAndroidReturn,
    ANDROID_RETURN_TTL_MS, ANDROID_SIGNUP_PATH,
} = await import('./androidReturn.js');

test('signup comes back to the landing section, in the reader\'s language, once', () => {
    assert.equal(ANDROID_SIGNUP_PATH, '/signup?next=android-testers');
    rememberAndroidReturn('android-testers');
    assert.equal(takeAndroidReturn('ar'), '/#android-testers');
    assert.equal(takeAndroidReturn('ar'), null, 'one use');
    rememberAndroidReturn('android-testers');
    assert.equal(takeAndroidReturn('en'), '/en#android-testers');
});

test('only our own value is remembered: no open redirect', () => {
    for (const next of [null, '', '/admin', 'https://evil.example', 'android-testers/../x']) {
        rememberAndroidReturn(next);
        assert.equal(hasAndroidReturn(), false, String(next));
    }
});

test('it expires and can be cleared', () => {
    rememberAndroidReturn('android-testers', 1000);
    assert.equal(hasAndroidReturn(1000 + ANDROID_RETURN_TTL_MS - 1), true);
    assert.equal(hasAndroidReturn(1000 + ANDROID_RETURN_TTL_MS), false);
    assert.equal(takeAndroidReturn('ar', 1000 + ANDROID_RETURN_TTL_MS), null);
    rememberAndroidReturn('android-testers');
    clearAndroidReturn();
    assert.equal(takeAndroidReturn('ar'), null);
});
