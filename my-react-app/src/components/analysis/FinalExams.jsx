import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import './FinalExams.css';

const FinalExams = ({ userId, username, sessionToken }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_sessions: 0,
        limit: 10
    });
    const [expandedSessionId, setExpandedSessionId] = useState(null);
    const [sessionDetails, setSessionDetails] = useState({});
  const [sessionQuestions, setSessionQuestions] = useState({});
  const [flippedQuestions, setFlippedQuestions] = useState(new Set());
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [loadingButtons, setLoadingButtons] = useState({});

    // Fetch final quiz sessions
    const fetchSessions = async (page = 1, limit = 10) => {
        if (!userId || !username || !sessionToken) {
            console.error('Missing required props:', { userId, username, sessionToken });
            setError('Missing authentication credentials');
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.get(
                `${Globals.URL}/final-quiz/sessions/${userId}?page=${page}&limit=${limit}&username=${encodeURIComponent(username)}&sessionToken=${encodeURIComponent(sessionToken)}`
            );
            
            setSessions(response.data.sessions);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching final quiz sessions:', err);
            setError('Failed to fetch final quiz sessions');
        } finally {
            setLoading(false);
        }
    };

    // Fetch detailed session information
    const fetchSessionDetails = async (sessionId) => {
        if (!username || !sessionToken) {
            console.error('Missing authentication credentials for session details');
            return;
        }
        
        try {
            const response = await axios.get(
                `${Globals.URL}/final-quiz/session/${sessionId}?username=${encodeURIComponent(username)}&sessionToken=${encodeURIComponent(sessionToken)}`
            );
            
            setSessionDetails(prev => ({
                ...prev,
                [sessionId]: response.data
            }));
        } catch (err) {
            console.error('Error fetching session details:', err);
        }
    };

    // Fetch questions for a specific session
    const fetchSessionQuestions = async (sessionId) => {
        if (!username || !sessionToken) {
            console.error('Missing authentication credentials for session questions');
            return;
        }
        
        try {
            const response = await axios.get(
                `${Globals.URL}/final-quiz/session/${sessionId}/questions?username=${encodeURIComponent(username)}&sessionToken=${encodeURIComponent(sessionToken)}`
            );
            
            setSessionQuestions(prev => ({
                ...prev,
                [sessionId]: response.data.questions || []
            }));
        } catch (error) {
            console.error('Error fetching session questions:', error);
        }
    };

    // Toggle session expansion
    const toggleSessionExpansion = (sessionId) => {
        if (expandedSessionId === sessionId) {
            setExpandedSessionId(null);
        } else {
            setExpandedSessionId(sessionId);
            if (!sessionDetails[sessionId]) {
                fetchSessionDetails(sessionId);
            }
            if (!sessionQuestions[sessionId]) {
                fetchSessionQuestions(sessionId);
            }
        }
    };

    // Toggle question flip
  const toggleQuestionFlip = (questionId) => {
    setFlippedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Handle See More button click for AI analysis
  const handleSeeMore = async (questionId, questionText, userAnswer, correctAnswer) => {
    // Flip the card immediately
    setFlippedQuestions(prev => new Set([...prev, questionId]));

    // If analysis already exists for this question, don't fetch again
    if (aiAnalysis[questionId]) {
      return;
    }

    // Set loading state
    setLoadingButtons(prev => ({ ...prev, [questionId]: true }));

    try {
      // Call AI analysis API (aligned with backend contract)
      const response = await axios.post(`${Globals.URL}/ai-analysis`, {
        question: questionText,
        selected_answer: userAnswer,
        correct_option: correctAnswer
      });

      setAiAnalysis(prev => ({
        ...prev,
        [questionId]: response.data.answer || 'No analysis available.'
      }));
    } catch (error) {
      const backendMsg = error?.response?.data?.answer || error?.response?.data?.error || error?.response?.data?.details;
      console.error('Error fetching AI analysis:', error?.response?.data || error);
      setAiAnalysis(prev => ({
        ...prev,
        [questionId]: backendMsg || 'Unable to generate analysis at this time.'
      }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleFlipBack = (questionId) => {
    setFlippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format duration
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        fetchSessions(newPage, pagination.limit);
    };

    useEffect(() => {
        if (userId && username && sessionToken) {
            fetchSessions();
        }
    }, [userId, username, sessionToken]);

    // Don't render if required props are missing
    if (!userId || !username || !sessionToken) {
        return (
            <div className="final-exams-container">
                <div className="error-message">
                    <p>Authentication credentials missing. Please refresh the page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="final-exams-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading final quiz sessions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="final-exams-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => fetchSessions()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="final-exams-container">
                <div className="no-data">
                    <div className="no-data-icon">🎯</div>
                    <h3>No Final Quiz Sessions</h3>
                    <p>You haven't completed any final quiz sessions yet.</p>
                    <p>Start a comprehensive review by taking a Final Quiz!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="final-exams-container">
            <div className="final-exams-header">
                <h2>🎯 Final Quiz Sessions</h2>
                <p className="final-exams-description">
                    Comprehensive review sessions with all questions from selected criteria
                </p>
            </div>

            <div className="sessions-list">
                {sessions.map((session) => (
                    <div key={session.id} className="session-card">
                        <div className="session-header">
                            <div className="session-info">
                                <h3 className="session-title">
                                    {session.question_type} - {session.source}
                                </h3>
                                <p className="session-date">
                                    {formatDate(session.start_time)}
                                </p>
                            </div>
                            <div className="session-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Score</span>
                                    <span 
                                        className="stat-value score"
                                        style={{ color: getScoreColor(session.score) }}
                                    >
                                        {session.score.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Questions</span>
                                    <span className="stat-value">
                                        {session.correct_answers}/{session.total_questions}
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Time</span>
                                    <span className="stat-value">
                                        {formatDuration(session.time_taken)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="session-actions">
                            <button
                                onClick={() => toggleSessionExpansion(session.id)}
                                className="view-details-btn"
                            >
                                {expandedSessionId === session.id ? 'Hide Details' : 'View Details'}
                            </button>
                        </div>

                        {/* Expanded Session Details */}
                        {expandedSessionId === session.id && (
                            <div className="session-expanded-content">
                                {sessionDetails[session.id] ? (
                                    <div className="session-details">
                                        <div className="session-details-grid">
                                            {/* Performance Summary Container */}
                                            <div className="performance-summary-container">
                                                <h4>Performance Summary</h4>
                                                <div className="performance-stats">
                                                    <div className="performance-item">
                                                        <span className="performance-label">Correct Answers</span>
                                                        <span className="performance-value correct">
                                                            {session.correct_answers}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">Incorrect Answers</span>
                                                        <span className="performance-value incorrect">
                                                            {session.total_questions - session.correct_answers}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">Time Efficiency</span>
                                                        <span className="performance-value">
                                                            {session.time_taken > 0 ? 
                                                                (session.total_questions / (session.time_taken / 60)).toFixed(1) + ' q/min' : 
                                                                'N/A'
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">Time Limit</span>
                                                        <span className="performance-value">
                                                            {formatDuration(session.time_limit)}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">Completion Time</span>
                                                        <span className="performance-value">
                                                            {formatDate(session.end_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Quiz Questions Container */}
                                            <div className="quiz-questions-container">
                                                <h4>Quiz Questions ({sessionQuestions[session.id]?.length || 0})</h4>
                                                {sessionQuestions[session.id] && sessionQuestions[session.id].length > 0 ? (
                                                    <div className="questions-grid">
                                                        {sessionQuestions[session.id].map((question, index) => (
                                                            <div key={question.id} className={`question-card ${flippedQuestions.has(question.id) ? 'flipped' : ''}`}>
                            <div className="question-card-inner">
                              {/* Front of Card */}
                              <div className="question-card-front">
                                <div className="question-header">
                                  <div className="question-meta">
                                    <span className="type-badge">
                                      📖 {question.question_type}
                                    </span>
                                    <span className={`result-badge ${question.is_correct ? 'correct' : 'wrong'}`}>
                                      {question.is_correct ? '✅ Correct' : '❌ Wrong'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="question-content">
                                  <div className="question-text">
                                    {question.question_text}
                                  </div>
                                  
                                  <div className="answers-section">
                                    <div className="answer-row">
                                      <span className="answer-label wrong">Your Answer:</span>
                                      <span className={`answer-text ${question.is_correct ? 'correct' : 'wrong'}`}>
                                        {question.user_answer || 'Not answered'}
                                      </span>
                                    </div>
                                    <div className="answer-row">
                                      <span className="answer-label correct">Correct Answer:</span>
                                      <span className="answer-text correct">{question.correct_option}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="question-actions">
                                    <button
                                      onClick={() => handleSeeMore(
                                        question.id,
                                        question.question_text,
                                        question.user_answer || 'Not answered',
                                        question.correct_option
                                      )}
                                      className="see-more-button"
                                      disabled={loadingButtons[question.id]}
                                    >
                                      {loadingButtons[question.id] ? 'Loading...' : '🔍 See More'}
                                    </button>
                                  </div>
                                  
                                  <div className="question-meta">
                                    <span className="question-number">Question {index + 1}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Back of Card */}
                              <div className="question-card-back">
                                <div className="ai-analysis-back">
                                  <div className="ai-analysis-header">
                                    <h3>🧠 AI Analysis</h3>
                                  </div>
                                  
                                  {loadingButtons[question.id] ? (
                                    <div className="ai-analysis-loading">
                                      <p>Analyzing question...</p>
                                      <div className="spinner"></div>
                                      <p className="loading-subtext">Please wait...</p>
                                    </div>
                                  ) : (
                                    <div className="ai-analysis-content">
                                      <p>{aiAnalysis[question.id] || 'No analysis available.'}</p>
                                    </div>
                                  )}
                                  
                                  <button 
                                    className="back-to-question-btn"
                                    onClick={() => handleFlipBack(question.id)}
                                    disabled={loadingButtons[question.id]}
                                  >
                                    ← Back to Question
                                  </button>
                                </div>
                              </div>
                            </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-questions">
                                                        <p>No questions available for this session.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="loading-details">
                                        <div className="spinner small"></div>
                                        <span>Loading details...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    
                    <span className="pagination-info">
                        Page {pagination.current_page} of {pagination.total_pages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinalExams;
