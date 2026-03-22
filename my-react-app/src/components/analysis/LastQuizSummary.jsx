import React from 'react';
import './analysis.css';

const LastQuizSummary = ({ latest_quiz }) => {
    return (
        <section className="streak-section">
            <h3 className="section-header">ملخص آخر اختبار</h3>
            {latest_quiz?.id ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    📊 ملخص الاختبار
                                </span>
                                <span className="source-badge">
                                    📚 {latest_quiz.source || 'general'}
                                </span>
                                <span className="date-badge">
                                    📅 آخر اختبار
                                </span>
                            </div>
                        </div>

                        <div className="question-content">
                            <div className="quiz-summary-text">
                                <h4>أداؤك في آخر اختبار</h4>
                                <p>تفاصيل آخر محاولة:</p>
                            </div>

                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">إجمالي الأسئلة:</span>
                                    <span className="answer-text primary">{latest_quiz.total_questions ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label correct">الإجابات الصحيحة:</span>
                                    <span className="answer-text correct">{latest_quiz.correct_answers ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label accuracy">الدقة:</span>
                                    <span className="answer-text accuracy">
                                        {latest_quiz.total_questions > 0
                                            ? ((latest_quiz.correct_answers / latest_quiz.total_questions) * 100).toFixed(2)
                                            : "0.00"
                                        }%
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">المدة:</span>
                                    <span className="answer-text time">
                                        {latest_quiz.duration && latest_quiz.duration > 0
                                            ? `${Math.floor(latest_quiz.duration / 60)}د ${latest_quiz.duration % 60}ث`
                                            : 'غير مسجل'}
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">متوسط الوقت لكل سؤال:</span>
                                    <span className="answer-text time">
                                        {latest_quiz.avg_time_per_question && latest_quiz.avg_time_per_question > 0
                                            ? `${parseFloat(latest_quiz.avg_time_per_question).toFixed(1)}ث`
                                            : 'غير مسجل'}
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label topics">المواضيع:</span>
                                    <span className="answer-text topics">
                                        {latest_quiz.topics_covered && latest_quiz.topics_covered.length > 0
                                            ? latest_quiz.topics_covered.join(', ')
                                            : 'mix'}
                                    </span>
                                </div>
                            </div>

                            <div className="question-actions">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="see-more-button"
                                >
                                    🔄 تحديث
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="no-streak">لا يوجد اختبار سابق.</p>
            )}
        </section>
    );
};

export default LastQuizSummary;