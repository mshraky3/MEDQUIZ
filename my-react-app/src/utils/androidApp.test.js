import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanLink, androidAppConfig, testerSteps } from './androidApp.js';
import copy from '../i18n/copy/androidTesters.js';

test('only https links count (no javascript:, http:, blanks or text)', () => {
    for (const bad of ['', '   ', 'javascript:alert(1)', 'http://play.google.com/x', 'play.google.com/x', 'https://a b', undefined, null]) {
        assert.equal(cleanLink(bad), '');
        assert.equal(androidAppConfig({ VITE_ANDROID_GROUP_URL: bad }).groupUrl, '');
    }
    assert.equal(cleanLink('  https://play.google.com/x  '), 'https://play.google.com/x');
});

test('without a group link the steps say the e-mail is added by hand', () => {
    for (const lang of ['ar', 'en']) {
        const steps = testerSteps(androidAppConfig({ VITE_ANDROID_TESTER_URL: 'https://play.google.com/apps/testing/x' }), copy[lang]);
        assert.deepEqual(steps.map((s) => s.key), ['wait', 'optin', 'install']);
        assert.equal(steps[0].href, '');
        assert.equal(steps[0].text, copy[lang].stepsManual.wait);
        assert.equal(steps[1].text, copy[lang].stepsManual.optIn);
    }
    assert.match(copy.en.stepsManual.wait, /by hand, usually within a day/);
});

test('with a group link: join the group, accept the test, install', () => {
    const config = androidAppConfig({
        VITE_ANDROID_GROUP_URL: 'https://groups.google.com/g/example',
        VITE_ANDROID_TESTER_URL: 'https://play.google.com/apps/testing/x',
        VITE_ANDROID_DOWNLOAD_URL: 'https://play.google.com/store/apps/details?id=x',
    });
    const steps = testerSteps(config, copy.en);
    assert.deepEqual(steps.map((s) => s.key), ['group', 'optin', 'install']);
    assert.deepEqual(steps.map((s) => s.href), [config.groupUrl, config.testerUrl, config.downloadUrl]);
    assert.ok(!JSON.stringify(steps).includes('by hand'));
});

test('a missing test link is said, never drawn as a dead button', () => {
    const [, optIn] = testerSteps(androidAppConfig({}), copy.en);
    assert.equal(optIn.href, '');
    assert.equal(optIn.missing, copy.en.noLink);
});
