/**
 * Tests for the theme helper (src/theme/theme.js).
 *
 * Run with `npm test` (node --test). Light must stay the default for anyone
 * who has not chosen otherwise, and a broken or blocked storage must never
 * stop the page from painting.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    THEME_STORAGE_KEY,
    normalizeThemePref,
    readThemePref,
    saveThemePref,
    resolveTheme,
    nextTheme,
    applyTheme,
} from './theme.js';

const memoryStorage = (initial = {}) => {
    const data = { ...initial };
    return {
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = String(v); },
        data,
    };
};

const throwingStorage = {
    getItem: () => { throw new Error('SecurityError'); },
    setItem: () => { throw new Error('QuotaExceededError'); },
};

test('defaults to light with nothing stored', () => {
    assert.equal(readThemePref(memoryStorage()), 'light');
    assert.equal(resolveTheme(readThemePref(memoryStorage()), true), 'light');
});

test('defaults to light with no storage at all', () => {
    assert.equal(readThemePref(null), 'light');
    assert.equal(readThemePref(undefined), 'light');
});

test('reads a saved choice', () => {
    assert.equal(readThemePref(memoryStorage({ [THEME_STORAGE_KEY]: 'dark' })), 'dark');
    assert.equal(readThemePref(memoryStorage({ [THEME_STORAGE_KEY]: 'light' })), 'light');
    assert.equal(readThemePref(memoryStorage({ [THEME_STORAGE_KEY]: 'system' })), 'system');
});

test('a bad stored value falls back to light', () => {
    for (const bad of ['Dark', 'night', '', '1', 'null', '{"theme":"dark"}']) {
        assert.equal(readThemePref(memoryStorage({ [THEME_STORAGE_KEY]: bad })), 'light', bad);
    }
    assert.equal(normalizeThemePref(undefined), 'light');
    assert.equal(normalizeThemePref(42), 'light');
});

test('storage that throws reads as light and saving reports failure', () => {
    assert.equal(readThemePref(throwingStorage), 'light');
    assert.equal(saveThemePref(throwingStorage, 'dark'), false);
    assert.equal(saveThemePref(null, 'dark'), false);
});

test('saving writes the normalized value', () => {
    const s = memoryStorage();
    assert.equal(saveThemePref(s, 'dark'), true);
    assert.equal(s.data[THEME_STORAGE_KEY], 'dark');
    saveThemePref(s, 'garbage');
    assert.equal(s.data[THEME_STORAGE_KEY], 'light');
});

test('"follow device" resolves from the device setting', () => {
    assert.equal(resolveTheme('system', true), 'dark');
    assert.equal(resolveTheme('system', false), 'light');
    assert.equal(resolveTheme('dark', false), 'dark');
    assert.equal(resolveTheme('light', true), 'light');
});

test('the navbar button flips light and dark', () => {
    assert.equal(nextTheme('light'), 'dark');
    assert.equal(nextTheme('dark'), 'light');
});

test('applyTheme sets data-theme, color-scheme and the browser colour', () => {
    const attrs = {};
    const meta = { content: '', setAttribute: (k, v) => { meta[k] = v; } };
    const doc = {
        documentElement: { style: {}, setAttribute: (k, v) => { attrs[k] = v; } },
        querySelector: () => meta,
    };
    applyTheme('dark', doc);
    assert.equal(attrs['data-theme'], 'dark');
    assert.equal(doc.documentElement.style.colorScheme, 'dark');
    assert.equal(meta.content, '#0b1220');
    applyTheme('anything-else', doc);
    assert.equal(attrs['data-theme'], 'light');
});
