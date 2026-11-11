import { describe, expect, it } from 'vitest';
import faqCopy from '../i18n/copy/faq.js';
import { PLAY_HIDDEN_FAQ_INDEXES, visibleFaqItems } from '../lib/playFaq';

describe('Play build FAQ', () => {
  it('hides exactly the price / group / renewal / how-to-subscribe questions', () => {
    const en = faqCopy.en.items as { question: string }[];
    const hidden = PLAY_HIDDEN_FAQ_INDEXES.map((i) => en[i].question);
    expect(hidden).toEqual([
      'How much does the subscription cost?',
      'Is there a group subscription for me and my friends?',
      'Does the subscription renew automatically?',
      'How do I subscribe?',
    ]);
  });

  it('the Arabic list has the same length so the indexes line up', () => {
    expect(faqCopy.ar.items.length).toBe(faqCopy.en.items.length);
  });

  it('the Play build shows no remaining answer with a riyal / SAR amount', () => {
    for (const lang of ['ar', 'en'] as const) {
      const shown = visibleFaqItems(faqCopy[lang].items as { question: string; answer: string }[], true);
      expect(shown.length).toBe(faqCopy[lang].items.length - PLAY_HIDDEN_FAQ_INDEXES.length);
      for (const item of shown) expect(item.answer).not.toMatch(/\b(SAR|ريال)\b|ريالاً/);
    }
  });

  it('a normal build keeps every question', () => {
    expect(visibleFaqItems([1, 2, 3], false)).toEqual([1, 2, 3]);
  });
});
