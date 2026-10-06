import { describe, expect, it } from 'vitest';
import appCopy from '@/i18n/appCopy';
import account from '@/i18n/copy/account.js';
import analysis from '@/i18n/copy/analysis.js';
import auth from '@/i18n/copy/auth.js';
import common from '@/i18n/copy/common.js';
import examGuides from '@/i18n/copy/examGuides.js';
import faq from '@/i18n/copy/faq.js';
import groups from '@/i18n/copy/groups.js';
import guides from '@/i18n/copy/guides.js';
import landing from '@/i18n/copy/landing.js';
import legal from '@/i18n/copy/legal.js';
import nationalDay from '@/i18n/copy/nationalDay.js';
import pastPapers from '@/i18n/copy/pastPapers.js';
import publicQuestions from '@/i18n/copy/publicQuestions.js';
import quiz from '@/i18n/copy/quiz.js';
import successStories from '@/i18n/copy/successStories.js';
import summaries from '@/i18n/copy/summaries.js';
import support from '@/i18n/copy/support.js';

const FILES: Record<string, any> = {
  appCopy, account, analysis, auth, common, examGuides, faq, groups, guides, landing, legal, nationalDay, pastPapers, publicQuestions, quiz, successStories, summaries, support,
};

/** Every leaf path with a coarse type, so Arabic and English can be compared shape for shape. */
function shape(node: unknown, path = '', out: Record<string, string> = {}): Record<string, string> {
  if (typeof node === 'function') out[path] = 'fn';
  else if (Array.isArray(node)) {
    out[path] = `array(${node.length})`;
    node.forEach((item, i) => shape(item, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) shape(v, path ? `${path}.${k}` : k, out);
  } else out[path] = typeof node;
  return out;
}

describe('copy files are complete in both languages', () => {
  for (const [name, copy] of Object.entries(FILES)) {
    it(`${name}: ar and en have the same keys, types and list lengths`, () => {
      expect(Object.keys(copy).sort(), `${name} languages`).toEqual(['ar', 'en']);
      const ar = shape(copy.ar);
      const en = shape(copy.en);
      const onlyAr = Object.keys(ar).filter((k) => !(k in en));
      const onlyEn = Object.keys(en).filter((k) => !(k in ar));
      expect({ onlyAr, onlyEn }).toEqual({ onlyAr: [], onlyEn: [] });
      const mismatched = Object.keys(ar).filter((k) => ar[k] !== en[k]);
      expect(mismatched.map((k) => `${k}: ar=${ar[k]} en=${en[k]}`)).toEqual([]);
    });
  }

  it('no string is left empty or as a placeholder', () => {
    const bad: string[] = [];
    const walk = (node: unknown, path: string) => {
      if (typeof node === 'string') {
        if (/\b(TODO|FIXME|lorem ipsum|undefined|\[object Object\])\b/i.test(node)) bad.push(path);
      } else if (Array.isArray(node)) node.forEach((n, i) => walk(n, `${path}[${i}]`));
      else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    };
    for (const [name, copy] of Object.entries(FILES)) walk(copy, name);
    expect(bad).toEqual([]);
  });

  it('the brand is always written SQB', () => {
    const offenders: string[] = [];
    const walk = (node: unknown, path: string) => {
      if (typeof node === 'string') {
        if (/\bMEDQUIZ\b|\bMedQuiz\b|\bMedQiz\b/i.test(node)) offenders.push(`${path}: ${node.slice(0, 60)}`);
      } else if (Array.isArray(node)) node.forEach((n, i) => walk(n, `${path}[${i}]`));
      else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    };
    for (const [name, copy] of Object.entries(FILES)) walk(copy, name);
    expect(offenders).toEqual([]);
  });
});
