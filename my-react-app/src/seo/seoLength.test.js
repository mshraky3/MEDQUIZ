import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPrerenderRoutes } from './siteMetadata.js';
import { buildPublicQuestionRoutes } from './publicQuestions.js';
import { fitText } from './fitText.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const payload = JSON.parse(fs.readFileSync(path.join(here, 'data/publicQuestions.json'), 'utf8'));

const allSeo = () => {
  const out = [];
  for (const lang of ['ar', 'en']) {
    for (const r of getPrerenderRoutes(lang)) out.push({ lang, ...r.seo, path: r.path });
    for (const r of buildPublicQuestionRoutes(payload, { lang })) out.push({ lang, ...r.seo, path: r.path });
  }
  return out;
};

test('fitText cuts at a word boundary and never leaves a mid-title ellipsis', () => {
  const long = 'A 28-year-old woman presented to the clinic with 2-month history of pain and swelling in the hand joints with…';
  const t = fitText(long, 40);
  assert.ok(t.length <= 40);
  assert.ok(!t.includes('…'));
  assert.ok(long.startsWith(t));
  assert.ok(!t.endsWith(' '));
  const d = fitText(long, 60, { ellipsis: true });
  assert.ok(d.length <= 60 && d.endsWith('…'));
});

test('no generated title is longer than 70 characters', () => {
  const seo = allSeo();
  assert.ok(seo.length > 50, `expected many routes, got ${seo.length}`);
  for (const s of seo) {
    assert.ok(s.title.length <= 70, `${s.path} title is ${s.title.length} chars: ${s.title}`);
    assert.ok(!s.title.includes('…'), `${s.path} title has an ellipsis`);
  }
});

test('no generated description is longer than 160 characters', () => {
  for (const s of allSeo()) {
    assert.ok(s.description.length <= 160, `${s.path} description is ${s.description.length} chars`);
  }
});
