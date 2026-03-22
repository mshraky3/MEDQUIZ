import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import './QuizHistory.css';

const QuizHistory = ({ userId, username, sessionToken }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [loadingButtons, setLoadingButtons] = useState({});

  // Fetch quiz sessions
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      // Ensure pagination parameters are valid numbers
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;

      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      // Add authentication parameters to the URL
      queryParams.append('username', username);
      queryParams.append('sessionToken', sessionToken);

      const url = `${Globals.URL}/quiz-sessions/history/${userId}?${queryParams.toString()}`;
      const response = await axios.get(url);

      setSessions(response.data.sessions || []);

      // Only update metadata from response, preserve user-controlled page/limit
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalSessions: response.data.pagination.totalSessions
        }));
      }
    } catch (err) {
      console.error('Error fetching quiz sessions:', err);
      setError('فشل في تحميل سجل الاختبارات');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch session details when expanded
  const fetchSessionDetails = async (sessionId) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('username', username);
      queryParams.append('sessionToken', sessionToken);

      const url = `${Globals.URL}/quiz-sessions/${sessionId}/details?${queryParams.toString()}`;
      const response = await axios.get(url);

      setSessionDetails(prev => ({
        ...prev,
        [sessionId]: response.data
      }));
    } catch (err) {
      console.error('Error fetching session details:', err);
    }
  };

  // Toggle session expansion
  const toggleSession = async (sessionId) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
      // Fetch details if not already loaded
      if (!sessionDetails[sessionId]) {
        await fetchSessionDetails(sessionId);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle See More button click for flip cards
  const handleSeeMore = useCallback(async (attemptId, questionText, selectedAnswer, correctAnswer, event) => {
    // Flip the card immediately
    setFlippedCards(prev => ({ ...prev, [attemptId]: true }));

    // If analysis already exists for this question, don't fetch again
    if (aiAnalysis[attemptId]) {
      return;
    }

    // Set loading state
    setLoadingButtons(prev => ({ ...prev, [attemptId]: true }));

    try {
      // Call AI analysis API (aligned with backend contract)
      const response = await axios.post(`${Globals.URL}/ai-analysis`, {
        question: questionText,
        selected_answer: selectedAnswer,
        correct_option: correctAnswer
      });

      setAiAnalysis(prev => ({
        ...prev,
        [attemptId]: response.data.answer || 'No explanation received.'
      }));
    } catch (error) {
      const backendMsg = error?.response?.data?.answer || error?.response?.data?.error || error?.response?.data?.details;
      console.error('Error fetching AI analysis:', error?.response?.data || error);
      setAiAnalysis(prev => ({
        ...prev,
        [attemptId]: backendMsg || 'تعذر إنشاء التحليل حالياً.'
      }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [attemptId]: false }));
    }
  }, [username, sessionToken, aiAnalysis]);

  const handleFlipBack = useCallback((attemptId) => {
    setFlippedCards(prev => ({ ...prev, [attemptId]: false }));
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy) => {
    const numAccuracy = parseFloat(accuracy || 0);
    if (numAccuracy >= 80) return '#10b981';
    if (numAccuracy >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Midgard': return '🎮';
      case 'GameBoy': return '🕹️';
      case 'October25': return '🗓️';
      default: return '📚';
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="quiz-history-loading">
        <div className="orbital-spinner">
          <div className="orbital-ring orbital-ring-1"></div>
          <div className="orbital-ring orbital-ring-2"></div>
          <div className="orbital-core"></div>
        </div>
        <p>جاري تحميل سجل الاختبارات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-history-error">
        <p>{error}</p>
        <button onClick={fetchSessions} className="retry-button">
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-history-container">
      <div className="quiz-history-header">
        <h3>سجل الاختبارات</h3>
        <p>تابع تقدمك عبر الزمن</p>
      </div>


      {/* Sessions List */}
      <div className="quiz-sessions-list">
        {sessions.length === 0 ? (
          <div className="no-sessions">
            <p>لا توجد جلسات اختبار</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="quiz-session-card">
              <div className="session-header">
                <div className="session-info">
                  <span className="session-date">{formatDate(session.start_time)}</span>
                  <span className="session-source">
                    {getSourceIcon(session.source)} {session.source}
                  </span>
                </div>
                <div className="session-accuracy" style={{ color: getAccuracyColor(session.quiz_accuracy) }}>
                  {parseFloat(session.quiz_accuracy || 0).toFixed(1)}%
                </div>
              </div>

              <div className="session-details">
                <div className="detail-item">
                  <span className="detail-label">الأسئلة:</span>
                  <span className="detail-value">{session.total_questions}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">صحيح:</span>
                  <span className="detail-value">{session.correct_answers}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">المدة:</span>
                  <span className="detail-value">{formatDuration(session.duration)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">متوسط الوقت:</span>
                  <span className="detail-value">{parseFloat(session.avg_time_per_question || 0).toFixed(1)}s</span>
                </div>
              </div>

              <div className="session-actions">
                <button
                  onClick={() => toggleSession(session.id)}
                  className="view-details-btn"
                >
                  {expandedSessionId === session.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                </button>
              </div>

              {/* Inline expanded content */}
              {expandedSessionId === session.id && sessionDetails[session.id] && (
                <div className="session-expanded-content">

                  <div className="question-attempts">
                    <h4>أسئلة وإجابات الاختبار</h4>
                    {sessionDetails[session.id].is_old_session ? (
                      <div className="old-session-notice">
                        <div className="notice-icon">ℹ️</div>
                        <div className="notice-content">
                          <h5>جلسة قديمة</h5>
                          <p>{sessionDetails[session.id].message}</p>
                          <p>فقط المعلومات الأساسية متاحة لهذا الاختبار.</p>
                        </div>
                      </div>
                    ) : sessionDetails[session.id].question_attempts.length === 0 ? (
                      <div className="no-attempts-notice">
                        <div className="notice-icon">📝</div>
                        <div className="notice-content">
                          <h5>لا توجد تفاصيل</h5>
                          <p>لا توجد محاولات مفصلة لهذه الجلسة.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="questions-grid">
                        {sessionDetails[session.id].question_attempts.map((attempt, index) => (
                          <div
                            key={attempt.id}
                            className={`question-card ${flippedCards[attempt.id] ? 'flipped' : ''}`}
                          >
                            <div className="question-card-inner">
                              {/* Front of Card */}
                              <div className="question-card-front">
                                <div className="question-header">
                                  <div className="question-meta">
                                    <span className="type-badge">
                                      📖 {attempt.question_type}
                                    </span>
                                    <span className="source-badge">
                                      📚 {attempt.source || 'general'}
                                    </span>
                                    <span className={`result-badge ${attempt.is_correct ? 'correct' : 'wrong'}`}>
                                      {attempt.is_correct ? '✅ صحيح' : '❌ خطأ'}
                                    </span>
                                  </div>
                                </div>

                                <div className="question-content">
                                  <div className="question-text">
                                    {attempt.question_text}
                                  </div>

                                  <div className="answers-section">
                                    <div className="answer-row">
                                      <span className="answer-label wrong">إجابتك:</span>
                                      <span className={`answer-text ${attempt.is_correct ? 'correct' : 'wrong'}`}>
                                        {attempt.selected_option}
                                      </span>
                                    </div>
                                    <div className="answer-row">
                                      <span className="answer-label correct">الإجابة الصحيحة:</span>
                                      <span className="answer-text correct">{attempt.correct_option}</span>
                                    </div>
                                  </div>

                                  <div className="question-actions">
                                    <button
                                      onClick={(e) =>
                                        handleSeeMore(
                                          attempt.id,
                                          attempt.question_text,
                                          attempt.selected_option,
                                          attempt.correct_option,
                                          e
                                        )
                                      }
                                      className="see-more-button"
                                      disabled={loadingButtons[attempt.id]}
                                    >
                                      {loadingButtons[attempt.id] ? 'جاري التحميل...' : '🔍 اعرف أكثر'}
                                    </button>
                                  </div>

                                  <div className="question-meta">
                                    <span className="time-taken">⏱️ {attempt.time_taken}s</span>
                                    <span className="question-number">سؤال {index + 1}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Back of Card */}
                              <div className="question-card-back">
                                <div className="ai-analysis-back">
                                  <div className="ai-analysis-header">
                                    <h3>🧠 تحليل الذكاء الاصطناعي</h3>
                                  </div>

                                  {loadingButtons[attempt.id] ? (
                                    <div className="ai-analysis-loading">
                                      <p>جاري تحليل السؤال...</p>
                                      <div className="spinner"></div>
                                      <p className="loading-subtext">يرجى الانتظار...</p>
                                    </div>
                                  ) : (
                                    <div className="ai-analysis-content">
                                      <p>{aiAnalysis[attempt.id] || 'لا يوجد تحليل متاح.'}</p>
                                    </div>
                                  )}

                                  <button
                                    className="back-to-question-btn"
                                    onClick={() => handleFlipBack(attempt.id)}
                                    disabled={loadingButtons[attempt.id]}
                                  >
                                    العودة للسؤال ←
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="quiz-history-pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="pagination-btn"
          >
            السابق
          </button>

          <span className="pagination-info">
            صفحة {pagination.page} من {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="pagination-btn"
          >
            التالي
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizHistory;
