import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './QUIZ.css';
import Loading from './Loading';
import ErrorScreen from './ErrorScreen';
import Result from './Result';
import Question from './Question';
import Globals from '../../global';

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
  const quizStartTimeRef = useRef(Date.now());
  const types = location.state?.types || 'mix';
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Use different endpoint for trial users
        const endpoint = isTrial ? '/free-trial/questions' : '/api/questions';
        const response = await axios.get(`${Globals.URL}${endpoint}`, {
          params: { limit: numQuestions, types: types }
        });

        if (response.data.questions?.length > 0) {
          setQuestions(response.data.questions);
        } else {
          setError("No questions were returned.");
        }
      } catch (err) {
        setError("Failed to load questions.");
        alert("Could not load quiz. Redirecting...");
        navigate("/quizs");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [numQuestions, navigate, isTrial, types]);

  const handleSelectOption = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_option;

    setAnswers(prev => [...prev, {
      question: currentQuestion.question_text,
      selected: selectedAnswer,
      correct: currentQuestion.correct_option,
      isCorrect,
      topic: currentQuestion.question_type
    }]);

    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  useEffect(() => {
    // Save trial answers for analysis
    if (isTrial && quizFinished && answers.length === questions.length) {
      window.sessionStorage.setItem('trialAnswers', JSON.stringify(answers));
    }
  }, [isTrial, quizFinished, answers, questions]);

  useEffect(() => {
    const sendQuizData = async () => {
      if (!id || dataSent || !quizFinished) return;
      if (answers.length !== questions.length) return;

      setDataSent(true);
      const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);
      const totalQuestions = answers.length;
      const correctCount = answers.filter(a => a.isCorrect).length;
      const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
      const topicsCovered = [...new Set(questions.map(q => q.question_type))];

      try {
        // Use different endpoint for trial users
        const endpoint = isTrial ? '/free-trial/quiz-sessions' : '/quiz-sessions';
        const sessionData = isTrial 
          ? {
              trialId: id,
              total_questions: totalQuestions,
              correct_answers: correctCount,
              quiz_accuracy: parseFloat(accuracy),
              duration,
              avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
              topics_covered: topicsCovered
            }
          : {
              user_id: id,
              total_questions: totalQuestions,
              correct_answers: correctCount,
              quiz_accuracy: parseFloat(accuracy),
              duration,
              avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
              topics_covered: topicsCovered
            };

        const sessionRes = await axios.post(`${Globals.URL}${endpoint}`, sessionData);
        const quiz_session_id = sessionRes.data.id;

        // Send individual question attempts
        const attemptPromises = answers.map((answer, index) => {
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
          return axios.post(`${Globals.URL}${attemptEndpoint}`, attemptData);
        });

        await Promise.all(attemptPromises);

        // Update topic analysis for non-trial users
        if (!isTrial) {
          const topicAnalysisPromises = topicsCovered.map(topic => {
            const topicQuestions = questions.filter(q => q.question_type === topic);
            const topicAnswers = answers.filter((_, index) => questions[index].question_type === topic);
            const topicCorrect = topicAnswers.filter(a => a.isCorrect).length;
            const topicAccuracy = topicQuestions.length > 0 ? (topicCorrect / topicQuestions.length) * 100 : 0;

            return axios.post(`${Globals.URL}/topic-analysis`, {
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
  }, [quizFinished, answers, questions, id, dataSent, isTrial]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  if (quizFinished) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
    const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);

    return (
      <Result
        correctAnswers={correctCount}
        totalQuestions={totalQuestions}
        accuracy={accuracy}
        duration={duration}
        answers={answers}
        isTrial={isTrial}
        userId={id}
        onRetry={() => {
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setAnswers([]);
          setQuizFinished(false);
          setDataSent(false);
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
    <Question
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      selectedAnswer={selectedAnswer}
      onSelectOption={handleSelectOption}
      onSubmitAnswer={handleSubmitAnswer}
      isTrial={isTrial}
    />
  );
};

export default QUIZ;
