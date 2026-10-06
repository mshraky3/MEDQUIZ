import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SOURCE,
  SNAPSHOT_MAX_AGE_MS,
  buildAnswers,
  buildAttemptPayloads,
  buildSessionPayload,
  buildTopicPayloads,
  firstUnanswered,
  isValidQuestion,
  parseQuizParams,
  parseSnapshot,
  scoreOf,
  settleWithRetry,
  snapshotSlot,
  type Question,
  type QuizParams,
} from '@/features/quiz/quizLogic';

const q = (id: number, type: string, correct = 'option1', text = `Question ${id}`): Question => ({
  id,
  question_text: text,
  option1: 'a',
  option2: 'b',
  option3: 'c',
  option4: 'd',
  correct_option: correct,
  question_type: type,
  explanation: id % 2 ? `why ${id}` : null,
});

const QS = [q(1, 'surgery'), q(2, 'surgery', 'option2'), q(3, 'medicine', 'option3'), q(4, 'pediatrics', 'option4')];
const PARAMS: QuizParams = { count: 4, types: 'mix', source: 'MidgardGameBoy', timerMinutes: null, isFinalQuiz: false, mode: 'exam' };

describe('isValidQuestion', () => {
  it('accepts a question with text and rejects empty / malformed rows', () => {
    expect(isValidQuestion(q(1, 'surgery'))).toBe(true);
    expect(isValidQuestion({ ...q(1, 'surgery'), question_text: '   ' })).toBe(false);
    expect(isValidQuestion({ id: 2 })).toBe(false);
    expect(isValidQuestion(null)).toBe(false);
    expect(isValidQuestion('text')).toBe(false);
  });
});

describe('buildAnswers / scoreOf', () => {
  it('marks answers against correct_option and keeps unanswered ones unmarked', () => {
    const records = buildAnswers(QS, { 0: 'option1', 1: 'option1', 2: 'option3' });
    expect(records.map((r) => r.isCorrect)).toEqual([true, false, true, false]);
    expect(records[3].selected).toBeUndefined();
    expect(records[0]).toMatchObject({ id: 1, topic: 'surgery', explanation: 'why 1' });
    expect(records[1].explanation).toBeNull();
  });

  it('scores to two decimals and survives an empty quiz', () => {
    const records = buildAnswers(QS, { 0: 'option1', 1: 'option2', 2: 'option1' });
    expect(scoreOf(records)).toEqual({ total: 4, correct: 2, accuracy: '50.00' });
    expect(scoreOf([])).toEqual({ total: 0, correct: 0, accuracy: '0.00' });
    const third = buildAnswers(QS.slice(0, 3), { 0: 'option1' });
    expect(scoreOf(third).accuracy).toBe('33.33');
  });
});

describe('buildSessionPayload', () => {
  const answers = buildAnswers(QS, { 0: 'option1', 1: 'option2', 2: 'option1', 3: 'option4' });

  it('regular quiz: snake_case body the /quiz-sessions endpoint expects', () => {
    const body: any = buildSessionPayload({ userId: 7, params: PARAMS, validQuestions: QS, answers, durationSeconds: 90 });
    expect(body).toEqual({
      user_id: 7,
      total_questions: 4,
      correct_answers: 3,
      quiz_accuracy: 75,
      duration: 90,
      avg_time_per_question: 22.5,
      topics_covered: ['surgery', 'medicine', 'pediatrics'],
      source: 'MidgardGameBoy',
      question_ids: [1, 2, 3, 4],
    });
  });

  it("stores the legacy 'mix' source as 'general' (the session check constraint)", () => {
    const body: any = buildSessionPayload({ userId: 7, params: { ...PARAMS, source: 'mix' }, validQuestions: QS, answers, durationSeconds: 40 });
    expect(body.source).toBe('general');
  });

  it('final (mock) exam: camelCase body with per-question attempts and the time limit in seconds', () => {
    const body: any = buildSessionPayload({
      userId: 7,
      params: { ...PARAMS, isFinalQuiz: true, timerMinutes: 120 },
      validQuestions: QS,
      answers,
      durationSeconds: 100,
      device: { platform: 'android', timestamp: '2026-10-07T00:00:00.000Z' },
    });
    expect(body).toMatchObject({
      userId: 7,
      totalQuestions: 4,
      correctAnswers: 3,
      timeTaken: 100,
      timeLimit: 7200,
      questionIds: [1, 2, 3, 4],
      sessionMetadata: { device: 'android', browser: 'sqb-app', timestamp: '2026-10-07T00:00:00.000Z' },
    });
    expect(body.questionAttempts).toHaveLength(4);
    expect(body.questionAttempts[1]).toEqual({ questionId: 2, userAnswer: 'option2', correctAnswer: 'option2', isCorrect: true, timeTaken: 25 });
  });

  it('final exam without a timer sends a null limit, and a zero-length run never divides by zero', () => {
    const body: any = buildSessionPayload({ userId: 1, params: { ...PARAMS, isFinalQuiz: true }, validQuestions: [], answers: [], durationSeconds: 5 });
    expect(body.timeLimit).toBeNull();
    expect(Number.isFinite(body.timeTaken)).toBe(true);
  });
});

