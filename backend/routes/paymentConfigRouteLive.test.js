/** GET /api/payment/config while a price offer is live (no end date in env): never cached. */
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';

delete process.env.NATIONAL_DAY_OFFER_ENDS_AT; // open-ended offer, live since 20 Sep 2026
delete process.env.NATIONAL_DAY_OFFER_STARTS_AT;

const { default: router } = await import('./payment.js');
const svc = await import('../services/paymentService.js');

test('live offer: kind=all is no-store, carries the offer, keeps per-origin CORS', async () => {
    assert.ok(svc.getOfferInfo(), 'an offer is live in this process');
    const app = express();
    app.use((req, res, next) => { res.set('Access-Control-Allow-Origin', req.headers.origin || ''); next(); });
    app.use('/api/payment', router);
    const server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
    try {
        const r = await new Promise((resolve, reject) => {
            http.get({
                host: '127.0.0.1', port: server.address().port, path: '/api/payment/config?kind=all',
                headers: { origin: 'https://www.smle-question-bank.com' },
            }, (res) => {
                let b = '';
                res.on('data', (c) => { b += c; });
                res.on('end', () => resolve({ h: res.headers, b: JSON.parse(b) }));
            }).on('error', reject);
        });
        assert.equal(r.h['cache-control'], 'no-store');
        assert.equal(r.h['access-control-allow-origin'], 'https://www.smle-question-bank.com');
        assert.equal(r.b.offer.active, true);
    } finally { server.close(); }
});
