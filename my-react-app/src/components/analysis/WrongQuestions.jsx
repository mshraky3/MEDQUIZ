import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';

const WrongQuestions = () => {
    const navigate = useNavigate();
    const { user, sessionToken, setUser } = useContext(UserContext);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const limit = 20; // Questions per page

    const protectedGet = useCallback(async (url, config = {}) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        try {
            return await axios.get(urlWithUser, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setUser(null, null);
                localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
                window.location.href = '/login?session=expired';
                return;
            }
            throw err;
        }
    }, [user, sessionToken, setUser]);

    const fetchWrongQuestions = useCallback(async (page = 0, append = false) => {
        if (!user?.id) return;

        try {
            setError(null);
            if (page === 0) setLoading(true);

            const response = await protectedGet(`${Globals.URL}/wrong-questions/user/${user.id}?limit=${limit}&offset=${page * limit}`);

            const { wrongQuestions: newQuestions, total } = response.data;

            if (append) {
                setWrongQuestions(prev => [...prev, ...newQuestions]);
            } else {
                setWrongQuestions(newQuestions);
            }

            setTotalQuestions(total);
            setHasMore((page + 1) * limit < total);
            setCurrentPage(page);

        } catch (err) {
            console.error('Error fetching wrong questions:', err);
            setError('تعذر تحميل الأسئلة الخاطئة');
        } finally {
            setLoading(false);
        }
    }, [user?.id, limit, protectedGet]);

    useEffect(() => {
        fetchWrongQuestions(0, false);
    }, [fetchWrongQuestions]);

    const loadMoreQuestions = useCallback(() => {
        if (hasMore && !loading) {
            fetchWrongQuestions(currentPage + 1, true);
        }
    }, [hasMore, loading, currentPage, fetchWrongQuestions]);

    return (
        <div className="analysis-wrapper fade-in">
                <div className="screen-header">

                    <h2 className="screen-title">مراجعة الأسئلة الخاطئة</h2>
                    <p className="screen-subtitle">
                        راجع أخطاءك وتعلم منها
                    </p>
                </div>

                {loading && wrongQuestions.length === 0 ? (
                    <div className="loading-state">
                        <Spinner size="lg" />
                        <p>جاري تحميل الأسئلة الخاطئة...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p><Icon name="x-circle" size={15} /> {error}</p>
                        <button
                            onClick={() => fetchWrongQuestions(0, false)}
                            className="primary-button"
                        >
                            حاول مرة أخرى
                        </button>
                    </div>
                ) : wrongQuestions.length === 0 ? (
                    <div className="no-data-state">
                        <h3><Icon name="sparkles" size={20} /> ممتاز!</h3>
                        <p>لم تخطئ في أي سؤال بعد.</p>
                        <button
                            onClick={() => navigate('/quizs')}
                            className="primary-button"
                        >
                            ابدأ اختبار
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="stats-summary">
                            <div className="stat-card">
                                <h3>إجمالي الإجابات الخاطئة</h3>
                                <p className="stat-number">{totalQuestions}</p>
                            </div>
                            <div className="stat-card">
                                <h3>الأسئلة المحملة</h3>
                                <p className="stat-number">{wrongQuestions.length}</p>
                            </div>
                        </div>

                        <section className="streak-section">
                            <h3 className="section-header">أسئلتك الخاطئة</h3>

                            <div className="questions-grid">
                                {wrongQuestions.map((question, index) => (
                                    <div key={question.id || index} className="question-card">
                                        <div className="question-header">
                                            <div className="question-meta">
                                                <span className="type-badge">
                                                    <Icon name="book" size={15} /> {getTypeLabel(question.question_type)}
                                                </span>
                                                <span className="source-badge">
                                                    <Icon name="book-open" size={15} /> {getSourceLabel(question.source)}
                                                </span>
                                                <span className="date-badge">
                                                    <Icon name="calendar" size={15} /> {new Date(question.attempted_at).toLocaleDateString()}
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
                                                    <span className="answer-text wrong">{question.selected_option}</span>
                                                </div>
                                                <div className="answer-row">
                                                    <span className="answer-label correct">الإجابة الصحيحة:</span>
                                                    <span className="answer-text correct">{question.correct_option}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="load-more-container">
                                    <button
                                        onClick={loadMoreQuestions}
                                        className="load-more-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'جاري التحميل...' : `تحميل المزيد (${Math.min(limit, totalQuestions - wrongQuestions.length)} متبقي)`}
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}

            </div>
    );
};

export default WrongQuestions;
