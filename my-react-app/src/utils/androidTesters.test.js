import test from 'node:test';
import assert from 'node:assert/strict';
import { looksLikeEmail, offerView, landingView, joinErrorKey } from './androidTesters.js';
import copy from '../i18n/copy/androidTesters.js';

test('email shape', () => {
    assert.equal(looksLikeEmail(' me@gmail.com '), true);
    for (const bad of ['', 'me', 'me@', 'me@gmail', 'a b@c.com']) assert.equal(looksLikeEmail(bad), false, bad);
});

test('the card view follows the server answer', () => {
    assert.equal(offerView(null), 'hidden');
    assert.equal(offerView({ success: false }), 'hidden');
    assert.equal(offerView({ success: true, left: 9, joined: false, reason: 'eligible' }), 'join');
    assert.equal(offerView({ success: true, left: 0, joined: false, reason: 'full' }), 'full');
    assert.equal(offerView({ success: true, left: 3, joined: true, redeemed: false }), 'joined');
    assert.equal(offerView({ success: true, left: 3, joined: true, redeemed: true }), 'redeemed');
    for (const reason of ['has_paid', 'active_subscription', 'grandfathered', 'already_granted', 'email_not_verified']) {
        assert.equal(offerView({ success: true, left: 5, joined: false, reason }), 'hidden', reason);
    }
});

test('landing: guests need the open public switch, members get their own answer', () => {
    const open = { success: true, open: true };
    assert.equal(landingView({ authReady: false, signedIn: false, publicState: open }), 'hidden');
    assert.equal(landingView({ authReady: true, signedIn: false, publicState: open }), 'guest');
    for (const publicState of [null, { success: false }, { success: true, open: false }]) {
        assert.equal(landingView({ authReady: true, signedIn: false, publicState }), 'hidden');
    }
    // A signed-in visitor never falls back to the guest offer.
    assert.equal(landingView({ authReady: true, signedIn: true, publicState: open, status: null }), 'hidden');
    assert.equal(landingView({ authReady: true, signedIn: true, status: { success: true, left: 2, reason: 'eligible' } }), 'join');
    assert.equal(landingView({ authReady: true, signedIn: true, status: { success: true, left: 2, reason: 'has_paid' } }), 'hidden');
});

test('every refusal reason has a message in Arabic and English', () => {
    const reasons = ['invalid_email', 'email_taken', 'full', 'already_joined', 'has_paid', 'something_new'];
    for (const lang of ['ar', 'en']) {
        for (const r of reasons) assert.ok(copy[lang].errors[joinErrorKey(r)], `${lang} ${r}`);
    }
});

test('Arabic and English copy have the same keys, brand is SQB, no emoji, no mention of ratings', () => {
    const shape = (o) => Object.keys(o).sort().map((k) => (typeof o[k] === 'object' ? `${k}{${shape(o[k])}}` : `${k}:${typeof o[k]}`)).join(',');
    assert.equal(shape(copy.ar), shape(copy.en));
    const text = JSON.stringify([copy.ar, copy.en]) + copy.ar.spots(3) + copy.en.spots(3);
    assert.ok(!/MEDQ|medq/i.test(text));
    assert.ok(!/another account|حساب آخر/i.test(JSON.stringify([copy.ar.errors.emailTaken, copy.en.errors.emailTaken])), 'neutral: never says who uses an address');
    assert.ok(!/\p{Extended_Pictographic}/u.test(text), 'no emoji');
    assert.ok(!/rating|review|تقييم|مراجعة/i.test(text), 'Play policy: nothing about ratings or reviews');
    assert.ok(!/\b15\b|١٥/.test(JSON.stringify([copy.ar, copy.en])), 'the seat count is never shown to students');
    assert.match(copy.en.spots(7), /Limited/);
});
