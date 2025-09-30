import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global.js';
import SEO from '../common/SEO';
import Navbar from '../common/Navbar.jsx';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';

const WrongQuestions = () => {
    const navigate = useNavigate();
    const { user, sessionToken, setUser } = useContext(UserContext);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState({});
    const [loadingButtons, setLoadingButtons] = useState({});
    const [flippedCards, setFlippedCards] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const limit = 20; // Questions per page

    const protectedGet = useCallback(async (url, config = {}) => {
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
            setError('Failed to load wrong questions');
        } finally {
            setLoading(false);
        }
    }, [user?.id, limit, protectedGet]);

    useEffect(() => {
        fetchWrongQuestions(0, false);
    }, [fetchWrongQuestions]);

    const handleSeeMore = useCallback(async (questionText, selectedAnswer, correctAnswer, attemptId) => {
        // Flip the card immediately
        setFlippedCards((prev) => ({ ...prev, [attemptId]: true }));
        setLoadingButtons((prev) => ({ ...prev, [attemptId]: true }));

        // If analysis already exists for this question, don't fetch again
        if (aiAnalysis[attemptId]) {
            setLoadingButtons((prev) => ({ ...prev, [attemptId]: false }));
            return;
        }

        try {
            const response = await axios.post(`${Globals.URL}/ai-analysis`, {
                question: questionText,
                selected_answer: selectedAnswer,
                correct_option: correctAnswer,
            });
            setAiAnalysis((prev) => ({ 
                ...prev, 
                [attemptId]: response.data.answer || 'No explanation received.' 
            }));
        } catch (error) {
            setAiAnalysis((prev) => ({ 
                ...prev, 
                [attemptId]: 'Failed to get AI analysis.' 
            }));
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [attemptId]: false }));
        }
    }, [aiAnalysis]);

    const handleFlipBack = useCallback((attemptId) => {
        setFlippedCards((prev) => ({ ...prev, [attemptId]: false }));
    }, []);

    const loadMoreQuestions = useCallback(() => {
        if (hasMore && !loading) {
            fetchWrongQuestions(currentPage + 1, true);
        }
    }, [hasMore, loading, currentPage, fetchWrongQuestions]);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Wrong Questions Review - SMLE Study Tool",
        "description": "Review and analyze all the questions you answered incorrectly to improve your SMLE performance.",
        "url": "https://medquiz.vercel.app/wrong-questions"
    };

    return (
        <>
            <Navbar />
            <SEO 
                title="Wrong Questions Review - Improve Your SMLE Performance"
                description="Review all questions you answered incorrectly with AI-powered explanations to improve your SMLE exam preparation and performance."
                keywords="SMLE wrong questions, medical exam mistakes, SMLE improvement, medical quiz review, wrong answers analysis, SMLE study help"
                url="https://medquiz.vercel.app/wrong-questions"
                structuredData={structuredData}
            />
            <div className="analysis-wrapper fade-in">
                <div className="screen-header">

                    <h2 className="screen-title">Wrong Questions Review</h2>
                    <p className="screen-subtitle">
                        Review and learn from your mistakes with AI-powered explanations
                    </p>
                </div>

                {loading && wrongQuestions.length === 0 ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your wrong questions...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>❌ {error}</p>
                        <button 
                            onClick={() => fetchWrongQuestions(0, false)}
                            className="primary-button"
                        >
                            Try Again
                        </button>
                    </div>
                ) : wrongQuestions.length === 0 ? (
                    <div className="no-data-state">
                        <h3>🎉 Congratulations!</h3>
                        <p>You haven't answered any questions incorrectly yet.</p>
                        <button 
                            onClick={() => navigate('/quizs')}
                            className="primary-button"
                        >
                            Take a Quiz
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="stats-summary">
                            <div className="stat-card">
                                <h3>Total Wrong Answers</h3>
                                <p className="stat-number">{totalQuestions}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Questions Loaded</h3>
                                <p className="stat-number">{wrongQuestions.length}</p>
                            </div>
                        </div>

                        <section className="streak-section">
                            <h3 className="section-header">Your Wrong Questions</h3>
                            
                            <div className="questions-grid">
                                {wrongQuestions.map((question, index) => (
                                    <div 
                                        key={question.id || index} 
                                        className={`question-card ${flippedCards[question.id] ? 'flipped' : ''}`}
                                    >
                                        <div className="question-card-inner">
                                            {/* Front of Card */}
                                            <div className="question-card-front">
                                                <div className="question-header">
                                                    <div className="question-meta">
                                                        <span className="type-badge">
                                                            📖 {question.question_type}
                                                        </span>
                                                        <span className="source-badge">
                                                            📚 {question.source || 'general'}
                                                        </span>
                                                        <span className="date-badge">
                                                            📅 {new Date(question.attempted_at).toLocaleDateString()}
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
                                                            <span className="answer-text wrong">{question.selected_option}</span>
                                                        </div>
                                                        <div className="answer-row">
                                                            <span className="answer-label correct">Correct Answer:</span>
                                                            <span className="answer-text correct">{question.correct_option}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="question-actions">
                                                        <button
                                                            onClick={() =>
                                                                handleSeeMore(
                                                                    question.question_text,
                                                                    question.selected_option,
                                                                    question.correct_option,
                                                                    question.id
                                                                )
                                                            }
                                                            className="see-more-button"
                                                            disabled={loadingButtons[question.id]}
                                                        >
                                                            {loadingButtons[question.id] ? 'Loading...' : '🔍 See More'}
                                                        </button>
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

                            {hasMore && (
                                <div className="load-more-container">
                                    <button
                                        onClick={loadMoreQuestions}
                                        className="load-more-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : `Load More (${Math.min(limit, totalQuestions - wrongQuestions.length)} remaining)`}
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}

            </div>
        </>
    );
};

export default WrongQuestions;
