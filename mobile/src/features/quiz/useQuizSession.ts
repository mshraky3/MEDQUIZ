import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { ApiError, api, isAborted } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { KEYS, getItem, removeItem, setItem } from '@/lib/storage';
import {
  AnswerRecord,
  Question,
  QuizParams,
  QuizSnapshot,
  buildAnswers,
  buildAttemptPayloads,
  buildSessionPayload,
  buildTopicPayloads,
  firstUnanswered,
  isValidQuestion,
  parseSnapshot,
  scoreOf,
  settleWithRetry,
  snapshotSlot,
} from './quizLogic';

export type Phase = 'loading' | 'resume' | 'paywalled' | 'categoryDone' | 'error' | 'question' | 'finished';
export type SubmitState = 'idle' | 'sending' | 'sent' | 'failed';
export type QuizErrorKey = 'errFinalAuth' | 'errInvalidData' | 'errNoQuestions' | 'errLoadFailed' | 'errResetFailed';

/** A snapshot this big would not survive Android's per-row read limit: skip saving it. */
const MAX_SNAPSHOT_CHARS = 1_500_000;

/**
 * The whole life of one quiz: fetch the questions (or offer to resume an
 * unfinished one), take answers (study mode reveals each as it is picked), run
 * the countdown, and on finish submit the session, the per-question attempts
 * and the topic analysis. A port of the website's QUIZ.jsx state machine.
 */
