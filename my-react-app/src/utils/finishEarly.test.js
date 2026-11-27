/**
 * "Finish now and see my result": what gets scored and saved, plus source-level
 * guards on QUIZ.jsx (no DOM test environment: see quiz-swap-guard.test.js).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countAnswered, submittedSet, canFinishEarly } from './finishEarly.js';
import quizCopy from '../i18n/copy/quiz.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (rel) => fs.readFileSync(path.join(here, rel), 'utf8').replace(/\r\n/g, '\n');
const questions = Array.from({ length: 10 }, (_, i) => ({ id: 100 + i, correct_option: `right-${i}` }));
// Answered out of order, with gaps: the case where re-numbering can go wrong.
const answers = { 7: 'answer-for-107', 0: 'answer-for-100', 4: 'answer-for-104' };

test('only answered questions are submitted, each still with its own answer', () => {
    const out = submittedSet(questions, answers, true);
    assert.deepEqual(out.questions.map((q) => q.id), [100, 104, 107]);
    out.questions.forEach((q, i) => assert.equal(out.answers[i], `answer-for-${q.id}`));
    assert.equal(Object.keys(out.answers).length, 3);
});

test('a normal finish and a timer expiry are left exactly as they were', () => {
    const out = submittedSet(questions, answers, false);
    assert.equal(out.questions, questions);
    assert.equal(out.answers, answers);
});

test('the inputs are not modified, so the shown total stays correct', () => {
    const before = JSON.stringify({ questions, answers });
    submittedSet(questions, answers, true);
    assert.equal(JSON.stringify({ questions, answers }), before);
});

test('page reload: answers restored from the autosave snapshot give the same result', () => {
    const restored = JSON.parse(JSON.stringify({ questions, questionAnswers: answers }));
    assert.equal(countAnswered(restored.questions, restored.questionAnswers), 3);
    assert.deepEqual(
        submittedSet(restored.questions, restored.questionAnswers, true),
        submittedSet(questions, answers, true),
    );
});

test('the button needs one answer, skips the final exam and does not double the Finish button', () => {
    const base = { questions, answers, currentIndex: 2, isFinalQuiz: false };
    assert.equal(canFinishEarly(base), true);
    assert.equal(canFinishEarly({ ...base, answers: {} }), false);
    assert.equal(canFinishEarly({ ...base, isFinalQuiz: true }), false);
    const all = Object.fromEntries(questions.map((_, i) => [i, 'x']));
    assert.equal(canFinishEarly({ ...base, answers: all }), true);
    assert.equal(canFinishEarly({ ...base, answers: all, currentIndex: 9 }), false);
    assert.equal(canFinishEarly({ ...base, currentIndex: 9 }), true, 'last question with blanks');
});

test('both the save and the result screen are built from the submitted set', () => {
    const src = read('../components/Quiz/QUIZ.jsx');
    assert.equal((src.match(/submittedSet\([^;]*finishedEarly\)/g) || []).length, 2);
    assert.equal((src.match(/buildAnswers\(\w+\.?\w*, submitted\.answers\)/g) || []).length, 2);
    assert.ok(!/buildAnswers\(\w+, questionAnswers\)/.test(src));
});

test('double submit: one latch per quiz, and "Another quiz" releases it so the next one is saved', () => {
    const src = read('../components/Quiz/QUIZ.jsx');
    assert.match(src, /if \(sendingRef\.current\) return;\n\s*sendingRef\.current = true;/);
    const retry = src.slice(src.indexOf('onRetry={() => {'), src.indexOf('onBackToQuizs='));
    for (const reset of ['attemptRef.current += 1', 'sendingRef.current = false', 'setDataSent(false)', 'setFinishedEarly(false)']) {
        assert.ok(retry.includes(reset), `"Another quiz" must call ${reset}`);
    }
    // A save still running for the previous quiz must not touch the new one.
    assert.match(src, /if \(isCurrentAttempt\(\)\) setDataSent\(true\);/);
});

test('the new wording exists in Arabic and English', () => {
    for (const lang of ['ar', 'en']) {
        const t = quizCopy[lang];
        for (const key of ['finishNow', 'finishNowTitle', 'finishNowConfirm', 'finishNowCancel']) {
            assert.ok(t.quiz[key], `${lang}.quiz.${key}`);
        }
        assert.match(t.quiz.finishNowBody(3, 10), /3.*10/);
        assert.match(t.result.earlyNote(3, 10), /3.*10/);
    }
});
