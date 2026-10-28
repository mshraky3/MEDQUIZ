import { describe, expect, it } from 'vitest';
import { accountAccess, needsSubscription } from '../lib/subscriptionState';

describe('what the Play build says about an account', () => {
  it('null remaining means full access (paid, granted, grandfathered, enforcement off)', () => {
    expect(accountAccess({ free_questions_remaining: null })).toBe('subscriber');
    expect(accountAccess({})).toBe('subscriber');
    expect(accountAccess(null)).toBe('subscriber');
    expect(needsSubscription({ free_questions_remaining: null })).toBe(false);
  });

  it('a number is the free tier; zero is spent', () => {
    expect(accountAccess({ free_questions_remaining: 7 })).toBe('free');
    expect(accountAccess({ free_questions_remaining: 1 })).toBe('free');
    expect(accountAccess({ free_questions_remaining: 0 })).toBe('free_spent');
    expect(accountAccess({ free_questions_remaining: -2 })).toBe('free_spent');
    expect(needsSubscription({ free_questions_remaining: 0 })).toBe(true);
  });
});

describe('Play build copy stays neutral', async () => {
  const { default: appCopy } = await import('../i18n/appCopy');
  const strings = (o: unknown): string[] =>
    typeof o === 'string'
      ? [o]
      : typeof o === 'function'
        ? [String((o as (n: number) => string)(3))]
        : o && typeof o === 'object'
          ? Object.values(o as object).flatMap(strings)
          : [];

  it('no price, currency or payment-provider words in the Play screens (both languages)', () => {
    for (const lang of ['ar', 'en'] as const) {
      const text = [...strings(appCopy[lang].playAccess), ...strings(appCopy[lang].webAccount)].join(' ');
      expect(text).not.toMatch(/SAR|ريال|Moyasar|ميسر|\d{2,}\s*(SAR|ر\.س)|https?:|www\./i);
    }
  });
});
