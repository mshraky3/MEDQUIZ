/**
 * Owner rule, 27 Nov 2026: the independence / not-affiliated / "not the
 * official exam" statement lives ONLY in the legal terms the user accepts
 * (the /terms page and the short Terms popup in auth.js) and in the website
 * footer. This test fails if it is dropped from either, or added anywhere else.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import legalCopy from './copy/legal.js';
import authCopy from './copy/auth.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const STATEMENT = /not affiliated|not connected to any official|independent (educational |practice )?(platform|tool)|not the official exam|do not represent the actual exam|غير تابع|ليست تابعة|لسنا تابعين|ولا ترتبط بأي جهة|منصة (تعليمية )?مستقلة|أداة تدريب مستقلة|ليست الاختبار الرسمي|(SCFHS|الهيئة)[^'"`\n]{0,80}(publishes? past|أوراق اختبارات)/i;

test('the accepted terms carry the statement in both languages', () => {
    for (const lang of ['ar', 'en']) {
        const page = JSON.stringify(legalCopy[lang].terms);
        const popup = JSON.stringify(authCopy[lang].terms);
        for (const text of [page, popup]) {
            assert.match(text, STATEMENT);
            assert.match(text, /SCFHS/);
            assert.match(text, /Prometric/);
        }
    }
    assert.match(JSON.stringify(legalCopy.en.terms), /not the official exam/);
    assert.match(JSON.stringify(legalCopy.ar.terms), /ليست الاختبار الرسمي/);
});

test('the website footer carries the statement in both languages', () => {
    // common.js imports a React hook, so read it as text.
    const lines = read('src/i18n/common.js').split('\n').filter((l) => /^\s*disclaimer:/.test(l));
    assert.equal(lines.length, 2);
    for (const line of lines) {
        assert.match(line, STATEMENT);
        assert.match(line, /Prometric/);
    }
    assert.match(read('src/components/common/Footer.jsx'), /t\.footer\.disclaimer/);
});

test('sign-up needs the terms checkbox, and Google sign-up needs the terms popup', () => {
    const signup = read('src/components/signup/Signup.jsx');
    assert.match(signup, /if \(!termsAgreed\)/);
    assert.match(signup, /to="\/terms"/);
    assert.match(signup, /!termsChecked \|\| !oauthSession/);
    assert.match(signup, /\/accept-terms/);
});

test('the statement is not repeated anywhere else', () => {
    // Terms live in legal.js and auth.js (each checked below), the footer in common.js.
    const allowed = new Set(['src/i18n/common.js', 'src/i18n/copy/legal.js', 'src/i18n/copy/auth.js']);
    const files = ['index.html', 'scripts/postbuild-seo.mjs'];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
            const rel = `${dir}/${entry.name}`;
            if (entry.isDirectory()) {
                if (entry.name !== 'content' && entry.name !== 'data') walk(rel);
            } else if (/\.(jsx?|mjs|html)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
                files.push(rel);
            }
        }
    };
    walk('src');
    const offenders = files.filter((rel) => !allowed.has(rel) && STATEMENT.test(read(rel)));
    assert.deepEqual(offenders, []);

    // Inside legal.js: the terms only (not About, Privacy or Refund).
    for (const lang of ['ar', 'en']) {
        for (const [name, doc] of Object.entries(legalCopy[lang])) {
            if (name !== 'terms') assert.doesNotMatch(JSON.stringify(doc), STATEMENT, `${lang}.${name}`);
        }
        const { terms, ...rest } = authCopy[lang];
        assert.ok(terms);
        const restText = Object.values(rest).map((v) => JSON.stringify(v)).join('\n');
        assert.doesNotMatch(restText, STATEMENT, `auth.${lang} outside the terms popup`);
    }
});
