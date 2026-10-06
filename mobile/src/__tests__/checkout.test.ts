import { describe, expect, it } from 'vitest';
import {
  MOYASAR_CSS,
  MOYASAR_JS,
  buildCheckoutHtml,
  choosePlan,
  isAllowedCheckoutUrl,
  isCallbackUrl,
  isCheckoutAvailable,
  isTestKey,
  parseCallbackUrl,
  planOffer,
  safeNextPath,
  savingsFor,
  scriptSafeJson,
  type CheckoutInit,
  type Plan,
} from '@/features/subscribe/checkout';

const PLANS: Plan[] = [
  { id: 'monthly', months: 1, priceHalalas: 4900 },
  { id: 'four_month', months: 4, priceHalalas: 12900 },
  { id: 'annual', months: 12, priceHalalas: 29900, compareAtHalalas: 39900 },
];

describe('isCheckoutAvailable', () => {
  it('needs payments on, a publishable key and at least one plan', () => {
    const ok = { enabled: true, publishableKey: 'pk_x', plans: PLANS };
    expect(isCheckoutAvailable(ok)).toBe(true);
    expect(isCheckoutAvailable({ ...ok, enabled: false })).toBe(false);
    expect(isCheckoutAvailable({ ...ok, publishableKey: null })).toBe(false);
    expect(isCheckoutAvailable({ ...ok, plans: [] })).toBe(false);
    expect(isCheckoutAvailable(null)).toBe(false);
    expect(isCheckoutAvailable(undefined)).toBe(false);
  });
});

describe('planOffer', () => {
  it('only reports an offer when the server sent a genuinely higher former price', () => {
    expect(planOffer(PLANS[2])).toEqual({ was: 399, saved: 100, pct: 25 });
    expect(planOffer(PLANS[0])).toBeNull();
    expect(planOffer({ priceHalalas: 1000, compareAtHalalas: 1000 })).toBeNull();
    expect(planOffer({ priceHalalas: 1000, compareAtHalalas: 500 })).toBeNull();
    expect(planOffer({ priceHalalas: 1000, compareAtHalalas: null })).toBeNull();
    expect(planOffer(null)).toBeNull();
  });
});

describe('choosePlan', () => {
  it('prefers the requested plan, then the recommended one, then the first', () => {
    expect(choosePlan(PLANS, 'monthly', 'annual').id).toBe('monthly');
    expect(choosePlan(PLANS, null, 'annual').id).toBe('annual');
    expect(choosePlan(PLANS, 'bogus', 'annual').id).toBe('annual');
    expect(choosePlan(PLANS, 'bogus', 'also-bogus').id).toBe('monthly');
  });
});

describe('isTestKey', () => {
  it('flags pk_test_ keys only', () => {
    expect(isTestKey('pk_test_abc')).toBe(true);
    expect(isTestKey('pk_live_abc')).toBe(false);
    expect(isTestKey(null)).toBe(false);
  });
});

describe('scriptSafeJson', () => {
  it('cannot break out of an inline <script>', () => {
    const LS = String.fromCharCode(0x2028);
    const PS = String.fromCharCode(0x2029);
    const out = scriptSafeJson({ description: '</script><script>alert(1)</script>', note: `a${LS}b${PS}c` });
    expect(out).not.toContain('</script>');
    expect(out).not.toContain('<');
    expect(out.includes(LS) || out.includes(PS)).toBe(false);
    expect(JSON.parse(out).description).toBe('</script><script>alert(1)</script>');
  });
});

describe('buildCheckoutHtml', () => {
  const init: CheckoutInit = {
    amount: 29900,
    currency: 'SAR',
    description: 'SQB 12 months',
    publishableKey: 'pk_test_FAKE',
    callbackUrl: 'https://www.smle-question-bank.com/payment/callback',
    accountId: 426,
    planId: 'annual',
    seats: 1,
    lang: 'ar',
  };
  const configOf = (html: string) => {
    const m = /Moyasar\.init\((\{.*\})\);/.exec(html);
    expect(m).not.toBeNull();
    return JSON.parse(m![1]);
  };

  it('initialises the hosted form with amount, description and metadata moving together', () => {
    const html = buildCheckoutHtml(init);
    const cfg = configOf(html);
    expect(cfg).toMatchObject({
      element: '.mysr-form',
      amount: 29900,
      currency: 'SAR',
      description: 'SQB 12 months',
      publishable_api_key: 'pk_test_FAKE',
      callback_url: init.callbackUrl,
      methods: ['creditcard'],
      language: 'ar',
      metadata: { account_id: '426', plan: 'annual', seats: '1' },
    });
    expect(html).toContain(MOYASAR_CSS);
    expect(html).toContain(MOYASAR_JS);
  });

  it('has no Apple Pay (it does not exist in Android WebViews)', () => {
    const cfg = configOf(buildCheckoutHtml(init));
    expect(cfg.methods).not.toContain('applepay');
    expect(buildCheckoutHtml(init).toLowerCase()).not.toContain('apple_pay');
  });

  it('sets direction from the language and reports seats for group plans', () => {
    expect(buildCheckoutHtml({ ...init, lang: 'ar' })).toContain('dir="rtl"');
    const en = buildCheckoutHtml({ ...init, lang: 'en', seats: 5 });
    expect(en).toContain('dir="ltr"');
    expect(configOf(en).metadata.seats).toBe('5');
    expect(configOf(buildCheckoutHtml({ ...init, seats: 0 })).metadata.seats).toBe('1');
  });

  it('keeps a hostile description from escaping the config', () => {
    const html = buildCheckoutHtml({ ...init, description: '</script><img src=x onerror=alert(1)>' });
    expect(html.match(/<script>/g)).toHaveLength(1);
    expect(configOf(html).description).toBe('</script><img src=x onerror=alert(1)>');
  });
});

