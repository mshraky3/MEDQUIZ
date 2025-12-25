import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global.js';
import SEO from '../common/SEO';
import OverallStats from './OverallStats';
import StreakInfo from './StreakInfo';
import TopicAnalysisTable from './TopicAnalysisTable';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import LastQuizSummary from './LastQuizSummary';
import QuizHistory from './QuizHistory';
import Progress from './Progress';
import FinalExams from './FinalExams';
import Navbar from '../common/Navbar.jsx';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';

const BestWorstTopic = ({ best, worst }) => (
  <section className="streak-section">
    <h3 className="section-header">Your Best & Worst Topics</h3>
    <div className="questions-grid">
      <div className="question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className="type-badge" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}>
              🏆 Best Topic
            </span>
            <span className="accuracy-badge" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}>
              📊 {best ? `${Number(best.accuracy).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="question-content">
          <div className="topic-performance-text">
            <h4>Your Strongest Subject</h4>
            <p>Keep up the great work in this area!</p>
          </div>
          
          <div className="answers-section">
            <div className="answer-row">
              <span className="answer-label correct">Topic:</span>
              <span className="answer-text correct">{best?.question_type || 'No data yet'}</span>
            </div>
            
            <div className="answer-row">
              <span className="answer-label accuracy">Accuracy:</span>
              <span className="answer-text accuracy">{best ? `${Number(best.accuracy).toFixed(1)}%` : 'N/A'}</span>
            </div>
            
            <div className="answer-row">
              <span className="answer-label primary">Questions:</span>
              <span className="answer-text primary">{best?.total_answered || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className="type-badge" style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white'
            }}>
              📉 Needs Improvement
            </span>
            <span className="accuracy-badge" style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white'
            }}>
              📊 {worst ? `${Number(worst.accuracy).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="question-content">
          <div className="topic-performance-text">
            <h4>Focus Area</h4>
            <p>Spend more time practicing this topic!</p>
          </div>
          
          <div className="answers-section">
            <div className="answer-row">
              <span className="answer-label wrong">Topic:</span>
              <span className="answer-text wrong">{worst?.question_type || 'No data yet'}</span>
            </div>
            
            <div className="answer-row">
              <span className="answer-label accuracy">Accuracy:</span>
              <span className="answer-text accuracy">{worst ? `${Number(worst.accuracy).toFixed(1)}%` : 'N/A'}</span>
            </div>
            
            <div className="answer-row">
              <span className="answer-label primary">Questions:</span>
              <span className="answer-text primary">{worst?.total_answered || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Analysis = () => {
  const { user, setUser, sessionToken } = useContext(UserContext);
  const location = useLocation();
  const id = user?.id || location.state?.id;
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
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');

  // SEO structured data for analysis page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "SMLE Performance Analysis - Track Your Progress",
    "description": "Comprehensive SMLE performance analysis with detailed statistics, topic-wise breakdown, and progress tracking. Monitor your strengths and weaknesses.",
        "url": `${Globals.URL}/analysis`,
    "mainEntity": {
      "@type": "EducationalService",
      "name": "SMLE Performance Analytics",
      "description": "Detailed analysis of SMLE practice performance with topic-wise statistics and progress tracking",
      "provider": {
        "@type": "Organization",
        "name": "SQB"
      }
    }
  };

  // Function to calculate best and worst topics from topicAnalysis data
  const calculateBestWorstTopics = useCallback((topicAnalysis) => {
    if (!topicAnalysis || !Array.isArray(topicAnalysis) || topicAnalysis.length === 0) {
      return { best: null, worst: null };
    }

    // Filter out topics with no questions answered
    const validTopics = topicAnalysis.filter(topic => 
      topic.total_answered > 0 && topic.total_correct !== undefined
    );

    if (validTopics.length === 0) {
      return { best: null, worst: null };
    }

    // Calculate accuracy for each topic
    const topicsWithAccuracy = validTopics.map(topic => ({
      ...topic,
      accuracy: (topic.total_correct / topic.total_answered) * 100
    }));

    // Sort by accuracy (highest first)
    const sortedTopics = topicsWithAccuracy.sort((a, b) => b.accuracy - a.accuracy);

    return {
      best: sortedTopics[0],
      worst: sortedTopics[sortedTopics.length - 1]
    };
  }, []);

  // Helper to handle protected GET requests
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

  // Optimized fetch functions with better error handling
  const fetchUserAnalysis = useCallback(async () => {
    setLoading(prev => ({ ...prev, userAnalysis: true }));
    setErrors(prev => ({ ...prev, userAnalysis: null }));
    try {
      const timestamp = Date.now();
      const res = await protectedGet(`${Globals.URL}/user-analysis/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, userAnalysis: res.data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, userAnalysis: 'Failed to load user analysis.' }));
    } finally {
      setLoading(prev => ({ ...prev, userAnalysis: false }));
    }
  }, [id, protectedGet]);

  const fetchStreakData = useCallback(async () => {
    setLoading(prev => ({ ...prev, streakData: true }));
    setErrors(prev => ({ ...prev, streakData: null }));
    try {
      const timestamp = Date.now();
      const res = await protectedGet(`${Globals.URL}/user-streaks/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, streakData: res.data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, streakData: 'Failed to load streak data.' }));
    } finally {
      setLoading(prev => ({ ...prev, streakData: false }));
    }
  }, [id, protectedGet]);

  const fetchTopicAnalysis = useCallback(async () => {
    setLoading(prev => ({ ...prev, topicAnalysis: true }));
    setErrors(prev => ({ ...prev, topicAnalysis: null }));
    try {
      const timestamp = Date.now();
      const res = await protectedGet(`${Globals.URL}/topic-analysis/user/${id}?_=${timestamp}`);
      setData(prev => ({ ...prev, topicAnalysis: res.data || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, topicAnalysis: 'Failed to load topic analysis.' }));
    } finally {
      setLoading(prev => ({ ...prev, topicAnalysis: false }));
    }
  }, [id, protectedGet]);

  const fetchQuestionAttempts = useCallback(async () => {
    setLoading(prev => ({ ...prev, questionAttempts: true }));
    setErrors(prev => ({ ...prev, questionAttempts: null }));
    try {
      const timestamp = Date.now();
      const res = await protectedGet(`${Globals.URL}/question-attempts/user/${id}?_=${timestamp}`, {
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
  }, [id, protectedGet]);

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
      const res = await protectedGet(`${Globals.URL}/question-attempts/session/${latestQuizId}`);
      setData(prev => ({ ...prev, lastQuizAttempts: res.data || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, lastQuizAttempts: 'Failed to load last quiz attempts.' }));
    } finally {
      setLoading(prev => ({ ...prev, lastQuizAttempts: false }));
    }
  }, [protectedGet]);

  // Optimized parallel loading for better performance
  const fetchAll = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous calls
    
    setRefreshing(true);
    
    try {
      // Load critical data in parallel (userAnalysis and streakData don't depend on each other)
      // Fetch userAnalysis directly to get data immediately, while fetchStreakData runs in parallel
      const [userAnalysisResponse] = await Promise.all([
        protectedGet(`${Globals.URL}/user-analysis/${id}?_=${Date.now()}`).then(res => {
          // Update state immediately
          setData(prev => ({ ...prev, userAnalysis: res.data }));
          setLoading(prev => ({ ...prev, userAnalysis: false }));
          return res;
        }).catch(err => {
          setErrors(prev => ({ ...prev, userAnalysis: 'Failed to load user analysis.' }));
          setLoading(prev => ({ ...prev, userAnalysis: false }));
          throw err;
        }),
        fetchStreakData()
      ]);
      
      const userAnalysisData = userAnalysisResponse.data;
      
      // Load secondary data in parallel (these don't depend on userAnalysis)
      await Promise.all([
        fetchTopicAnalysis(),
        fetchQuestionAttempts(),
        fetchQuestions()
      ]);
      
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
  }, [fetchStreakData, fetchTopicAnalysis, fetchQuestionAttempts, fetchQuestions, fetchLastQuizAttempts, id, refreshing, protectedGet]);

  // Initial fetch only - no more annoying auto-refresh
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    // Only refresh data when component first mounts
    // Small delay to ensure backend has processed quiz data
    setTimeout(() => {
      fetchAll();
    }, 500);
    
  }, [id, navigate]); // Remove fetchAll and refreshing from dependencies to prevent re-runs

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

  // Calculate best and worst topics from the same data source
  const { best, worst } = calculateBestWorstTopics(data.topicAnalysis);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: ' Overview', icon: 'chart-bar' },
    { id: 'topics', label: ' Topics', icon: 'book-open' },
    { id: 'recent', label: ' Recent Quiz', icon: 'clock' },
    { id: 'history', label: ' History', icon: 'chart-line' },
    { id: 'progress', label: ' Progress', icon: 'target' },
    { id: 'final-exams', label: ' Final Exams', icon: 'graduation-cap' },
    { id: 'streaks', label: ' Streaks', icon: 'fire' }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
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
                <BestWorstTopic best={best} worst={worst} />
              </>
            )}
          </>
        );
      
      case 'topics':
        return (
          <>
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
          </>
        );
      
      case 'recent':
        return (
          <>
            {loading.userAnalysis ? (
              <SectionLoader message="Loading last quiz summary..." />
            ) : errors.userAnalysis ? null : (
              <LastQuizSummary latest_quiz={data.userAnalysis?.latest_quiz} />
            )}

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
          </>
        );
      
      case 'history':
        return (
          <QuizHistory 
            userId={id} 
            username={user?.username}
            sessionToken={sessionToken}
          />
        );
      
      case 'progress':
        return (
          <Progress 
            userId={id} 
            username={user?.username}
            sessionToken={sessionToken}
          />
        );
      
      case 'final-exams':
        if (!user?.username || !sessionToken) {
          return (
            <div className="analysis-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading user data...</p>
              </div>
            </div>
          );
        }
        return (
          <FinalExams 
            userId={id} 
            username={user.username}
            sessionToken={sessionToken}
          />
        );
      
      case 'streaks':
        return (
          <>
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
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <SEO 
        title="Performance Analysis - Track Your SMLE Progress"
        description="Comprehensive SMLE performance analysis with detailed statistics, topic-wise breakdown, and progress tracking. Monitor your strengths and weaknesses to improve your exam preparation."
        keywords="SMLE analysis, medical exam performance, SMLE progress tracking, medical quiz analytics, Saudi medical license analysis, performance statistics"
        url={`${Globals.URL}/analysis`}
        structuredData={structuredData}
      />
      <div className="analysis-wrapper fade-in">
        <h2 className="screen-title">Quiz Health Report</h2>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={`tab-icon icon-${tab.icon}`}></span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* Action Buttons */}
        <div className="button-bar">
          <button
            onClick={() => navigate("/wrong-questions")}
            className="secondary-button"
          >
            📚 Review Wrong Questions
          </button>
          <button
            onClick={handleRefresh}
            className="secondary-button"
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
          </button>
          <button
            onClick={() => navigate("/quizs", { state: { id } })}
            className="primary-button"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default Analysis;