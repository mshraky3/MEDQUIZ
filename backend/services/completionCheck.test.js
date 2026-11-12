/**
 * GET /api/check-completion/:userId - the dead-sentinel short circuit (change C1).
 *
 * Proves, over a real HTTP round trip (express on localhost, no database server):
 *   1. for source = 'MidgardGameBoy' the new handler's HTTP response (status, body
 *      bytes, content-type, content-length, etag) is IDENTICAL to the original
 *      handler's, and the database is not touched;
 *   2. every other source still runs both queries and returns what the original did;
 *   3. the route in app.js keeps requireSession + requireOwnUser in front of it.
 *
 * LEGACY_HANDLER below is a verbatim copy of the handler that lived in app.js
 * before this change; it is the reference the new code is compared against.
 *
 * The in-memory db answers the two COUNT queries by evaluating the same rule the SQL
 * states. When PGlite is available (PGLITE_PATH=<...>/node_modules/@electric-sql/pglite,
 * else those cases are skipped) the same comparison also runs against the real SQL.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import express from 'express';
import { pathToFileURL, fileURLToPath } from 'node:url';
import {
    makeCheckCompletionHandler, isDeadCompletionSource, deadCompletionBody, DEAD_COMPLETION_SOURCE,
} from './completionCheck.js';

const here = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- reference (old) handler
function makeLegacyHandler({ db, resolveContentTrack }) {
    return async (req, res) => {
        const { userId } = req.params;
        const { type, source } = req.query;

        try {
            // Get total questions for this cardinality, within the caller's bank
            const track = resolveContentTrack(req);
            const totalQuery = await db.query(`
            SELECT COUNT(*) as total
            FROM questions
            WHERE track = $1 AND question_type = $2 AND $3 = ANY(sources)
        `, [track, type, source]);

            // Get completed questions for this cardinality
            const completedQuery = await db.query(`
            SELECT COUNT(*) as completed
            FROM user_question_progress p
            JOIN questions q ON q.id = p.question_id
            WHERE p.user_id = $1 AND q.question_type = $2 AND $3 = ANY(q.sources)
        `, [userId, type, source]);

            const total = parseInt(totalQuery.rows[0].total);
            const completed = parseInt(completedQuery.rows[0].completed);
            const isCompleted = total > 0 && completed >= total;

            res.json({
                total,
                completed,
                isCompleted,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0
            });
        } catch (err) {
            console.error('Error checking completion:', err);
            res.status(500).json({ message: 'Failed to check completion' });
        }
    };
}

// ---------------------------------------------------------------- data (shape of the live bank)
const QUESTIONS = [];
let nextId = 1;
const addQ = (track, type, sources) => QUESTIONS.push({ id: nextId++, track, question_type: type, sources });
for (let i = 0; i < 6; i++) addQ('medical', 'medicine', ['MedicalGameBoy']);
for (let i = 0; i < 4; i++) addQ('medical', 'medicine', ['MedicalGameBoy', 'MedicalConfirmed']); // multi-collection
for (let i = 0; i < 5; i++) addQ('medical', 'surgery', ['MedicalMidgard']);
for (let i = 0; i < 3; i++) addQ('nursing', 'medicine', ['NursingConfirmed']);
const PROGRESS = [ // user 7 finished 5 of 10 GameBoy medicine, and all 5 surgery Midgard
    ...[1, 2, 3, 4, 5].map((q) => ({ user_id: 7, question_id: q })),
    ...[11, 12, 13, 14, 15].map((q) => ({ user_id: 7, question_id: q })),
    { user_id: 8, question_id: 1 },
];

/** Answers the two COUNT queries by the rule their SQL states; counts calls. */
function makeMemoryDb() {
    const calls = [];
    return {
        calls,
        async query(sql, params) {
            calls.push({ sql: sql.replace(/\s+/g, ' ').trim(), params });
            const arrays = (v) => (Array.isArray(v) ? `{${v.join(',')}}` : v);
            if (/COUNT\(\*\) as total/.test(sql)) {
                const [track, type, source] = params;
                const n = QUESTIONS.filter((q) => q.track === track && q.question_type === arrays(type) && q.sources.includes(arrays(source))).length;
                return { rows: [{ total: String(n) }] }; // pg returns bigint as a string
            }
            if (/COUNT\(\*\) as completed/.test(sql)) {
                const [userId, type, source] = params;
                const n = PROGRESS.filter((p) => p.user_id === Number(userId)).filter((p) => {
                    const q = QUESTIONS.find((x) => x.id === p.question_id);
                    return q && q.question_type === arrays(type) && q.sources.includes(arrays(source));
                }).length;
                return { rows: [{ completed: String(n) }] };
            }
            throw new Error('unexpected query');
        },
    };
}

