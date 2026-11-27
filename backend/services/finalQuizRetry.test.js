/**
 * Retry safety of POST /final-quiz/submit.
 *
 * The three clients (QUIZ.jsx, ExamPage.jsx, the Android app) send the same body up
 * to three times, adding retry_attempt on the 2nd and 3rd. Whatever failed the
 * first time (the reply, the insert of the answers, nothing at all), the student
 * must end with exactly one history row and one set of answers.
 *
 * The route itself is run: its source is cut out of app.js (importing app.js would
 * open a real pool and listen on a port) and bound to a PGlite database.
 *
 * PGlite is not a repo dependency: install it outside the repo and point
 * PGLITE_PATH at node_modules/@electric-sql/pglite, otherwise these tests are
 * skipped. PGlite has ONE connection, so two requests really running at once cannot
 * be reproduced here; the test of the per-user lock only checks that it is taken.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { insertFinalQuizAttempts } from './finalQuizAttempts.js';
import { validationMode, judgeAnswer, loadQuestionsById } from './attemptValidation.js';
import { recomputeSessionSummary } from './sessionSummary.js';
import { saveFinalQuiz } from './finalQuizSave.js';

let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped below */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

const here = path.dirname(fileURLToPath(import.meta.url));
const appSource = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
const routeFrom = appSource.indexOf("app.post('/final-quiz/submit'");
const routeTo = appSource.indexOf('// Get final quiz sessions history', routeFrom);

