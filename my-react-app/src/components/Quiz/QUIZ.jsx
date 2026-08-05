import React, { useEffect, useState, useRef, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './QUIZ.css';
import Loading from './Loading';
import ErrorScreen from './ErrorScreen';
import './Loading.css';
import './ErrorScreen.css';
import Result from './Result';
import Question from './Question';
import QuizComplete from './QuizComplete';
import Globals from '../../global.js';
import { getSourceLabel } from '../../utils/sourceLabels';
import { UserContext } from '../../UserContext';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

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
  const id = location.state?.id;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSent, setDataSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  // Category completion: the selected type+source has no unseen questions left.
  const [categoryDone, setCategoryDone] = useState(null);
  const [resettingCategory, setResettingCategory] = useState(false);
  // (type,source) categories finished by the quiz just submitted.
  const [completedTopics, setCompletedTopics] = useState([]);
  const quizStartTimeRef = useRef(Date.now());
  const types = location.state?.types || 'mix';
  // Default to the unified bank sentinel (a valid session source) so a stateless
  // direct navigation to /quiz/:n still fetches and submits with a legal source.
  const source = location.state?.source || 'MidgardGameBoy';
  const timerMinutes = location.state?.timer || null;
  const isFinalQuiz = location.state?.isFinalQuiz || false;
  const { user, setUser, sessionToken } = useContext(UserContext);
  const [timeRemaining, setTimeRemaining] = useState(timerMinutes ? timerMinutes * 60 : null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showUnansweredPopup, setShowUnansweredPopup] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [countdown, setCountdown] = useState(2);
  const [finalDuration, setFinalDuration] = useState(null);

  const protectedGet = async (url, config = {}) => {
    if (!user || !sessionToken) throw new Error('Not authenticated');
    const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
    try {
      return await axios.get(urlWithUser, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setUser(null, null);
        localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
        window.location.href = '/login?session=expired';
        return;
      }
      throw err;
    }
  };
  // Helper for protected POST
  const protectedPost = async (url, data, config = {}) => {
    if (!user || !sessionToken) throw new Error('Not authenticated');
    const body = { ...data, username: user.username };
    try {
      return await axios.post(url, body, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setUser(null, null);
        localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
        window.location.href = '/login?session=expired';
        return;
      }
      throw err;
    }
  };

  // Timer effect
  useEffect(() => {
    if (!timerMinutes || timerExpired || quizFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerExpired(true);
          // Store the final duration when timer expires
          const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);
          setFinalDuration(duration);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes, timerExpired, quizFinished]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategoryDone(null);

        // Add userId to params for non-trial users to filter completed questions
        const params = {
          limit: numQuestions,
          types: types,
          source: source
        };

        // Add userId for progress filtering
        if (id) {
          params.userId = id;
        }

        // Use different endpoint based on quiz type
        let endpoint, response;

        if (isFinalQuiz) {
          // Final quiz is only for authenticated users
          if (!user || !sessionToken) {
            setError(t.errFinalAuth);
            setLoading(false);
            return;
          }

          // Final quiz endpoint - get all questions including previously answered ones
          endpoint = '/final-quiz/questions';
          response = await protectedGet(`${Globals.URL}${endpoint}`, {
            params: {
              questionType: types,
              source: source
            }
          });
        } else {
          // Regular quiz endpoint
          endpoint = '/api/questions';
          response = await protectedGet(`${Globals.URL}${endpoint}`, {
            params: params
          });
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
        console.error('Error fetching questions:', err);
        setError(t.errLoadFailed);
        // Don't auto-redirect, let user retry
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [numQuestions, navigate, types, source, id, retryCount]);

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
      await protectedPost(`${Globals.URL}/api/reset-progress`, {
        userId: id,
        source,
        types: typesArr
      });
      setCategoryDone(null);
      setError(null);
      setRetryCount(prev => prev + 1); // refetch — questions are available again
    } catch (err) {
      console.error('Error resetting category progress:', err);
      setError(t.errResetFailed);
      setCategoryDone(null);
    } finally {
      setResettingCategory(false);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedAnswer(option);
    // Save answer for current question
    setQuestionAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
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


  useEffect(() => {
    const sendQuizData = async () => {
      if (!id || dataSent || !quizFinished || finalDuration === null) return;

      // Build answers array from questionAnswers
      const validQuestions = questions.filter(isValidQuestion);
      const finalAnswers = validQuestions.map((question, index) => {
        const selectedAnswer = questionAnswers[index];
        const isCorrect = selectedAnswer === question.correct_option;
        return {
          question: question.question_text,
          selected: selectedAnswer,
          correct: question.correct_option,
          isCorrect,
          topic: question.question_type
        };
      });

      if (finalAnswers.length !== validQuestions.length || validQuestions.length === 0) return;

      setDataSent(true);
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
            username: user.username,
            sessionToken: sessionToken,
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

        const sessionRes = await protectedPost(`${Globals.URL}${endpoint}`, sessionData);
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

            return protectedPost(`${Globals.URL}/question-attempts`, attemptData);
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

            return protectedPost(`${Globals.URL}/topic-analysis`, {
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
        console.error("Error sending quiz data:", error);
      }
    };

    sendQuizData();
  }, [quizFinished, questionAnswers, questions, id, dataSent, finalDuration]);

  if (loading) {
    return <Loading />;
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
    const finalAnswers = validQuestions.map((question, index) => {
      const selectedAnswer = questionAnswers[index];
      const isCorrect = selectedAnswer === question.correct_option;
      return {
        question: question.question_text,
        selected: selectedAnswer,
        correct: question.correct_option,
        isCorrect,
        topic: question.question_type
      };
    });

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
          setQuizFinished(false);
          setDataSent(false);
          setFinalDuration(null);
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
