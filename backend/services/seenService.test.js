/**
 * "Seen when answered": the service behind POST /api/questions/seen, run against
 * PGlite (no local Postgres). PGlite is not a repo dependency: install it
 * outside the repo and point PGLITE_PATH at node_modules/@electric-sql/pglite,
 * otherwise these tests are skipped. The 401 and "more than 20 ids" checks live
 * in the route (requireSession and the length guard) and are asserted against
 * app.js source below because app.js cannot be imported without a database.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { markQuestionsSeen, cleanQuestionIds, MAX_SEEN_IDS } from './seenService.js';

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
        CREATE TABLE accounts (id SERIAL PRIMARY KEY, username text, track text DEFAULT 'medical',
            free_questions_used int DEFAULT 0, free_questions_served int DEFAULT 0);
        CREATE TABLE questions (id SERIAL PRIMARY KEY, track text NOT NULL DEFAULT 'medical',
            question_type text, source text);
        CREATE TABLE user_question_progress (id SERIAL PRIMARY KEY,
            user_id int NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            question_id int NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            question_type text, source text, UNIQUE(user_id, question_id));
        INSERT INTO accounts (username, free_questions_used, free_questions_served) VALUES ('a', 3, 9), ('b', 0, 0);
        INSERT INTO questions (track, question_type, source)
            SELECT 'medical', 'medicine', 'general' FROM generate_series(1, 30);
        INSERT INTO questions (track, question_type, source) VALUES ('nursing', 'x', 'general'); -- id 31
    `);
    return db;
}
const count = async (db, uid) =>
    (await db.query('SELECT COUNT(*)::int c FROM user_question_progress WHERE user_id=$1', [uid])).rows[0].c;
// The exact predicate GET /api/questions uses to exclude seen questions.
const selectable = async (db, uid) =>
    (await db.query(`SELECT id FROM questions WHERE track='medical' AND NOT EXISTS (
        SELECT 1 FROM user_question_progress uqp WHERE uqp.user_id=$1 AND uqp.question_id=questions.id)`, [uid]))
        .rows.map((r) => r.id);

test('cleanQuestionIds keeps positive integers once, drops junk', () => {
    assert.deepEqual(cleanQuestionIds([1, '2', 2, -1, 0, 1.5, 'x', null, {}]), [1, 2]);
    assert.deepEqual(cleanQuestionIds('nope'), []);
});

test('route guards: session required, at most 20 ids, id from the session', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    const i = src.indexOf("app.post('/api/questions/seen'");
    const block = src.slice(i, i + 1200);
    assert.match(block, /requireSession/);
    assert.match(block, /MAX_SEEN_IDS/);
    assert.match(block, /userId: req\.accountId/);
    assert.doesNotMatch(block, /req\.body\??\.(user_?id|userId|username)/);
    assert.equal(MAX_SEEN_IDS, 20);
});

test('records valid ids; unknown and other-track ids are ignored', { skip }, async () => {
    const db = await setup();
    const n = await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [1, 2, 3, 31, 9999] });
    assert.equal(n, 3);
    assert.equal(await count(db, 1), 3);
});

test('idempotent: twice leaves one row per question', { skip }, async () => {
    const db = await setup();
    await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [5, 6] });
    await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [5, 6] });
    assert.equal(await count(db, 1), 2);
});

test('touches no free-tier counter and only the given user', { skip }, async () => {
    const db = await setup();
    const before = (await db.query('SELECT * FROM accounts ORDER BY id')).rows;
    await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [1, 2, 3] });
    assert.deepEqual((await db.query('SELECT * FROM accounts ORDER BY id')).rows, before);
    assert.equal(await count(db, 2), 0);
});

test('selection no longer returns them; reset-progress makes them eligible again', { skip }, async () => {
    const db = await setup();
    await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [1, 2, 3] });
    const left = await selectable(db, 1);
    assert.ok(![1, 2, 3].some((id) => left.includes(id)));
    assert.equal(left.length, 27);
    assert.equal((await selectable(db, 2)).length, 30); // other users unaffected
    await db.query('DELETE FROM user_question_progress WHERE user_id = $1', [1]); // what /api/reset-progress does
    assert.equal((await selectable(db, 1)).length, 30);
});

test('the later quiz submit insert still works unchanged (no duplicate rows)', { skip }, async () => {
    const db = await setup();
    await markQuestionsSeen(db, { userId: 1, track: 'medical', questionIds: [1, 2, 3] });
    // Same statement POST /quiz-sessions runs for every answered question.
    for (const id of [1, 2, 3, 4]) {
        await db.query(`INSERT INTO user_question_progress (user_id, question_id, question_type, source)
            VALUES ($1,$2,'medicine','general') ON CONFLICT (user_id, question_id) DO NOTHING`, [1, id]);
    }
    assert.equal(await count(db, 1), 4);
});
