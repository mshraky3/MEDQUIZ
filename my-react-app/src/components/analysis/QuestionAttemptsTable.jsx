import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import './analysis.css';

const QuestionAttemptsTable = ({ questionAttempts, questions, latestQuiz, isTrial }) => {
    const [showAll, setShowAll] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState({});
    const [loadingButtons, setLoadingButtons] = useState({});
    const [flippedCards, setFlippedCards] = useState({});

    // Memoize expensive filtering and sorting operations
    const lastQuizAttempts = useMemo(() => {
        if (!latestQuiz || !latestQuiz.id) return [];

        return questionAttempts
            .filter(a => a.quiz_session_id === latestQuiz.id)
            .sort((a, b) => new Date(a.attempted_at) - new Date(b.attempted_at));
    }, [questionAttempts, latestQuiz]);

    const displayedAttempts = useMemo(() => {
        return showAll ? lastQuizAttempts : lastQuizAttempts.slice(0, 5);
    }, [lastQuizAttempts, showAll]);

    // Memoize questions lookup for better performance
    const questionsMap = useMemo(() => {
        const map = new Map();
        questions.forEach(q => map.set(q.id, q));
        return map;
    }, [questions]);

    const handleSeeMore = useCallback(async (attemptId, questionText, selectedAnswer, correctAnswer, event) => {
        // Flip the card immediately
        setFlippedCards((prev) => ({ ...prev, [attemptId]: true }));
        setLoadingButtons((prev) => ({ ...prev, [attemptId]: true }));

        // If analysis already exists for this question, don't fetch again
        if (aiAnalysis[attemptId]) {
            setLoadingButtons((prev) => ({ ...prev, [attemptId]: false }));
            return;
        }

        if (isTrial) {
            // For trial users, show a message about AI analysis being available with full access
            setAiAnalysis((prev) => ({
                ...prev,
                [attemptId]: 'تحليل الأسئلة بالذكاء الاصطناعي متاح مع الوصول الكامل. تواصل معنا لتفعيل هذه الميزة!'
            }));
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
                [attemptId]: response.data.answer || 'لم يتم استلام تحليل.'
            }));
        } catch (error) {
            setAiAnalysis((prev) => ({
                ...prev,
                [attemptId]: 'فشل في الحصول على تحليل الذكاء الاصطناعي.'
            }));
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [attemptId]: false }));
        }
    }, [isTrial, aiAnalysis]);

    const handleFlipBack = useCallback((attemptId) => {
        setFlippedCards((prev) => ({ ...prev, [attemptId]: false }));
    }, []);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    return (
        <section className="streak-section">
            <h3 className="section-header">أسئلة آخر اختبار</h3>

            {lastQuizAttempts.length > 0 ? (
                <>
                    <div className="questions-grid">
                        {displayedAttempts.map((attempt, index) => {
                            const questionRow = questionsMap.get(attempt.question_id);
                            const questionText = questionRow?.question_text || 'Unknown question';
                            const correctAnswer = questionRow?.correct_option || 'N/A';
                            const questionSource = questionRow?.source || 'general';
                            const questionType = questionRow?.question_type || 'General';
                            const isCorrect = attempt.is_correct;
                            return (
                                <div
                                    key={attempt.id || index}
                                    className={`question-card ${flippedCards[attempt.id] ? 'flipped' : ''}`}
                                >
                                    <div className="question-card-inner">
                                        {/* Front of Card */}
                                        <div className="question-card-front">
                                            <div className="question-header">
                                                <div className="question-meta">
                                                    <span className="type-badge">
                                                        📖 {questionType}
                                                    </span>
                                                    <span className="source-badge">
                                                        📚 {questionSource}
                                                    </span>
                                                    <span className={`result-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                                                        {isCorrect ? '✅ صحيح' : '❌ خطأ'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="question-content">
                                                <div className="question-text">
                                                    {questionText}
                                                </div>

                                                <div className="answers-section">
                                                    <div className="answer-row">
                                                        <span className="answer-label wrong">إجابتك:</span>
                                                        <span className={`answer-text ${isCorrect ? 'correct' : 'wrong'}`}>
                                                            {attempt.selected_option}
                                                        </span>
                                                    </div>
                                                    <div className="answer-row">
                                                        <span className="answer-label correct">الإجابة الصحيحة:</span>
                                                        <span className="answer-text correct">{correctAnswer}</span>
                                                    </div>
                                                </div>

                                                <div className="question-actions">
                                                    <button
                                                        onClick={(e) =>
                                                            handleSeeMore(
                                                                attempt.id,
                                                                questionText,
                                                                attempt.selected_option,
                                                                correctAnswer,
                                                                e
                                                            )
                                                        }
                                                        className="see-more-button"
                                                        disabled={loadingButtons[attempt.id]}
                                                    >
                                                        {loadingButtons[attempt.id] ? 'جاري التحميل...' : '🔍 عرض المزيد'}
                                                    </button>
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
                                                    الرجوع للسؤال ←
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {lastQuizAttempts.length > 5 && (
                        <div className="see-all-container">
                            <button
                                onClick={toggleShowAll}
                                className="see-all-button"
                            >
                                {showAll ? '▲ عرض أقل' : `▼ عرض الكل (${lastQuizAttempts.length})`}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="no-streak">لم يتم العثور على أسئلة في آخر اختبار.</p>
            )}

        </section>
    );
};

export default QuestionAttemptsTable;