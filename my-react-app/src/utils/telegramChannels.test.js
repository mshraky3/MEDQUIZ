import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { orderedChannels, telegramUrl, trackForPath, trackTelegramHtml } from './telegramChannels.js';
import copy from '../i18n/copy/telegramCard.js';
import { buildCollections, buildPastPaperRoutes, collectionPageHtml } from '../seo/pastPapers.js';
import { buildPublicQuestionRoutes } from '../seo/publicQuestions.js';
import { buildExamRoutes } from '../seo/examGuides.js';

const payload = JSON.parse(fs.readFileSync(new URL('../seo/data/publicQuestions.json', import.meta.url), 'utf8'));
const channelsIn = (html) => [...new Set(html.match(/https:\/\/t\.me\/sqb_[a-z]+/g) || [])];

test('each track has its own channel; unknown falls back to the main one', () => {
    assert.equal(telegramUrl('medical'), 'https://t.me/sqb_exam');
    assert.equal(telegramUrl('nursing'), 'https://t.me/sqb_snle');
    assert.equal(telegramUrl('dental'), 'https://t.me/sqb_sdle');
    assert.equal(telegramUrl(undefined), 'https://t.me/sqb_exam');
});

test('the track of a public page, in both languages', () => {
    for (const [path, track] of [
        ['/past-papers/snle-confirmed', 'nursing'], ['/en/past-papers/sdle-core', 'dental'],
        ['/past-papers/smle-midgard', 'medical'], ['/exams/snle', 'nursing'], ['/en/exams/snle/eligibility', 'nursing'],
        ['/exams/smle', 'medical'], ['/questions/nursing-fundamentals', 'nursing'],
        ['/en/questions/medical-surgical-nursing/some-slug', 'nursing'],
        // A medicine question whose slug mentions nursing is still medicine.
        ['/questions/medicine/nursing-home-resident', null],
        ['/', null], ['/past-papers', null], ['/exams', null],
    ]) assert.equal(trackForPath(path), track, path);
});

test('the prerendered box exists for each track and not for a page without one', () => {
    for (const none of [null, undefined, '', 'mixed', 'toString']) assert.equal(trackTelegramHtml(none, copy.ar), '');
    assert.match(trackTelegramHtml('medical', copy.ar), /t\.me\/sqb_exam"/);
    assert.match(trackTelegramHtml('medical', copy.ar), /SMLE/);
    assert.match(trackTelegramHtml('nursing', copy.ar), /t\.me\/sqb_snle/);
    assert.match(trackTelegramHtml('dental', copy.en), /t\.me\/sqb_sdle/);
});

test('every prerendered past-paper page links its own channel only; the tracks without a trial offer free questions', () => {
    const { collections } = buildCollections(payload);
    for (const lang of ['ar', 'en']) {
        for (const c of collections) {
            const html = collectionPageHtml(c, collections, lang);
            assert.deepEqual(channelsIn(html), [telegramUrl(c.track)], `${c.slug} ${lang} channel`);
            if (c.track === 'medical') continue;
            // A signup button comes before any long list of samples.
            const button = html.indexOf('pq-cta-btn');
            assert.ok(button > 0, c.slug);
            if (c.samples.length) assert.ok(button < html.indexOf('<ol class="pq-list">'), `${c.slug} button above the list`);
        }
    }
});

test('prerendered question pages link their track, and the mixed library hub links /telegram', () => {
    for (const lang of ['ar', 'en']) {
        const hubHref = `href="${lang === 'en' ? '/en' : ''}/telegram"`;
        for (const route of buildPublicQuestionRoutes(payload, { lang })) {
            if (/\/questions$/.test(route.path)) {
                assert.deepEqual(channelsIn(route.html), [], route.path);
                assert.ok(route.html.includes(hubHref), route.path);
                continue;
            }
            const track = trackForPath(route.path) === 'nursing' ? 'nursing' : 'medical';
            assert.deepEqual(channelsIn(route.html), [telegramUrl(track)], route.path);
        }
    }
});

test('prerendered exam pages link their exam channel; shared exam pages link /telegram', () => {
    for (const lang of ['ar', 'en']) {
        const hubHref = `href="${lang === 'en' ? '/en' : ''}/telegram"`;
        const seen = new Set();
        for (const route of buildExamRoutes({ lang })) {
            const track = trackForPath(route.path);
            seen.add(track);
            assert.deepEqual(channelsIn(route.html), track ? [telegramUrl(track)] : [], route.path);
            assert.equal(route.html.includes(hubHref), !track, route.path);
        }
        assert.deepEqual([...seen].sort(), [null, 'medical', 'nursing'].sort());
    }
});

test('the past-papers hub, about every track, links /telegram', () => {
    for (const lang of ['ar', 'en']) {
        const hub = buildPastPaperRoutes(payload, { lang }).find((r) => /\/past-papers$/.test(r.path));
        assert.ok(hub.html.includes(`href="${lang === 'en' ? '/en' : ''}/telegram"`), lang);
        assert.deepEqual(channelsIn(hub.html), []);
    }
});

test('the channel list keeps its order for a visitor and puts a student\'s own track first', () => {
    assert.deepEqual(orderedChannels().map((c) => c.track), ['medical', 'nursing', 'dental']);
    assert.ok(orderedChannels().every((c) => !c.own));
    assert.ok(orderedChannels('pharmacy').every((c) => !c.own));
    assert.deepEqual(orderedChannels('dental').map((c) => [c.track, c.own]), [['dental', true], ['medical', false], ['nursing', false]]);
    assert.deepEqual(orderedChannels('nursing')[0], {
        track: 'nursing', exam: 'SNLE', handle: '@sqb_snle', url: 'https://t.me/sqb_snle', own: true,
    });
});
