/**
 * Bank-count cache (change C4). Behaviour tests use a counting stub db and an injected clock;
 * the equivalence tests run the ORIGINAL queries and the cache over the same data on PGlite
 * (set PGLITE_PATH, else skipped) and require identical numbers for every track, specialty and
 * collection. The same comparison was run against the live bank on 11 Nov 2026: 75 combinations,
 * 0 mismatches (see _private-data/SQB/optimization/changes/04-bank-count-cache.md).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createBankCounts, BANK_COUNTS_TTL_MS, BANK_COUNTS_SQL } from './bankCounts.js';

const here = path.dirname(fileURLToPath(import.meta.url));

// ------------------------------------------------------------------ stub db + clock
function stub(rows) {
    const s = { calls: 0, rows, fail: false, gate: null, async query(sql) {
        s.calls += 1;
        if (s.gate) await s.gate;
        if (s.fail) throw new Error('db down');
        assert.equal(sql, BANK_COUNTS_SQL);
        return { rows: s.rows };
    } };
    return s;
}
const ROWS = [
    { kind: 'type', track: 'medical', question_type: 'medicine', source: null, total: 12 },
    { kind: 'type', track: 'medical', question_type: 'surgery', source: null, total: 5 },
    { kind: 'type', track: 'nursing', question_type: 'nursing medical', source: null, total: 3 },
    { kind: 'source', track: 'medical', question_type: 'medicine', source: 'MedicalGameBoy', total: 10 },
    { kind: 'source', track: 'medical', question_type: 'medicine', source: 'MedicalConfirmed', total: 4 },
    { kind: 'source', track: 'medical', question_type: 'surgery', source: 'MedicalGameBoy', total: 5 },
    { kind: 'source', track: 'nursing', question_type: 'nursing medical', source: 'NursingConfirmed', total: 3 },
];
function clock() { const c = { t: 1_000_000, now: () => c.t, tick(ms) { c.t += ms; } }; return c; }

test('one query serves many calls inside the TTL, across hub and submit lookups', async () => {
    const db = stub(ROWS); const c = clock();
    const bc = createBankCounts({ db, now: c.now });
    assert.deepEqual((await bc.typeResult('medical')).rows.sort((a, b) => a.question_type.localeCompare(b.question_type)),
        [{ question_type: 'medicine', total: 12 }, { question_type: 'surgery', total: 5 }]);
    assert.deepEqual((await bc.sourceResult('medical')).rows.sort((a, b) => a.source.localeCompare(b.source)),
        [{ source: 'MedicalConfirmed', total: 4 }, { source: 'MedicalGameBoy', total: 15 }]);
    assert.equal(await bc.comboCount('medical', 'medicine', 'MedicalGameBoy'), 10);
    assert.equal(await bc.comboCount('medical', 'medicine', 'NursingConfirmed'), 0);
    assert.equal(await bc.comboCount('nursing', 'medicine', 'NursingConfirmed'), 0, 'track is part of the key');
    assert.deepEqual((await bc.typeResult('dental')).rows, [], 'unknown track: empty, like the old query');
    assert.equal(db.calls, 1);
    c.tick(BANK_COUNTS_TTL_MS - 1);
    await bc.typeResult('medical');
    assert.equal(db.calls, 1, 'still fresh just before the TTL');
    c.tick(2);
    await bc.typeResult('medical');
    assert.equal(db.calls, 2, 'refreshed after the TTL');
});

test('concurrent callers on a cold instance share one refresh', async () => {
    const db = stub(ROWS); let open; db.gate = new Promise((r) => { open = r; });
    const bc = createBankCounts({ db });
    const all = Promise.all([bc.typeResult('medical'), bc.sourceResult('medical'), bc.comboCount('medical', 'medicine', 'MedicalGameBoy')]);
    open(); await all;
    assert.equal(db.calls, 1);
});

test('invalidate() forces a fresh read and a refresh that started before it is not stored', async () => {
    const db = stub(ROWS); const bc = createBankCounts({ db });
    await bc.typeResult('medical'); assert.equal(db.calls, 1);
    bc.invalidate();
    await bc.typeResult('medical'); assert.equal(db.calls, 2);

    const db2 = stub(ROWS); let open; db2.gate = new Promise((r) => { open = r; });
    const bc2 = createBankCounts({ db: db2 });
    const inflight = bc2.typeResult('medical'); // starts a refresh
    bc2.invalidate();                            // admin write lands while it runs
    open(); await inflight;
    db2.gate = null;
    await bc2.typeResult('medical');
    assert.equal(db2.calls, 2, 'the pre-invalidate result was not kept as the snapshot');
});

test('a failed refresh serves the previous snapshot; with none, the error reaches the caller', async () => {
    const db = stub(ROWS); const c = clock();
    const bc = createBankCounts({ db, now: c.now });
    await assert.doesNotReject(bc.typeResult('medical'));
    db.fail = true; c.tick(BANK_COUNTS_TTL_MS + 1);
    assert.equal((await bc.typeResult('medical')).rows.length, 2, 'stale snapshot beats an error');
    db.fail = false;
    assert.equal(db.calls, 2);
    await bc.typeResult('medical');
    assert.equal(db.calls, 3, 'retried on the next call');

    const cold = createBankCounts({ db: Object.assign(stub(ROWS), { fail: true }) });
    await assert.rejects(cold.typeResult('medical'), /db down/);
});

test('non-string type or source returns null so the caller runs the original query', async () => {
    const bc = createBankCounts({ db: stub(ROWS) });
    for (const args of [['medical', undefined, 'x'], ['medical', 'medicine', undefined], ['medical', null, 'x'], [undefined, 'medicine', 'x']]) {
        assert.equal(await bc.comboCount(...args), null);
    }
});

test('app.js wiring: hub and submit use the snapshot, and every question write invalidates it', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
    assert.match(src, /bankCounts\.typeResult\(track\),\s*bankCounts\.sourceResult\(track\)/);
    assert.match(src, /bankCounts\.comboCount\(resolveContentTrack\(req\), type, source\)/);
    const clears = src.match(/questionsCache\.clear\(\);/g).length;
    const invalidates = src.match(/bankCounts\.invalidate\(\)/g).length;
    assert.ok(invalidates >= clears + 1, `every questionsCache.clear() (${clears}) has an invalidate, plus the recall import (${invalidates})`);
    assert.ok(!/FROM questions WHERE track = \$1 GROUP BY question_type/.test(src), 'old hub type query is gone');
});

// ------------------------------------------------------------------ equivalence on real SQL (PGlite)
let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

async function seed() {
    const pg = new PGlite();
    await pg.exec('CREATE TABLE questions (id serial PRIMARY KEY, track text NOT NULL, question_type text, source text, sources text[])');
    const specs = [
        ['medical', 'medicine', ['MedicalGameBoy'], 30],
        ['medical', 'medicine', ['MedicalGameBoy', 'MedicalConfirmed'], 12],   // multi-collection
        ['medical', 'medicine', ['MedicalOctoberRecall', 'MedicalMonthlyRecall', 'MedicalMidgard'], 7],
        ['medical', 'surgery', ['MedicalMidgard'], 9],
        ['medical', 'pediatric', ['MedicalConfirmed', 'MedicalMidgard'], 4],
        ['nursing', 'nursing medical', ['NursingConfirmed'], 6],
        ['nursing', 'nursing medical', ['NursingMostRepeated', 'NursingEMS'], 5],
        ['dental', 'dental endodontics', ['DentalExplained'], 8],
        ['medical', 'obstetrics and gynecology', [], 2],                          // no collection at all
    ];
    for (const [track, type, sources, n] of specs) {
        await pg.query('INSERT INTO questions (track, question_type, source, sources) SELECT $1, $2, $3, $4::text[] FROM generate_series(1, $5)',
            [track, type, sources[0] || 'general', sources, n]);
    }
    return pg;
}

test('real SQL: hub rows (per track) equal the old GROUP BY queries', { skip }, async () => {
    const pg = await seed();
    const bc = createBankCounts({ db: pg });
    for (const track of ['medical', 'nursing', 'dental', 'none']) {
        const oldType = (await pg.query('SELECT question_type, COUNT(*)::int AS total FROM questions WHERE track = $1 GROUP BY question_type', [track])).rows;
        const oldSource = (await pg.query('SELECT s AS source, COUNT(*)::int AS total FROM questions, unnest(sources) AS s WHERE track = $1 GROUP BY s', [track])).rows;
        const key = (r) => JSON.stringify(Object.entries(r).sort());
        assert.deepEqual((await bc.typeResult(track)).rows.map(key).sort(), oldType.map(key).sort(), `types ${track}`);
        assert.deepEqual((await bc.sourceResult(track)).rows.map(key).sort(), oldSource.map(key).sort(), `sources ${track}`);
    }
});

test('real SQL: every (track, specialty, collection) count equals the old submit-chain query', { skip }, async () => {
    const pg = await seed();
    const bc = createBankCounts({ db: pg });
    const tracks = ['medical', 'nursing', 'dental'];
    const types = ['medicine', 'surgery', 'pediatric', 'nursing medical', 'dental endodontics', 'obstetrics and gynecology', 'ethics'];
    const sources = ['MedicalGameBoy', 'MedicalConfirmed', 'MedicalMidgard', 'MedicalOctoberRecall', 'MedicalMonthlyRecall',
        'NursingConfirmed', 'NursingMostRepeated', 'NursingEMS', 'DentalExplained', 'MidgardGameBoy', 'general', 'nope'];
    let checked = 0;
    for (const track of tracks) for (const type of types) for (const source of sources) {
        const old = (await pg.query('SELECT COUNT(*)::int AS c FROM questions WHERE track = $1 AND question_type = $2 AND $3 = ANY(sources)', [track, type, source])).rows[0].c;
        assert.equal(await bc.comboCount(track, type, source), old, `${track}/${type}/${source}`);
        checked += 1;
    }
    assert.equal(checked, tracks.length * types.length * sources.length);
});

test('real SQL: a question added then invalidate() shows up at once, and not before without it', { skip }, async () => {
    const pg = await seed();
    const bc = createBankCounts({ db: pg });
    assert.equal(await bc.comboCount('medical', 'surgery', 'MedicalMidgard'), 9);
    await pg.query("INSERT INTO questions (track, question_type, source, sources) VALUES ('medical','surgery','MedicalMidgard','{MedicalMidgard}')");
    assert.equal(await bc.comboCount('medical', 'surgery', 'MedicalMidgard'), 9, 'cached inside the TTL (the stated trade-off)');
    bc.invalidate();
    assert.equal(await bc.comboCount('medical', 'surgery', 'MedicalMidgard'), 10);
});
