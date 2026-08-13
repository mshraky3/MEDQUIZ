import React from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisShared.css';

const OverallStats = ({ userAnalysis }) => {
    const t = useCopy(analysisCopy).overall;
    const { lang } = useLang();
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
            <h3 className="section-header">{t.title}</h3>

            {userAnalysis ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    <Icon name="bar-chart" size={15} /> {t.glance}
                                </span>
                                <span className="accuracy-badge" style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    color: 'white'
                                }}>
                                    <Icon name="target" size={15} /> {calculateAccuracy()}%
                                </span>
                            </div>
                        </div>

                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>{t.journey}</h4>
                                <p>{t.journeyHint}</p>
                            </div>

                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">{t.totalSessions}</span>
                                    <span className="answer-text primary">{userAnalysis.total_quizzes ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label accuracy">{t.avgAccuracy}</span>
                                    <span className="answer-text accuracy">{calculateAccuracy()}%</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label correct">{t.answered}</span>
                                    <span className="answer-text correct">{userAnalysis.total_questions_answered ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">{t.totalTime}</span>
                                    <span className="answer-text time">
                                        {userAnalysis.total_duration ? (userAnalysis.total_duration / 60).toFixed(1) : 0} {t.minutes}
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">{t.avgSession}</span>
                                    <span className="answer-text time">
                                        {userAnalysis.avg_duration ? (userAnalysis.avg_duration / 60).toFixed(1) : 0} {t.minutes}
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
                                            <Icon name="book-open" size={15} /> {getSourceLabel(source.source, lang)}
                                        </span>
                                        <span className="accuracy-badge" style={{
                                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                            color: 'white'
                                        }}>
                                            <Icon name="bar-chart" size={15} /> {source.avg_accuracy}%
                                        </span>
                                    </div>
                                </div>

                                <div className="question-content">
                                    <div className="topic-performance-text">
                                        <h4>{t.bySource}</h4>
                                        <p>{t.bySourceHint(getSourceLabel(source.source, lang))}</p>
                                    </div>

                                    <div className="answers-section">
                                        <div className="answer-row">
                                            <span className="answer-label primary">{t.quizzes}</span>
                                            <span className="answer-text primary">{source.quiz_count}</span>
                                        </div>

                                        <div className="answer-row">
                                            <span className="answer-label correct">{t.questions}</span>
                                            <span className="answer-text correct">{source.total_questions}</span>
                                        </div>

                                        <div className="answer-row">
                                            <span className="answer-label accuracy">{t.accuracy}</span>
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
                                        <Icon name="book-open" size={15} /> {t.sourceBreakdown}
                                    </span>
                                </div>
                            </div>

                            <div className="question-content">
                                <div className="topic-performance-text">
                                    <h4>{t.noDataYet}</h4>
                                    <p>{t.noDataHint}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="no-streak">{t.noOverall}</p>
            )}
        </section>
    );
};

export default OverallStats;