describe('callback URL handling', () => {
  const base = 'https://www.smle-question-bank.com/payment/callback';

  it('recognises the callback on the site host, www or apex', () => {
    expect(isCallbackUrl(`${base}?id=1&status=paid`)).toBe(true);
    expect(isCallbackUrl('https://smle-question-bank.com/payment/callback?id=1')).toBe(true);
  });

  it('rejects other hosts, other paths and junk', () => {
    expect(isCallbackUrl('https://evil.example/payment/callback?id=1')).toBe(false);
    expect(isCallbackUrl('https://smle-question-bank.com.evil.example/payment/callback')).toBe(false);
    expect(isCallbackUrl('https://sub.smle-question-bank.com/payment/callback')).toBe(false);
    expect(isCallbackUrl('https://www.smle-question-bank.com/payment/other')).toBe(false);
    expect(isCallbackUrl('not a url')).toBe(false);
    expect(isCallbackUrl('')).toBe(false);
  });

  it('reads id, status, message and next from the query', () => {
    expect(parseCallbackUrl(`${base}?id=pay_1&status=paid&message=ok&next=%2Fgroups`)).toEqual({ id: 'pay_1', status: 'paid', message: 'ok', next: '/groups' });
    expect(parseCallbackUrl(base)).toEqual({ id: null, status: null, message: null, next: null });
  });

  it('only ever routes to the groups page or the home tabs', () => {
    expect(safeNextPath('/groups')).toBe('/groups');
    expect(safeNextPath('/groups/')).toBe('/groups');
    expect(safeNextPath('/account')).toBe('/(tabs)');
    expect(safeNextPath('//evil.example')).toBe('/(tabs)');
    expect(safeNextPath('https://evil.example')).toBe('/(tabs)');
    expect(safeNextPath('javascript:alert(1)')).toBe('/(tabs)');
    expect(safeNextPath('')).toBe('/(tabs)');
    expect(safeNextPath(null)).toBe('/(tabs)');
  });
});

describe('isAllowedCheckoutUrl', () => {
  it('allows https and the blank start page, nothing else', () => {
    expect(isAllowedCheckoutUrl('about:blank')).toBe(true);
    expect(isAllowedCheckoutUrl('https://cdn.moyasar.com/mpf/1.16.0/moyasar.js')).toBe(true);
    expect(isAllowedCheckoutUrl('https://acs.bank.example/3ds')).toBe(true);
    for (const bad of ['http://acs.bank.example', 'intent://scan/#Intent;scheme=zxing;end', 'market://details?id=x', 'file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,hi', '']) {
      expect(isAllowedCheckoutUrl(bad)).toBe(false);
    }
  });
});

describe('savingsFor (group seats)', () => {
  it('shows what one seat saves against buying alone', () => {
    // 5 seats for 19600 halalas = 39.2 SAR each, against 49 SAR alone.
    expect(savingsFor({ priceHalalas: 19600, seats: 5, compareToHalalas: 4900 })).toEqual({ perSeat: 39, solo: 49, percent: 20 });
  });

  it('says nothing when there is no comparison or no real saving', () => {
    expect(savingsFor({ priceHalalas: 19600, seats: 5, compareToHalalas: null })).toBeNull();
    expect(savingsFor({ priceHalalas: 24500, seats: 5, compareToHalalas: 4900 })).toBeNull();
    expect(savingsFor({ priceHalalas: 30000, seats: 5, compareToHalalas: 4900 })).toBeNull();
    expect(savingsFor({ priceHalalas: 19600, seats: 0, compareToHalalas: 4900 })).toBeNull();
    expect(savingsFor(null)).toBeNull();
  });
});
