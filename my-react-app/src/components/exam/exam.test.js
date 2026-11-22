/**
 * Exam mode, browser side: the clock (absolute deadlines, restore, hard stop),
 * the state machine, scoring and the save payloads, the storage round trip,
 * the calculator and the copy pair. No React and no DOM.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    deadlineFrom, secondsLeft, isExpired, restoreDeadline, formatClock, clockTone,
} from './examClock.js';
import {
    createExam, startPart, skipBreak, goTo, selectAnswer, toggleFlag, addSpent, openReview, closeReview,
    finishPart, reconcile, partSummary, scoreExam, buildSubmission, isCorrectAnswer,
} from './examEngine.js';
import { saveExam, saveExamState, loadExam, clearExam } from './examStorage.js';
import { initialCalc, pressKey, formatResult } from './calcEngine.js';
import { LAB_GROUPS } from './labValues.js';
import examCopy from '../../i18n/copy/exam.js';

const T0 = 1_700_000_000_000;
const MIN = 60 * 1000;

const mkQuestions = (n) => Array.from({ length: n }, (_, i) => ({
    id: 100 + i,
    question_text: `Question ${i + 1}`,
    option1: 'A one', option2: 'B two', option3: 'C three', option4: 'D four',
    correct_option: 'B two',
    question_type: i % 2 === 0 ? 'medicine' : 'surgery',
}));

const payload = (served, over = {}) => ({
    mode: 'full',
    exam: { key: 'smle', confirmed: true, practiceLength: false, breakMinutes: 30, passMark: { pass: 560 } },
    requested: 200,
    served,
    capped: false,
    notes: [],
    byDomain: [],
    parts: [
        { index: 1, questions: served / 2, minutes: 120, from: 0, to: served / 2 },
        { index: 2, questions: served / 2, minutes: 120, from: served / 2, to: served },
    ],
    ...over,
});

const fresh = (served = 20) => ({ state: createExam(payload(served), T0), questions: mkQuestions(served) });

// ----------------------------------------------------------------- the clock

test('clock: deadlines are absolute and seconds round up', () => {
    const d = deadlineFrom(T0, 120);
    assert.equal(d, T0 + 120 * MIN);
    assert.equal(secondsLeft(d, T0), 7200);
    assert.equal(secondsLeft(d, T0 + 500), 7200);
    assert.equal(secondsLeft(d, T0 + 1000), 7199);
    assert.equal(secondsLeft(d, d - 1), 1);
    assert.equal(secondsLeft(d, d), 0);
    assert.equal(secondsLeft(d, d + 99999), 0);
    assert.equal(secondsLeft(null, T0), 0);
    assert.equal(isExpired(d, d - 1), false);
    assert.equal(isExpired(d, d), true);
    assert.equal(isExpired(null, d), false);
});

test('clock: a restored deadline cannot be further out than the part allows', () => {
    const now = T0 + 5 * MIN;
    assert.equal(restoreDeadline(NaN, now, 120), null);
    assert.equal(restoreDeadline('x', now, 120), null);
    assert.equal(restoreDeadline(T0 + 60 * MIN, now, 120), T0 + 60 * MIN);
    const cheat = restoreDeadline(now + 999 * MIN, now, 120);
    assert.ok(cheat <= now + 120 * MIN + 5000);
    assert.equal(restoreDeadline(T0 - MIN, now, 120), T0 - MIN, 'a past deadline stays in the past');
});

test('clock: format and tone', () => {
    assert.equal(formatClock(7200), '2:00:00');
    assert.equal(formatClock(3599), '59:59');
    assert.equal(formatClock(61), '1:01');
    assert.equal(formatClock(-5), '0:00');
    assert.equal(clockTone(7000, 7200), 'ok');
    assert.equal(clockTone(1000, 7200), 'ok');
    assert.equal(clockTone(900, 7200), 'warn');
    assert.equal(clockTone(300, 7200), 'danger');
    assert.equal(clockTone(0, 7200), 'danger');
});

// ------------------------------------------------------------- state machine

test('start: Part 1 gets its own absolute deadline of 120 minutes', () => {
    const { state } = fresh();
    assert.equal(state.stage, 'rules');
    const s = startPart(state, T0 + 1000);
    assert.equal(s.stage, 'part');
    assert.equal(s.partDeadline, T0 + 1000 + 120 * MIN);
    assert.equal(s.current, 0);
    assert.equal(startPart(s, T0 + 5000), s, 'a running part cannot be restarted');
});

test('answers: only inside the active part, only real options, changeable', () => {
    const { state, questions } = fresh();
    let s = startPart(state, T0);
    s = selectAnswer(s, questions, 3, 'A one');
    assert.equal(s.answers[questions[3].id], 'A one');
    s = selectAnswer(s, questions, 3, 'C three');
    assert.equal(s.answers[questions[3].id], 'C three');
    assert.equal(selectAnswer(s, questions, 3, 'not an option'), s);
    assert.equal(selectAnswer(s, questions, 15, 'A one'), s, 'a Part 2 question is locked during Part 1');
    assert.equal(selectAnswer(openReview(s), questions, 3, 'A one').answers[questions[3].id], 'C three', 'no answering from the review grid');
});

test('navigation is clamped to the part', () => {
    const { state } = fresh();
    let s = startPart(state, T0);
    assert.equal(goTo(s, 999).current, 9);
    assert.equal(goTo(s, -4).current, 0);
    assert.equal(goTo(openReview(s), 4).stage, 'part', 'a click on the grid returns to the exam');
});

test('flags toggle, and flagsUsed remembers every question ever flagged', () => {
    const { state, questions } = fresh();
    let s = startPart(state, T0);
    s = toggleFlag(s, questions, 2);
    s = toggleFlag(s, questions, 5);
    s = toggleFlag(s, questions, 2);
    assert.deepEqual(Object.keys(s.flags).map(Number), [questions[5].id]);
    assert.equal(Object.keys(s.everFlagged).length, 2);
    assert.equal(toggleFlag(s, questions, 12), s, 'cannot flag in another part');
});

test('part summary counts answered, flagged and unanswered', () => {
    const { state, questions } = fresh();
    let s = startPart(state, T0);
    s = selectAnswer(s, questions, 0, 'A one');
    s = selectAnswer(s, questions, 1, 'B two');
    s = toggleFlag(s, questions, 1);
    s = toggleFlag(s, questions, 4);
    const sum = partSummary(s, questions, 0);
    assert.deepEqual([sum.total, sum.answered, sum.flagged, sum.unanswered], [10, 2, 2, 8]);
    assert.equal(sum.items[1].number, 2);
    assert.equal(sum.items[1].answered && sum.items[1].flagged, true);
});

test('finish Part 1 by hand: break starts, Part 2 clock only starts when the student starts it', () => {
    const { state } = fresh();
    let s = startPart(state, T0);
    s = finishPart(s, T0 + 50 * MIN, 'user');
    assert.equal(s.stage, 'break');
    assert.equal(s.partIdx, 1);
    assert.equal(s.partDeadline, null);
    assert.equal(s.breakDeadline, T0 + 50 * MIN + 30 * MIN);
    assert.deepEqual(s.results, [{ index: 1, endedBy: 'user', secondsUsed: 3000 }]);
    // starts Part 2 after 10 minutes of break
    const p2 = startPart(s, T0 + 60 * MIN);
    assert.equal(p2.stage, 'part');
    assert.equal(p2.partDeadline, T0 + 60 * MIN + 120 * MIN);
    assert.equal(p2.breakSeconds, 600);
    assert.equal(p2.current, 10);
    assert.equal(p2.breakSkipped, false);
});

test('skipping the break is recorded', () => {
    const { state } = fresh();
    let s = finishPart(startPart(state, T0), T0 + 10 * MIN, 'user');
    s = skipBreak(s, T0 + 12 * MIN);
    assert.equal(s.stage, 'part');
    assert.equal(s.breakSkipped, true);
    assert.equal(skipBreak(s, T0), s);
});

test('finishing the last part ends the exam', () => {
    const { state } = fresh();
    let s = finishPart(startPart(state, T0), T0 + 10 * MIN, 'user');
    s = finishPart(startPart(s, T0 + 20 * MIN), T0 + 80 * MIN, 'user');
    assert.equal(s.stage, 'done');
    assert.equal(s.results.length, 2);
    assert.equal(finishPart(s, T0), s, 'nothing runs after the end');
});

// ------------------------------------------------------------------ hard stop

test('hard stop: a part past its deadline is ended by timeout and charged its full allowance', () => {
    const { state } = fresh();
    const s = startPart(state, T0);
    assert.equal(reconcile(s, T0 + 119 * MIN), s, 'still running just before');
    const stopped = reconcile(s, T0 + 120 * MIN);
    assert.equal(stopped.stage, 'break');
    assert.deepEqual(stopped.results, [{ index: 1, endedBy: 'timeout', secondsUsed: 7200 }]);
    assert.equal(stopped.breakStartedAt, T0 + 120 * MIN, 'the break starts when the part ended');
});

test('hard stop after a long absence ends the part at its deadline, not at "now"', () => {
    const { state } = fresh();
    const s = startPart(state, T0);
    const later = reconcile(s, T0 + 600 * MIN);
    assert.equal(later.stage, 'break');
    assert.equal(later.breakStartedAt, T0 + 120 * MIN);
    assert.equal(later.breakDeadline, T0 + 150 * MIN);
});

test('hard stop works from the review grid too, and Part 2 timing out ends the exam', () => {
    const { state } = fresh();
    let s = openReview(startPart(state, T0));
    s = reconcile(s, T0 + 130 * MIN);
    assert.equal(s.stage, 'break');
    s = startPart(s, T0 + 140 * MIN);
    s = reconcile(s, T0 + 140 * MIN + 120 * MIN);
    assert.equal(s.stage, 'done');
    assert.deepEqual(s.results.map((r) => r.endedBy), ['timeout', 'timeout']);
});

test('reload restore: a tampered far-future deadline is pulled in, then expires normally', () => {
    const { state } = fresh();
    const tampered = { ...startPart(state, T0), partDeadline: T0 + 9999 * MIN };
    const restored = reconcile(tampered, T0 + MIN);
    assert.ok(restored.partDeadline <= T0 + MIN + 120 * MIN + 5000);
    assert.equal(restored.stage, 'part');
    const missing = reconcile({ ...startPart(state, T0), partDeadline: null }, T0 + MIN);
    assert.equal(missing.stage, 'break', 'a running part with no deadline cannot run forever');
});

test('closeReview returns to the part and the clock was never paused', () => {
    const { state } = fresh();
    const s = startPart(state, T0);
    const r = openReview(s);
    assert.equal(r.partDeadline, s.partDeadline);
    assert.equal(closeReview(r).stage, 'part');
});

// -------------------------------------------------------- scoring and saving

test('score: unanswered counts as wrong, per-part and per-topic', () => {
    const { state, questions } = fresh(20);
    let s = startPart(state, T0);
    for (let i = 0; i < 10; i += 1) s = selectAnswer(s, questions, i, i < 6 ? 'B two' : 'A one'); // 6 right, 4 wrong
    s = finishPart(s, T0 + 30 * MIN, 'user');
    s = startPart(s, T0 + 40 * MIN);
    s = selectAnswer(s, questions, 10, 'B two');
    s = selectAnswer(s, questions, 11, 'B two');
    s = finishPart(s, T0 + 100 * MIN, 'timeout');
    const score = scoreExam(s, questions);
    assert.equal(score.total, 20);
    assert.equal(score.correct, 8);
    assert.equal(score.answered, 12);
    assert.equal(score.unanswered, 8);
    assert.equal(score.percent, 40);
    assert.deepEqual(score.parts.map((p) => [p.correct, p.answered, p.percent, p.endedBy]), [[6, 10, 60, 'user'], [2, 2, 20, 'timeout']]);
    assert.equal(score.parts[0].secondsUsed, 1800);
    assert.equal(score.secondsAllowed, 14400);
    const medicine = score.topics.find((t) => t.type === 'medicine');
    const surgery = score.topics.find((t) => t.type === 'surgery');
    assert.equal(medicine.total + surgery.total, 20);
    assert.equal(medicine.correct + surgery.correct, 8);
    assert.ok(score.topics[0].percent <= score.topics[1].percent, 'weakest first');
    assert.equal(isCorrectAnswer(questions[0], ' B two '), true);
    assert.equal(isCorrectAnswer(questions[0], undefined), false);
});

test('paid save body fits /final-quiz/submit and carries part scores and flags in session_metadata', () => {
    const { state, questions } = fresh(20);
    let s = startPart(state, T0);
    s = selectAnswer(s, questions, 0, 'B two');
    s = addSpent(s, questions, 0, 42);
    s = toggleFlag(s, questions, 3);
    s = finishPart(s, T0 + 10 * MIN, 'user');
    s = finishPart(startPart(s, T0 + 20 * MIN), T0 + 30 * MIN, 'user');
    const body = buildSubmission(s, questions, scoreExam(s, questions), { userId: 7 });
    assert.equal(body.userId, 7);
    assert.equal(body.questionType, 'exam');
    assert.equal(body.source, 'smle');
    assert.equal(body.totalQuestions, 20);
    assert.equal(body.correctAnswers, 1);
    assert.equal(body.timeLimit, 14400);
    assert.equal(body.timeTaken, 1200);
    assert.equal(body.questionIds.length, 20);
    assert.equal(body.questionAttempts.length, 20, 'unanswered questions are saved too (as empty answers)');
    assert.equal(body.questionAttempts[0].timeTaken, 42);
    assert.equal(body.questionAttempts[1].userAnswer, '');
    assert.equal(body.questionAttempts[1].isCorrect, false);
    const exam = body.sessionMetadata.exam;
    assert.equal(exam.key, 'smle');
    assert.equal(exam.mode, 'full');
    assert.equal(exam.flagsUsed, 1);
    assert.equal(exam.parts.length, 2);
    assert.deepEqual(exam.parts.map((p) => p.questions), [10, 10]);
    assert.equal(exam.parts[0].correct, 1);
    assert.equal(exam.parts[0].seconds, 600);
    assert.equal(exam.breakSeconds, 600);
    assert.equal(JSON.stringify(body).includes('explanation'), false);
});

test('demo save body has no user id, no key, and the unconfirmed flag survives', () => {
    const p = payload(20, { mode: 'demo', exam: { key: 'sdle', confirmed: false, practiceLength: true, breakMinutes: 0 }, parts: [{ index: 1, questions: 20, minutes: 24, from: 0, to: 20 }] });
    const questions = mkQuestions(20);
    let s = startPart(createExam(p, T0), T0);
    s = finishPart(s, T0 + 5 * MIN, 'user');
    assert.equal(s.stage, 'done');
    const body = buildSubmission(s, questions, scoreExam(s, questions), { userId: 7 });
    assert.equal(body.userId, undefined);
    assert.equal(body.questionType, undefined);
    assert.deepEqual(Object.keys(body.questionAttempts[0]).sort(), ['questionId', 'timeTaken', 'userAnswer']);
    assert.equal(body.sessionMetadata.confirmed, false);
    assert.equal(body.timeLimit, 1440);
});

test('a one-part exam with no break (SDLE practice length) never enters the break stage', () => {
    const p = payload(10, { exam: { key: 'sdle', confirmed: false, breakMinutes: 0 }, parts: [{ index: 1, questions: 10, minutes: 120, from: 0, to: 10 }] });
    const s = finishPart(startPart(createExam(p, T0), T0), T0 + MIN, 'user');
    assert.equal(s.stage, 'done');
});

// -------------------------------------------------------------------- storage

function fakeStore() {
    const m = new Map();
    return { get: (k) => (m.has(k) ? m.get(k) : null), set: (k, v) => { m.set(k, v); return true; }, remove: (k) => m.delete(k), m };
}

test('storage: save, restore, update the small slot only, clear', () => {
    const store = fakeStore();
    const { state, questions } = fresh(20);
    let s = startPart(state, T0);
    saveExam(5, s, questions, store);
    s = selectAnswer(s, questions, 0, 'A one');
    saveExamState(5, s, store);
    const back = loadExam(5, store);
    assert.equal(back.questions.length, 20);
    assert.equal(back.state.answers[questions[0].id], 'A one');
    assert.equal(back.state.partDeadline, s.partDeadline, 'the absolute deadline comes back unchanged');
    assert.equal(loadExam(6, store), null, 'another account sees nothing');
    clearExam(5, store);
    assert.equal(loadExam(5, store), null);
});

test('storage: corrupt, foreign-version or inconsistent data is dropped, never thrown', () => {
    const store = fakeStore();
    const { state, questions } = fresh(20);
    saveExam(1, state, questions, store);
    store.set('sqb_exam_state_1', '{not json');
    assert.equal(loadExam(1, store), null);
    saveExam(1, { ...state, v: 99 }, questions, store);
    assert.equal(loadExam(1, store), null);
    saveExam(1, state, questions.slice(0, 5), store);
    assert.equal(loadExam(1, store), null, 'question list shorter than the plan');
});

test('restore after a reload mid-Part-1 ends in the right place on both sides of the deadline', () => {
    const store = fakeStore();
    const { state, questions } = fresh(20);
    saveExam(9, startPart(state, T0), questions, store);
    const during = reconcile(loadExam(9, store).state, T0 + 30 * MIN);
    assert.equal(during.stage, 'part');
    assert.equal(secondsLeft(during.partDeadline, T0 + 30 * MIN), 90 * 60);
    const after = reconcile(loadExam(9, store).state, T0 + 125 * MIN);
    assert.equal(after.stage, 'break');
    assert.equal(after.results[0].endedBy, 'timeout');
});

// ----------------------------------------------------------------- calculator

const keys = (str, state = initialCalc()) => str.split(' ').reduce(pressKey, state);

test('calculator: arithmetic, chaining, decimals, no float noise', () => {
    assert.equal(keys('1 2 + 3 =').display, '15');
    assert.equal(keys('2 * 3 + 4 =').display, '10', 'immediate execution, like a pocket calculator');
    assert.equal(keys('0 . 1 + 0 . 2 =').display, '0.3');
    assert.equal(keys('9 / 4 =').display, '2.25');
    assert.equal(keys('5 + * 3 =').display, '15', 'a second operator replaces the first');
    assert.equal(keys('1 . 5 . 5').display, '1.55', 'one decimal point only');
    assert.equal(keys('7 neg').display, '-7');
    assert.equal(keys('7 neg neg').display, '7');
    assert.equal(keys('5 0 pct').display, '0.5');
    assert.equal(keys('1 6 sqrt').display, '4');
    assert.equal(keys('1 2 3 back').display, '12');
    assert.equal(keys('7 back').display, '0');
    assert.equal(keys('1 2 C').display, '0');
});

test('calculator: divide by zero and sqrt of a negative show Error until cleared', () => {
    const e = keys('5 / 0 =');
    assert.equal(e.display, 'Error');
    assert.equal(pressKey(e, '3'), e);
    assert.equal(pressKey(e, 'C').display, '0');
    assert.equal(keys('4 neg sqrt').display, 'Error');
    assert.equal(formatResult(Infinity), 'Error');
});

// ------------------------------------------------------------ lab values, copy

test('lab values: every row has a name, a range and a place in a group', () => {
    assert.ok(LAB_GROUPS.length >= 3);
    for (const g of LAB_GROUPS) {
        assert.ok(examCopy.en.labs.groups[g.group], `en heading for ${g.group}`);
        assert.ok(examCopy.ar.labs.groups[g.group], `ar heading for ${g.group}`);
        for (const [name, range] of g.rows) {
            assert.ok(name && range);
        }
    }
});

const shape = (v) => (v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])])) : typeof v === 'function' ? 'fn' : 'str');

test('copy: Arabic and English have the same keys, no brand but SQB, no affiliation or "same as the real exam" claims', () => {
    assert.deepEqual(shape(examCopy.ar), shape(examCopy.en));
    const flat = JSON.stringify(examCopy, (k, v) => (typeof v === 'function' ? v(1, 2, 3, 4) : v));
    assert.ok(!/MEDQ?UIZE?/i.test(flat));
    assert.ok(!/same as the real exam|identical to the real exam|official SCFHS exam|مطابق للاختبار الحقيقي|نفس الاختبار الحقيقي/i.test(flat));
    // it says it is NOT affiliated; it must never say it IS
    assert.ok(!/(affiliated with|endorsed by|approved by|official partner|in partnership with)/i.test(JSON.stringify(examCopy.en).replace(/not affiliated with or endorsed by/gi, '')));
    assert.ok(!/prometric/i.test(flat), 'no provider is named');
    // never a question count in copy
    assert.ok(!/\b\d{3,5}\s+(questions|سؤال)/i.test(flat.replace(/200|100|120/g, '')));
});
