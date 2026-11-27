import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getPrerenderRoutes, getSeoConfig } from './siteMetadata.js';
import { siteFooterNavHtml } from './prerenderHtml.js';
import { hasEnglishTwin, pathForLang } from './locales.js';
import hubCopy from '../i18n/copy/telegramHub.js';
import cardCopy from '../i18n/copy/telegramCard.js';

const read = (rel) => fs.readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const SITE = 'https://www.smle-question-bank.com';

test('/telegram is prerendered in both languages with all three channels', () => {
    for (const [lang, path, dir] of [['ar', '/telegram', 'rtl'], ['en', '/en/telegram', 'ltr']]) {
        const route = getPrerenderRoutes(lang).find((r) => r.path === path);
        assert.ok(route, path);
        assert.ok(route.html.includes(`dir="${dir}"`), path);
        for (const handle of ['sqb_exam', 'sqb_snle', 'sqb_sdle']) {
            assert.ok(route.html.includes(`href="https://t.me/${handle}"`), `${path} ${handle}`);
        }
        assert.ok(route.html.includes(hubCopy[lang].title));
        assert.equal(route.seo.url, `${SITE}${path}`);
        assert.equal(route.seo.lang, lang);
        assert.equal(route.seo.title, hubCopy[lang].meta.title);
        assert.equal(route.seo.description, hubCopy[lang].meta.description);
        assert.ok(!route.seo.robots.includes('noindex'));
        assert.deepEqual(route.seo.alternates.map((a) => a.href), [`${SITE}/telegram`, `${SITE}/en/telegram`, `${SITE}/telegram`]);
        assert.ok(route.seo.structuredData.every((item) => !JSON.stringify(item).includes(lang === 'en' ? 'ar-SA' : '/en/')));
    }
    assert.ok(hasEnglishTwin('/telegram'));
    assert.equal(pathForLang('/telegram?utm_source=x', 'en'), '/en/telegram?utm_source=x');
    assert.equal(getSeoConfig('/en/telegram').url, `${SITE}/en/telegram`);
});

test('/tg is a temporary redirect to /telegram that adds nothing to the query', () => {
    const vercel = JSON.parse(read('vercel.json'));
    // Vercel carries the visitor's own query string over to a destination
    // without one, so utm_source reaches captureTouch() on the hub.
    assert.deepEqual(vercel.redirects.find((r) => r.source === '/tg'), { source: '/tg', destination: '/telegram', permanent: false });
});

test('the router, sitemap hints and both footers know the hub', () => {
    assert.match(read('src/main.jsx'), /pub\('\/telegram', <TelegramHub \/>\)/);
    assert.match(read('scripts/postbuild-seo.mjs'), /'\/telegram': \{ priority/);
    assert.match(siteFooterNavHtml('ar'), /href="\/telegram"/);
    assert.match(siteFooterNavHtml('en'), /href="\/en\/telegram"/);
    assert.match(read('src/components/common/Footer.jsx'), /to: TELEGRAM_HUB_PATH/);
});

/** Every string in a copy tree, functions called with an exam name. */
const strings = (value) => {
    if (typeof value === 'string') return [value];
    if (typeof value === 'function') return [value('SNLE')];
    return Object.values(value).flatMap(strings);
};
const shape = (value) => (value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
    : typeof value);

test('Telegram copy comes in matching ar/en pairs that do not mix languages', () => {
    for (const copy of [hubCopy, cardCopy]) {
        assert.deepEqual(shape(copy.ar), shape(copy.en));
        for (const s of strings(copy.en)) assert.ok(!/[\u0600-\u06FF]/.test(s), s);
        // Latin script in Arabic text: only the brand and proper names.
        for (const s of strings(copy.ar)) {
            assert.ok(!/[A-Za-z]/.test(s.replace(/SQB|SMLE|SNLE|SDLE|Prometric/g, '')), s);
        }
    }
});

test('Telegram copy makes no count, recall or affiliation claim', () => {
    const all = [...strings(hubCopy), ...strings(cardCopy)].join('\n');
    assert.ok(!/\d{2,}|[\u0660-\u0669]/.test(all), 'no numbers');
    assert.ok(!/subscriber|recall|real exam|مشترك|تجميعات|المسربة/i.test(all));
    assert.match(hubCopy.en.note, /not affiliated/);
});
