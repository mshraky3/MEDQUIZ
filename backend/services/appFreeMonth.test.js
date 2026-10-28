/**
 * One free month from the Android app: the rules, and that the grant goes through
 * one locked transaction and leaves a 'granted' audit row (never 'paid').
 * A scripted fake db stands in for Postgres (no local Postgres exists).
 */
process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';

import test from 'node:test';
import assert from 'node:assert/strict';

const {
    evaluateAppFreeMonth, redeemAppFreeMonth, isAppFreeMonthEnabled,
    APP_FREE_MONTH_EVENT, APP_PLATFORM_MARKER,
} = await import('./appFreeMonth.js');

const base = { id: 7, email_verified: true, subscription_status: null, subscription_expiry_date: null, is_admin_created: false, grandfathered_at: null };

function fakeDb({ account = base, history = [] } = {}) {
    const log = [];
    const client = {
        query: async (sql, params) => {
            const q = sql.replace(/\s+/g, ' ').trim();
            log.push({ q, params });
            if (q.startsWith('SELECT id, email_verified')) return { rows: account ? [account] : [] };
            if (q.startsWith('SELECT event_type, status')) return { rows: history };
            return { rows: [] };
        },
        release: () => { log.push({ q: 'RELEASE' }); },
    };
    return { db: { connect: async () => client }, log };
}

test('the feature is off unless APP_FREE_MONTH_ENABLED is exactly "true"', () => {
    delete process.env.APP_FREE_MONTH_ENABLED;
    assert.equal(isAppFreeMonthEnabled(), false);
    process.env.APP_FREE_MONTH_ENABLED = '1';
    assert.equal(isAppFreeMonthEnabled(), false);
    process.env.APP_FREE_MONTH_ENABLED = 'true';
    assert.equal(isAppFreeMonthEnabled(), true);
    delete process.env.APP_FREE_MONTH_ENABLED;
});

test('rules: who may and may not get it', () => {
    const future = new Date(Date.now() + 86400000);
    assert.deepEqual(evaluateAppFreeMonth(base, []), { eligible: true, reason: 'eligible' });
    assert.equal(evaluateAppFreeMonth(null).reason, 'account_not_found');
    assert.equal(evaluateAppFreeMonth({ ...base, email_verified: false }).reason, 'email_not_verified');
    assert.equal(evaluateAppFreeMonth(base, [{ event_type: APP_FREE_MONTH_EVENT, status: 'granted' }]).reason, 'already_redeemed');
    assert.equal(evaluateAppFreeMonth(base, [{ event_type: 'payment_paid', status: 'paid' }]).reason, 'has_paid');
    assert.equal(evaluateAppFreeMonth({ ...base, grandfathered_at: new Date() }).reason, 'grandfathered');
    assert.equal(evaluateAppFreeMonth({ ...base, is_admin_created: true }).reason, 'already_granted');
    assert.equal(evaluateAppFreeMonth({ ...base, subscription_status: 'active', subscription_expiry_date: future }).reason, 'active_subscription');
    // a lapsed subscription with no paid row (should not exist) is not "live"
    assert.equal(evaluateAppFreeMonth({ ...base, subscription_status: 'active', subscription_expiry_date: new Date(Date.now() - 1000) }).eligible, true);
});

test('no platform marker, no grant, and the database is not touched', async () => {
    const { db, log } = fakeDb();
    assert.deepEqual(await redeemAppFreeMonth(db, 7, { platform: 'web' }), { granted: false, reason: 'not_from_app' });
    assert.deepEqual(await redeemAppFreeMonth(db, 7, {}), { granted: false, reason: 'not_from_app' });
    assert.equal(log.length, 0);
});

test('a grant: locks the row, one month, is_admin_created, a granted audit row, no paid row', async () => {
    const { db, log } = fakeDb();
    const before = Date.now();
    const out = await redeemAppFreeMonth(db, 7, { platform: APP_PLATFORM_MARKER });
    assert.equal(out.granted, true);
    assert.equal(out.months, 1);
    const days = (new Date(out.expiresAt).getTime() - before) / 86400000;
    assert.ok(days > 27 && days < 32, `about one month, got ${days} days`);

    const sqls = log.map((l) => l.q);
    assert.equal(sqls[0], 'BEGIN');
    assert.match(sqls[1], /FROM accounts WHERE id = \$1 FOR UPDATE/);
    assert.ok(sqls.some((s) => s.startsWith('UPDATE accounts') && /is_admin_created = TRUE/.test(s)));
    const insert = log.find((l) => l.q.startsWith('INSERT INTO payment_events'));
    assert.ok(insert, 'audit row written');
    assert.match(insert.q, /'granted'/);
    assert.ok(!/'paid'/.test(insert.q), 'never recorded as paid');
    assert.equal(insert.params[1], APP_FREE_MONTH_EVENT);
    assert.equal(insert.params[2], 'app_free_month_7');
    assert.ok(sqls.includes('COMMIT'));
    assert.equal(sqls.at(-1), 'RELEASE');
});

test('ineligible: rolls back, writes nothing', async () => {
    for (const [name, opts, reason] of [
        ['paid before', { history: [{ event_type: 'payment_paid', status: 'paid' }] }, 'has_paid'],
        ['already redeemed', { history: [{ event_type: APP_FREE_MONTH_EVENT, status: 'granted' }] }, 'already_redeemed'],
        ['no such account', { account: null }, 'account_not_found'],
    ]) {
        const { db, log } = fakeDb(opts);
        const out = await redeemAppFreeMonth(db, 7, { platform: APP_PLATFORM_MARKER });
        assert.deepEqual(out, { granted: false, reason }, name);
        const sqls = log.map((l) => l.q);
        assert.ok(sqls.includes('ROLLBACK'), name);
        assert.ok(!sqls.some((s) => s.startsWith('UPDATE') || s.startsWith('INSERT')), name);
    }
});
