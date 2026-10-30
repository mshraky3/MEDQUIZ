import test from 'node:test';
import assert from 'node:assert/strict';
import { refusesNewGoogleAccount } from './googleSignIn.js';

test('the website sign-up page may create accounts', () => {
    assert.equal(refusesNewGoogleAccount({ credential: 'x', track: 'medical' }), false);
    assert.equal(refusesNewGoogleAccount({ mode: 'signup' }), false);
    assert.equal(refusesNewGoogleAccount(), false);
});

test('the login page never creates accounts', () => {
    assert.equal(refusesNewGoogleAccount({ mode: 'login' }), true);
});

test('the Google Play app never creates accounts, even on its sign-up screen', () => {
    assert.equal(refusesNewGoogleAccount({ mode: 'signup', client: 'android-play' }), true);
    assert.equal(refusesNewGoogleAccount({ client: 'android-play' }), true);
});

test('an unknown client value changes nothing', () => {
    assert.equal(refusesNewGoogleAccount({ client: 'ios' }), false);
});
