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

const BestWorstTopic = ({ best, worst }) => (
  <section className="streak-section">
    <h3 className="section-header">Your Best & Worst Topics</h3>
    <div className="stats-grid">
      <div className="stat-card" style={{ background: 'var(--bg-light)' }}>
        <div className="stat-label">Best Topic</div>
        {best ? (
          <>
            <div className="stat-value">{best.question_type}</div>
            <div style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
              {Number(best.accuracy).toFixed(1)}% accuracy
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-light)' }}>
              {best.total_answered} questions
            </div>
          </>
        ) : <div className="stat-value">N/A</div>}
      </div>
      <div className="stat-card" style={{ background: 'var(--bg-light)' }}>
        <div className="stat-label">Weakest Topic</div>
        {worst ? (
          <>
            <div className="stat-value">{worst.question_type}</div>
            <div style={{ color: 'var(--error-color)', fontWeight: 600 }}>
              {Number(worst.accuracy).toFixed(1)}% accuracy
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-light)' }}>
              {worst.total_answered} questions
            </div>
          </>
        ) : <div className="stat-value">N/A</div>}
      </div>
    </div>
  </section>
);

const Analysis = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  const [data, setData] = useState({
    userAnalysis: null,
    streakData: null,
    topicAnalysis: [],
    questionAttempts: [],
    questions: [],
    lastQuizAttempts: []
  });
  
  const [loading, setLoading] = useState({
    userAnalysis: true,
    streakData: true,
    topicAnalysis: true,
    questionAttempts: true,
    questions: true,
    lastQuizAttempts: true
  });
  
  const [errors, setErrors] = useState({
    userAnalysis: null,
    streakData: null,
    topicAnalysis: null,
    questionAttempts: null,
    questions: null,
    lastQuizAttempts: null
  });

  const [refreshing, setRefreshing] = useState(false);
  const pollingRef = useRef();
  const isInitializedRef = useRef(false);

  // Optimized fetch functions with better error handling
  const fetchUserAnalysis = useCallback(async () => {
    setLoading(prev => ({ ...prev, userAnalysis: true }));
    setErrors(prev => ({ ...prev, userAnalysis: null }));
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/user-analysis/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, userAnalysis: res.data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, userAnalysis: 'Failed to load user analysis.' }));
    } finally {
      setLoading(prev => ({ ...prev, userAnalysis: false }));
    }
  }, [id]);

  const fetchStreakData = useCallback(async () => {
    setLoading(prev => ({ ...prev, streakData: true }));
    setErrors(prev => ({ ...prev, streakData: null }));
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/user-streaks/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, streakData: res.data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, streakData: 'Failed to load streak data.' }));
    } finally {
      setLoading(prev => ({ ...prev, streakData: false }));
    }
  }, [id]);

  const fetchTopicAnalysis = useCallback(async () => {
    setLoading(prev => ({ ...prev, topicAnalysis: true }));
    setErrors(prev => ({ ...prev, topicAnalysis: null }));
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/topic-analysis/user/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, topicAnalysis: res.data || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, topicAnalysis: 'Failed to load topic analysis.' }));
    } finally {
      setLoading(prev => ({ ...prev, topicAnalysis: false }));
    }
  }, [id]);

  const fetchQuestionAttempts = useCallback(async () => {
    setLoading(prev => ({ ...prev, questionAttempts: true }));
    setErrors(prev => ({ ...prev, questionAttempts: null }));
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/question-attempts/user/${id}?_=${timestamp}`, {
        timeout: 10000 // 10 second timeout
      });
      setData(prev => ({ ...prev, questionAttempts: res.data || [] }));
    } catch (err) {
      console.error('Error fetching question attempts:', err);
      setErrors(prev => ({ 
        ...prev, 
        questionAttempts: err.code === 'ECONNABORTED' 
          ? 'Request timed out. Please try again.' 
          : 'Failed to load question attempts.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, questionAttempts: false }));
    }
  }, [id]);

  const fetchQuestions = useCallback(async () => {
    setLoading(prev => ({ ...prev, questions: true }));
    setErrors(prev => ({ ...prev, questions: null }));
    try {
      const timestamp = Date.now();
      const res = await axios.get(`${Globals.URL}/api/all-questions?_=${timestamp}`);
      setData(prev => ({ ...prev, questions: res.data.questions || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, questions: 'Failed to load questions.' }));
    } finally {
      setLoading(prev => ({ ...prev, questions: false }));
    }
  }, []);

  const fetchLastQuizAttempts = useCallback(async (latestQuizId) => {
    if (!latestQuizId) {
      setData(prev => ({ ...prev, lastQuizAttempts: [] }));
      setLoading(prev => ({ ...prev, lastQuizAttempts: false }));
      setErrors(prev => ({ ...prev, lastQuizAttempts: null }));
      return;
    }
    setLoading(prev => ({ ...prev, lastQuizAttempts: true }));
    setErrors(prev => ({ ...prev, lastQuizAttempts: null }));
    try {
      const res = await axios.get(`${Globals.URL}/question-attempts/session/${latestQuizId}`);
      setData(prev => ({ ...prev, lastQuizAttempts: res.data || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, lastQuizAttempts: 'Failed to load last quiz attempts.' }));
    } finally {
      setLoading(prev => ({ ...prev, lastQuizAttempts: false }));
    }
  }, []);

  // Sequential loading for better performance
  const fetchAll = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous calls
    
    setRefreshing(true);
    
    try {
      // Load critical data first
      await fetchUserAnalysis();
      await fetchStreakData();
      
      // Load secondary data in parallel
      await Promise.all([
        fetchTopicAnalysis(),
        fetchQuestionAttempts(),
        fetchQuestions()
      ]);
      
      // Get the current userAnalysis data to check for latest quiz
      const currentData = await axios.get(`${Globals.URL}/user-analysis/${id}`);
      const userAnalysisData = currentData.data;
      
      // Load last quiz attempts after userAnalysis is available
      if (userAnalysisData && userAnalysisData.latest_quiz && userAnalysisData.latest_quiz.id) {
        await fetchLastQuizAttempts(userAnalysisData.latest_quiz.id);
      } else {
        setData(prev => ({ ...prev, lastQuizAttempts: [] }));
        setLoading(prev => ({ ...prev, lastQuizAttempts: false }));
        setErrors(prev => ({ ...prev, lastQuizAttempts: null }));
      }
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserAnalysis, fetchStreakData, fetchTopicAnalysis, fetchQuestionAttempts, fetchQuestions, fetchLastQuizAttempts, id, refreshing]);

  // Initial fetch and polling
  useEffect(() => {
    if (!id) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.location.state?.id) {
          clearInterval(interval);
        } else if (attempts >= 3) {
          clearInterval(interval);
          navigate('/');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchAll();
    }
    
    // Set up polling
    pollingRef.current = setInterval(() => {
      if (!refreshing) {
        fetchAll();
      }
    }, 300000); // 5 minutes
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [id, navigate]); // Remove fetchAll from dependencies to prevent re-runs

  // Manual refresh
  const handleRefresh = useCallback(() => {
    if (!refreshing) {
      fetchAll();
    }
  }, [fetchAll, refreshing]);

  // Section loading indicators
  const SectionLoader = ({ message }) => (
    <div className="section-loader">
      <div className="loader" style={{ width: 30, height: 30, borderWidth: 3 }}></div>
      <p style={{ color: '#888', fontSize: '1rem', marginTop: 8 }}>{message}</p>
    </div>
  );

  // Error component with retry button
  const ErrorWithRetry = ({ error, onRetry, retryFunction }) => (
    <div className="error-screen">
      <p>{error}</p>
      <button 
        onClick={() => {
          onRetry();
          retryFunction();
        }}
        className="retry-button"
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="analysis-wrapper fade-in">
      <h2 className="screen-title">Quiz Health Report</h2>
      
      {loading.userAnalysis ? (
        <SectionLoader message="Loading overall stats..." />
      ) : errors.userAnalysis ? (
        <ErrorWithRetry 
          error={errors.userAnalysis} 
          onRetry={() => setErrors(prev => ({ ...prev, userAnalysis: null }))}
          retryFunction={fetchUserAnalysis}
        />
      ) : (
        <>
          <OverallStats userAnalysis={data.userAnalysis} />
          <BestWorstTopic best={data.userAnalysis?.best_topic} worst={data.userAnalysis?.worst_topic} />
        </>
      )}

      {/* Streak Info */}
      {loading.streakData ? (
        <SectionLoader message="Loading streak info..." />
      ) : errors.streakData ? (
        <ErrorWithRetry 
          error={errors.streakData} 
          onRetry={() => setErrors(prev => ({ ...prev, streakData: null }))}
          retryFunction={fetchStreakData}
        />
      ) : (
        <StreakInfo streakData={data.streakData} />
      )}

      {/* Topic Analysis */}
      {loading.topicAnalysis ? (
        <SectionLoader message="Loading topic analysis..." />
      ) : errors.topicAnalysis ? (
        <ErrorWithRetry 
          error={errors.topicAnalysis} 
          onRetry={() => setErrors(prev => ({ ...prev, topicAnalysis: null }))}
          retryFunction={fetchTopicAnalysis}
        />
      ) : (
        <TopicAnalysisTable topicAnalysis={data.topicAnalysis} />
      )}
      
      {/* Last Quiz Summary (from userAnalysis) */}
      {loading.userAnalysis ? (
        <SectionLoader message="Loading last quiz summary..." />
      ) : errors.userAnalysis ? null : (
        <LastQuizSummary latest_quiz={data.userAnalysis?.latest_quiz} />
      )}

      {/* Question Attempts Table */}
      {loading.lastQuizAttempts || loading.questions ? (
        <SectionLoader message="Loading last quiz questions..." />
      ) : errors.lastQuizAttempts || errors.questions ? (
        <ErrorWithRetry 
          error={errors.lastQuizAttempts || errors.questions} 
          onRetry={() => {
            setErrors(prev => ({ 
              ...prev, 
              lastQuizAttempts: null,
              questions: null 
            }));
          }}
          retryFunction={() => {
            fetchQuestions();
            if (data.userAnalysis?.latest_quiz?.id) {
              fetchLastQuizAttempts(data.userAnalysis.latest_quiz.id);
            }
          }}
        />
      ) : (
        <QuestionAttemptsTable 
          questionAttempts={data.lastQuizAttempts} 
          questions={data.questions} 
          latestQuiz={data.userAnalysis?.latest_quiz} 
        />
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