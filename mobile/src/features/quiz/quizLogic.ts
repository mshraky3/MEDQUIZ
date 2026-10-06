/**
 * The pure parts of the quiz: what counts as a question, how answers are
 * scored, and exactly what is sent to the server when a quiz ends. Ported from
 * the website's QUIZ.jsx so both produce the same records; kept free of React
 * and I/O so it can be tested.
 */

export type Question = {
  id: number;
  question_text: string;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  option4?: string | null;
  correct_option: string;
  question_type: string;
  source?: string;
  explanation?: string | null;
  [key: string]: unknown;
};

export type AnswerRecord = {
  id: number;
  question: string;
  selected: string | undefined;
  correct: string;
  isCorrect: boolean;
  topic: string;
  explanation: string | null;
};

export type QuizParams = {
  /** How many questions were asked for. */
  count: number;
  /** 'mix' or a comma list of specialty keys. */
  types: string;
  source: string;
  /** Minutes, or null for no timer. */
  timerMinutes: number | null;
  isFinalQuiz: boolean;
  /** 'study' reveals each answer as it is picked; the final quiz is never study. */
  mode: 'study' | 'exam';
};

export const DEFAULT_SOURCE = 'MidgardGameBoy';
export const OPTION_KEYS = ['option1', 'option2', 'option3', 'option4'] as const;

export const isValidQuestion = (question: unknown): question is Question => {
  const q = question as Question | null | undefined;
  return !!q && typeof q === 'object' && typeof q.question_text === 'string' && q.question_text.trim().length > 0;
};

/** The per-question record the result screen reviews. */
export function buildAnswers(validQuestions: Question[], questionAnswers: Record<number, string>): AnswerRecord[] {
  return validQuestions.map((question, index) => {
    const selected = questionAnswers[index];
    return {
      id: question.id,
      question: question.question_text,
      selected,
      correct: question.correct_option,
      isCorrect: selected === question.correct_option,
      topic: question.question_type,
      explanation: question.explanation || null,
    };
  });
}

export function scoreOf(answers: AnswerRecord[]) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : '0.00';
  return { total, correct, accuracy };
}

/**
 * Runs each task, retries only the ones that failed once, and reports how many
 * are still failing. One flaky request must not silently drop the rest of the
 * batch (which is what Promise.all would do).
 */
export async function settleWithRetry(tasks: (() => Promise<unknown>)[]): Promise<{ failures: number }> {
  const firstPass = await Promise.allSettled(tasks.map((task) => task()));
  const failedIndexes = firstPass.map((r, i) => (r.status === 'rejected' ? i : -1)).filter((i) => i !== -1);
  if (failedIndexes.length === 0) return { failures: 0 };
  const retryPass = await Promise.allSettled(failedIndexes.map((i) => tasks[i]()));
  return { failures: retryPass.filter((r) => r.status === 'rejected').length };
}

/** The body of POST /quiz-sessions (regular) or /final-quiz/submit (mock exam). */
export function buildSessionPayload(args: {
  userId: number;
  params: QuizParams;
  validQuestions: Question[];
  answers: AnswerRecord[];
  durationSeconds: number;
  device?: { platform: string; timestamp: string };
}) {
  const { userId, params, validQuestions, answers, durationSeconds } = args;
  const { total, correct, accuracy } = scoreOf(answers);

  if (params.isFinalQuiz) {
    const perQuestion = Math.floor(durationSeconds / Math.max(1, total));
    return {
      userId,
      questionType: params.types,
      source: params.source,
      totalQuestions: total,
      correctAnswers: correct,
      timeTaken: durationSeconds,
      timeLimit: params.timerMinutes ? params.timerMinutes * 60 : null,
      questionIds: validQuestions.map((q) => q.id),
      questionAttempts: answers.map((answer, index) => ({
        questionId: validQuestions[index].id,
        userAnswer: answer.selected,
        correctAnswer: answer.correct,
        isCorrect: answer.isCorrect,
        timeTaken: perQuestion,
      })),
      sessionMetadata: {
        device: args.device?.platform ?? 'android',
        browser: 'sqb-app',
        timestamp: args.device?.timestamp ?? new Date().toISOString(),
      },
    };
  }

  return {
    user_id: userId,
    total_questions: total,
    correct_answers: correct,
    quiz_accuracy: parseFloat(accuracy),
    duration: durationSeconds,
    avg_time_per_question: parseFloat((durationSeconds / Math.max(1, total)).toFixed(2)),
    topics_covered: [...new Set(validQuestions.map((q) => q.question_type))],
    // The legacy 'mix' value is not a legal session source; the server's
    // check constraint stores 'general' for it.
    source: params.source === 'mix' ? 'general' : params.source,
    question_ids: validQuestions.map((q) => q.id),
  };
}

