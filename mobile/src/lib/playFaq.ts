/**
 * Google Play build: the FAQ must not quote prices, group plans, renewal or "how to subscribe"
 * (sign-in-only build, docs/PAYMENTS-FOR-APP.md). The FAQ copy is synced from the website and
 * has no ids, so these are the positions of those four questions; the test in
 * __tests__/playFaq.test.ts pins them to the English question text so a changed copy fails loudly.
 */
export const PLAY_HIDDEN_FAQ_INDEXES = [4, 5, 6, 10] as const;

export function visibleFaqItems<T>(items: T[], playBuild: boolean): T[] {
  if (!playBuild) return items;
  return items.filter((_, index) => !(PLAY_HIDDEN_FAQ_INDEXES as readonly number[]).includes(index));
}
