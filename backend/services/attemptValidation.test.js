/**
 * Tests for the server-side pairing check (server-validation.diff).
 * Install as backend/services/attemptValidation.test.js and run:  cd backend && node --test services/attemptValidation.test.js
 * No database: a recording fake db stands in for pg, and app.js wiring is asserted on its source
 * (app.js cannot be imported without a database, same approach as finalQuizAttempts.test.js).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    judgeAnswer, judgeAttempts, summarizeJudgements, validationMode, normalizeOption, loadQuestionsById,
} from './attemptValidation.js';

const here = path.dirname(fileURLToPath(import.meta.url));

const Q = (id, key = 1) => ({
    id,
    option1: `q${id} alpha`, option2: `q${id} beta`, option3: `q${id} gamma`, option4: `q${id} delta`,
    correct_option: [`q${id} alpha`, `q${id} beta`, `q${id} gamma`, `q${id} delta`][key - 1],
});
const fakeDb = (questions) => ({
    calls: [],
    async query(sql, params) {
        this.calls.push({ sql, params });
        const ids = new Set(params[0]);
        return { rows: questions.filter((q) => ids.has(q.id)) };
    },
});
const read = (a) => ({ questionId: a.question_id, selected: a.selected_option });

test('mode: default is log, unknown values fall back to log', () => {
    assert.equal(validationMode({}), 'log');
    assert.equal(validationMode({ ATTEMPT_VALIDATION: 'ENFORCE' }), 'enforce');
    assert.equal(validationMode({ ATTEMPT_VALIDATION: 'off' }), 'off');
    assert.equal(validationMode({ ATTEMPT_VALIDATION: 'nonsense' }), 'log');
});

test('an answer that is one of the options is ok, and is_correct comes from the key', () => {
    const q = Q(1, 2);
    assert.deepEqual(judgeAnswer(q, 'q1 beta'), { status: 'ok', canonical: 'q1 beta', isCorrect: true, matchedBy: 'exact' });
    assert.equal(judgeAnswer(q, 'q1 alpha').isCorrect, false);
});

test('a lying client cannot make a wrong answer right (is_correct is recomputed)', () => {
    const q = Q(1, 2);
    const v = judgeAnswer(q, 'q1 gamma'); // the browser would have sent is_correct: true
    assert.equal(v.status, 'ok');
    assert.equal(v.isCorrect, false);
});

test('case and spacing differences match and are stored as the question\'s own text', () => {
    const q = Q(1, 1);
    const v = judgeAnswer(q, '  Q1   ALPHA ');
    assert.equal(v.status, 'ok');
    assert.equal(v.canonical, 'q1 alpha');
    assert.equal(v.matchedBy, 'normalized');
    assert.equal(v.isCorrect, true);
});

test('THE 3-4 NOV BUG: text that belongs to a different question is not_an_option', () => {
    const v = judgeAnswer(Q(1), 'q2 alpha');
    assert.equal(v.status, 'not_an_option');
    assert.equal(v.isCorrect, false);
});

test('unanswered and unknown question', () => {
    assert.equal(judgeAnswer(Q(1), undefined).status, 'unanswered');
    assert.equal(judgeAnswer(Q(1), '').status, 'unanswered');
    assert.equal(judgeAnswer(null, 'x').status, 'unknown_question');
});

test('two options with the same text: the key position decides, no crash', () => {
    const q = { id: 9, option1: 'same', option2: 'same', option3: 'c', option4: 'd', correct_option: 'same' };
    assert.equal(judgeAnswer(q, 'same').status, 'ok');
});

test('normalizeOption', () => {
    assert.equal(normalizeOption('  A   B '), 'a b');
    assert.equal(normalizeOption(null), '');
});

test('judgeAttempts: one query for the whole batch, rejection only in enforce mode', async () => {
    const qs = [Q(1), Q(2), Q(3)];
    const attempts = [
        { question_id: 1, selected_option: 'q1 alpha' },
        { question_id: 2, selected_option: 'q1 beta' },   // belongs to question 1, not 2
        { question_id: 3, selected_option: 'q3 delta' },
    ];
    const db = fakeDb(qs);
    const logMode = await judgeAttempts(db, attempts, read, 'log');
    assert.equal(db.calls.length, 1);
    assert.deepEqual(logMode.map((j) => j.reject), [false, false, false]);
    assert.equal(logMode[1].verdict.status, 'not_an_option');
    const enforce = await judgeAttempts(fakeDb(qs), attempts, read, 'enforce');
    assert.deepEqual(enforce.map((j) => j.reject), [false, true, false]);
    const off = await judgeAttempts(fakeDb(qs), attempts, read, 'off');
    assert.deepEqual(off.map((j) => j.verdict), [null, null, null]);
});

test('a fully swapped 50-question quiz is flagged as a suspected swap and fully rejected in enforce mode', async () => {
    const qs = Array.from({ length: 50 }, (_, i) => Q(i + 1));
    // answers are shifted by one question: exactly what the incident did
    const attempts = qs.map((q, i) => ({ question_id: q.id, selected_option: qs[(i + 1) % 50].option1 }));
    const judged = await judgeAttempts(fakeDb(qs), attempts, read, 'enforce');
    const sum = summarizeJudgements(judged);
    assert.equal(sum.bad, 50);
    assert.equal(sum.suspectSwap, true);
    assert.ok(judged.every((j) => j.reject));
});

test('one stray mismatch in a 50-question quiz is not a suspected swap', async () => {
    const qs = Array.from({ length: 50 }, (_, i) => Q(i + 1));
    const attempts = qs.map((q) => ({ question_id: q.id, selected_option: q.option1 }));
    attempts[10].selected_option = 'old spelling of an option';
    const sum = summarizeJudgements(await judgeAttempts(fakeDb(qs), attempts, read, 'enforce'));
    assert.equal(sum.bad, 1);
    assert.equal(sum.suspectSwap, false);
});

test('loadQuestionsById ignores junk ids and does not query for an empty list', async () => {
    const db = fakeDb([Q(1)]);
    assert.equal((await loadQuestionsById(db, [])).size, 0);
    assert.equal(db.calls.length, 0);
    const m = await loadQuestionsById(db, [1, 1, 'x', null]);
    assert.equal(m.size, 1);
    assert.deepEqual(db.calls[0].params[0], [1]);
});

// ── wiring in app.js (source assertions; skipped when the patch is not applied yet) ──
const appSrc = (() => { try { return fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8'); } catch { return ''; } })();
const wired = appSrc.includes('attemptValidation.js');
test('app.js: the three write paths use the validation', { skip: !wired && 'patch not applied' }, () => {
    assert.ok(appSrc.includes("code: verdict.status === 'unknown_question' ? 'UNKNOWN_QUESTION' : 'OPTION_NOT_IN_QUESTION'"));
    assert.ok(appSrc.includes('judgeAttempts(db, question_attempts'));       // POST /quiz-sessions
    assert.ok(appSrc.includes('judgeAnswer(questions.get(Number(a.questionId))')); // POST /final-quiz/submit
    assert.ok(appSrc.includes("logger.warn('ATTEMPT_NOT_AN_OPTION'"));
});

// /final-quiz/submit must not trust the userId in the body.
import { readFileSync } from 'node:fs';
test('final-quiz/submit checks the body userId against the session', () => {
  const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(src, /app\.post\('\/final-quiz\/submit', requireSession, requireOwnBodyUser\('userId'\)/);
  const m = src.match(/function requireOwnBodyUser\(field\) \{[\s\S]*?\r?\n\}\r?\n/);
  assert.ok(m, 'helper exists');
  const mk = new Function('logger', m[0] + '; return requireOwnBodyUser;')({ warn() {} });
  const run = (body, id) => { const req = { body, accountId: id, originalUrl: '/x' }; let code = null, nexted = false;
    mk('userId')(req, { status: (c) => ({ json: () => { code = c; } }) }, () => { nexted = true; }); return { code, nexted, req }; };
  assert.equal(run({ userId: 5 }, 5).nexted, true);
  assert.equal(run({ userId: '5' }, 5).nexted, true);
  assert.equal(run({ userId: 6 }, 5).code, 403);
  const r = run({}, 5); assert.equal(r.nexted, true); assert.equal(r.req.body.userId, 5);
});