/** The handler of the real route, bound to `db`. */
function submitRoute(db) {
    assert.ok(routeFrom !== -1 && routeTo > routeFrom, 'the route was found in app.js');
    let handler = null;
    const pass = (req, res, next) => next();
    const quiet = { info() {}, warn() {}, error() {}, debug() {} };
    const deps = {
        app: { post: (...args) => { handler = args.at(-1); } },
        requireSession: pass,
        requireOwnBodyUser: () => pass,
        subscriberOnly: pass,
        db,
        logger: quiet,
        notifyBackendError: async () => {},
        validationMode,
        judgeAnswer,
        loadQuestionsById,
        recomputeSessionSummary,
        saveFinalQuiz,
    };
    new Function(...Object.keys(deps), appSource.slice(routeFrom, routeTo))(...Object.values(deps));
    return async (body) => {
        const res = { code: 200, body: null, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
        // The JSON round trip is what a request does to the body.
        await handler({ body: JSON.parse(JSON.stringify(body)) }, res);
        return res;
    };
}

/**
 * A stand-in for the pg Pool over PGlite's single connection: a connected client
 * owns it until release(). `failWhen(sql)` makes that statement fail inside
 * Postgres, so an open transaction is aborted the way a real error aborts it.
 */
function poolOver(pg) {
    const pool = { log: [], failWhen: null };
    let queue = Promise.resolve();
    const acquire = () => {
        let free;
        const mine = new Promise((resolve) => { free = resolve; });
        const ready = queue.then(() => free);
        queue = queue.then(() => mine);
        return ready;
    };
    const run = async (sql, params) => {
        pool.log.push(sql);
        if (pool.failWhen?.(sql)) {
            await pg.query('SELECT 1/0').catch(() => {});
            throw new Error('Connection terminated unexpectedly');
        }
        return pg.query(sql, params);
    };
    pool.query = async (sql, params) => {
        const free = await acquire();
        try { return await run(sql, params); } finally { free(); }
    };
    pool.connect = async () => {
        const free = await acquire();
        return { query: run, release: () => free() };
    };
    return pool;
}

/** Column types and NOT NULLs as in production (information_schema, 27 Nov 2026). */
async function setup(questions = 4) {
    const pg = new PGlite();
    await pg.exec(`
        CREATE TABLE questions (id SERIAL PRIMARY KEY, option1 text, option2 text, option3 text, option4 text, correct_option text);
        CREATE TABLE final_review_sessions (id SERIAL PRIMARY KEY, session_id uuid DEFAULT gen_random_uuid(),
            user_id integer NOT NULL, question_type varchar(100) NOT NULL, source varchar(100) NOT NULL,
            total_questions integer NOT NULL, correct_answers integer NOT NULL, score numeric NOT NULL,
            time_taken integer NOT NULL, time_limit integer NOT NULL,
            start_time timestamp DEFAULT CURRENT_TIMESTAMP, end_time timestamp,
            session_metadata jsonb, question_ids integer[] DEFAULT '{}');
        CREATE TABLE final_quiz_attempts (id SERIAL PRIMARY KEY,
            session_id integer NOT NULL REFERENCES final_review_sessions(id) ON DELETE CASCADE,
            question_id integer NOT NULL, user_answer varchar(255) NOT NULL, correct_answer varchar(255) NOT NULL,
            is_correct boolean NOT NULL, time_taken integer DEFAULT 0, created_at timestamp DEFAULT CURRENT_TIMESTAMP);
    `);
    await pg.query(
        `INSERT INTO questions (option1, option2, option3, option4, correct_option)
         SELECT 'A', 'B', 'C', 'D', 'B' FROM generate_series(1, $1)`,
        [questions]
    );
    const pool = poolOver(pg);
    return { pg, pool, submit: submitRoute(pool) };
}

/** A finished exam: the first half answered right, the rest wrong. */
function exam(questions = 4, over = {}) {
    const ids = Array.from({ length: questions }, (_, i) => i + 1);
    const right = Math.floor(questions / 2);
    return {
        userId: 7,
        questionType: 'exam',
        source: 'mock',
        totalQuestions: questions,
        correctAnswers: right,
        timeTaken: 100,
        timeLimit: 600,
        questionIds: ids,
        questionAttempts: ids.map((id, i) => ({
            questionId: id, userAnswer: i < right ? 'B' : 'A', correctAnswer: 'B', isCorrect: i < right, timeTaken: 25,
        })),
        sessionMetadata: { device: 'web', timestamp: '2026-11-27T10:00:00.000Z' },
        ...over,
    };
}

const history = async (pg) => (await pg.query(
    'SELECT id, total_questions, correct_answers, score::float AS score FROM final_review_sessions ORDER BY id'
)).rows;
const answersPerSession = async (pg) => (await pg.query(
    `SELECT session_id, COUNT(*)::int AS n, COUNT(DISTINCT question_id)::int AS distinct_questions
       FROM final_quiz_attempts GROUP BY 1 ORDER BY 1`
)).rows;
const failAnswers = (sql) => /INSERT INTO final_quiz_attempts/.test(sql);

async function assertSavedOnce(pg, { questions = 4, correct = 2 } = {}) {
    const rows = await history(pg);
    assert.equal(rows.length, 1, `one history row, found ${rows.length}`);
    assert.deepEqual(
        { total: rows[0].total_questions, correct: rows[0].correct_answers, score: rows[0].score },
        { total: questions, correct, score: Math.round(10000 * correct / questions) / 100 }
    );
    assert.deepEqual(await answersPerSession(pg), [{ session_id: rows[0].id, n: questions, distinct_questions: questions }]);
    return rows[0];
}

test('lost reply: the retry of a fully saved exam adds nothing', { skip }, async () => {
    const { pg, submit } = await setup();
    try {
        const first = await submit(exam());
        const retry = await submit({ ...exam(), retry_attempt: 1 });
        await assertSavedOnce(pg);
        const again = await submit({ ...exam(), retry_attempt: 2 });
        assert.equal(retry.code, 200);
        for (const r of [retry, again]) assert.deepEqual(r.body, first.body, 'the same session is reported back');
        await assertSavedOnce(pg);
    } finally { await pg.close(); }
});

test('a failed insert of the answers leaves no history row behind', { skip }, async () => {
    const { pg, pool, submit } = await setup();
    try {
        pool.failWhen = failAnswers;
        const r = await submit(exam());
        assert.equal(r.code, 500);
        assert.deepEqual(await history(pg), []);
        assert.deepEqual(await answersPerSession(pg), []);

        pool.failWhen = null;
        assert.equal((await submit({ ...exam(), retry_attempt: 1 })).code, 200);
        await assertSavedOnce(pg);
    } finally { await pg.close(); }
});

test('1,200 answers: a failure in the second chunk saves nothing, the retry saves all in 2 inserts', { skip }, async () => {
    const { pg, pool, submit } = await setup(1200);
    try {
        let chunk = 0;
        pool.failWhen = (sql) => failAnswers(sql) && ++chunk === 2;
        assert.equal((await submit(exam(1200))).code, 500);
        assert.deepEqual(await history(pg), []);
        assert.deepEqual(await answersPerSession(pg), []);

        pool.failWhen = null;
        pool.log.length = 0;
        assert.equal((await submit({ ...exam(1200), retry_attempt: 1 })).code, 200);
        assert.equal(pool.log.filter(failAnswers).length, 2);
        await assertSavedOnce(pg, { questions: 1200, correct: 600 });
    } finally { await pg.close(); }
});

// What the code before the transaction could leave behind: the row alone, or (over
// 1,000 answers) the row and the first chunk.
for (const kept of [0, 1000]) {
    test(`retry over a half-saved exam (row + ${kept} of 1,200 answers) completes that same row`, { skip }, async () => {
        const { pg, submit } = await setup(1200);
        try {
            const body = exam(1200);
            const { rows } = await pg.query(
                `INSERT INTO final_review_sessions (user_id, question_type, source, total_questions, correct_answers,
                     score, time_taken, time_limit, end_time, session_metadata, question_ids)
                 VALUES (7, 'exam', 'mock', 1200, 600, 50, 100, 600, CURRENT_TIMESTAMP, $1, $2) RETURNING id`,
                [JSON.stringify(body.sessionMetadata), body.questionIds]
            );
            await insertFinalQuizAttempts(pg, rows[0].id, body.questionAttempts.slice(0, kept));

            const r = await submit({ ...body, retry_attempt: 1 });
            assert.equal(r.code, 200);
            assert.equal(r.body.sessionId, rows[0].id);
            await assertSavedOnce(pg, { questions: 1200, correct: 600 });
        } finally { await pg.close(); }
    });
}

test('retry still finds the row after the server re-judged the totals', { skip }, async () => {
    const { pg, submit } = await setup();
    try {
        // The browser says 3 right; the answers say 2, and the stored totals follow the answers.
        const body = exam(4, { correctAnswers: 3 });
        await submit(body);
        await submit({ ...body, retry_attempt: 1 });
        await assertSavedOnce(pg);
    } finally { await pg.close(); }
});

test('a retry arriving after the earlier tries used their 60 s each is still recognised', { skip }, async () => {
    const { pg, submit } = await setup();
    try {
        await submit(exam());
        await pg.query(`UPDATE final_review_sessions SET start_time = start_time - INTERVAL '4 minutes'`);
        await submit({ ...exam(), retry_attempt: 2 });
        await assertSavedOnce(pg);
    } finally { await pg.close(); }
});

test('another exam with the same totals and duration is not mistaken for the retried one', { skip }, async () => {
    const { pg, submit } = await setup(8);
    try {
        await submit(exam());
        const other = exam(4, {
            questionIds: [5, 6, 7, 8],
            questionAttempts: exam().questionAttempts.map((a) => ({ ...a, questionId: a.questionId + 4 })),
            sessionMetadata: { device: 'web', timestamp: '2026-11-27T10:03:00.000Z' },
        });
        await submit({ ...other, retry_attempt: 1 }); // its first try never reached the server
        assert.equal((await history(pg)).length, 2);
        assert.deepEqual((await answersPerSession(pg)).map((r) => r.n), [4, 4]);
    } finally { await pg.close(); }
});

test('first tries are never merged, even when the body is identical', { skip }, async () => {
    const { pg, submit } = await setup();
    try {
        await submit(exam());
        await submit(exam());
        assert.equal((await history(pg)).length, 2);
        assert.deepEqual((await answersPerSession(pg)).map((r) => r.n), [4, 4]);
    } finally { await pg.close(); }
});

test('one transaction, with the per-user lock taken before the earlier save is looked up', { skip }, async () => {
    const { pg, pool, submit } = await setup();
    try {
        for (const retry_attempt of [0, 1]) {
            pool.log.length = 0;
            await submit({ ...exam(), retry_attempt });
            const at = (re) => pool.log.findIndex((sql) => re.test(sql));
            assert.ok(at(/^BEGIN/) !== -1 && at(/pg_advisory_xact_lock/) > at(/^BEGIN/));
            const firstUse = at(/FROM final_review_sessions\s+WHERE user_id|INSERT INTO final_review_sessions/);
            assert.ok(firstUse > at(/pg_advisory_xact_lock/));
            // The totals recompute swallows its own errors, so it must not run
            // inside the transaction: a failed statement there would turn COMMIT
            // into a silent rollback.
            assert.ok(at(/SET total_questions = t\.n/) > at(/^COMMIT/));
        }
    } finally { await pg.close(); }
});

test('a failing totals recompute does not undo or fail a saved exam', { skip }, async () => {
    const { pg, pool, submit } = await setup();
    try {
        pool.failWhen = (sql) => /SET total_questions = t\.n/.test(sql);
        assert.equal((await submit(exam())).code, 200);
        await assertSavedOnce(pg);
    } finally { await pg.close(); }
});