/** One POST /question-attempts body per answered question. */
export function buildAttemptPayloads(args: {
  userId: number;
  sessionId: number;
  validQuestions: Question[];
  answers: AnswerRecord[];
  durationSeconds: number;
}) {
  const { userId, sessionId, validQuestions, answers, durationSeconds } = args;
  const perQuestion = Math.floor(durationSeconds / Math.max(1, answers.length));
  return answers.map((answer, index) => ({
    user_id: userId,
    question_id: validQuestions[index].id,
    selected_option: answer.selected,
    is_correct: answer.isCorrect,
    time_taken: perQuestion,
    quiz_session_id: sessionId,
  }));
}

/** One POST /topic-analysis body per specialty covered. */
export function buildTopicPayloads(args: {
  userId: number;
  validQuestions: Question[];
  answers: AnswerRecord[];
  durationSeconds: number;
}) {
  const { userId, validQuestions, answers, durationSeconds } = args;
  const topics = [...new Set(validQuestions.map((q) => q.question_type))];
  const perQuestion = Math.floor(durationSeconds / Math.max(1, answers.length));
  return topics.map((topic) => {
    const topicQuestions = validQuestions.filter((q) => q.question_type === topic);
    const topicAnswers = answers.filter((_, index) => validQuestions[index].question_type === topic);
    const correct = topicAnswers.filter((a) => a.isCorrect).length;
    return {
      user_id: userId,
      question_type: topic,
      total_answered: topicQuestions.length,
      total_correct: correct,
      accuracy: topicQuestions.length > 0 ? (correct / topicQuestions.length) * 100 : 0,
      avg_time: perQuestion,
    };
  });
}

// ── Autosave ───────────────────────────────────────────────────────────────

export type QuizSnapshot = {
  questions: Question[];
  questionAnswers: Record<number, string>;
  currentQuestionIndex: number;
  revealedIndexes: number[];
  deadline: number | null;
  /** When the quiz was started, for the duration and for staleness. */
  startedAt: number;
  savedAt: number;
};

/** A snapshot older than this is discarded rather than offered for resuming. */
export const SNAPSHOT_MAX_AGE_MS = 12 * 60 * 60 * 1000;

/**
 * Keyed by account and by what was asked for, so a shared device can never
 * inherit someone else's in-progress answers.
 */
export function snapshotSlot(userId: number | string | undefined, p: QuizParams): string {
  return `${userId ?? 'anon'}_${p.count}_${p.types}_${p.source}_${p.isFinalQuiz ? 'f' : 'n'}`;
}

export function parseSnapshot(raw: string | null, now: number = Date.now()): QuizSnapshot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as QuizSnapshot;
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) return null;
    if (typeof parsed.savedAt === 'number' && now - parsed.savedAt > SNAPSHOT_MAX_AGE_MS) return null;
    // A timed quiz whose deadline has passed has nothing to resume.
    if (parsed.deadline && parsed.deadline <= now) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Index of the first question without an answer, or -1. */
export function firstUnanswered(count: number, questionAnswers: Record<number, string>): number {
  for (let i = 0; i < count; i += 1) if (!questionAnswers[i]) return i;
  return -1;
}

/** Normalises route params (always strings) into typed quiz params. */
export function parseQuizParams(raw: Record<string, string | string[] | undefined>): QuizParams {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const count = Math.min(500, Math.max(1, parseInt(one(raw.count) || '10', 10) || 10));
  const timer = parseInt(one(raw.timer) || '', 10);
  const isFinalQuiz = one(raw.final) === '1';
  return {
    count,
    types: one(raw.types) || 'mix',
    source: one(raw.source) || DEFAULT_SOURCE,
    timerMinutes: Number.isFinite(timer) && timer > 0 ? timer : null,
    isFinalQuiz,
    // A direct entry with no mode falls back to exam: the safer of the two, as
    // it can never reveal an answer the student did not ask to see.
    mode: one(raw.mode) === 'study' && !isFinalQuiz ? 'study' : 'exam',
  };
}
