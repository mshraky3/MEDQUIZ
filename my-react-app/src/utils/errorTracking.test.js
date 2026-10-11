/**
 * Tests for the in-app-browser noise filter in errorTracking.js.
 *
 * Run with `npm test` (node --test). The filter has to drop the injected
 * "__alhWeb" error and nothing else, so most of these cases are the ones that
 * must STILL report.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { isInjectedInAppBrowserError } from './errorTracking.js';

const SAFARI_MSG = "ReferenceError: Can't find variable: __alhWeb";
const CHROME_MSG = 'Uncaught ReferenceError: __alhWeb is not defined';

test('drops the injected __alhWeb error with the observed stack shape', () => {
    assert.equal(isInjectedInAppBrowserError(SAFARI_MSG, 'global code@page:1:42'), true);
    assert.equal(
        isInjectedInAppBrowserError(SAFARI_MSG, 'global code@https://www.smle-question-bank.com/quizs:1:118'),
        true
    );
});

test('drops it when there is no stack at all', () => {
    assert.equal(isInjectedInAppBrowserError(SAFARI_MSG, undefined), true);
    assert.equal(isInjectedInAppBrowserError(SAFARI_MSG, ''), true);
});

test('drops the Chrome wording with a message-only stack', () => {
    assert.equal(isInjectedInAppBrowserError(CHROME_MSG, 'ReferenceError: __alhWeb is not defined'), true);
});

test('still reports when the same variable error comes from an SQB script', () => {
    assert.equal(
        isInjectedInAppBrowserError(SAFARI_MSG, 'global code@https://www.smle-question-bank.com/assets/index-abc123.js:1:42'),
        false
    );
    assert.equal(
        isInjectedInAppBrowserError(SAFARI_MSG, 'loadQuiz@https://www.smle-question-bank.com/assets/index-abc123.js:3:900\nglobal code@page:1:42'),
        false
    );
    assert.equal(
        isInjectedInAppBrowserError(
            CHROME_MSG,
            'ReferenceError: __alhWeb is not defined\n    at loadQuiz (https://www.smle-question-bank.com/assets/index-abc123.js:3:900)'
        ),
        false
    );
});

test('still reports a real ReferenceError in SQB code', () => {
    assert.equal(isInjectedInAppBrowserError("ReferenceError: Can't find variable: quizState", 'global code@page:1:42'), false);
    assert.equal(isInjectedInAppBrowserError('Uncaught ReferenceError: userId is not defined', ''), false);
});

test('does not match a variable that merely starts with the injected name', () => {
    assert.equal(isInjectedInAppBrowserError("ReferenceError: Can't find variable: __alhWebExtra", 'global code@page:1:1'), false);
});

test('ignores empty input', () => {
    assert.equal(isInjectedInAppBrowserError('', ''), false);
    assert.equal(isInjectedInAppBrowserError(undefined, undefined), false);
});
