import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
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

    // Fetch final quiz sessions
    const fetchSessions = async (page = 1, limit = 10) => {
        if (!userId || !username || !sessionToken) {
            console.error('Missing required props:', { userId, username, sessionToken });
            setError('بيانات المصادقة مفقودة');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${Globals.URL}/final-quiz/sessions/${userId}?page=${page}&limit=${limit}&username=${encodeURIComponent(username)}`,
                { headers: { Authorization: `Bearer ${sessionToken}` } }
            );

            setSessions(response.data.sessions);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching final quiz sessions:', err);
            setError('فشل في تحميل جلسات الاختبار النهائي');
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
                `${Globals.URL}/final-quiz/session/${sessionId}?username=${encodeURIComponent(username)}`,
                { headers: { Authorization: `Bearer ${sessionToken}` } }
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
                `${Globals.URL}/final-quiz/session/${sessionId}/questions?username=${encodeURIComponent(username)}`,
                { headers: { Authorization: `Bearer ${sessionToken}` } }
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
                    <p>بيانات المصادقة مفقودة. يرجى تحديث الصفحة.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="final-exams-container">
                <Spinner fullScreen label="جاري تحميل جلسات الاختبار النهائي..." />
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
                    <div className="no-data-icon"><Icon name="target" size={40} /></div>
                    <h3>لا توجد جلسات اختبار نهائي</h3>
                    <p>لم تكمل أي جلسة اختبار نهائي بعد.</p>
                    <p>ابدأ مراجعة شاملة باختبار نهائي!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="final-exams-container">
            <div className="final-exams-header">
                <h2><Icon name="target" size={15} /> جلسات الاختبار النهائي</h2>
                <p className="final-exams-description">
                    جلسات مراجعة شاملة لجميع الأسئلة من المعايير المختارة
                </p>
            </div>

            <div className="sessions-list">
                {sessions.map((session) => (
                    <div key={session.id} className="session-card">
                        <div className="session-header">
                            <div className="session-info">
                                <h3 className="session-title">
                                    {getTypeLabel(session.question_type)} - {getSourceLabel(session.source)}
                                </h3>
                                <p className="session-date">
                                    {formatDate(session.start_time)}
                                </p>
                            </div>
                            <div className="session-stats">
                                <div className="stat-item">
                                    <span className="stat-label">النتيجة</span>
                                    <span
                                        className="stat-value score"
                                        style={{ color: getScoreColor(session.score) }}
                                    >
                                        {session.score.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">الأسئلة</span>
                                    <span className="stat-value">
                                        {session.correct_answers}/{session.total_questions}
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">الوقت</span>
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
                                {expandedSessionId === session.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
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
                                                <h4>ملخص الأداء</h4>
                                                <div className="performance-stats">
                                                    <div className="performance-item">
                                                        <span className="performance-label">الإجابات الصحيحة</span>
                                                        <span className="performance-value correct">
                                                            {session.correct_answers}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">الإجابات الخاطئة</span>
                                                        <span className="performance-value incorrect">
                                                            {session.total_questions - session.correct_answers}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">كفاءة الوقت</span>
                                                        <span className="performance-value">
                                                            {session.time_taken > 0 ?
                                                                (session.total_questions / (session.time_taken / 60)).toFixed(1) + ' q/min' :
                                                                'N/A'
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">حد الوقت</span>
                                                        <span className="performance-value">
                                                            {formatDuration(session.time_limit)}
                                                        </span>
                                                    </div>
                                                    <div className="performance-item">
                                                        <span className="performance-label">وقت الإكمال</span>
                                                        <span className="performance-value">
                                                            {formatDate(session.end_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quiz Questions Container */}
                                            <div className="quiz-questions-container">
                                                <h4>أسئلة الاختبار ({sessionQuestions[session.id]?.length || 0})</h4>
                                                {sessionQuestions[session.id] && sessionQuestions[session.id].length > 0 ? (
                                                    <div className="questions-grid">
                                                        {sessionQuestions[session.id].map((question, index) => (
                                                            <div key={question.id} className="question-card">
                                                                <div className="question-card-inner">
                                                                    <div className="question-header">
                                                                        <div className="question-meta">
                                                                            <span className="type-badge">
                                                                                <Icon name="book" size={15} /> {getTypeLabel(question.question_type)}
                                                                            </span>
                                                                            <span className={`result-badge ${question.is_correct ? 'correct' : 'wrong'}`}>
                                                                                {question.is_correct ? <><Icon name="check-circle" size={13} /> صحيح</> : <><Icon name="x-circle" size={13} /> خطأ</>}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="question-content">
                                                                        <div className="question-text">
                                                                            {question.question_text}
                                                                        </div>

                                                                        <div className="answers-section">
                                                                            <div className="answer-row">
                                                                                <span className="answer-label wrong">إجابتك:</span>
                                                                                <span className={`answer-text ${question.is_correct ? 'correct' : 'wrong'}`}>
                                                                                    {question.user_answer || 'لم تجب'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="answer-row">
                                                                                <span className="answer-label correct">الإجابة الصحيحة:</span>
                                                                                <span className="answer-text correct">{question.correct_option}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="question-meta">
                                                                            <span className="question-number">سؤال {index + 1}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-questions">
                                                        <p>لا توجد أسئلة لهذه الجلسة.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="loading-details">
                                        <Spinner size="sm" />
                                        <span>جاري التحميل...</span>
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
                        السابق
                    </button>

                    <span className="pagination-info">
                        صفحة {pagination.current_page} من {pagination.total_pages}
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className="pagination-btn"
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinalExams;
