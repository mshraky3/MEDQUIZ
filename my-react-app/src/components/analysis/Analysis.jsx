import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global';
import OverallStats from './OverallStats';
import StreakInfo from './StreakInfo';
import TopicAnalysisTable from './TopicAnalysisTable';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import LastQuizSummary from './LastQuizSummary';

const Analysis = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) navigate("/");
  }, [id, navigate]);

  const [userAnalysis, setUserAnalysis] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [topicAnalysis, setTopicAnalysis] = useState([]);
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userRes,
          streakRes,
          topicRes,
          questionRes,
          questionsRes
        ] = await Promise.all([
          axios.get(`${Globals.URL}/user-analysis/${id}?nocache=${Date.now()}`),
          axios.get(`${Globals.URL}/user-streaks/${id}?nocache=${Date.now()}`),
          axios.get(`${Globals.URL}/topic-analysis/user/${id}?nocache=${Date.now()}`),
          axios.get(`${Globals.URL}/question-attempts/user/${id}?nocache=${Date.now()}`),
          axios.get(`${Globals.URL}/api/all-questions?nocache=${Date.now()}`)
        ]);
        setUserAnalysis(userRes.data);
        setStreakData(streakRes.data);
        setTopicAnalysis(topicRes.data);
        setQuestionAttempts(questionRes.data);
        setQuestions(questionsRes.data.questions || []);
        setError(null);
      } catch (err) {
        setError("Failed to load analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Preparing your analysis report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="primary-button">Go Back</button>
      </div>
    );
  }

  return (
    <div className="analysis-wrapper fade-in">
      <h2 className="screen-title">Quiz Health Report</h2>
      {userAnalysis || streakData || topicAnalysis.length || questionAttempts.length ? (
        <>
          <OverallStats userAnalysis={userAnalysis} />
          <StreakInfo streakData={streakData} />
          <TopicAnalysisTable topicAnalysis={topicAnalysis} />
          <LastQuizSummary latest_quiz={userAnalysis?.latest_quiz} />
          <QuestionAttemptsTable questionAttempts={questionAttempts} questions={questions} />
        </>
      ) : (
        <p className="no-data-message">No quiz data found for this user.</p>
      )}

      <div className="button-bar">
        <button
          onClick={() => navigate("/quizs", { state: { id } })}
          className="primary-button"
        >
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default Analysis;