// ---------------------------------------------------------------- http helpers
function startApp(handlerFactory, db) {
    const app = express();
    // stand-ins for requireSession / requireOwnUser: the session account is 7, track from the session
    app.get('/api/check-completion/:userId',
        (req, res, next) => { req.accountId = 7; req.userTrack = 'medical'; next(); },
        (req, res, next) => (Number(req.params.userId) !== req.accountId ? res.status(403).json({ message: 'Forbidden' }) : next()),
        handlerFactory({ db, resolveContentTrack: (req) => req.userTrack }));
    return new Promise((resolve) => {
        const server = app.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
    });
}
function get(port, pathAndQuery) {
    return new Promise((resolve, reject) => {
        http.get({ host: '127.0.0.1', port, path: pathAndQuery }, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve({
                status: res.statusCode,
                body: Buffer.concat(chunks).toString('utf8'),
                headers: {
                    'content-type': res.headers['content-type'],
                    'content-length': res.headers['content-length'],
                    etag: res.headers.etag,
                },
            }));
        }).on('error', reject);
    });
}

const SENTINEL_URLS = [
    '/api/check-completion/7?type=medicine&source=MidgardGameBoy',
    '/api/check-completion/7?type=surgery&source=MidgardGameBoy',
    '/api/check-completion/7?type=mix&source=MidgardGameBoy',
    '/api/check-completion/7?source=MidgardGameBoy',                        // no type
    '/api/check-completion/7?type=&source=MidgardGameBoy',                  // empty type
    '/api/check-completion/7?type=medicine&type=surgery&source=MidgardGameBoy', // type array
    '/api/check-completion/7?type%5Bx%5D=1&source=MidgardGameBoy',          // type object
    '/api/check-completion/7?type=pediatrics&source=MidgardGameBoy&extra=1',
];
const OTHER_URLS = [
    '/api/check-completion/7?type=medicine&source=MedicalGameBoy',     // 5 of 10
    '/api/check-completion/7?type=medicine&source=MedicalConfirmed',   // 0 of 4 completed? ids 7-10 not done
    '/api/check-completion/7?type=surgery&source=MedicalMidgard',      // 5 of 5 -> completed
    '/api/check-completion/7?type=medicine&source=NursingConfirmed',   // other bank: 0 (track is medical)
    '/api/check-completion/7?type=medicine&source=midgardgameboy',     // other casing is NOT the sentinel
    '/api/check-completion/7?type=medicine&source=MidgardGameBoy2',    // lookalike
    '/api/check-completion/7?type=medicine&source=MidgardGameBoy&source=MedicalGameBoy', // array: not the sentinel
    '/api/check-completion/7?type=medicine',                           // no source at all
    '/api/check-completion/7?source=MedicalGameBoy',                   // no type
];

async function compare(makeDb, urls) {
    const dbOld = makeDb(); const dbNew = makeDb();
    const a = await startApp(makeLegacyHandler, dbOld);
    const b = await startApp(makeCheckCompletionHandler, dbNew);
    const out = [];
    try {
        for (const url of urls) {
            const callsBeforeOld = dbOld.calls.length; const callsBeforeNew = dbNew.calls.length;
            const oldRes = await get(a.port, url);
            const newRes = await get(b.port, url);
            out.push({ url, oldRes, newRes, oldCalls: dbOld.calls.length - callsBeforeOld, newCalls: dbNew.calls.length - callsBeforeNew });
        }
    } finally { a.server.close(); b.server.close(); }
    return out;
}

// ---------------------------------------------------------------- tests (in-memory db)
test('sentinel: response is byte-for-byte the old handler response, and no database call is made', async () => {
    const results = await compare(makeMemoryDb, SENTINEL_URLS);
    for (const r of results) {
        assert.deepEqual(r.newRes, r.oldRes, `identical response for ${r.url}`);
        assert.equal(r.newRes.status, 200);
        assert.equal(r.newRes.body, '{"total":0,"completed":0,"isCompleted":false,"percentage":0}');
        assert.equal(r.oldCalls, 2, `the old handler made 2 queries for ${r.url}`);
        assert.equal(r.newCalls, 0, `the new handler made 0 queries for ${r.url}`);
    }
});

test('every other source still hits the database (2 queries) and answers exactly as before', async () => {
    const results = await compare(makeMemoryDb, OTHER_URLS);
    for (const r of results) {
        assert.deepEqual(r.newRes, r.oldRes, `identical response for ${r.url}`);
        assert.equal(r.newCalls, 2, `2 queries for ${r.url}`);
        assert.equal(r.oldCalls, 2);
    }
    const byUrl = Object.fromEntries(results.map((r) => [r.url, JSON.parse(r.newRes.body)]));
    assert.deepEqual(byUrl['/api/check-completion/7?type=medicine&source=MedicalGameBoy'], { total: 10, completed: 5, isCompleted: false, percentage: 50 });
    assert.deepEqual(byUrl['/api/check-completion/7?type=surgery&source=MedicalMidgard'], { total: 5, completed: 5, isCompleted: true, percentage: 100 });
});

