import React from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './OverallStats.css';

// Matches Analysis.jsx's own accuracyTone exactly, so the hero "weakest
// topic" card and these per-source cards use one consistent colour language.
function accuracyTone(pct) {
    if (pct == null || Number.isNaN(pct)) return 'neutral';
    if (pct >= 75) return 'high';
    if (pct >= 50) return 'mid';
    return 'low';
}

const OverallStats = ({ userAnalysis }) => {
    const t = useCopy(analysisCopy).overall;
    const { lang } = useLang();

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
        <section className="ov-section">
            <h3 className="ov-title">{t.title}</h3>

            {userAnalysis ? (
                <div className="ov-grid">
                    <div className="ov-card">
                        <div className="ov-card-head">
                            <span className="ov-badge">
                                <Icon name="bar-chart" size={15} /> {t.glance}
                            </span>
                            <span className={`ov-accuracy tone-${accuracyTone(Number(calculateAccuracy()))}`}>
                                <Icon name="target" size={15} /> {calculateAccuracy()}%
                            </span>
                        </div>

                        <div className="ov-card-body">
                            <div className="ov-blurb">
                                <h4>{t.journey}</h4>
                                <p>{t.journeyHint}</p>
                            </div>

                            <div className="ov-stats">
                                <div className="ov-stat">
                                    <span className="ov-stat-label">{t.totalSessions}</span>
                                    <span className="ov-stat-value">{userAnalysis.total_quizzes ?? 0}</span>
                                </div>

                                <div className="ov-stat">
                                    <span className="ov-stat-label">{t.avgAccuracy}</span>
                                    <span className="ov-stat-value">{calculateAccuracy()}%</span>
                                </div>

                                <div className="ov-stat">
                                    <span className="ov-stat-label">{t.answered}</span>
                                    <span className="ov-stat-value">{userAnalysis.total_questions_answered ?? 0}</span>
                                </div>

                                <div className="ov-stat">
                                    <span className="ov-stat-label">{t.totalTime}</span>
                                    <span className="ov-stat-value">
                                        {userAnalysis.total_duration ? (userAnalysis.total_duration / 60).toFixed(1) : 0} {t.minutes}
                                    </span>
                                </div>

                                <div className="ov-stat">
                                    <span className="ov-stat-label">{t.avgSession}</span>
                                    <span className="ov-stat-value">
                                        {userAnalysis.avg_duration ? (userAnalysis.avg_duration / 60).toFixed(1) : 0} {t.minutes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {userAnalysis.source_breakdown && userAnalysis.source_breakdown.length > 0 ? (
                        userAnalysis.source_breakdown.map((source, index) => (
                            <div key={index} className="ov-card">
                                <div className="ov-card-head">
                                    <span className="ov-badge">
                                        <Icon name="book-open" size={15} /> {getSourceLabel(source.source, lang)}
                                    </span>
                                    <span className={`ov-accuracy tone-${accuracyTone(Number(source.avg_accuracy))}`}>
                                        <Icon name="bar-chart" size={15} /> {source.avg_accuracy}%
                                    </span>
                                </div>

                                <div className="ov-card-body">
                                    <div className="ov-blurb">
                                        <h4>{t.bySource}</h4>
                                        <p>{t.bySourceHint(getSourceLabel(source.source, lang))}</p>
                                    </div>

                                    <div className="ov-stats">
                                        <div className="ov-stat">
                                            <span className="ov-stat-label">{t.quizzes}</span>
                                            <span className="ov-stat-value">{source.quiz_count}</span>
                                        </div>

                                        <div className="ov-stat">
                                            <span className="ov-stat-label">{t.questions}</span>
                                            <span className="ov-stat-value">{source.total_questions}</span>
                                        </div>

                                        <div className="ov-stat">
                                            <span className="ov-stat-label">{t.accuracy}</span>
                                            <span className="ov-stat-value">{source.avg_accuracy}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="ov-card">
                            <div className="ov-card-head">
                                <span className="ov-badge">
                                    <Icon name="book-open" size={15} /> {t.sourceBreakdown}
                                </span>
                            </div>

                            <div className="ov-card-body">
                                <div className="ov-blurb">
                                    <h4>{t.noDataYet}</h4>
                                    <p>{t.noDataHint}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="ov-empty">{t.noOverall}</p>
            )}
        </section>
    );
};

export default OverallStats;
