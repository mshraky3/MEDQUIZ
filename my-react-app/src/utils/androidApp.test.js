import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanLink, androidAppConfig, isAndroidCardVisible } from './androidApp.js';

test('the card is hidden until both links are set', () => {
    assert.equal(isAndroidCardVisible(androidAppConfig({})), false);
    assert.equal(isAndroidCardVisible(androidAppConfig({ VITE_ANDROID_TESTER_URL: 'https://play.google.com/apps/testing/x' })), false);
    assert.equal(isAndroidCardVisible(androidAppConfig({ VITE_ANDROID_DOWNLOAD_URL: 'https://play.google.com/store/apps/details?id=x' })), false);
    assert.equal(isAndroidCardVisible(androidAppConfig({
        VITE_ANDROID_TESTER_URL: 'https://play.google.com/apps/testing/x',
        VITE_ANDROID_DOWNLOAD_URL: 'https://play.google.com/store/apps/details?id=x',
    })), true);
});

test('only https links count (no javascript:, http:, blanks or text)', () => {
    for (const bad of ['', '   ', 'javascript:alert(1)', 'http://play.google.com/x', 'play.google.com/x', 'https://a b', undefined, null]) {
        assert.equal(cleanLink(bad), '');
    }
    assert.equal(cleanLink('  https://play.google.com/x  '), 'https://play.google.com/x');
});

test('the free-month line needs exactly "true"', () => {
    assert.equal(androidAppConfig({ VITE_ANDROID_FREE_MONTH: 'true' }).freeMonth, true);
    for (const v of ['', 'false', '1', 'yes', 'TRUE ', undefined]) {
        assert.equal(androidAppConfig({ VITE_ANDROID_FREE_MONTH: v }).freeMonth, v === 'TRUE ' ? false : false);
    }
});
