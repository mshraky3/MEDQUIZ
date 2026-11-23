/**
 * Exam-mode endpoints against PGlite (no local Postgres exists). PGlite is not a
 * repo dependency: install it outside the repo and point PGLITE_PATH at
 * node_modules/@electric-sql/pglite, otherwise these tests are skipped.
 * The routes are mounted on a throwaway express app whose stand-in for
 * requireSession reads the account from a test header, so what is under test is
 * the exam router itself: entitlement, picking rules, a locked free account.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import express from 'express';
import { pathToFileURL, fileURLToPath } from 'node:url';
import examRouter from './exam.js';
import { normaliseText } from '../services/examPicker.js';

const here = path.dirname(fileURLToPath(import.meta.url));

let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

process.env.PAYMENT_ENFORCEMENT_ENABLED = 'true';

const FUTURE = new Date(Date.now() + 30 * 86400000).toISOString();

async function setup() {
    const db = new PGlite();
    await db.exec(`
        CREATE TABLE accounts (id SERIAL PRIMARY KEY, username text, track text DEFAULT 'medical',
            subscription_status text, subscription_expiry_date timestamptz,
            is_admin_created boolean DEFAULT false, grandfathered_at timestamptz);
        CREATE TABLE questions (id SERIAL PRIMARY KEY, question_text text, option1 text, option2 text, option3 text, option4 text,
            question_type varchar(100), correct_option text, source varchar(100), track varchar(20) DEFAULT 'medical',
            explanation text, sources text[] DEFAULT '{}');
        CREATE TABLE final_review_sessions (id SERIAL PRIMARY KEY, session_id uuid DEFAULT gen_random_uuid(),
            user_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            question_type varchar(100) NOT NULL, source varchar(100) NOT NULL,
            total_questions integer NOT NULL, correct_answers integer NOT NULL, score numeric NOT NULL,
            time_taken integer NOT NULL, time_limit integer NOT NULL,
            start_time timestamp DEFAULT now(), end_time timestamp, session_metadata jsonb,
            created_at timestamp DEFAULT now(), question_ids integer[] DEFAULT '{}');
        CREATE TABLE final_quiz_attempts (id SERIAL PRIMARY KEY,
            session_id integer REFERENCES final_review_sessions(id) ON DELETE CASCADE,
            question_id integer, user_answer varchar(255) NOT NULL, correct_answer varchar(255) NOT NULL,
            is_correct boolean, time_taken integer DEFAULT 0, created_at timestamp DEFAULT now());
    `);

    // accounts: 1 paid medical, 2 free medical, 3 paid nursing, 4 paid dental, 5 free nursing
    await db.query(`INSERT INTO accounts (username, track, subscription_status, subscription_expiry_date) VALUES
        ('paid-med', 'medical', 'active', $1), ('free-med', 'medical', NULL, NULL),
        ('paid-nur', 'nursing', 'active', $1), ('paid-den', 'dental', 'active', $1),
        ('free-nur', 'nursing', NULL, NULL)`, [FUTURE]);

    let n = 0;
    const add = async (track, specialty, source, count, over = {}) => {
        for (let i = 0; i < count; i += 1) {
            n += 1;
            const v = {
                text: `${specialty} question ${n}`, o4: 'D choice', expl: 'because', ...over,
            };
            await db.query(
                `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source, track, explanation, sources)
                 VALUES ($1, 'A choice', 'B choice', 'C choice', $2, $3, 'B choice', $4::text, $5, $6, ARRAY[$4::text])`,
                [v.text, v.o4, specialty, source, track, v.expl]
            );
        }
    };
    // medical: usable 120 + 80 + 90 + 60 = 350, plus rows the rules must refuse
    await add('medical', 'medicine', 'MedicalGameBoy', 120);
    await add('medical', 'surgery', 'MedicalGameBoy', 80);
    await add('medical', 'pediatric', 'MedicalConfirmed', 90);
    await add('medical', 'obstetrics and gynecology', 'MedicalGameBoy', 60);
    await add('medical', 'medicine', 'MedicalGameBoy', 15, { expl: null });          // no explanation
    await add('medical', 'medicine', 'MedicalGameBoy', 15, { expl: '   ' });         // blank explanation
    await add('medical', 'surgery', 'MedicalGameBoy', 15, { o4: " Didn't Recall " }); // placeholder
    await add('medical', 'surgery', 'MedicalGameBoy', 10, { o4: 'a choice' });       // identical options
    await add('medical', 'surgery', 'OldUnkeptSource', 20);                           // not a kept source
    // one text appearing twice (same recall in two collections)
    await add('medical', 'pediatric', 'MedicalGameBoy', 1, { text: 'medicine question 1' });
    // nursing (no source filter): adult 150 + 40 med-surg/mental, mc 120, fundamentals 90, no management
    await add('nursing', 'medical surgical nursing', 'NursingConfirmed', 110);
    await add('nursing', 'mental health nursing', 'NursingConfirmed', 40);
    await add('nursing', 'maternal and newborn nursing', 'NursingConfirmed', 60);
    await add('nursing', 'pediatric nursing', 'NursingConfirmed', 60);
    await add('nursing', 'nursing fundamentals', 'NursingConfirmed', 60);
    await add('nursing', 'nursing pharmacology', 'NursingConfirmed', 30);
    // dental: a small pool of 60 (below the 100-question practice length)
    await add('dental', 'endodontics', 'DentalExplained', 40);
    await add('dental', 'periodontics', 'DentalExplained', 20);
    return db;
}

async function serve(db) {
    const app = express();
    app.use(express.json());
    app.use('/api/exam', async (req, res, next) => {
        const username = req.headers['x-test-user'];
        const { rows } = await db.query('SELECT id, track FROM accounts WHERE username = $1', [username]);
        if (!rows[0]) return res.status(401).json({ message: 'no session' });
        req.db = db;
        req.accountId = rows[0].id;
        req.userTrack = rows[0].track; // what requireSession derives from the account
        next();
    }, examRouter);
    const server = http.createServer(app);
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const call = async (user, method, url, body) => {
        const res = await fetch(base + url, {
            method,
            headers: { 'content-type': 'application/json', 'x-test-user': user },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        return { status: res.status, body: await res.json() };
    };
    return { call, close: () => new Promise((r) => server.close(r)) };
}

const assertRules = (questions) => {
    const ids = new Set();
    const texts = new Set();
    for (const x of questions) {
        assert.equal('explanation' in x, false, 'no explanation in the payload');
        for (const k of ['option1', 'option2', 'option3', 'option4']) {
            assert.notEqual(normaliseText(x[k]), "didn't recall");
            assert.notEqual(normaliseText(x[k]), '');
        }
        assert.equal(new Set([x.option1, x.option2, x.option3, x.option4].map(normaliseText)).size, 4, 'four distinct options');
        assert.ok(!ids.has(x.id));
        ids.add(x.id);
        const t = normaliseText(x.question_text);
        assert.ok(!texts.has(t), 'no repeated text');
        texts.add(t);
    }
};

test('config: entitlement and exam shape per account', { skip }, async () => {
    const db = await setup();
    const api = await serve(db);
    try {
        const paid = await api.call('paid-med', 'GET', '/api/exam/config');
        assert.equal(paid.status, 200);
        assert.equal(paid.body.entitlement, 'full');
        assert.equal(paid.body.track, 'medical');
        assert.equal(paid.body.full.exam.key, 'smle');
        assert.equal(paid.body.full.exam.confirmed, true);
        assert.deepEqual(paid.body.full.parts.map((p) => [p.questions, p.minutes]), [[100, 120], [100, 120]]);
        assert.equal(paid.body.full.served, 200);

        const free = await api.call('free-med', 'GET', '/api/exam/config');
        assert.equal(free.body.entitlement, 'locked');

        const dental = await api.call('paid-den', 'GET', '/api/exam/config');
        assert.equal(dental.body.full.exam.key, 'sdle');
        assert.equal(dental.body.full.exam.confirmed, true);
        assert.equal(dental.body.full.exam.practiceLength, false);
        assert.equal(dental.body.full.capped, true);
        assert.equal(dental.body.full.served, 60);
        assert.equal((await api.call('nobody', 'GET', '/api/exam/config')).status, 401);
    } finally { await api.close(); await db.close(); }
});

test('paid SMLE start: 200 questions, rules obeyed, track from the session, no explanation', { skip }, async () => {
    const db = await setup();
    const api = await serve(db);
    try {
        // A body that tries to choose another track or exam must be ignored.
        const r = await api.call('paid-med', 'POST', '/api/exam/start', { track: 'nursing', examKey: 'snle', demo: true });
        assert.equal(r.status, 200);
        assert.equal(r.body.mode, 'full');
        assert.equal(r.body.exam.key, 'smle');
        assert.equal(r.body.questions.length, 200);
        assert.equal(r.body.served, 200);
        assert.equal(r.body.capped, false);
        assert.deepEqual(r.body.parts.map((p) => p.questions), [100, 100]);
        assertRules(r.body.questions);
        const types = new Set(r.body.questions.map((x) => x.question_type));
        assert.deepEqual([...types].sort(), ['medicine', 'obstetrics and gynecology', 'pediatric', 'surgery']);
        // un-kept source never appears, nor does the blank-explanation medicine row
        const ids = r.body.questions.map((x) => x.id);
        const { rows } = await db.query(`SELECT id FROM questions WHERE id = ANY($1::int[]) AND (source = 'OldUnkeptSource' OR explanation IS NULL OR BTRIM(explanation) = '' OR track <> 'medical')`, [ids]);
        assert.equal(rows.length, 0);
        // proportional by specialty: medicine (the biggest pool) leads
        const count = (t) => r.body.questions.filter((x) => x.question_type === t).length;
        assert.ok(count('medicine') > count('surgery'));
        // two starts give different orders
        const r2 = await api.call('paid-med', 'POST', '/api/exam/start', {});
        assert.notDeepEqual(r2.body.questions.map((x) => x.id), ids);
    } finally { await api.close(); await db.close(); }
});

test('paid SNLE start: blueprint split, management reported short', { skip }, async () => {
    const db = await setup();
    const api = await serve(db);
    try {
        const r = await api.call('paid-nur', 'POST', '/api/exam/start', {});
        assert.equal(r.status, 200);
        assert.equal(r.body.exam.key, 'snle');
        assert.equal(r.body.questions.length, 200);
        assertRules(r.body.questions);
        const dom = Object.fromEntries(r.body.byDomain.map((d) => [d.key, d]));
        assert.equal(dom.management.got, 0);
        assert.equal(dom.management.wanted, 20);
        assert.ok(r.body.notes.some((n) => n.code === 'domain_short' && n.domain === 'management'));
        // adult 150 available, maternal-child 120, fundamentals 90: all >= their raised share
        assert.equal(dom.adult.got + dom.maternal_child.got + dom.fundamentals.got, 200);
        assert.ok(dom.adult.got > dom.maternal_child.got && dom.maternal_child.got >= dom.fundamentals.got);
    } finally { await api.close(); await db.close(); }
});

test('dental start: smaller pool caps the count and the response says so', { skip }, async () => {
    const db = await setup();
    const api = await serve(db);
    try {
        const r = await api.call('paid-den', 'POST', '/api/exam/start', {});
        assert.equal(r.status, 200);
        assert.equal(r.body.exam.key, 'sdle');
        assert.equal(r.body.exam.confirmed, true);
        assert.equal(r.body.requested, 200);
        assert.equal(r.body.served, 60);
        assert.equal(r.body.capped, true);
        assert.deepEqual(r.body.parts.map((p) => [p.questions, p.minutes]), [[30, 36], [30, 36]]);
        assert.ok(r.body.notes.some((n) => n.code === 'pool_short'));
        assertRules(r.body.questions);
    } finally { await api.close(); await db.close(); }
});

test('free account: the exam is locked, nothing is served and nothing is saved', { skip }, async () => {
    const db = await setup();
    const api = await serve(db);
    try {
        const r = await api.call('free-med', 'POST', '/api/exam/start', {});
        assert.equal(r.status, 403);
        assert.equal(r.body.code, 'SUBSCRIPTION_REQUIRED');
        assert.equal(r.body.questions, undefined);
        assert.equal((await api.call('free-med', 'GET', '/api/exam/config')).body.entitlement, 'locked');
        assert.equal((await db.query('SELECT COUNT(*)::int c FROM final_review_sessions')).rows[0].c, 0);
    } finally { await api.close(); }
});

test('the router never reads a track, user id or exam key from the request', () => {
    const src = fs.readFileSync(path.join(here, 'exam.js'), 'utf8');
    assert.ok(!/req\.(query|body)\??\.(track|userId|user_id|examKey|exam_key)/.test(src));
    assert.match(src, /req\.userTrack/);
    assert.match(src, /req\.accountId/);
    const app = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    assert.match(app, /app\.use\('\/api\/exam', requireSession,/);
});
