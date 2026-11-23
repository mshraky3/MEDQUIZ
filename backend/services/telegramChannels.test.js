import test from 'node:test';
import assert from 'node:assert/strict';
import { channelFor, hasSeparateChannels, tracksOn, mainChannel } from './telegramChannels.js';

test('without track channels everything goes to the main channel', () => {
    const env = {};
    assert.equal(mainChannel(env), '@sqb_exam');
    for (const t of ['medical', 'nursing', 'dental', 'whatever']) assert.equal(channelFor(t, env), '@sqb_exam');
    assert.equal(hasSeparateChannels(env), false);
    assert.deepEqual(tracksOn('@sqb_exam', env), ['medical', 'nursing', 'dental']);
});

test('SNLE and SDLE channels are used when set, a junk value falls back to the main channel', () => {
    const env = { TELEGRAM_CHANNEL: '@sqb_exam', TELEGRAM_CHANNEL_SNLE: '@sqb_snle', TELEGRAM_CHANNEL_SDLE: 'not a channel' };
    assert.equal(channelFor('nursing', env), '@sqb_snle');
    assert.equal(channelFor('dental', env), '@sqb_exam');
    assert.equal(channelFor('medical', env), '@sqb_exam');
    assert.equal(hasSeparateChannels(env), true);
    assert.deepEqual(tracksOn('@sqb_exam', env), ['medical', 'dental']);
    assert.deepEqual(tracksOn('@sqb_snle', env), ['nursing']);
});

test('numeric channel ids are accepted', () => {
    const env = { TELEGRAM_CHANNEL_SDLE: '-1001234567890' };
    assert.equal(channelFor('dental', env), '-1001234567890');
});
