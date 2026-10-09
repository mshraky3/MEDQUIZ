import test from 'node:test';
import assert from 'node:assert/strict';
import { isDisposableEmail, emailDomain } from './disposableEmail.js';

test('blocks known throwaway domains, case-insensitively and on subdomains', () => {
    assert.equal(isDisposableEmail('4d249b4782@emailnox.live'), true);
    assert.equal(isDisposableEmail('X@MAILINATOR.COM'), true);
    assert.equal(isDisposableEmail('a@sub.mailinator.com'), true);
    assert.equal(isDisposableEmail('  a@yopmail.com '), true);
});

test('lets real providers and look-alikes through', () => {
    for (const e of ['a@gmail.com', 'a@hotmail.com', 'a@student.um.edu.sa', 'a@icloud.com', 'a@notmailinator.com', 'a@mailinator.com.sa']) {
        assert.equal(isDisposableEmail(e), false, e);
    }
});

test('handles missing or malformed input', () => {
    assert.equal(isDisposableEmail(''), false);
    assert.equal(isDisposableEmail(undefined), false);
    assert.equal(isDisposableEmail('no-at-sign'), false);
    assert.equal(emailDomain('a@B.com'), 'b.com');
});
