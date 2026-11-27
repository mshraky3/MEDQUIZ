/**
 * A final exam with unanswered questions (the timer ran out) must save.
 *
 * The Android app and the website's final-review exam send `userAnswer:
 * answer.selected`; for a blank that is undefined, JSON drops the field, and
 * final_quiz_attempts.user_answer is NOT NULL, so the whole multi-row INSERT
 * failed and POST /final-quiz/submit answered 500. Installed Android builds keep
 * sending no field, so the server has to accept it.
 *
 * Runs against PGlite (no local Postgres exists). It is not a repo dependency:
 * install it outside the repo and point PGLITE_PATH at
 * node_modules/@electric-sql/pglite, otherwise these tests are skipped.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { insertFinalQuizAttempts } from './finalQuizAttempts.js';
import { judgeAnswer, loadQuestionsById } from './attemptValidation.js';
import { recomputeSessionSummary } from './sessionSummary.js';
import { INTEGRITY_CHECKS, runIntegrityChecks } from './integrityChecks.js';

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
        CREATE TABLE questions (id SERIAL PRIMARY KEY, option1 text, option2 text, option3 text, option4 text, correct_option text);
        CREATE TABLE final_review_sessions (id SERIAL PRIMARY KEY, user_id integer NOT NULL,
            total_questions integer NOT NULL, correct_answers integer NOT NULL, score numeric NOT NULL);
        CREATE TABLE final_quiz_attempts (id SERIAL PRIMARY KEY,
            session_id integer REFERENCES final_review_sessions(id) ON DELETE CASCADE,
            question_id integer, user_answer varchar(255) NOT NULL, correct_answer varchar(255) NOT NULL,
            is_correct boolean, time_taken integer DEFAULT 0, created_at timestamp DEFAULT now());
    `);
    for (let i = 0; i < 4; i += 1) {
        await db.query(`INSERT INTO questions (option1, option2, option3, option4, correct_option) VALUES ('A', 'B', 'C', 'D', 'B')`);
    }
    // What the client reports: 4 questions, 1 right.
    await db.query('INSERT INTO final_review_sessions (user_id, total_questions, correct_answers, score) VALUES (7, 4, 1, 25)');
    return db;
}

// The attempts as the server receives them: question 1 right, 2 wrong, 3 and 4
// never answered. The JSON round trip is what removes the undefined field.
const attemptsOnTheWire = () => JSON.parse(JSON.stringify(
    ['B', 'A', undefined, undefined].map((selected, i) => ({
        questionId: i + 1,
        userAnswer: selected,
        correctAnswer: 'B',
        isCorrect: selected === 'B',
        timeTaken: 25,
    }))
));

const saved = async (db) => (await db.query(
    'SELECT question_id, user_answer, is_correct FROM final_quiz_attempts ORDER BY question_id'
)).rows;

test('an exam with blanks saves every per-question row, blanks as an empty string', { skip }, async () => {
    const db = await setup();
    try {
        const attempts = attemptsOnTheWire();
        assert.equal('userAnswer' in attempts[2], false, 'the client sends no field for a blank');
        assert.equal(await insertFinalQuizAttempts(db, 1, attempts), 4);
        assert.deepEqual(await saved(db), [
            { question_id: 1, user_answer: 'B', is_correct: true },
            { question_id: 2, user_answer: 'A', is_correct: false },
            { question_id: 3, user_answer: '', is_correct: false },
            { question_id: 4, user_answer: '', is_correct: false },
        ]);
    } finally { await db.close(); }
});

test('an explicit null is saved the same way, and an exam with nothing answered saves too', { skip }, async () => {
    const db = await setup();
    try {
        const none = attemptsOnTheWire().map((a) => ({ ...a, userAnswer: null, isCorrect: false }));
        assert.equal(await insertFinalQuizAttempts(db, 1, none), 4);
        assert.deepEqual((await saved(db)).map((r) => r.user_answer), ['', '', '', '']);
    } finally { await db.close(); }
});

// The route's own steps in its order: judge each answer, insert, recompute the totals.
test('scoring is unchanged: blanks still count in the total and never as correct', { skip }, async () => {
    const db = await setup();
    try {
        const attempts = attemptsOnTheWire();
        const questions = await loadQuestionsById(db, attempts.map((a) => a.questionId));
        const judged = attempts.map((a) => judgeAnswer(questions.get(a.questionId), a.userAnswer));
        assert.deepEqual(judged.map((v) => v.status), ['ok', 'ok', 'unanswered', 'unanswered']);
        await insertFinalQuizAttempts(db, 1, attempts);
        let failed = null;
        const changed = await recomputeSessionSummary(db, 1, 7, { final: true, env: {}, onError: (e) => { failed = e; } });
        assert.equal(failed, null);
        assert.equal(changed, null, 'the stored totals already match the rows');
        const { rows } = await db.query('SELECT total_questions, correct_answers, score::float AS score FROM final_review_sessions');
        assert.deepEqual(rows, [{ total_questions: 4, correct_answers: 1, score: 25 }]);
    } finally { await db.close(); }
});

test('the integrity check ignores blanks but still reports an answer from another question', { skip }, async () => {
    const db = await setup();
    try {
        const checks = INTEGRITY_CHECKS.filter((c) => c.name === 'final_answer_not_an_option');
        assert.equal(checks.length, 1);
        await insertFinalQuizAttempts(db, 1, attemptsOnTheWire());
        assert.deepEqual(await runIntegrityChecks(db, checks), [], 'a skipped question is not a mismatched answer');
        await insertFinalQuizAttempts(db, 1, [
            { questionId: 3, userAnswer: 'text from another question', correctAnswer: 'B', isCorrect: false },
        ]);
        const [found] = await runIntegrityChecks(db, checks);
        assert.deepEqual(found.rows, [{ session_id: 1, n: 1 }]);
    } finally { await db.close(); }
});
