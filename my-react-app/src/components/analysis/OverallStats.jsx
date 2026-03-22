import React from 'react';
import './analysis.css';

const OverallStats = ({ userAnalysis }) => {
    // Remove debug logging in production

    const calculateAccuracy = () => {
        if (userAnalysis?.avg_accuracy !== undefined) {
            return Number(userAnalysis.avg_accuracy).toFixed(2);
        }

        const correct = userAnalysis?.total_correct_answers;
        const total = userAnalysis?.total_questions_answered;

        if (typeof correct === 'number' && typeof total === 'number' && total > 0) {
            return ((correct / total) * 100).toFixed(2);
        }

        return "0.00";
    };

    return (
        <section className="streak-section">
            <h3 className="section-header">الأداء العام</h3>

            {userAnalysis ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    📊 نظرة على الأداء
                                </span>
                                <span className="accuracy-badge" style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    color: 'white'
                                }}>
                                    🎯 {calculateAccuracy()}%
                                </span>
                            </div>
                        </div>

                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>مسيرتك التعليمية</h4>
                                <p>نظرة شاملة على تقدمك:</p>
                            </div>

                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">إجمالي الجلسات:</span>
                                    <span className="answer-text primary">{userAnalysis.total_quizzes ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label accuracy">متوسط الدقة:</span>
                                    <span className="answer-text accuracy">{calculateAccuracy()}%</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label correct">الأسئلة المُجابة:</span>
                                    <span className="answer-text correct">{userAnalysis.total_questions_answered ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">إجمالي الوقت:</span>
                                    <span className="answer-text time">
                                        {userAnalysis.total_duration ? (userAnalysis.total_duration / 60).toFixed(1) : 0} دقيقة
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">متوسط مدة الجلسة:</span>
                                    <span className="answer-text time">
                                        {userAnalysis.avg_duration ? (userAnalysis.avg_duration / 60).toFixed(1) : 0} دقيقة
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Source Breakdown as Cards */}
                    {userAnalysis.source_breakdown && userAnalysis.source_breakdown.length > 0 ? (
                        userAnalysis.source_breakdown.map((source, index) => (
                            <div key={index} className="question-card">
                                <div className="question-header">
                                    <div className="question-meta">
                                        <span className="source-badge">
                                            📚 {source.source}
                                        </span>
                                        <span className="accuracy-badge" style={{
                                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                            color: 'white'
                                        }}>
                                            📊 {source.avg_accuracy}%
                                        </span>
                                    </div>
                                </div>

                                <div className="question-content">
                                    <div className="topic-performance-text">
                                        <h4>الأداء حسب المصدر</h4>
                                        <p>أداؤك في أسئلة {source.source}:</p>
                                    </div>

                                    <div className="answers-section">
                                        <div className="answer-row">
                                            <span className="answer-label primary">الاختبارات:</span>
                                            <span className="answer-text primary">{source.quiz_count}</span>
                                        </div>

                                        <div className="answer-row">
                                            <span className="answer-label correct">الأسئلة:</span>
                                            <span className="answer-text correct">{source.total_questions}</span>
                                        </div>

                                        <div className="answer-row">
                                            <span className="answer-label accuracy">الدقة:</span>
                                            <span className="answer-text accuracy">{source.avg_accuracy}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="question-card">
                            <div className="question-header">
                                <div className="question-meta">
                                    <span className="type-badge">
                                        📚 تفصيل المصادر
                                    </span>
                                </div>
                            </div>

                            <div className="question-content">
                                <div className="topic-performance-text">
                                    <h4>لا توجد بيانات بعد</h4>
                                    <p>ابدأ اختبارات من مصادر مختلفة لرؤية التفاصيل!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="no-streak">لا توجد بيانات عامة حتى الآن.</p>
            )}
        </section>
    );
};

export default OverallStats;