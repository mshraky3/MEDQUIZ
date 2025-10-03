import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './QUIZ.css';
import Loading from './Loading';
import ErrorScreen from './ErrorScreen';
import './Loading.css';
import './ErrorScreen.css';
import Result from './Result';
import Question from './Question';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';

const QUIZ = () => {
  const { numQuestions } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const isTrial = location.state?.isTrial || false;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSent, setDataSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const quizStartTimeRef = useRef(Date.now());
  const types = location.state?.types || 'mix';
  const source = location.state?.source || 'mix';
  const timerMinutes = location.state?.timer || null;
  const { user, setUser, sessionToken } = useContext(UserContext);
  const [timeRemaining, setTimeRemaining] = useState(timerMinutes ? timerMinutes * 60 : null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showUnansweredPopup, setShowUnansweredPopup] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [countdown, setCountdown] = useState(2);
  
  const protectedGet = async (url, config = {}) => {
    if (!user || !sessionToken) throw new Error('Not authenticated');
    const urlWithCreds = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}&sessionToken=${encodeURIComponent(sessionToken)}`;
    try {
      return await axios.get(urlWithCreds, config);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setUser(null, null);
        localStorage.clear();
        window.location.href = '/login?session=expired';
        return;
      }
      throw err;
    }
  };
  // Helper for protected POST
  const protectedPost = async (url, data, config = {}) => {
    if (!user || !sessionToken) throw new Error('Not authenticated');
    const body = { ...data, username: user.username, sessionToken };
    try {
      return await axios.post(url, body, config);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setUser(null, null);
        localStorage.clear();
        window.location.href = '/login?session=expired';
        return;
      }
      throw err;
    }
  };

  // Timer effect
  useEffect(() => {
    if (!timerMinutes || timerExpired) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerExpired(true);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes, timerExpired]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add userId to params for non-trial users to filter completed questions
        const params = { 
          limit: numQuestions, 
          types: types, 
          source: source 
        };
        
        // Add userId for progress filtering (non-trial users only)
        if (!isTrial && id) {
          params.userId = id;
        }
        
        // Use different endpoint for trial users
        const endpoint = isTrial ? '/free-trial/questions' : '/api/questions';
        const response = await protectedGet(`${Globals.URL}${endpoint}`, {
          params: params
        });

        if (response.data.questions?.length > 0) {
          setQuestions(response.data.questions);
        } else {
          setError("No questions were returned.");
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError("Failed to load questions.");
        // Don't auto-redirect, let user retry
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [numQuestions, navigate, isTrial, types, source, id, retryCount]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
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
      // Show popup with count of unanswered questions and auto-redirect
      setUnansweredCount(unansweredQuestions.length);
      setCountdown(2);
      setShowUnansweredPopup(true);
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Redirect to first unanswered question
            const firstUnansweredIndex = questions.findIndex((_, index) => !questionAnswers[index]);
            if (firstUnansweredIndex !== -1) {
              setCurrentQuestionIndex(firstUnansweredIndex);
              setShowUnansweredPopup(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return;
    }
    setQuizFinished(true);
  };


  // Sync selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(questionAnswers[currentQuestionIndex] || null);
  }, [currentQuestionIndex, questionAnswers]);

  useEffect(() => {
    // Save trial answers for analysis
    if (isTrial && quizFinished && Object.keys(questionAnswers).length === questions.length) {
      const trialAnswers = questions.map((question, index) => {
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
      window.sessionStorage.setItem('trialAnswers', JSON.stringify(trialAnswers));
    }
  }, [isTrial, quizFinished, questionAnswers, questions]);

  useEffect(() => {
    const sendQuizData = async () => {
      if (!id || dataSent || !quizFinished) return;
      
      // Build answers array from questionAnswers
      const finalAnswers = questions.map((question, index) => {
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
      
      if (finalAnswers.length !== questions.length) return;

      setDataSent(true);
      const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);
      const totalQuestions = finalAnswers.length;
      const correctCount = finalAnswers.filter(a => a.isCorrect).length;
      const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
      const topicsCovered = [...new Set(questions.map(q => q.question_type))];
      console.log("QUIZ - topicsCovered:", topicsCovered);
      console.log("QUIZ - questions types:", questions.map(q => q.question_type));

      try {
        // Use different endpoint for trial users
        const endpoint = isTrial ? '/free-trial/quiz-sessions' : '/quiz-sessions';
        const questionIds = questions.map(q => q.id);
        const sessionData = isTrial 
          ? {
              trialId: id,
              total_questions: totalQuestions,
              correct_answers: correctCount,
              quiz_accuracy: parseFloat(accuracy),
              duration,
              avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
              topics_covered: topicsCovered,
              source: source === 'mix' ? 'general' : source,
              question_ids: questionIds
            }
          : {
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

        const sessionRes = await protectedPost(`${Globals.URL}${endpoint}`, sessionData);
        const quiz_session_id = sessionRes.data.id;

        // Send individual question attempts
        const attemptPromises = finalAnswers.map((answer, index) => {
          const question = questions[index];
          const attemptData = isTrial
            ? {
                trialId: id,
                question_id: question.id,
                selected_option: answer.selected,
                is_correct: answer.isCorrect,
                time_taken: Math.floor(duration / totalQuestions),
                quiz_session_id: quiz_session_id
              }
            : {
                user_id: id,
                question_id: question.id,
                selected_option: answer.selected,
                is_correct: answer.isCorrect,
                time_taken: Math.floor(duration / totalQuestions),
                quiz_session_id: quiz_session_id
              };

          const attemptEndpoint = isTrial ? '/free-trial/question-attempts' : '/question-attempts';
          return protectedPost(`${Globals.URL}${attemptEndpoint}`, attemptData);
        });

        await Promise.all(attemptPromises);

        // Update topic analysis for non-trial users
        if (!isTrial) {
          const topicAnalysisPromises = topicsCovered.map(topic => {
            const topicQuestions = questions.filter(q => q.question_type === topic);
            const topicAnswers = finalAnswers.filter((_, index) => questions[index].question_type === topic);
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

          await Promise.all(topicAnalysisPromises);
        }

      } catch (error) {
        console.error("Error sending quiz data:", error);
      }
    };

    sendQuizData();
  }, [quizFinished, questionAnswers, questions, id, dataSent, isTrial]);

  if (loading) {
    return <Loading />;
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
    const finalAnswers = questions.map((question, index) => {
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
    const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
    const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);

    return (
      <Result
        correctAnswers={correctCount}
        totalQuestions={totalQuestions}
        accuracy={accuracy}
        duration={duration}
        answers={finalAnswers}
        isTrial={isTrial}
        userId={id}
        onRetry={() => {
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setQuestionAnswers({});
          setQuizFinished(false);
          setDataSent(false);
          setTimeRemaining(timerMinutes ? timerMinutes * 60 : null);
          setTimerExpired(false);
          quizStartTimeRef.current = Date.now();
        }}
        onBackToQuizs={() => navigate('/quizs', { 
          state: { 
            id: id, 
            isTrial: isTrial 
          } 
        })}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Question
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onFinishQuiz={handleFinishQuiz}
        isTrial={isTrial}
        timeRemaining={timeRemaining}
        timerMinutes={timerMinutes}
      />
      
      {/* Unanswered Questions Popup */}
      {showUnansweredPopup && (
        <div className="unanswered-popup-overlay">
          <div className="unanswered-popup">
            <h3>⚠️ {unansweredCount} Unanswered Questions</h3>
            <p className="redirect-message">
              Going to first unanswered question in <span className="countdown">{countdown}</span>...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default QUIZ;
