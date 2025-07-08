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
        const response = await axios.get(`${Globals.URL}/api/questions`, {
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
  }, [numQuestions, navigate]);

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
      isCorrect
    }]);

    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

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
        const sessionRes = await axios.post(`${Globals.URL}/quiz-sessions`, {
          user_id: id,
          total_questions: totalQuestions,
          correct_answers: correctCount, // ✅ Changed from correct_options
          quiz_accuracy: parseFloat(accuracy),
          duration,
          avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
          topics_covered: topicsCovered
        });
        const quiz_session_id = sessionRes.data.id;

        // Save topic analysis
        const topicMap = {};
        answers.forEach((ans, i) => {
          const topic = questions[i]?.question_type;
          if (!topic) return;
          if (!topicMap[topic]) topicMap[topic] = { total: 0, correct: 0 };
          topicMap[topic].total += 1;
          if (ans.isCorrect) topicMap[topic].correct += 1;
        });

        for (const [topic, data] of Object.entries(topicMap)) {
          await axios.post(`${Globals.URL}/topic-analysis`, {
            user_id: id,
            question_type: topic,
            total_answered: data.total,
            total_correct: data.correct,
            accuracy: parseFloat(((data.correct / data.total) * 100).toFixed(2)),
            avg_time: parseFloat((duration / totalQuestions).toFixed(2))
          });
        }

        for (let i = 0; i < answers.length; i++) {
          const ans = answers[i];
          const q = questions[i];
          if (!id || !q.id || !ans.selected || quiz_session_id === undefined) {
            console.warn('Skipping invalid attempt', { id, qid: q?.id, selected: ans?.selected, quiz_session_id });
            continue;
          }

          const payload = {
            user_id: id,
            question_id: q.id,
            selected_option: ans.selected,
            is_correct: ans.isCorrect,
            time_taken: parseFloat((duration / totalQuestions).toFixed(2)),
            quiz_session_id
          };

          console.log("Sending attempt:", payload);

          await axios.post(`${Globals.URL}/question-attempts`, payload);
        }

        // Update user streak
        await axios.post(`${Globals.URL}/user-streaks`, { user_id: id });

        // Update user analysis
        await axios.post(`${Globals.URL}/user-analysis`, { user_id: id });

      } catch (err) {
        console.error('Error sending quiz data:', err.message);
      }
    };

    sendQuizData();
  }, [quizFinished, answers, id, dataSent, questions]);

  if (loading) return <Loading />;
  if (error) return <ErrorScreen message={error} navigate={navigate} id={id} />;
  if (quizFinished) return <Result answers={answers} navigate={navigate} id={id} />;

  return (
    <Question
      currentQuestion={questions[currentQuestionIndex]}
      currentIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      selectedAnswer={selectedAnswer}
      onSelectOption={handleSelectOption}
      onSubmitAnswer={handleSubmitAnswer}
    />
  );
};

export default QUIZ;