test('a database failure on a real source is still a 500 with the same body', async () => {
    const failing = () => ({ calls: [], async query() { throw new Error('db down'); } });
    const orig = console.error; console.error = () => {};
    try {
        const results = await compare(failing, ['/api/check-completion/7?type=medicine&source=MedicalGameBoy']);
        assert.equal(results[0].newRes.status, 500);
        assert.deepEqual(results[0].newRes, results[0].oldRes);
    } finally { console.error = orig; }
});

test('auth ordering is unchanged: another user id is refused before the handler runs', async () => {
    const dbNew = makeMemoryDb();
    const b = await startApp(makeCheckCompletionHandler, dbNew);
    try {
        const r = await get(b.port, '/api/check-completion/8?type=medicine&source=MidgardGameBoy');
        assert.equal(r.status, 403);
        assert.equal(dbNew.calls.length, 0);
    } finally { b.server.close(); }
});

test('only the exact sentinel string is short-circuited', () => {
    assert.equal(DEAD_COMPLETION_SOURCE, 'MidgardGameBoy');
    assert.equal(isDeadCompletionSource('MidgardGameBoy'), true);
    for (const v of ['midgardgameboy', 'MidgardGameBoy ', 'MidgardGameBoy2', '', undefined, null, ['MidgardGameBoy'], { a: 1 }, 'MedicalGameBoy']) {
        assert.equal(isDeadCompletionSource(v), false, String(JSON.stringify(v)));
    }
    assert.equal(JSON.stringify(deadCompletionBody()), '{"total":0,"completed":0,"isCompleted":false,"percentage":0}');
});

test('app.js keeps requireSession and requireOwnUser in front of the completion handler', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    const line = src.split(/\r?\n/).find((l) => l.includes("'/api/check-completion/:userId'"));
    assert.ok(line, 'route is registered');
    const iSession = line.indexOf('requireSession');
    const iOwn = line.indexOf("requireOwnUser('userId')");
    const iHandler = line.indexOf('makeCheckCompletionHandler');
    assert.ok(iSession > 0 && iOwn > iSession && iHandler > iOwn, 'order: requireSession, requireOwnUser, handler');
    assert.equal(src.match(/api\/check-completion/g).length, 1, 'only one registration');
});

// ---------------------------------------------------------------- tests (real SQL on PGlite)
let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

async function makePgDb() {
    const pg = new PGlite();
    await pg.exec(`
        CREATE TABLE questions (id int PRIMARY KEY, track text NOT NULL, question_type text, source text, sources text[]);
        CREATE TABLE user_question_progress (user_id int NOT NULL, question_id int NOT NULL, UNIQUE (user_id, question_id));`);
    for (const q of QUESTIONS) {
        await pg.query('INSERT INTO questions (id, track, question_type, source, sources) VALUES ($1,$2,$3,$4,$5)',
            [q.id, q.track, q.question_type, q.sources[0], q.sources]);
    }
    for (const p of PROGRESS) await pg.query('INSERT INTO user_question_progress VALUES ($1,$2)', [p.user_id, p.question_id]);
    const calls = [];
    return { calls, query: async (sql, params) => { calls.push(sql); return pg.query(sql, params); } };
}

test('real SQL (PGlite): sentinel old == new, 0 queries; other sources unchanged', { skip }, async () => {
    const dbOld = await makePgDb(); const dbNew = await makePgDb();
    const a = await startApp(makeLegacyHandler, dbOld);
    const b = await startApp(makeCheckCompletionHandler, dbNew);
    try {
        for (const url of [...SENTINEL_URLS, ...OTHER_URLS]) {
            const o = await get(a.port, url); const n = await get(b.port, url);
            assert.deepEqual(n, o, `identical response for ${url}`);
        }
        // sentinel URLs cost the new handler nothing; the other URLs cost it 2 queries each
        assert.equal(dbNew.calls.length, OTHER_URLS.length * 2);
        assert.equal(dbOld.calls.length, (SENTINEL_URLS.length + OTHER_URLS.length) * 2);
    } finally { a.server.close(); b.server.close(); }
});

test('assumption guard (PGlite): the old SQL answers 0 for the sentinel only while no question carries it', { skip }, async () => {
    const db = await makePgDb();
    const old = await db.query('SELECT COUNT(*) AS total FROM questions WHERE track = $1 AND question_type = $2 AND $3 = ANY(sources)', ['medical', 'medicine', 'MidgardGameBoy']);
    assert.equal(Number(old.rows[0].total), 0, 'no question carries the sentinel (also true live: 0 of 14,376 on 11 Nov 2026)');
    // If an import ever filed a question under the sentinel, the old SQL would count it and the
    // short circuit would be wrong: this documents exactly what to revisit then.
    await db.query("INSERT INTO questions (id, track, question_type, source, sources) VALUES (999, 'medical', 'medicine', 'MidgardGameBoy', ARRAY['MidgardGameBoy'])");
    const after = await db.query('SELECT COUNT(*) AS total FROM questions WHERE track = $1 AND question_type = $2 AND $3 = ANY(sources)', ['medical', 'medicine', 'MidgardGameBoy']);
    assert.equal(Number(after.rows[0].total), 1);
});
