import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { telegramUrl, trackForPath, trackTelegramHtml } from './telegramChannels.js';
import copy from '../i18n/copy/telegramCard.js';
import { buildCollections, collectionPageHtml } from '../seo/pastPapers.js';
import { buildPublicQuestionRoutes } from '../seo/publicQuestions.js';
import { buildExamRoutes } from '../seo/examGuides.js';

const payload = JSON.parse(fs.readFileSync(new URL('../seo/data/publicQuestions.json', import.meta.url), 'utf8'));

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

test('the prerendered box exists for nursing and dental only', () => {
    assert.equal(trackTelegramHtml('medical', copy.ar), '');
    assert.match(trackTelegramHtml('nursing', copy.ar), /t\.me\/sqb_snle/);
    assert.match(trackTelegramHtml('dental', copy.en), /t\.me\/sqb_sdle/);
});

test('prerendered SNLE and SDLE past-paper pages link their channel and offer the free questions', () => {
    const { collections } = buildCollections(payload);
    for (const lang of ['ar', 'en']) {
        for (const c of collections) {
            const html = collectionPageHtml(c, collections, lang);
            if (c.track === 'medical') {
                assert.ok(!/sqb_snle|sqb_sdle/.test(html), c.slug);
                continue;
            }
            assert.ok(html.includes(telegramUrl(c.track)), `${c.slug} ${lang} channel`);
            // A signup button comes before any long list of samples.
            const button = html.indexOf('pq-cta-btn');
            assert.ok(button > 0, c.slug);
            if (c.samples.length) assert.ok(button < html.indexOf('<ol class="pq-list">'), `${c.slug} button above the list`);
        }
    }
});

test('prerendered nursing question and SNLE exam pages link @sqb_snle, medicine pages do not', () => {
    for (const lang of ['ar', 'en']) {
        for (const route of [...buildPublicQuestionRoutes(payload, { lang }), ...buildExamRoutes({ lang })]) {
            const nursing = trackForPath(route.path) === 'nursing';
            assert.equal(route.html.includes('t.me/sqb_snle'), nursing, route.path);
        }
    }
});