export function useQuizSession(params: QuizParams) {
  const { user } = useAuth();
  const userId = user?.id;
  const { count, types, source, timerMinutes, isFinalQuiz } = params;
  const studyMode = params.mode === 'study' && !isFinalQuiz;
  const slot = snapshotSlot(userId, params);
  const storageKey = KEYS.quizSave(slot);

  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [errorKey, setErrorKey] = useState<QuizErrorKey | null>(null);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [paywallReason, setPaywallReason] = useState<string>('free_allowance_exhausted');
  const [resettingCategory, setResettingCategory] = useState(false);
  const [pending, setPending] = useState<QuizSnapshot | null>(null);

  const [finished, setFinished] = useState(false);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [completedTopics, setCompletedTopics] = useState<{ type: string; source: string }[]>([]);

  const [unansweredCount, setUnansweredCount] = useState(0);
  const [showUnanswered, setShowUnanswered] = useState(false);
  const [countdown, setCountdown] = useState(2);

  const startedAtRef = useRef(Date.now());
  const deadlineRef = useRef<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [decided, setDecided] = useState(false); // resume-or-new has been settled
  const sendingRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const freshDeadline = useCallback(() => (timerMinutes ? Date.now() + timerMinutes * 60_000 : null), [timerMinutes]);

  // 1. On entry, look for an unfinished quiz of exactly this shape.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snap = parseSnapshot(await getItem(storageKey));
      if (cancelled) return;
      if (snap) {
        setPending(snap);
        setPhase('resume');
      } else {
        setDecided(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // The slot identifies the quiz; entering the screen is the only trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    if (!pending) return;
    setQuestions(pending.questions);
    setAnswers(pending.questionAnswers || {});
    setIndex(Math.min(pending.currentQuestionIndex || 0, pending.questions.length - 1));
    setRevealed(new Set(pending.revealedIndexes || []));
    deadlineRef.current = pending.deadline;
    startedAtRef.current = pending.startedAt || Date.now();
    setTimeRemaining(pending.deadline ? Math.max(0, Math.floor((pending.deadline - Date.now()) / 1000)) : null);
    setPending(null);
    setDecided(true);
    setPhase('question');
  }, [pending]);

  const startNew = useCallback(async () => {
    await removeItem(storageKey);
    setPending(null);
    setPhase('loading');
    setDecided(true);
    setFetchTick((n) => n + 1);
  }, [storageKey]);

  // 2. Fetch a fresh set of questions.
  useEffect(() => {
    if (!decided) return undefined;
    if (questions.length > 0 && fetchTick === 0) return undefined; // resumed

    const controller = new AbortController();
    (async () => {
      try {
        setPhase('loading');
        setErrorKey(null);
        let response: any;
        if (isFinalQuiz) {
          if (!user) {
            setErrorKey('errFinalAuth');
            setPhase('error');
            return;
          }
          response = await api.get('/final-quiz/questions', { params: { questionType: types, source }, signal: controller.signal });
        } else {
          const query: Record<string, unknown> = { limit: count, types, source };
          if (userId) query.userId = userId;
          response = await api.get('/api/questions', { params: query, signal: controller.signal });
        }
        if (!alive.current) return;

        if (response?.questions?.length > 0) {
          const sane = (response.questions as unknown[]).filter(isValidQuestion);
          if (sane.length > 0) {
            startedAtRef.current = Date.now();
            deadlineRef.current = freshDeadline();
            setTimeRemaining(timerMinutes ? timerMinutes * 60 : null);
            setQuestions(sane);
            setAnswers({});
            setRevealed(new Set());
            setIndex(0);
            setFinished(false);
            setFinalDuration(null);
            setSubmitState('idle');
            sendingRef.current = false;
            setPhase('question');
          } else {
            setErrorKey('errInvalidData');
            setPhase('error');
          }
        } else if (response?.completed) {
          // No unseen questions left because the whole category is finished.
          setCategoryTotal(response.totalInCategory || 0);
          setPhase('categoryDone');
        } else {
          setErrorKey('errNoQuestions');
          setPhase('error');
        }
      } catch (err) {
        if (isAborted(err)) return;
        if (!alive.current) return;
        // 402: the free allowance is spent, or this is a subscriber-only quiz
        // type. NOT a lockout and NOT an error: there are simply no free
        // questions left to serve.
        if (err instanceof ApiError && err.status === 402) {
          setPaywallReason(err.data?.reason || 'free_allowance_exhausted');
          setPhase('paywalled');
        } else {
          setErrorKey('errLoadFailed');
          setPhase('error');
        }
      }
    })();
    return () => controller.abort();
    // `questions.length` is deliberately read once, to tell a resume from a fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decided, fetchTick, count, types, source, isFinalQuiz, userId]);

  // 3. The countdown. Absolute deadline, so backgrounding the app cannot pause it.
  useEffect(() => {
    if (!timerMinutes || finished || phase !== 'question') return undefined;
    const tick = () => {
      const deadline = deadlineRef.current;
      if (!deadline) return;
      setTimeRemaining(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [timerMinutes, finished, phase, questions.length]);

  const finishNow = useCallback(() => {
    setFinalDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
    setFinished(true);
    setShowUnanswered(false);
    setPhase('finished');
    void removeItem(storageKey);
  }, [storageKey]);

  // Time ran out: finish with whatever has been answered.
  useEffect(() => {
    if (!timerMinutes || finished || phase !== 'question') return;
    if (timeRemaining === 0 && questions.length > 0) finishNow();
  }, [timeRemaining, timerMinutes, finished, phase, questions.length, finishNow]);

  // 4. Autosave, debounced, only while there is something to protect.
  useEffect(() => {
    if (phase !== 'question' || finished || questions.length === 0) return undefined;
    const handle = setTimeout(() => {
      const snapshot: QuizSnapshot = {
        questions,
        questionAnswers: answers,
        currentQuestionIndex: index,
        revealedIndexes: [...revealed],
        deadline: deadlineRef.current,
        startedAt: startedAtRef.current,
        savedAt: Date.now(),
      };
      const raw = JSON.stringify(snapshot);
      if (raw.length <= MAX_SNAPSHOT_CHARS) void setItem(storageKey, raw);
    }, 400);
    return () => clearTimeout(handle);
  }, [phase, finished, questions, answers, index, revealed, storageKey]);

  // 5. Unanswered-questions popup: counts down, then jumps to the first gap.
  useEffect(() => {
    if (!showUnanswered) return undefined;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const gap = firstUnanswered(questions.length, answers);
          if (gap !== -1) setIndex(gap);
          setShowUnanswered(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showUnanswered, questions.length, answers]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const select = useCallback(
    (option: string) => {
      // In study mode the first pick is final: the answer is about to be shown,
      // so allowing a change afterwards would let the score be edited with the
      // answer in view.
      if (studyMode && revealed.has(index)) return;
      setAnswers((prev) => ({ ...prev, [index]: option }));
      if (studyMode) setRevealed((prev) => new Set(prev).add(index));
    },
    [studyMode, revealed, index]
  );

  const finish = useCallback(() => {
    const gaps = questions.map((_, i) => i).filter((i) => !answers[i]);
    if (gaps.length > 0) {
      setUnansweredCount(gaps.length);
      setCountdown(2);
      setShowUnanswered(true);
      return;
    }
    finishNow();
  }, [questions, answers, finishNow]);

  const next = useCallback(() => {
    if (index + 1 < questions.length) setIndex(index + 1);
    else finish();
  }, [index, questions.length, finish]);

  const previous = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  const retryFetch = useCallback(() => {
    setErrorKey(null);
    setQuestions([]);
    setFetchTick((n) => n + 1);
  }, []);

  /** Clears this category's progress so it can be practised again from scratch. */
  const resetCategory = useCallback(async (): Promise<'ok' | 'subscribe' | 'failed'> => {
    if (!user) return 'failed';
    setResettingCategory(true);
    try {
      const typesArr = !types || types === 'mix' ? [] : types.split(',');
      await api.post('/api/reset-progress', { userId, source, types: typesArr });
      setCategoryTotal(0);
      setQuestions([]);
      setFetchTick((n) => n + 1);
      return 'ok';
    } catch (err) {
      // Restarting a finished section is subscriber-only.
      if (err instanceof ApiError && err.status === 402) return 'subscribe';
      setErrorKey('errResetFailed');
      setPhase('error');
      return 'failed';
    } finally {
      if (alive.current) setResettingCategory(false);
    }
  }, [user, userId, types, source]);

  /** "Another quiz" means a NEW set, not the same ten again. */
  const startAnother = useCallback(() => {
    setQuestions([]);
    setAnswers({});
    setRevealed(new Set());
    setIndex(0);
    setFinished(false);
    setFinalDuration(null);
    setCompletedTopics([]);
    setSubmitState('idle');
    sendingRef.current = false;
    setPhase('loading');
    setFetchTick((n) => n + 1);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────

  const validQuestions = useMemo(() => questions.filter(isValidQuestion), [questions]);
  const answerRecords: AnswerRecord[] = useMemo(() => buildAnswers(validQuestions, answers), [validQuestions, answers]);
  const score = useMemo(() => scoreOf(answerRecords), [answerRecords]);
  const duration = finalDuration ?? Math.floor((Date.now() - startedAtRef.current) / 1000);

  // 6. Submit. The in-flight latch is a ref (a re-render must not fire a second
  // submission) and is separate from `submitState`, which only says 'sent' once
  // the server has acknowledged the session, so a failed submit can be retried.
  const submit = useCallback(async () => {
    if (!userId || finalDuration === null || validQuestions.length === 0) return;
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSubmitState('sending');
    const durationSeconds = finalDuration;
    try {
      const endpoint = isFinalQuiz ? '/final-quiz/submit' : '/quiz-sessions';
      const sessionData = buildSessionPayload({
        userId,
        params,
        validQuestions,
        answers: answerRecords,
        durationSeconds,
        device: { platform: Platform.OS === 'web' ? 'web' : 'android', timestamp: new Date().toISOString() },
      });

      // The session POST carries the student's result; the attempts and topic
      // analysis are derived detail with their own retry. Retry it three times
      // with a short backoff, telling the server when it is a retry so it can
      // recognise a submission that already landed instead of writing it twice.
      let sessionRes: any;
      let lastErr: unknown;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          sessionRes = await api.post(endpoint, attempt === 0 ? sessionData : { ...sessionData, retry_attempt: attempt });
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          const status = err instanceof ApiError ? err.status : 0;
          // A 4xx is a refusal, not a flaky call: retrying sends the same body.
          if (status >= 400 && status < 500) throw err;
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 800));
        }
      }
      if (lastErr) throw lastErr;

      if (!alive.current) return;
      setSubmitState('sent');
      if (Array.isArray(sessionRes?.completedCategories) && sessionRes.completedCategories.length > 0) {
        setCompletedTopics(sessionRes.completedCategories);
      }

      if (!isFinalQuiz) {
        const sessionId = sessionRes.id as number;
        const attempts = buildAttemptPayloads({ userId, sessionId, validQuestions, answers: answerRecords, durationSeconds });
        await settleWithRetry(attempts.map((body) => () => api.post('/question-attempts', body)));
        const topics = buildTopicPayloads({ userId, validQuestions, answers: answerRecords, durationSeconds });
        await settleWithRetry(topics.map((body) => () => api.post('/topic-analysis', body)));
      }
    } catch {
      // Left retryable rather than lost for good.
      sendingRef.current = false;
      if (alive.current) setSubmitState('failed');
    }
  }, [userId, finalDuration, validQuestions, answerRecords, isFinalQuiz, params]);

  useEffect(() => {
    if (finished && finalDuration !== null && submitState === 'idle') void submit();
  }, [finished, finalDuration, submitState, submit]);

  return {
    phase,
    questions: validQuestions,
    current: validQuestions[index] as Question | undefined,
    index,
    total: validQuestions.length,
    answers,
    revealed,
    studyMode,
    isRevealed: studyMode && revealed.has(index),
    selected: answers[index] ?? null,
    timeRemaining,
    errorKey,
    categoryTotal,
    paywallReason,
    resettingCategory,
    pendingResume: pending,
    finished,
    duration,
    score,
    answerRecords,
    submitState,
    completedTopics,
    unansweredCount,
    showUnanswered,
    countdown,
    select,
    next,
    previous,
    finish,
    retryFetch,
    resetCategory,
    startAnother,
    resume,
    startNew,
    retrySubmit: () => {
      setSubmitState('idle');
    },
  };
}
