import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cashoutConfig, cashoutSnapshot } from './adminMetricsService.js';
import { fetchLiveSettlements } from './moyasarSettlements.js';

// All amounts and ids below are made up.
const paidRow = (ref, halalas, fee, day) => ({
    gateway_ref: ref, received_at: `${day}T09:00:00Z`, amount_halalas: halalas,
    currency: 'SAR', livemode: true, status: 'paid',
    raw_payload: { id: ref, amount: halalas, fee, currency: 'SAR', status: 'paid', source: { company: 'mada' } },
});
const db = (rows) => ({ query: async () => ({ rows }) });
const settlement = (createdAt, amountHalalas, paymentIds) => ({ id: createdAt, createdAt, amountHalalas, paymentIds });

const SETTLEMENTS = [
    settlement('2030-02-20T07:00:00Z', 30000, ['c']),
    settlement('2030-01-05T07:00:00Z', 10000, ['a']),
    // 22:30 UTC is already 11 Jan in Riyadh.
    settlement('2030-01-10T22:30:00Z', 20001, ['b']),
];

test('cashoutConfig reads both settings and refuses anything unclear', () => {
    assert.deepEqual(
        cashoutConfig({ CASHOUT_LAST: ' 2030-01-12:2030-01-10 ', OWNER_SHARE_RATIO: '0.25' }),
        { lastCashout: { date: '2030-01-12', coversThrough: '2030-01-10' }, ownerShareRatio: 0.25 },
    );
    for (const bad of ['', '2030-01-12', '2030-01-10:2030-01-12', '2030-02-31:2030-01-01', '2030-01-12:2030-01-10:x']) {
        assert.equal(cashoutConfig({ CASHOUT_LAST: bad }).lastCashout, null, bad);
    }
    for (const bad of ['', '0', '-1', '38.25', 'abc']) {
        assert.equal(cashoutConfig({ OWNER_SHARE_RATIO: bad }).ownerShareRatio, null, bad);
    }
});

test('cashoutSnapshot counts settlements after the cut-off, by Riyadh day', async () => {
    const out = await cashoutSnapshot(db([]), {
        settlements: SETTLEMENTS,
        config: { lastCashout: { date: '2030-01-12', coversThrough: '2030-01-10' }, ownerShareRatio: 0.25 },
    });
    assert.deepEqual(out.uncashed.map((s) => s.date), ['2030-01-11', '2030-02-20']);
    assert.equal(out.uncashedHalalas, 50001);
    assert.equal(out.ownerShareHalalas, 12500);
    assert.deepEqual(out.unsettled, { count: 0, grossHalalas: 0, netHalalas: 0, estimatedCount: 0, oldestDate: null });
});

test('cashoutSnapshot lists ledger payments that no settlement covers as not yet settled', async () => {
    const out = await cashoutSnapshot(db([paidRow('a', 5000, 150, '2030-01-02'), paidRow('z', 5000, 150, '2030-02-25')]), {
        settlements: SETTLEMENTS,
        config: { lastCashout: null, ownerShareRatio: 0.25 },
    });
    assert.equal(out.unsettled.count, 1);
    assert.equal(out.unsettled.grossHalalas, 5000);
    assert.equal(out.unsettled.netHalalas, 4850);
    assert.equal(out.unsettled.oldestDate, '2030-02-25');
    // No recorded cash-out: the all-time total must not pose as money in the bank.
    assert.equal(out.uncashed, null);
    assert.equal(out.uncashedHalalas, null);
    assert.equal(out.ownerShareHalalas, null);
});

const fakeHttp = (pages) => ({
    get: async (url, { params }) => {
        const path = url.split('/v1')[1];
        return pages[`${path}?${params.page}`] || { status: 500, data: {} };
    },
});
const ok = (data) => ({ status: 200, data });

test('fetchLiveSettlements follows pages and never counts a repeated settlement twice', async () => {
    const s = { id: 's1', amount: 1000, currency: 'SAR', created_at: '2030-01-05T07:00:00Z' };
    const out = await fetchLiveSettlements({
        secretKey: 'sk_live_x',
        http: fakeHttp({
            '/settlements?1': ok({ settlements: [s], meta: { next_page: 2 } }),
            '/settlements?2': ok({ settlements: [s], meta: { next_page: null } }),
            '/settlements/s1/lines?1': ok({ lines: [{ payment_id: 'a', type: 'payment', amount: 1000 }], meta: {} }),
        }),
    });
    assert.deepEqual(out, [{ id: 's1', createdAt: s.created_at, amountHalalas: 1000, paymentIds: ['a'] }]);
});

test('fetchLiveSettlements refuses a test key and fails whole on any bad response', async () => {
    await assert.rejects(fetchLiveSettlements({ secretKey: 'sk_test_x', http: fakeHttp({}) }), /live/);
    await assert.rejects(fetchLiveSettlements({
        secretKey: 'sk_live_x',
        http: fakeHttp({ '/settlements?1': ok({ settlements: [{ id: 's1', amount: 1 }], meta: {} }) }),
    }), /HTTP 500/);
});
