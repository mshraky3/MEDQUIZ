import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentConfigCachePolicy, CONFIG_START_GUARD_MS, CONFIG_S_MAXAGE, CONFIG_SWR } from './paymentConfigCache.js';

const NOW = Date.parse('2026-11-11T12:00:00Z');
const base = {
    kind: 'all', offer: null, goldenMonths: null, nowMs: NOW,
    startsAtMs: [Date.parse('2026-09-20T00:00:00+03:00'), Date.parse('2026-10-08T00:00:00+03:00')],
};

test('nothing on sale: kind=all is CDN-cacheable for 5 minutes with a short stale window', () => {
    assert.deepEqual(paymentConfigCachePolicy(base), { header: 'public, s-maxage=300, stale-while-revalidate=60', shared: true });
});

test('a live offer or live Golden Months is never cached', () => {
    assert.deepEqual(paymentConfigCachePolicy({ ...base, offer: { active: true } }), { header: 'no-store', shared: false });
    assert.deepEqual(paymentConfigCachePolicy({ ...base, goldenMonths: { active: true } }), { header: 'no-store', shared: false });
});

test('the checkout and groups probes (individual, group, anything else) stay no-store', () => {
    for (const kind of ['individual', 'group', undefined, 'x']) {
        assert.equal(paymentConfigCachePolicy({ ...base, kind }).header, 'no-store');
    }
});

test('a start inside the guard window is not cached, so a scheduled offer never shows late', () => {
    assert.equal(paymentConfigCachePolicy({ ...base, startsAtMs: [NOW + 60_000] }).header, 'no-store');
    assert.equal(paymentConfigCachePolicy({ ...base, startsAtMs: [NOW + CONFIG_START_GUARD_MS - 1] }).header, 'no-store');
    assert.equal(paymentConfigCachePolicy({ ...base, startsAtMs: [NOW + CONFIG_START_GUARD_MS] }).shared, true);
    // the guard is longer than the longest time a stored copy can still be served
    assert.ok(CONFIG_START_GUARD_MS > (CONFIG_S_MAXAGE + CONFIG_SWR) * 1000);
    // past starts and junk values do not matter
    assert.equal(paymentConfigCachePolicy({ ...base, startsAtMs: [NOW - 1, null, undefined, NaN] }).shared, true);
});
