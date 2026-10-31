// Fake client only: nothing here touches a database. Fake data throughout.
import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteAccountData, DELETION_OUTCOME, scrubPaymentPayloadSql } from './accountDeletionService.js';

const DAY = 86_400_000;

/**
 * Records every statement. `world` decides the answers:
 *   account (row or null), paid (bool), group (bool), missing (Set of substrings
 *   whose statement fails with 42P01), boom (substring whose statement throws).
 */
function fakeClient(world) {
    const log = [];
    return {
        log,
        async query(sql, params) {
            const s = sql.replace(/\s+/g, ' ').trim();
            log.push(s);
            for (const m of world.missing || []) {
                if (s.includes(m)) { const e = new Error('relation does not exist'); e.code = '42P01'; throw e; }
            }
            if (world.boom && s.includes(world.boom)) throw new Error('disk on fire');
            if (s.startsWith('SELECT id, email, username')) {
                return { rows: world.account ? [world.account] : [] };
            }
            if (s.includes("FROM payment_events WHERE account_id = $1 AND status = 'paid'")) {
                return { rows: world.paid ? [{ '?column?': 1 }] : [] };
            }
            if (s.includes('FROM subscription_groups g')) {
                return { rows: world.group ? [{ '?column?': 1 }] : [] };
            }
            return { rows: [], rowCount: 1 };
        },
    };
}

const acct = (over = {}) => ({ id: 7, email: 'Fake.Person@example.test', username: 'fake.person@example.test', subscription_expiry_date: null, ...over });
const wrote = (c, needle) => c.log.some((s) => s.includes(needle));

test('never paid: personal rows and the account row are deleted', async () => {
    const c = fakeClient({ account: acct(), paid: false });
    const r = await deleteAccountData(c, 7);
    assert.equal(r.outcome, DELETION_OUTCOME.DELETED);
    assert.ok(wrote(c, 'DELETE FROM user_question_attempts'));
    assert.ok(wrote(c, 'DELETE FROM login_history'));
    assert.ok(wrote(c, 'DELETE FROM success_stories'));
    assert.ok(wrote(c, 'DELETE FROM accounts WHERE id = $1'));
    assert.ok(!wrote(c, 'UPDATE payment_events'), 'a never-paid account has no payment rows to touch');
});

test('ever paid and term over: anonymised, shell kept, payload scrubbed, accounts row NOT deleted', async () => {
    const c = fakeClient({ account: acct({ subscription_expiry_date: new Date(Date.now() - DAY) }), paid: true });
    const r = await deleteAccountData(c, 7);
    assert.equal(r.outcome, DELETION_OUTCOME.ANONYMISED);
    assert.ok(wrote(c, 'UPDATE payment_events'));
    assert.ok(!wrote(c, 'DELETE FROM accounts'), 'payment rows must keep their account shell');
    assert.ok(!wrote(c, 'DELETE FROM payment_events'), 'money rows are never deleted');
    const upd = c.log.find((s) => s.startsWith('UPDATE accounts SET username'));
    assert.ok(upd && upd.includes('google_id = NULL') && upd.includes('isactive = FALSE'));
});

test('paid time still running: refused, nothing written', async () => {
    const c = fakeClient({ account: acct({ subscription_expiry_date: new Date(Date.now() + 10 * DAY) }), paid: true });
    const r = await deleteAccountData(c, 7);
    assert.deepEqual([r.outcome, r.reason], [DELETION_OUTCOME.REFUSED, 'paid_time_left']);
    assert.ok(!c.log.some((s) => /^(DELETE|UPDATE)/.test(s)));
});

test('owner of a live group: refused, nothing written', async () => {
    const c = fakeClient({ account: acct(), paid: true, group: true });
    const r = await deleteAccountData(c, 7);
    assert.deepEqual([r.outcome, r.reason], [DELETION_OUTCOME.REFUSED, 'group_owner']);
    assert.ok(!c.log.some((s) => /^(DELETE|UPDATE)/.test(s)));
});

test('unknown account: not_found and nothing written (idempotent second call)', async () => {
    const c = fakeClient({ account: null });
    assert.equal((await deleteAccountData(c, 7)).outcome, DELETION_OUTCOME.NOT_FOUND);
    assert.ok(!c.log.some((s) => /^(DELETE|UPDATE)/.test(s)));
});

test('a table that does not exist is skipped, the rest still runs', async () => {
    const c = fakeClient({ account: acct(), paid: false, missing: new Set(['final_review_sessions', 'broadcast_recipients']) });
    const r = await deleteAccountData(c, 7);
    assert.equal(r.outcome, DELETION_OUTCOME.DELETED);
    assert.ok(wrote(c, 'ROLLBACK TO SAVEPOINT'));
    assert.ok(wrote(c, 'DELETE FROM accounts WHERE id = $1'));
});

test('any other error propagates so the caller can ROLLBACK', async () => {
    const c = fakeClient({ account: acct(), paid: false, boom: 'DELETE FROM user_streaks' });
    await assert.rejects(() => deleteAccountData(c, 7), /disk on fire/);
    assert.ok(!wrote(c, 'DELETE FROM accounts'));
});

test('payload scrub keeps only whitelisted keys (no e-mail, name, card, ip, description)', () => {
    for (const bad of ['email', 'name', 'ip', 'description', 'callback', 'number', 'holder', 'message']) {
        assert.ok(!new RegExp(`'${bad}'`, 'i').test(scrubPaymentPayloadSql), `scrub must not copy ${bad}`);
    }
    for (const keep of ["'id'", "'status'", "'amount'", "'currency'", "'created_at'", "'fee'", "'refunded'", '{metadata,plan}', '{metadata,seats}']) {
        assert.ok(scrubPaymentPayloadSql.includes(keep), `scrub must keep ${keep}`);
    }
});
