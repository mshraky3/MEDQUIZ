/**
 * GET /api/payment/config over real HTTP, production-like state: the price offer ended on
 * 1 Oct 2026 (NATIONAL_DAY_OFFER_ENDS_AT as set on Vercel) and Golden Months ended 8 Nov.
 * Env must be set before the modules load, hence the dynamic imports.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';

process.env.NATIONAL_DAY_OFFER_ENDS_AT = '2026-10-01T23:59:59+03:00';
delete process.env.NATIONAL_DAY_OFFER_STARTS_AT;
delete process.env.GOLDEN_MONTHS_STARTS_AT;
delete process.env.GOLDEN_MONTHS_ENDS_AT;
process.env.MOYASAR_PUBLISHABLE_KEY = 'pk_test_dummy';

const { default: router } = await import('./payment.js');
const svc = await import('../services/paymentService.js');
const golden = await import('../services/goldenMonths.js');

function get(port, path, headers = {}) {
    return new Promise((resolve, reject) => {
        http.get({ host: '127.0.0.1', port, path, headers }, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
        }).on('error', reject);
    });
}

async function withServer(fn) {
    const app = express();
    // mimic app.js: the cors middleware reflects the origin with credentials before the router
    app.use((req, res, next) => {
        if (req.headers.origin) {
            res.set('Access-Control-Allow-Origin', req.headers.origin);
            res.set('Access-Control-Allow-Credentials', 'true');
            res.vary('Origin');
        }
        next();
    });
    app.use('/api/payment', (req, res, next) => { req.db = null; next(); }, router);
    const server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
    try { await fn(server.address().port); } finally { server.close(); }
}

test('state is production-like: no offer, no Golden Months', () => {
    assert.equal(svc.getOfferInfo(), null);
    assert.equal(golden.getGoldenInfo(), null);
});

test('kind=all is CDN-cacheable, identical for every visitor, and the body is unchanged', async () => {
    await withServer(async (port) => {
        const visitors = [
            {},
            { origin: 'https://www.smle-question-bank.com' },
            { origin: 'https://smle-question-bank.com', authorization: 'Bearer abc', cookie: 'a=b', 'accept-language': 'ar' },
            { 'cache-control': 'no-cache', pragma: 'no-cache', 'user-agent': 'okhttp' },
        ];
        const results = [];
        for (const h of visitors) results.push(await get(port, '/api/payment/config?kind=all', h));
        for (const r of results) {
            assert.equal(r.status, 200);
            assert.equal(r.headers['cache-control'], 'public, s-maxage=300, stale-while-revalidate=60');
            assert.equal(r.headers['access-control-allow-origin'], '*');
            assert.equal(r.headers['access-control-allow-credentials'], undefined);
            assert.equal(r.headers['set-cookie'], undefined);
            assert.equal(r.body, results[0].body, 'same bytes for every visitor');
            assert.equal(r.headers.etag, results[0].headers.etag);
        }
        const enabled = svc.isPaymentEnforcementEnabled();
        const expected = JSON.stringify({
            enabled,
            currency: svc.getCurrency(),
            kind: 'all',
            plans: svc.listPlansForDisplay('all'),
            offer: null,
            goldenMonths: null,
            publishableKey: enabled ? 'pk_test_dummy' : null,
        });
        assert.equal(results[0].body, expected, 'body is exactly what the old handler produced');
    });
});

test('individual (default), group and unknown kinds stay no-store with per-origin CORS', async () => {
    await withServer(async (port) => {
        for (const q of ['', '?kind=individual', '?kind=group', '?kind=bogus']) {
            const r = await get(port, '/api/payment/config' + q, { origin: 'https://www.smle-question-bank.com' });
            assert.equal(r.status, 200);
            assert.equal(r.headers['cache-control'], 'no-store', q);
            assert.equal(r.headers['access-control-allow-origin'], 'https://www.smle-question-bank.com');
            assert.equal(r.headers['access-control-allow-credentials'], 'true');
        }
    });
});
