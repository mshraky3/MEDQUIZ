import React, { useEffect, useState, useCallback, useRef } from 'react';
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

  // Section states
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [userAnalysisLoading, setUserAnalysisLoading] = useState(true);
  const [userAnalysisError, setUserAnalysisError] = useState(null);

  const [streakData, setStreakData] = useState(null);
  const [streakLoading, setStreakLoading] = useState(true);
  const [streakError, setStreakError] = useState(null);

  const [topicAnalysis, setTopicAnalysis] = useState([]);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState(null);

  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [questionAttemptsLoading, setQuestionAttemptsLoading] = useState(true);
  const [questionAttemptsError, setQuestionAttemptsError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);

  const [lastQuizAttempts, setLastQuizAttempts] = useState([]);
  const [lastQuizAttemptsLoading, setLastQuizAttemptsLoading] = useState(true);
  const [lastQuizAttemptsError, setLastQuizAttemptsError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const pollingRef = useRef();

  // Fetch functions
  const fetchUserAnalysis = useCallback(async () => {
    setUserAnalysisLoading(true);
    setUserAnalysisError(null);
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/user-analysis/${id}?_=${timestamp}`);
      setUserAnalysis(res.data);
    } catch (err) {
      setUserAnalysisError('Failed to load user analysis.');
    } finally {
      setUserAnalysisLoading(false);
    }
  }, [id]);

  const fetchStreakData = useCallback(async () => {
    setStreakLoading(true);
    setStreakError(null);
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/user-streaks/${id}?_=${timestamp}`);
      setStreakData(res.data);
    } catch (err) {
      setStreakError('Failed to load streak data.');
    } finally {
      setStreakLoading(false);
    }
  }, [id]);

  const fetchTopicAnalysis = useCallback(async () => {
    setTopicLoading(true);
    setTopicError(null);
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/topic-analysis/user/${id}?_=${timestamp}`);
      setTopicAnalysis(res.data || []);
    } catch (err) {
      setTopicError('Failed to load topic analysis.');
    } finally {
      setTopicLoading(false);
    }
  }, [id]);

  const fetchQuestionAttempts = useCallback(async () => {
    setQuestionAttemptsLoading(true);
    setQuestionAttemptsError(null);
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/question-attempts/user/${id}?_=${timestamp}`);
      setQuestionAttempts(res.data || []);
    } catch (err) {
      setQuestionAttemptsError('Failed to load question attempts.');
    } finally {
      setQuestionAttemptsLoading(false);
    }
  }, [id]);

  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError(null);
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/api/all-questions?_=${timestamp}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      setQuestionsError('Failed to load questions.');
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  // Fetch only last quiz attempts
  const fetchLastQuizAttempts = useCallback(async (latestQuizId) => {
    if (!latestQuizId) {
      setLastQuizAttempts([]);
      setLastQuizAttemptsLoading(false);
      setLastQuizAttemptsError(null);
      return;
    }
    setLastQuizAttemptsLoading(true);
    setLastQuizAttemptsError(null);
    try {
      const res = await axios.get(`${Globals.URL}/question-attempts/session/${latestQuizId}`);
      setLastQuizAttempts(res.data || []);
    } catch (err) {
      setLastQuizAttemptsError('Failed to load last quiz attempts.');
    } finally {
      setLastQuizAttemptsLoading(false);
    }
  }, []);

  // Fetch all sections
  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUserAnalysis(),
      fetchStreakData(),
      fetchTopicAnalysis(),
      fetchQuestionAttempts(),
      fetchQuestions()
    ]);
    // Fetch last quiz attempts after userAnalysis is loaded
    if (userAnalysis && userAnalysis.latest_quiz && userAnalysis.latest_quiz.id) {
      await fetchLastQuizAttempts(userAnalysis.latest_quiz.id);
    } else {
      setLastQuizAttempts([]);
      setLastQuizAttemptsLoading(false);
      setLastQuizAttemptsError(null);
    }
    setRefreshing(false);
  }, [fetchUserAnalysis, fetchStreakData, fetchTopicAnalysis, fetchQuestionAttempts, fetchQuestions, fetchLastQuizAttempts, userAnalysis]);

  // Initial fetch and polling
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    fetchAll();
    pollingRef.current = setInterval(fetchAll, 30000000);
    return () => clearInterval(pollingRef.current);
  }, [id, fetchAll, navigate]);

  // Manual refresh
  const handleRefresh = () => {
    fetchAll();
  };

  // Section loading indicators
  const SectionLoader = ({ message }) => (
    <div className="section-loader">
      <div className="loader" style={{ width: 30, height: 30, borderWidth: 3 }}></div>
      <p style={{ color: '#888', fontSize: '1rem', marginTop: 8 }}>{message}</p>
    </div>
  );

  return (
    <div className="analysis-wrapper fade-in">
      <h2 className="screen-title">Quiz Health Report</h2>
      {userAnalysisLoading ? (
        <SectionLoader message="Loading overall stats..." />
      ) : userAnalysisError ? (
        <div className="error-screen"><p>{userAnalysisError}</p></div>
      ) : (
        <OverallStats userAnalysis={userAnalysis} />
      )}

      {/* Streak Info */}
      {streakLoading ? (
        <SectionLoader message="Loading streak info..." />
      ) : streakError ? (
        <div className="error-screen"><p>{streakError}</p></div>
      ) : (
        <StreakInfo streakData={streakData} />
      )}

      {/* Topic Analysis */}
      {topicLoading ? (
        <SectionLoader message="Loading topic analysis..." />
      ) : topicError ? (
        <div className="error-screen"><p>{topicError}</p></div>
      ) : (
        <TopicAnalysisTable topicAnalysis={topicAnalysis} />
      )}

      {/* Last Quiz Summary (from userAnalysis) */}
      {userAnalysisLoading ? (
        <SectionLoader message="Loading last quiz summary..." />
      ) : userAnalysisError ? null : (
        <LastQuizSummary latest_quiz={userAnalysis?.latest_quiz} />
      )}

      {/* Question Attempts Table */}
      {lastQuizAttemptsLoading || questionsLoading ? (
        <SectionLoader message="Loading last quiz questions..." />
      ) : lastQuizAttemptsError || questionsError ? (
        <div className="error-screen"><p>{lastQuizAttemptsError || questionsError}</p></div>
      ) : (
        <QuestionAttemptsTable questionAttempts={lastQuizAttempts} questions={questions} latestQuiz={userAnalysis?.latest_quiz} />
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