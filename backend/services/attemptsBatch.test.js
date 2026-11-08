/**
 * POST /question-attempts/batch: service-level tests with an in-memory fake db that
 * understands just the three statements the service issues (session owner, question
 * options, multi-row insert with NOT EXISTS), so idempotency is actually exercised.
 * The app.js wiring (auth, body limit, route) is asserted on its source, as in the
 * other tests here, because app.js cannot be imported without a database.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordAttemptsBatch, MAX_ATTEMPTS_PER_BATCH } from './attemptsBatch.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const clamp = (v) => Math.max(0, Math.min(Number(v) || 0, 43200));
const Q = (id) => ({ id, option1: `a${id}`, option2: `b${id}`, option3: `c${id}`, option4: `d${id}`, correct_option: `a${id}` });

function makeDb({ sessions = { 10: 7 }, stored = [] } = {}) {
    const db = {
        stored, inserts: 0,
        async query(sql, params) {
            if (/FROM user_quiz_sessions/.test(sql)) {
                return { rows: sessions[params[0]] !== undefined ? [{ user_id: sessions[params[0]] }] : [] };
            }
            if (/FROM questions/.test(sql)) return { rows: params[0].map(Q) };
            if (/INSERT INTO user_question_attempts/.test(sql)) {
                db.inserts += 1;
                const [uid, sid, qids, opts, cors, times] = params;
                let n = 0;
                qids.forEach((q, i) => {
                    if (stored.some((r) => r.quiz_session_id === sid && r.question_id === q)) return;
                    stored.push({ user_id: uid, quiz_session_id: sid, question_id: q, selected_option: opts[i], is_correct: cors[i], time_taken: times[i] });
                    n += 1;
                });
                return { rowCount: n };
            }
            throw new Error('unexpected sql ' + sql);
        },
    };
    return db;
}
const att = (n, start = 1) => Array.from({ length: n }, (_, i) => ({
    question_id: start + i, selected_option: `a${start + i}`, is_correct: false, time_taken: 5,
}));
const run = (db, over = {}) => recordAttemptsBatch(db, { userId: 7, sessionId: 10, attempts: att(3), mode: 'enforce', clampSeconds: clamp, ...over });

test('150 answers go in as ONE insert; server recomputes is_correct', async () => {
    const db = makeDb();
    const r = await run(db, { attempts: att(150) });
    assert.equal(r.status, 201);
    assert.equal(r.body.inserted, 150);
    assert.equal(db.inserts, 1);
    assert.equal(db.stored.every((x) => x.is_correct === true), true); // client said false, key says a<id>
});

test('retry of the same batch does not duplicate', async () => {
    const db = makeDb();
    await run(db, { attempts: att(5) });
    const again = await run(db, { attempts: att(5) });
    assert.equal(again.status, 201);
    assert.equal(again.body.inserted, 0);
    assert.equal(again.body.skipped_existing, 5);
    assert.equal(db.stored.length, 5);
});

test('partly duplicate batch inserts only the missing ones', async () => {
    const db = makeDb();
    await run(db, { attempts: att(3) });          // q1..3
    const r = await run(db, { attempts: att(5) }); // q1..5
    assert.equal(r.body.inserted, 2);
    assert.equal(r.body.skipped_existing, 3);
    assert.equal(db.stored.length, 5);
});

test('same question twice inside one payload is stored once', async () => {
    const db = makeDb();
    const r = await run(db, { attempts: [...att(2), ...att(2)] });
    assert.equal(r.body.inserted, 2);
    assert.equal(db.stored.length, 2);
});

test('size cap: 500 ok, 501 refused with 413, nothing written', async () => {
    const db = makeDb();
    assert.equal((await run(db, { attempts: att(MAX_ATTEMPTS_PER_BATCH) })).status, 201);
    const db2 = makeDb();
    const big = await run(db2, { attempts: att(MAX_ATTEMPTS_PER_BATCH + 1) });
    assert.equal(big.status, 413);
    assert.equal(db2.stored.length, 0);
});

test("someone else's session is refused and nothing is written", async () => {
    const db = makeDb({ sessions: { 10: 99 } });
    const r = await run(db);
    assert.equal(r.status, 400);
    assert.equal(r.body.code, 'SESSION_NOT_OWNED');
    assert.equal(db.stored.length, 0);
    const missing = await run(makeDb({ sessions: {} }));
    assert.equal(missing.status, 400);
});

test('bad payloads are 400', async () => {
    const db = makeDb();
    assert.equal((await run(db, { attempts: [] })).status, 400);
    assert.equal((await run(db, { attempts: 'x' })).status, 400);
    assert.equal((await run(db, { sessionId: undefined })).status, 400);
    assert.equal((await run(db, { attempts: [{ question_id: 1 }] })).status, 400);
    assert.equal(db.stored.length, 0);
});

test('enforce drops a pair whose text is not an option; log mode keeps it; off skips the check', async () => {
    const bad = [{ question_id: 1, selected_option: 'nonsense', is_correct: true, time_taken: 3 }, ...att(1, 2)];
    const e = await run(makeDb(), { attempts: bad });
    assert.equal(e.body.inserted, 1);
    assert.equal(e.body.rejected, 1);
    const l = makeDb();
    assert.equal((await run(l, { attempts: bad, mode: 'log' })).body.inserted, 2);
    const o = makeDb();
    await run(o, { attempts: bad, mode: 'off' });
    assert.equal(o.stored[0].is_correct, true); // client value kept when validation is off
});

test('absurd time_taken is clamped', async () => {
    const db = makeDb();
    await run(db, { attempts: [{ ...att(1)[0], time_taken: 9e9 }] });
    assert.equal(db.stored[0].time_taken, 43200);
});

test('app.js wiring: route behind requireSession, own-user check, 1mb body limit, old route kept', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    assert.match(src, /app\.post\('\/question-attempts\/batch', requireSession,/);
    assert.match(src, /app\.post\('\/question-attempts', requireSession,/);
    assert.match(src, /'\/question-attempts\/batch': '1mb'/);
    const block = src.slice(src.indexOf("app.post('/question-attempts/batch'"), src.indexOf("app.post('/user-analysis'"));
    assert.match(block, /user_id does not match the authenticated session/);
    assert.match(block, /userId: user_id/);
});
