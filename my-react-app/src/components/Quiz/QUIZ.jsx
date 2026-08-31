import React, { useEffect, useState, useRef, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../utils/apiClient.js';
import './QUIZ.css';
import Loading from './Loading';
import ErrorScreen from './ErrorScreen';
import './Loading.css';
import './ErrorScreen.css';
import Result from './Result';
import Question from './Question';
import QuizComplete from './QuizComplete';
import { getSourceLabel } from '../../utils/sourceLabels';
import { UserContext } from '../../UserContext';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import { safeGetSessionItem, safeSetSessionItem, safeRemoveSessionItem } from '../../utils/safeStorage.js';

/**
 * The per-question record the result screen reviews. Built in two places (the
 * submission effect and the finished-quiz render), so it lives here to keep
 * them from drifting apart. `explanation` rides along from the question rows
 * already in memory — the review screen needs no extra request for it.
 */
const buildAnswers = (validQuestions, questionAnswers) =>
  validQuestions.map((question, index) => {
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

const isValidQuestion = (question) => {
  return (
    question &&
    typeof question === 'object' &&
    typeof question.question_text === 'string' &&
    question.question_text.trim().length > 0
  );
};

// Runs each task, retries only the ones that failed once, and reports how
// many are still failing after that — used for the per-question-attempt and
// topic-analysis submissions so one flaky request doesn't silently drop the
// rest (Promise.all would reject the whole batch on a single failure).
const settleWithRetry = async (tasks) => {
  const firstPass = await Promise.allSettled(tasks.map((task) => task()));
  const failedIndexes = firstPass
    .map((result, index) => (result.status === 'rejected' ? index : -1))
    .filter((index) => index !== -1);
  if (failedIndexes.length === 0) return { failures: 0 };

  const retryPass = await Promise.allSettled(failedIndexes.map((index) => tasks[index]()));
  const stillFailing = retryPass.filter((result) => result.status === 'rejected').length;
  return { failures: stillFailing };
};

const QUIZ = () => {
  const { numQuestions } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useCopy(quizCopy).quiz;
  const { lang, dir } = useLang();
  const { user, sessionToken } = useContext(UserContext);
  // A bookmarked/back-button /quiz/:n has no location.state, but the user is
  // still signed in — falling back to the session's own id (matching
  // QUIZS.jsx:45) is what lets sendQuizData actually submit instead of
  // silently discarding a finished quiz because `id` was never set.
  const id = user?.id || location.state?.id;
  const types = location.state?.types || 'mix';
  // Default to the unified bank sentinel (a valid session source) so a stateless
  // direct navigation to /quiz/:n still fetches and submits with a legal source.
  const source = location.state?.source || 'MidgardGameBoy';
  const timerMinutes = location.state?.timer || null;
  const isFinalQuiz = location.state?.isFinalQuiz || false;
  // 'study' locks each answer as it is picked and reveals the correct option
  // with its explanation; 'exam' is the original silent behaviour, with
  // feedback only on the result screen. A direct navigation to /quiz/:n with
  // no state (bookmark, back button) falls back to exam mode — the safer of
  // the two, since it can never reveal an answer the student did not ask to see.
  const studyMode = location.state?.mode === 'study' && !isFinalQuiz;

  // ── Autosave ──────────────────────────────────────────────────────────
  // Refreshing mid-quiz (or the back/forward button) used to lose every
  // answer and the timer, AND refetch a different randomized question set
  // from the server — there was no persistence at all. numQuestions/types/
  // source/isFinalQuiz are stable across a reload (the URL, and
  // location.state, which the History API keeps for that entry), so they're
  // enough to key a sessionStorage slot that survives one. Scoped to the
  // account id so a shared-device session change can never inherit someone
  // else's in-progress answers.
  const storageKey = `sqb_quiz_${id || 'anon'}_${numQuestions}_${types}_${source}_${isFinalQuiz ? 'f' : 'n'}`;

  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) {
    savedRef.current = (() => {
      try {
        const raw = safeGetSessionItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) return null;
        return parsed;
      } catch {
        return null;
      }
    })();
  }
  // Consumed on the fetch effect's first run only — a later refetch (manual
  // retry, changed params) must hit the network like normal, not keep
  // replaying the same restored snapshot forever.
  const skipInitialFetchRef = useRef(!!savedRef.current);

  const [questions, setQuestions] = useState(() => savedRef.current?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => savedRef.current?.currentQuestionIndex || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(() => !savedRef.current);
  const [error, setError] = useState(null);
  // dataSent means "the server acknowledged this session", nothing weaker.
  // sendingRef is the separate in-flight latch that stops a re-render from
  // firing a second submission while the first is still running — the two used
  // to be the same flag, which is why a failed submit could never be retried.
  const [dataSent, setDataSent] = useState(false);
  const sendingRef = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  // Category completion: the selected type+source has no unseen questions left.
  const [categoryDone, setCategoryDone] = useState(null);
  const [resettingCategory, setResettingCategory] = useState(false);
  // (type,source) categories finished by the quiz just submitted.
  const [completedTopics, setCompletedTopics] = useState([]);
  const quizStartTimeRef = useRef(Date.now());

  // Absolute deadline, not "seconds remaining" — computed once (restored, or
  // fresh from timerMinutes) so a refresh mid-countdown resumes the real
  // remaining time instead of re-arming the full timer or freezing it.
  const deadlineRef = useRef(
    savedRef.current?.deadline || (timerMinutes ? Date.now() + timerMinutes * 60000 : null)
  );

  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!deadlineRef.current) return null;
    return Math.max(0, Math.floor((deadlineRef.current - Date.now()) / 1000));
  });
  const [timerExpired, setTimerExpired] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState(() => savedRef.current?.questionAnswers || {});
  // Indexes whose answer has been revealed in study mode. Held here rather than
  // in <Question> because that component is keyed by index and remounts on
  // every navigation, which would reset the reveal when the student goes back.
  const [revealedIndexes, setRevealedIndexes] = useState(() => new Set(savedRef.current?.revealedIndexes || []));
  const [showUnansweredPopup, setShowUnansweredPopup] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [countdown, setCountdown] = useState(2);
  const [finalDuration, setFinalDuration] = useState(null);
  // Set when the server answers 402: the free allowance is spent, or this quiz
  // type is subscriber-only. Rendered as an upsell screen, never a redirect.
  const [paywalled, setPaywalled] = useState(null);

  // Timer effect — the updater is pure now (just the decrement). StrictMode
  // double-invokes updaters; the old version called setTimerExpired,
  // setFinalDuration and setQuizFinished from inside this one, which meant
  // those three could each fire twice per real tick in dev.
  useEffect(() => {
    if (!timerMinutes || timerExpired || quizFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes, timerExpired, quizFinished]);

  // Expiry side effects live here instead — run exactly once, the render
  // after timeRemaining actually reaches 0.
  useEffect(() => {
    if (!timerMinutes || timerExpired || quizFinished) return;
    if (timeRemaining !== 0) return;
    setTimerExpired(true);
    setFinalDuration(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
    setQuizFinished(true);
  }, [timeRemaining, timerMinutes, timerExpired, quizFinished]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      // The restored snapshot already has everything this effect would fetch.
      skipInitialFetchRef.current = false;
      return undefined;
    }

    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategoryDone(null);

        const params = { limit: numQuestions, types, source };
        if (id) params.userId = id;

        let response;
        if (isFinalQuiz) {
          if (!user || !sessionToken) {
            setError(t.errFinalAuth);
            setLoading(false);
            return;
          }
          response = await apiClient.get('/final-quiz/questions', {
            params: { questionType: types, source },
            signal: controller.signal,
          });
        } else {
          response = await apiClient.get('/api/questions', { params, signal: controller.signal });
        }

        if (response.data.questions?.length > 0) {
          const sanitizedQuestions = response.data.questions.filter(isValidQuestion);

          if (sanitizedQuestions.length > 0) {
            setQuestions(sanitizedQuestions);
          } else {
            setError(t.errInvalidData);
          }
        } else if (response.data.completed) {
          // No unseen questions left because the whole category is finished —
          // show the completion screen instead of an error.
          setCategoryDone({ total: response.data.totalInCategory || 0 });
        } else {
          setError(t.errNoQuestions);
        }
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
        // 402 = the free question allowance is spent (or this is a
        // subscriber-only quiz type). NOT a lockout and NOT an error: the
        // account is fine, there are simply no free questions left to serve.
        if (err.response?.status === 402) {
          setPaywalled(err.response.data?.reason || 'free_allowance_exhausted');
        } else {
          console.error('Error fetching questions:', err);
          setError(t.errLoadFailed);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    return () => controller.abort();
  }, [numQuestions, types, source, id, retryCount, isFinalQuiz, user, sessionToken, t]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // Clear this category's progress so the user can practise it again from scratch.
  const handleResetCategory = async () => {
    if (!user || !sessionToken) {
      navigate('/quizs', { state: { id } });
      return;
    }
    setResettingCategory(true);
    try {
      const typesArr = (!types || types === 'mix') ? [] : types.split(',');
      await apiClient.post('/api/reset-progress', {
        userId: id,
        source,
        types: typesArr
      });
      setCategoryDone(null);
      setError(null);
      setRetryCount(prev => prev + 1); // refetch — questions are available again
    } catch (err) {
      // Restarting a finished section is subscriber-only. The account that
      // finished it may have lapsed since, so this is a reachable path and
      // deserves the paywall rather than "we could not reset this section".
      if (err?.response?.status === 402) {
        navigate('/subscribe?reason=reset_requires_subscription');
        return;
      }
      console.error('Error resetting category progress:', err);
      setError(t.errResetFailed);
      setCategoryDone(null);
    } finally {
      setResettingCategory(false);
    }
  };

  const handleSelectOption = (option) => {
    // In study mode the first pick is final: the answer is about to be shown,
    // so allowing a change afterwards would let the score be edited with the
    // answer in view.
    if (studyMode && revealedIndexes.has(currentQuestionIndex)) return;

    setSelectedAnswer(option);
    // Save answer for current question
    setQuestionAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));

    if (studyMode) {
      setRevealedIndexes(prev => {
        const next = new Set(prev);
        next.add(currentQuestionIndex);
        return next;
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Check if all questions are answered before finishing
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    // Check if all questions are answered before finishing
    const unansweredQuestions = [];
    questions.forEach((_, index) => {
      if (!questionAnswers[index]) {
        unansweredQuestions.push(index);
      }
    });

    if (unansweredQuestions.length > 0) {
      // Show popup with count of unanswered questions; the countdown itself
      // and its redirect run in the effect below.
      setUnansweredCount(unansweredQuestions.length);
      setCountdown(2);
      setShowUnansweredPopup(true);
      return;
    }
    // Store the final duration when quiz is finished
    const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);
    setFinalDuration(duration);
    setQuizFinished(true);
  };

  // Drives the unanswered-questions popup's redirect countdown as a proper
  // effect, so the interval is always cleared — on unmount if the user
  // navigates away mid-countdown, and if the popup is retriggered — instead of
  // a timer started inline in an event handler that only clears itself on
  // reaching 0 and otherwise leaks, calling setState after the component is gone.
  useEffect(() => {
    if (!showUnansweredPopup) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const firstUnansweredIndex = questions.findIndex((_, index) => !questionAnswers[index]);
          if (firstUnansweredIndex !== -1) {
            setCurrentQuestionIndex(firstUnansweredIndex);
          }
          setShowUnansweredPopup(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showUnansweredPopup, questions, questionAnswers]);


  // Sync selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(questionAnswers[currentQuestionIndex] || null);
  }, [currentQuestionIndex, questionAnswers]);

  // Keep index valid if the question list changes size.
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [questions, currentQuestionIndex]);

  // Persist progress on every change, and clear it once there is nothing left
  // to protect (submitted, or the whole attempt is done). This is the write
  // side of the autosave read at the top of the component.
  useEffect(() => {
    if (quizFinished || dataSent) {
      safeRemoveSessionItem(storageKey);
      return;
    }
    if (questions.length === 0) return;
    const toSave = {
      questions,
      questionAnswers,
      currentQuestionIndex,
      revealedIndexes: [...revealedIndexes],
      deadline: deadlineRef.current,
    };
    safeSetSessionItem(storageKey, JSON.stringify(toSave));
  }, [questions, questionAnswers, currentQuestionIndex, revealedIndexes, quizFinished, dataSent, storageKey]);

  // Native "leave site?" prompt while there is progress a refresh could still
  // lose track of visually (autosave covers the data, but a closed tab still
  // ends the session) — only once at least one question has been answered,
  // so it never fires on a quiz the student hasn't actually started.
  useEffect(() => {
    if (quizFinished || dataSent || Object.keys(questionAnswers).length === 0) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [quizFinished, dataSent, questionAnswers]);


  useEffect(() => {
    const sendQuizData = async () => {
      if (!id || dataSent || !quizFinished || finalDuration === null) return;

      // Build answers array from questionAnswers
      const validQuestions = questions.filter(isValidQuestion);
      if (validQuestions.length === 0) return;
      // buildAnswers maps every validQuestion 1:1, so finalAnswers.length can
      // never differ from validQuestions.length — that comparison used to
      // sit here too, permanently true and dead.
      const finalAnswers = buildAnswers(validQuestions, questionAnswers);

      // Re-entry guard, and NOT setDataSent(true).
      //
      // This used to set dataSent before the request, so the flag doubled as
      // the "don't submit twice" latch. That made a failed submission
      // permanent: the POST throws, the catch logs to console, dataSent is
      // already true, and the effect's own guard on line 1 means the finished
      // quiz can never be sent again. The student sees a normal results screen
      // for a quiz the server never recorded. A ref keeps the double-submit
      // protection without claiming the data arrived; dataSent is now set only
      // after the server has actually acknowledged the session.
      if (sendingRef.current) return;
      sendingRef.current = true;
      const duration = finalDuration;
      const totalQuestions = finalAnswers.length;
      const correctCount = finalAnswers.filter(a => a.isCorrect).length;
      const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
      const topicsCovered = [...new Set(validQuestions.map(q => q.question_type))];

      try {
        // Use different endpoint based on quiz type
        let endpoint;
        if (isFinalQuiz) {
          endpoint = '/final-quiz/submit';
        } else {
          endpoint = '/quiz-sessions';
        }
        const questionIds = validQuestions.map(q => q.id);
        let sessionData;

        if (isFinalQuiz) {
          // Build question attempts for final quiz
          const questionAttempts = finalAnswers.map((answer, index) => {
            const question = validQuestions[index];
            return {
              questionId: question.id,
              userAnswer: answer.selected,
              correctAnswer: answer.correct,
              isCorrect: answer.isCorrect,
              timeTaken: Math.floor(duration / totalQuestions)
            };
          });

          sessionData = {
            userId: id,
            questionType: types,
            source: source,
            totalQuestions: totalQuestions,
            correctAnswers: correctCount,
            timeTaken: duration,
            timeLimit: timerMinutes ? timerMinutes * 60 : null,
            questionIds: validQuestions.map(q => q.id), // Include question IDs
            questionAttempts: questionAttempts, // Include question attempts
            sessionMetadata: {
              device: 'web',
              browser: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          };
        } else {
          sessionData = {
            user_id: id,
            total_questions: totalQuestions,
            correct_answers: correctCount,
            quiz_accuracy: parseFloat(accuracy),
            duration,
            avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
            topics_covered: topicsCovered,
            source: source === 'mix' ? 'general' : source,
            question_ids: questionIds
          };
        }

        // The session POST is the one request here that carries the student's
        // result; the attempt and topic-analysis calls below are derived detail
        // and already have their own retry (settleWithRetry). This one had
        // none — a single 500 or dropped connection lost the whole quiz. Retry
        // three times with a short backoff, telling the server when it is a
        // retry so it can recognise a submission that already landed instead of
        // writing it twice.
        const postSession = async () => {
          let lastErr;
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              return await apiClient.post(endpoint, attempt === 0 ? sessionData : { ...sessionData, retry_attempt: attempt });
            } catch (err) {
              lastErr = err;
              const status = err?.response?.status;
              // 4xx is a refusal, not a flaky call — retrying sends the same
              // rejected body again. 401 in particular is already handled
              // globally by apiClient's session-expiry interceptor.
              if (status && status >= 400 && status < 500) throw err;
              if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 800));
            }
          }
          throw lastErr;
        };

        const sessionRes = await postSession();
        setDataSent(true);
        const quiz_session_id = sessionRes.data.id;

        // The server tells us which (type, source) topics this quiz just
        // completed, so the results screen can congratulate the user.
        if (Array.isArray(sessionRes.data.completedCategories) && sessionRes.data.completedCategories.length > 0) {
          setCompletedTopics(sessionRes.data.completedCategories);
        }

        // Send individual question attempts (skip for final quiz). One failed
        // request no longer drops the rest of the batch — see settleWithRetry.
        if (!isFinalQuiz) {
          const attemptTasks = finalAnswers.map((answer, index) => () => {
            const question = validQuestions[index];
            const attemptData = {
              user_id: id,
              question_id: question.id,
              selected_option: answer.selected,
              is_correct: answer.isCorrect,
              time_taken: Math.floor(duration / totalQuestions),
              quiz_session_id: quiz_session_id
            };

            return apiClient.post('/question-attempts', attemptData);
          });

          const { failures } = await settleWithRetry(attemptTasks);
          if (failures > 0) {
            console.warn(`${failures} question attempt(s) failed to sync after retry.`);
          }
        }

        // Update topic analysis (skip for final quiz)
        if (!isFinalQuiz) {
          const topicAnalysisTasks = topicsCovered.map(topic => () => {
            const topicQuestions = validQuestions.filter(q => q.question_type === topic);
            const topicAnswers = finalAnswers.filter((_, index) => validQuestions[index].question_type === topic);
            const topicCorrect = topicAnswers.filter(a => a.isCorrect).length;
            const topicAccuracy = topicQuestions.length > 0 ? (topicCorrect / topicQuestions.length) * 100 : 0;

            return apiClient.post('/topic-analysis', {
              user_id: id,
              question_type: topic,
              total_answered: topicQuestions.length,
              total_correct: topicCorrect,
              accuracy: topicAccuracy,
              avg_time: Math.floor(duration / totalQuestions)
            });
          });

          const { failures: topicFailures } = await settleWithRetry(topicAnalysisTasks);
          if (topicFailures > 0) {
            console.warn(`${topicFailures} topic-analysis update(s) failed to sync after retry.`);
          }
        }

      } catch (error) {
        // Left as NOT sent, so this is retryable rather than lost for good:
        // dataSent stays false and the guard is released, so a remount of this
        // screen (or the answers-changed effect firing again) submits once
        // more. apiClient has already reported the failure to the error
        // tracker, which is how these surface to the owner.
        sendingRef.current = false;
        console.error("Error sending quiz data:", error);
      }
    };

    sendQuizData();
  }, [quizFinished, questionAnswers, questions, id, dataSent, finalDuration, isFinalQuiz, source, timerMinutes, types]);

  if (loading) {
    return <Loading />;
  }

  // Out of free questions. Deliberately its own screen, not ErrorScreen:
  // nothing failed, and nothing about the account has been taken away.
  if (paywalled) {
    // Three states, not two. `unanswered_backlog` is the odd one: the account
    // still HAS free questions, it has simply fetched a pile and answered none
    // of them (the allowance is spent on answering — see checkQuizAccess).
    // Sending that student to the pricing page would be a lie and a bad ask;
    // what they need is to go back and finish. Only the other two sell.
    const backlog = paywalled === 'unanswered_backlog';
    const spent = paywalled === 'free_allowance_exhausted';
    const title = backlog ? t.paywallBacklogTitle : spent ? t.paywallSpentTitle : t.paywallSubscriberTitle;
    const body = backlog ? t.paywallBacklogBody : spent ? t.paywallSpentBody : t.paywallSubscriberBody;
    const goBack = () => navigate('/quizs', { state: { id } });

    return (
      <div className="quiz-paywall" dir={dir}>
        <div className="quiz-paywall-card">
          <span className="quiz-paywall-icon" aria-hidden="true">
            <Icon name={backlog ? 'refresh' : 'lock'} size={40} />
          </span>
          <h2>{title}</h2>
          <p>{body}</p>
          <button
            type="button"
            className="quiz-paywall-cta"
            onClick={backlog ? goBack : () => navigate('/subscribe')}
          >
            {backlog ? t.paywallBacklogCta : t.paywallCta}
          </button>
          {!backlog && (
            <button type="button" className="quiz-paywall-secondary" onClick={goBack}>
              {t.paywallBack}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (categoryDone) {
    return (
      <QuizComplete
        sourceLabel={getSourceLabel(source, lang)}
        total={categoryDone.total}
        resetting={resettingCategory}
        onRestart={handleResetCategory}
        onBack={() => navigate('/quizs', { state: { id } })}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        message={error}
        navigate={navigate}
        id={id}
        onRetry={handleRetry}
      />
    );
  }

  if (quizFinished) {
    const validQuestions = questions.filter(isValidQuestion);
    const finalAnswers = buildAnswers(validQuestions, questionAnswers);

    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = finalAnswers.length;
    const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : '0.00';
    // Use the stored final duration instead of recalculating
    const duration = finalDuration !== null ? finalDuration : Math.floor((Date.now() - quizStartTimeRef.current) / 1000);

    return (
      <Result
        correctAnswers={correctCount}
        totalQuestions={totalQuestions}
        accuracy={accuracy}
        duration={duration}
        answers={finalAnswers}
        isFinalQuiz={isFinalQuiz}
        userId={id}
        completedTopics={completedTopics}
        onRetry={() => {
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setQuestionAnswers({});
          setRevealedIndexes(new Set());
          setQuizFinished(false);
          setDataSent(false);
          setFinalDuration(null);
          deadlineRef.current = timerMinutes ? Date.now() + timerMinutes * 60000 : null;
          setTimeRemaining(timerMinutes ? timerMinutes * 60 : null);
          setTimerExpired(false);
          quizStartTimeRef.current = Date.now();
        }}
        onBackToQuizs={() => navigate('/quizs', {
          state: {
            id: id
          }
        })}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!isValidQuestion(currentQuestion)) {
    return (
      <ErrorScreen
        message={t.errInvalidData}
        navigate={navigate}
        id={id}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      <Question
        // Remounts per question so the question-card's entrance fade
        // (QUIZ.css) actually plays on every question change, not just once.
        key={currentQuestionIndex}
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        revealed={studyMode && revealedIndexes.has(currentQuestionIndex)}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onFinishQuiz={handleFinishQuiz}
        timeRemaining={timeRemaining}
        timerMinutes={timerMinutes}
        userId={user?.id}
        userEmail={user?.email}
      />

      {/* Unanswered Questions Popup */}
      {showUnansweredPopup && (
        <div className="unanswered-popup-overlay">
          <div className="unanswered-popup" dir={dir}>
            <h3><Icon name="alert-triangle" size={18} /> {t.unansweredTitle(unansweredCount)}</h3>
            <p className="redirect-message">
              {t.unansweredRedirectBefore} <span className="countdown">{countdown}</span>...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default QUIZ;
