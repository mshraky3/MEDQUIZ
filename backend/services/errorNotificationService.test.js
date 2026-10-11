/**
 * Tests for the base URL used by the links in error alert emails.
 *
 * The alert used to fall back to http://localhost:5173 when APP_URL was unset,
 * so production alerts linked to the reader's own machine. resolveAppUrl takes
 * the env as an argument so these tests never touch the real one.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppUrl } from './errorNotificationService.js';

const SITE = 'https://www.smle-question-bank.com';

test('falls back to the production site, never localhost, when APP_URL is unset', () => {
    assert.equal(resolveAppUrl({}), SITE);
    assert.equal(resolveAppUrl({ NODE_ENV: 'production' }), SITE);
    assert.equal(resolveAppUrl({ NODE_ENV: 'production', APP_URL: '   ' }), SITE);
});

test('uses APP_URL when it is set, without a trailing slash', () => {
    assert.equal(resolveAppUrl({ NODE_ENV: 'production', APP_URL: 'https://example.test/' }), 'https://example.test');
});

test('ignores a localhost APP_URL in production', () => {
    for (const url of ['http://localhost:5173', 'http://127.0.0.1:3000/', 'http://[::1]:5173']) {
        assert.equal(resolveAppUrl({ NODE_ENV: 'production', APP_URL: url }), SITE, url);
    }
});

test('keeps a localhost APP_URL outside production, for local development', () => {
    assert.equal(resolveAppUrl({ NODE_ENV: 'development', APP_URL: 'http://localhost:5173' }), 'http://localhost:5173');
});

test('does not treat a host that only starts with "localhost" as local', () => {
    assert.equal(
        resolveAppUrl({ NODE_ENV: 'production', APP_URL: 'https://localhost.example.com' }),
        'https://localhost.example.com'
    );
});
