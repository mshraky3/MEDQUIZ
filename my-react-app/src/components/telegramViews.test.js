/**
 * The Telegram placements rendered to static markup, signed out and signed in.
 * Vite compiles the JSX; nothing is fetched and no browser is involved, so this
 * covers what is drawn, not clicks.
 */
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../..', import.meta.url));
let vite;
let mod;

before(async () => {
    vite = await createServer({
        root,
        configFile: fileURLToPath(new URL('../../vite.config.js', import.meta.url)),
        appType: 'custom',
        logLevel: 'error',
        server: { middlewareMode: true, hmr: false, watch: null },
        optimizeDeps: { noDiscovery: true, include: [] },
        // Without module-sync Vite resolves the router to its CommonJS build.
        ssr: { resolve: { externalConditions: ['module-sync', 'node'] } },
    });
    const load = (path) => vite.ssrLoadModule(path);
    mod = {
        UserContext: (await load('/src/UserContext.jsx')).UserContext,
        LanguageContext: (await load('/src/i18n/LanguageContext.jsx')).LanguageContext,
        Card: (await load('/src/components/landing/TelegramCard.jsx')).default,
        Hub: (await load('/src/components/telegram/TelegramHub.jsx')).default,
        Nudge: (await load('/src/components/Quiz/ResultTelegramNudge.jsx')).default,
        Contact: (await load('/src/components/contact/Contact.jsx')).default,
    };
});

after(async () => { await vite?.close(); });

const render = (element, { user = null, lang = 'ar' } = {}) => renderToStaticMarkup(
    React.createElement(MemoryRouter, null,
        React.createElement(mod.LanguageContext.Provider, { value: { lang, dir: lang === 'ar' ? 'rtl' : 'ltr' } },
            React.createElement(mod.UserContext.Provider, { value: { user } }, element)))
);
const channelLinks = (html) => [...html.matchAll(/href="https:\/\/t\.me\/(sqb_[a-z]+)"/g)].map((m) => m[1]);

test('landing card, signed out: a choice of the three channels', () => {
    const html = render(React.createElement(mod.Card));
    assert.deepEqual(channelLinks(html), ['sqb_exam', 'sqb_snle', 'sqb_sdle']);
    assert.match(html, /طب<\/span> <span class="tgc-choice-exam">SMLE/);
});

test('landing card, signed in: one button for the track and a link to the hub', () => {
    const html = render(React.createElement(mod.Card), { user: { track: 'nursing' } });
    assert.deepEqual(channelLinks(html), ['sqb_snle']);
    assert.match(html, /class="tgc-hub-link" href="\/telegram"/);
});

test('hub: equal choices signed out; the own track first and marked when signed in', () => {
    const anonymous = render(React.createElement(mod.Hub));
    assert.deepEqual(channelLinks(anonymous), ['sqb_exam', 'sqb_snle', 'sqb_sdle']);
    assert.ok(!anonymous.includes('tgh-badge') && !anonymous.includes('tgh-card--other'));

    const dental = render(React.createElement(mod.Hub), { user: { track: 'dental' }, lang: 'en' });
    assert.deepEqual(channelLinks(dental), ['sqb_sdle', 'sqb_exam', 'sqb_snle']);
    assert.equal(dental.split('tgh-badge').length - 1, 1);
    assert.ok(dental.indexOf('Your channel') < dental.indexOf('sqb_sdle'));
    assert.equal(dental.split('tgh-card--other').length - 1, 2);
});

test('result nudge: the student\'s own channel, closable; absent when blocked or signed out', () => {
    const html = render(React.createElement(mod.Nudge, { user: { track: 'nursing' } }));
    assert.deepEqual(channelLinks(html), ['sqb_snle']);
    assert.match(html, /aria-label="إغلاق"/);
    assert.equal(render(React.createElement(mod.Nudge, { user: { track: 'nursing' }, blocked: true })), '');
    assert.equal(render(React.createElement(mod.Nudge, { user: null })), '');
});

test('result nudge sits under the result actions, and no paywall or running-quiz screen has it', () => {
    const read = (rel) => fs.readFileSync(new URL(rel, import.meta.url), 'utf8');
    const result = read('./Quiz/Result.jsx');
    assert.ok(result.indexOf('<ResultTelegramNudge') > result.indexOf('className="result-buttons"'));
    assert.ok(result.indexOf('<ResultTelegramNudge') < result.indexOf('className="result-review"'));
    for (const file of ['./Quiz/QUIZ.jsx', './Quiz/Question.jsx', './Quiz/AllowanceSpent.jsx', './exam/ExamRunner.jsx']) {
        assert.ok(!read(file).includes('TelegramNudge'), file);
    }
});

test('contact page lists the three channels, own track first, and links the hub', () => {
    const html = render(React.createElement(mod.Contact), { user: { track: 'nursing' } });
    assert.deepEqual(channelLinks(html), ['sqb_snle', 'sqb_exam', 'sqb_sdle']);
    assert.match(html, /href="\/telegram"/);
});
