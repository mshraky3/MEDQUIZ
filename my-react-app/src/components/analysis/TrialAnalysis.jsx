import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './analysis.css';
import OverallStats from './OverallStats';
import LastQuizSummary from './LastQuizSummary';
import TopicAnalysisTable from './TopicAnalysisTable';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import StreakInfo from './StreakInfo';

const TrialAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trialData, setTrialData] = useState(null);

  // Check if user is a trial user and get trial data
  useEffect(() => {
    if (!id || !id.startsWith('trial_')) {
      console.log('Not a trial user, redirecting to home');
      navigate('/');
      return;
    }

    const trialAnswers = window.sessionStorage.getItem('trialAnswers');
    if (!trialAnswers) {
      console.log('No trial data found, redirecting to home');
      navigate('/');
      return;
    }

    try {
      const parsed = JSON.parse(trialAnswers);
      setTrialData(parsed);
    } catch (e) {
      console.error('Error parsing trial data:', e);
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    const createTrialData = () => {
      if (!trialData) return;

      // Validate trial data structure
      if (!Array.isArray(trialData) || trialData.length === 0) {
        console.error('Invalid trial data structure');
        navigate('/');
        return;
      }

      // For trial users, create mock data from their trial answers
      const totalQuestions = trialData.length;
      const correctCount = trialData.filter(a => a.isCorrect).length;
      const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
      
      // Create mock user data for trial users
      const mockUserData = {
        total_quizzes: 1,
        total_questions_answered: totalQuestions,
        total_correct_answers: correctCount,
        accuracy: parseFloat(accuracy),
        avg_accuracy: parseFloat(accuracy),
        total_duration: 0,
        avg_duration: 0,
        latest_quiz: {
          id: 'trial_quiz_1',
          total_questions: totalQuestions,
          correct_answers: correctCount,
          quiz_accuracy: parseFloat(accuracy),
          duration: 0,
          start_time: new Date().toISOString()
        },
        last_active: new Date().toISOString(),
        topics: Object.entries(trialData.reduce((acc, answer) => {
          if (!acc[answer.topic]) acc[answer.topic] = { total: 0, correct: 0 };
          acc[answer.topic].total++;
          if (answer.isCorrect) acc[answer.topic].correct++;
          return acc;
        }, {})).map(([topic, data]) => ({
          question_type: topic,
          total_answered: data.total,
          total_correct: data.correct,
          accuracy: ((data.correct / data.total) * 100).toFixed(2),
          avg_time: 0
        })),
        duration_stats: {
          total_duration: 0,
          avg_duration: 0
        }
      };

      setUserData(mockUserData);
      setQuestions(trialData.map((answer, index) => ({
        id: `trial_q_${index + 1}`,
        question_text: answer.question,
        correct_option: answer.correct
      })));
      setQuestionAttempts(trialData.map((answer, index) => ({
        id: `trial_attempt_${index + 1}`,
        question_id: `trial_q_${index + 1}`,
        selected_option: answer.selected,
        is_correct: answer.isCorrect,
        attempted_at: new Date().toISOString(),
        quiz_session_id: 'trial_quiz_1'
      })));
      setLoading(false);
    };

    createTrialData();
  }, [trialData, navigate]);

  // Cleanup trial data when component unmounts
  useEffect(() => {
    return () => {
      // Clear trial data after a delay to allow navigation
      setTimeout(() => {
        window.sessionStorage.removeItem('trialAnswers');
      }, 1000);
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading trial analysis...</div>;
  }

  if (!userData) {
    return (
      <div className="error">
        <p>No trial data available</p>
        <button 
          onClick={() => navigate('/')} 
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="trial-analysis-notice">
        <span className="trial-emoji">🎯</span>
        <span className="trial-text">Free Trial Analysis - Based on your 40 sample questions</span>
      </div>
      
      <OverallStats userAnalysis={userData} />
      <LastQuizSummary latest_quiz={userData.latest_quiz} />
      <StreakInfo userId={id} isTrial={true} />
      <TopicAnalysisTable topics={userData.topics} />
      <QuestionAttemptsTable 
        questionAttempts={questionAttempts} 
        questions={questions} 
        latestQuiz={userData.latest_quiz}
        isTrial={true}
      />
    </div>
  );
};

export default TrialAnalysis; 