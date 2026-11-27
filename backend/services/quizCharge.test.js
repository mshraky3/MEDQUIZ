/**
 * Free-question charging on submit, including a quiz ended early with "Finish
 * now and see my result", run against PGlite (see seenService.test.js: set
 * PGLITE_PATH, otherwise the database tests are skipped).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spendFreeAllowance } from './quizCharge.js';
import { checkQuizAccess } from './paymentService.js';

const here = path.dirname(fileURLToPath(import.meta.url));

let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

async function setup() {
    const db = new PGlite();
    await db.exec(`
        CREATE TABLE accounts (id SERIAL PRIMARY KEY, free_allowance int,
            free_questions_used int NOT NULL DEFAULT 0, free_questions_served int NOT NULL DEFAULT 0,
            is_admin_created boolean NOT NULL DEFAULT FALSE, grandfathered_at timestamptz,
            subscription_status text NOT NULL DEFAULT 'free', subscription_expiry_date timestamptz);
        INSERT INTO accounts (free_allowance) VALUES (10);                       -- 1 free, new
        INSERT INTO accounts (free_allowance, subscription_status, subscription_expiry_date)
            VALUES (10, 'active', NOW() + INTERVAL '30 days');                   -- 2 paid
        INSERT INTO accounts (free_allowance, is_admin_created) VALUES (10, TRUE);   -- 3 admin
        INSERT INTO accounts (free_allowance, grandfathered_at) VALUES (10, NOW());  -- 4 grandfathered
        INSERT INTO accounts (free_allowance, subscription_status, subscription_expiry_date)
            VALUES (10, 'active', NOW() - INTERVAL '1 day');                     -- 5 lapsed
    `);
    return db;
}
const account = async (db, id) => (await db.query('SELECT * FROM accounts WHERE id = $1', [id])).rows[0];
const ids = (n) => Array.from({ length: n }, (_, i) => i + 1);
const spend = (db, userId, n, extra = {}) =>
    spendFreeAllowance(db, { userId, questionIds: ids(n), totalQuestions: n, legacyAllowance: 40, ...extra });
// What GET /api/questions does: hand out at most `servable`, then count it.
const fetchQuiz = async (db, id, asked) => {
    const access = checkQuizAccess(await account(db, id));
    if (!access.allowed) return { count: 0, reason: access.reason };
    const count = Math.min(asked, access.servable);
    await db.query('UPDATE accounts SET free_questions_served = free_questions_served + $1 WHERE id = $2', [count, id]);
    return { count, reason: access.reason };
};

const enforced = (fn) => async () => {
    const before = process.env.PAYMENT_ENFORCEMENT_ENABLED;
    process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';
    try { await fn(); } finally {
        if (before === undefined) delete process.env.PAYMENT_ENFORCEMENT_ENABLED;
        else process.env.PAYMENT_ENFORCEMENT_ENABLED = before;
    }
};

test('free account: finishing 3 of 10 early spends 3, not 10', { skip }, enforced(async () => {
    const db = await setup();
    assert.equal((await fetchQuiz(db, 1, 10)).count, 10);
    assert.equal(await spend(db, 1, 3), 3);
    const a = await account(db, 1);
    assert.equal(a.free_questions_used, 3);
    assert.equal(a.free_questions_served, 10, 'the served counter (anti-abuse) is not given back');
}));

test('free account: ending early never locks it out, and every free question stays reachable', { skip }, enforced(async () => {
    const db = await setup();
    // Worst case: answer ONE question of every quiz, then finish now.
    let quizzes = 0;
    for (;;) {
        const q = await fetchQuiz(db, 1, 10);
        if (q.count === 0) { assert.equal(q.reason, 'free_allowance_exhausted'); break; }
        await spend(db, 1, 1);
        quizzes += 1;
        assert.ok(quizzes <= 10, 'more quizzes than free questions');
    }
    const a = await account(db, 1);
    assert.equal(a.free_questions_used, 10);
    // The unanswered cap still bounds how much was ever handed out unanswered.
    assert.ok(a.free_questions_served - a.free_questions_used <= 10);
}));

test('paid, admin-created and grandfathered accounts are never debited', { skip }, enforced(async () => {
    const db = await setup();
    for (const id of [2, 3, 4]) {
        await spend(db, id, 3);
        assert.equal((await account(db, id)).free_questions_used, 0, `account ${id}`);
    }
    await spend(db, 5, 3);
    assert.equal((await account(db, 5)).free_questions_used, 3, 'a lapsed subscription is metered again');
}));

test('double submit: the re-sent copy of a saved quiz is not charged again', { skip }, async () => {
    const db = await setup();
    await spend(db, 1, 3);
    assert.equal(await spend(db, 1, 3, { alreadyRecorded: true }), 0);
    assert.equal((await account(db, 1)).free_questions_used, 3);
});

test('the charge stops at the allowance, and falls back to total_questions without ids', { skip }, async () => {
    const db = await setup();
    await spend(db, 1, 25);
    assert.equal((await account(db, 1)).free_questions_used, 10);
    const db2 = await setup();
    await spendFreeAllowance(db2, { userId: 1, totalQuestions: 4, legacyAllowance: 40 });
    assert.equal((await account(db2, 1)).free_questions_used, 4);
    assert.equal(await spendFreeAllowance(db2, { userId: 1, questionIds: [], totalQuestions: 0, legacyAllowance: 40 }), 0);
});

test('POST /quiz-sessions skips the charge only for a save made by an earlier request', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
    const start = src.indexOf("app.post('/quiz-sessions'");
    const route = src.slice(start, src.indexOf("app.get('/quiz-sessions/history", start));
    assert.match(route, /alreadyRecorded: savedByEarlierRequest/);
    // Set in exactly one place: the client-declared retry. The connection-drop
    // lookups find a row THIS request inserted, which still has to be paid for.
    assert.equal((route.match(/savedByEarlierRequest = true/g) || []).length, 1);
    assert.match(route, /if \(Number\(retry_attempt\) > 0\) \{[\s\S]{0,400}savedByEarlierRequest = true/);
});
