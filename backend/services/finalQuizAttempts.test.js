/**
 * Large final exams: the JSON body cap on POST /final-quiz/submit only, and the
 * batched insert of the answers. app.js cannot be imported without a database,
 * so the parser is exercised through a small express app that mounts the SAME
 * middleware factory app.js uses, and the app.js wiring is asserted on its source.
 * The SQL is checked against a recording fake db (no local Postgres; PGlite is
 * not a dependency), so the statement text is verified, not executed.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import {
    insertFinalQuizAttempts, jsonBodyParser, FINAL_QUIZ_JSON_LIMIT, ATTEMPT_CHUNK_SIZE,
} from './finalQuizAttempts.js';

const here = path.dirname(fileURLToPath(import.meta.url));

const makeAttempts = (n) => Array.from({ length: n }, (_, i) => ({
    questionId: 10000 + i,
    userAnswer: (i % 4) + 1,
    correctAnswer: ((i + 1) % 4) + 1,
    isCorrect: i % 4 === 0,
    timeTaken: 37,
}));

const examBody = (n) => ({
    userId: 123456,
    questionType: ['medicine', 'surgery'],
    source: 'general',
    totalQuestions: n,
    correctAnswers: Math.floor(n / 4),
    timeTaken: 5400,
    timeLimit: 7200,
    questionIds: makeAttempts(n).map((a) => a.questionId),
    questionAttempts: makeAttempts(n),
    sessionMetadata: { device: 'web', browser: 'x'.repeat(120), timestamp: new Date().toISOString() },
});

async function withServer(fn) {
    const app = express();
    app.use(jsonBodyParser(express, { '/final-quiz/submit': FINAL_QUIZ_JSON_LIMIT }));
    app.post('/final-quiz/submit', (req, res) => res.json({ n: req.body.questionAttempts.length }));
    app.post('/other', (req, res) => res.json({ ok: true }));
    app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.type || err.message }));
    const server = app.listen(0);
    try {
        await fn(`http://127.0.0.1:${server.address().port}`);
    } finally {
        server.closeAllConnections();
        server.close();
    }
}

const post = (url, body) => fetch(url, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});

test('a 1,200-answer exam is over the old 100 KB default but under the new cap', () => {
    const bytes = Buffer.byteLength(JSON.stringify(examBody(1200)));
    assert.ok(bytes > 100 * 1024, `1,200 answers = ${bytes} bytes, must exceed the old limit`);
    assert.ok(bytes < 2 * 1024 * 1024);
});

test('POST /final-quiz/submit accepts a 1,200-answer body (was 413)', async () => {
    await withServer(async (base) => {
        const r = await post(`${base}/final-quiz/submit`, examBody(1200));
        assert.equal(r.status, 200);
        assert.deepEqual(await r.json(), { n: 1200 });
    });
});

test('every other route still refuses a body over 100 KB', async () => {
    await withServer(async (base) => {
        const r = await post(`${base}/other`, examBody(1200));
        assert.equal(r.status, 413);
        const small = await post(`${base}/other`, { a: 1 });
        assert.equal(small.status, 200);
    });
});

test('the final-exam route still has a ceiling (3 MB is refused)', async () => {
    await withServer(async (base) => {
        const r = await post(`${base}/final-quiz/submit`, { questionAttempts: [], pad: 'x'.repeat(3 * 1024 * 1024) });
        assert.equal(r.status, 413);
    });
});

const recorder = () => {
    const calls = [];
    return { calls, query: async (sql, params) => { calls.push({ sql, params }); return { rows: [] }; } };
};

test('1,200 answers are inserted with 2 queries, in order, with the old defaults', async () => {
    const db = recorder();
    const attempts = makeAttempts(1200);
    attempts[5].timeTaken = undefined; // old code stored `timeTaken || 0`
    const n = await insertFinalQuizAttempts(db, 77, attempts);
    assert.equal(n, 1200);
    assert.equal(db.calls.length, 2);
    assert.equal(db.calls[0].params.length, ATTEMPT_CHUNK_SIZE * 6);
    assert.equal(db.calls[1].params.length, 200 * 6);
    assert.match(db.calls[0].sql, /INSERT INTO final_quiz_attempts/);
    assert.match(db.calls[0].sql, /\(\$1, \$2, \$3, \$4, \$5, \$6\), \(\$7, \$8/);
    assert.ok(db.calls.every((c) => c.params.length < 65535));
    // placeholders and params line up: row 6 of chunk 1 is index 5
    assert.deepEqual(db.calls[0].params.slice(5 * 6, 6 * 6), [77, 10005, 2, 3, false, 0]);
    // chunk 2 starts at attempt 1000
    assert.deepEqual(db.calls[1].params.slice(0, 6), [77, 11000, 1, 2, true, 37]);
    const highest = Math.max(...[...db.calls[1].sql.matchAll(/\$(\d+)/g)].map((m) => Number(m[1])));
    assert.equal(highest, 200 * 6);
});

test('small exams and empty input', async () => {
    const db = recorder();
    assert.equal(await insertFinalQuizAttempts(db, 1, []), 0);
    assert.equal(await insertFinalQuizAttempts(db, 1, undefined), 0);
    assert.equal(db.calls.length, 0);
    assert.equal(await insertFinalQuizAttempts(db, 1, makeAttempts(1)), 1);
    assert.equal(db.calls.length, 1);
    await assert.rejects(() => insertFinalQuizAttempts(db, 1, 'abc'), TypeError);
});

test('a database error propagates (the route answers 500, nothing is swallowed)', async () => {
    const db = { query: async () => { throw new Error('boom'); } };
    await assert.rejects(() => insertFinalQuizAttempts(db, 1, makeAttempts(3)), /boom/);
});

test('app.js is wired to the per-route limit and the batched insert', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    assert.match(src, /app\.use\(jsonBodyParser\(express, \{ '\/final-quiz\/submit': FINAL_QUIZ_JSON_LIMIT \}\)\)/);
    assert.ok(!/app\.use\(express\.json\(\)\)/.test(src), 'no global default parser left in front');
    assert.match(src, /await insertFinalQuizAttempts\(db, sessionId, questionAttempts\)/);
    assert.ok(!/INSERT INTO final_quiz_attempts/.test(src), 'per-row insert removed from app.js');
});