describe('attempt and topic payloads', () => {
  const answers = buildAnswers(QS, { 0: 'option1', 1: 'option1', 2: 'option3' });

  it('one attempt per question, tied to the session, with an even time split', () => {
    const attempts = buildAttemptPayloads({ userId: 7, sessionId: 99, validQuestions: QS, answers, durationSeconds: 83 });
    expect(attempts).toHaveLength(4);
    expect(attempts[0]).toEqual({ user_id: 7, question_id: 1, selected_option: 'option1', is_correct: true, time_taken: 20, quiz_session_id: 99 });
    expect(attempts[3].selected_option).toBeUndefined();
    expect(attempts[3].is_correct).toBe(false);
  });

  it('one topic row per specialty with accuracy over the questions asked', () => {
    const topics = buildTopicPayloads({ userId: 7, validQuestions: QS, answers, durationSeconds: 80 });
    const byType = Object.fromEntries(topics.map((t) => [t.question_type, t]));
    expect(topics).toHaveLength(3);
    expect(byType.surgery).toMatchObject({ total_answered: 2, total_correct: 1, accuracy: 50, avg_time: 20 });
    expect(byType.medicine).toMatchObject({ total_answered: 1, total_correct: 1, accuracy: 100 });
    expect(byType.pediatrics).toMatchObject({ total_answered: 1, total_correct: 0, accuracy: 0 });
  });
});

describe('settleWithRetry', () => {
  it('retries only the failures, once, and reports what is still failing', async () => {
    const flaky = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue('ok');
    const fine = vi.fn().mockResolvedValue('ok');
    const broken = vi.fn().mockRejectedValue(new Error('down'));
    const result = await settleWithRetry([fine, flaky, broken]);
    expect(result).toEqual({ failures: 1 });
    expect(fine).toHaveBeenCalledTimes(1);
    expect(flaky).toHaveBeenCalledTimes(2);
    expect(broken).toHaveBeenCalledTimes(2);
  });

  it('does a single pass when nothing fails, and handles an empty batch', async () => {
    const task = vi.fn().mockResolvedValue(1);
    expect(await settleWithRetry([task, task])).toEqual({ failures: 0 });
    expect(task).toHaveBeenCalledTimes(2);
    expect(await settleWithRetry([])).toEqual({ failures: 0 });
  });
});

describe('autosave snapshots', () => {
  const NOW = 1_800_000_000_000;
  const snap = (over: object = {}) =>
    JSON.stringify({ questions: QS, questionAnswers: { 0: 'option1' }, currentQuestionIndex: 1, revealedIndexes: [], deadline: null, startedAt: NOW - 1000, savedAt: NOW - 1000, ...over });

  it('is keyed by account, request shape and quiz kind so shared devices never cross over', () => {
    const a = snapshotSlot(1, PARAMS);
    expect(a).not.toBe(snapshotSlot(2, PARAMS));
    expect(a).not.toBe(snapshotSlot(1, { ...PARAMS, count: 20 }));
    expect(a).not.toBe(snapshotSlot(1, { ...PARAMS, types: 'surgery' }));
    expect(a).not.toBe(snapshotSlot(1, { ...PARAMS, source: 'MedicalMidgard' }));
    expect(a).not.toBe(snapshotSlot(1, { ...PARAMS, isFinalQuiz: true }));
    expect(snapshotSlot(undefined, PARAMS)).toContain('anon');
  });

  it('restores a fresh snapshot', () => {
    expect(parseSnapshot(snap(), NOW)?.currentQuestionIndex).toBe(1);
  });

  it('discards stale, expired-timer, empty and corrupt snapshots', () => {
    expect(parseSnapshot(null, NOW)).toBeNull();
    expect(parseSnapshot('not json', NOW)).toBeNull();
    expect(parseSnapshot(snap({ questions: [] }), NOW)).toBeNull();
    expect(parseSnapshot(snap({ savedAt: NOW - SNAPSHOT_MAX_AGE_MS - 1 }), NOW)).toBeNull();
    expect(parseSnapshot(snap({ savedAt: NOW - SNAPSHOT_MAX_AGE_MS + 1000 }), NOW)).not.toBeNull();
    expect(parseSnapshot(snap({ deadline: NOW - 1 }), NOW)).toBeNull();
    expect(parseSnapshot(snap({ deadline: NOW + 60_000 }), NOW)).not.toBeNull();
  });
});

describe('firstUnanswered', () => {
  it('finds the first gap, or -1 when everything is answered', () => {
    expect(firstUnanswered(4, { 0: 'a', 1: 'b', 3: 'd' })).toBe(2);
    expect(firstUnanswered(2, { 0: 'a', 1: 'b' })).toBe(-1);
    expect(firstUnanswered(0, {})).toBe(-1);
  });
});

describe('parseQuizParams', () => {
  it('applies the defaults a bare /quiz link gets', () => {
    expect(parseQuizParams({})).toEqual({ count: 10, types: 'mix', source: DEFAULT_SOURCE, timerMinutes: null, isFinalQuiz: false, mode: 'exam' });
  });

  it('clamps the count and ignores a bad timer', () => {
    expect(parseQuizParams({ count: '9999' }).count).toBe(500);
    expect(parseQuizParams({ count: '-5' }).count).toBe(1);
    expect(parseQuizParams({ count: 'abc' }).count).toBe(10);
    expect(parseQuizParams({ timer: '0' }).timerMinutes).toBeNull();
    expect(parseQuizParams({ timer: 'x' }).timerMinutes).toBeNull();
    expect(parseQuizParams({ timer: '45' }).timerMinutes).toBe(45);
  });

  it('takes the first value of a repeated param', () => {
    expect(parseQuizParams({ types: ['surgery', 'medicine'], count: ['20', '30'] })).toMatchObject({ types: 'surgery', count: 20 });
  });

  it('study mode needs an explicit ask and is never allowed on the final exam', () => {
    expect(parseQuizParams({ mode: 'study' }).mode).toBe('study');
    expect(parseQuizParams({ mode: 'whatever' }).mode).toBe('exam');
    expect(parseQuizParams({ mode: 'study', final: '1' })).toMatchObject({ mode: 'exam', isFinalQuiz: true });
  });
});
