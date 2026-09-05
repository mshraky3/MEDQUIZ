import React from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisPanels.css';

// Matches Analysis.jsx's own accuracyTone exactly, so the hero "weakest topic"
// card and these cards use one consistent colour language.
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

    if (!userAnalysis) {
        return <p className="ap-empty">{t.noOverall}</p>;
    }

    const overall = calculateAccuracy();

    return (
        <div className="ap-grid">
            <div className="ap-card">
                <div className="ap-card-head">
                    <span className="ap-badge">
                        <Icon name="bar-chart" size={14} /> {t.glance}
                    </span>
                    <span className={`ap-acc tone-${accuracyTone(Number(overall))}`}>
                        <bdi>{overall}%</bdi>
                    </span>
                </div>

                <div className="ap-card-body">
                    <div className="ap-stats">
                        <div className="ap-stat">
                            <span className="ap-stat-label">{t.totalSessions}</span>
                            <span className="ap-stat-value">{userAnalysis.total_quizzes ?? 0}</span>
                        </div>
                        <div className="ap-stat">
                            <span className="ap-stat-label">{t.answered}</span>
                            <span className="ap-stat-value">{userAnalysis.total_questions_answered ?? 0}</span>
                        </div>
                        <div className="ap-stat">
                            <span className="ap-stat-label">{t.totalTime}</span>
                            <span className="ap-stat-value">
                                {userAnalysis.total_duration ? (userAnalysis.total_duration / 60).toFixed(1) : 0} {t.minutes}
                            </span>
                        </div>
                        <div className="ap-stat">
                            <span className="ap-stat-label">{t.avgSession}</span>
                            <span className="ap-stat-value">
                                {userAnalysis.avg_duration ? (userAnalysis.avg_duration / 60).toFixed(1) : 0} {t.minutes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {userAnalysis.source_breakdown && userAnalysis.source_breakdown.length > 0 ? (
                userAnalysis.source_breakdown.map((source, index) => (
                    <div key={index} className="ap-card">
                        <div className="ap-card-head">
                            <span className="ap-badge">
                                <Icon name="book-open" size={14} /> {getSourceLabel(source.source, lang)}
                            </span>
                            <span className={`ap-acc tone-${accuracyTone(Number(source.avg_accuracy))}`}>
                                <bdi>{source.avg_accuracy}%</bdi>
                            </span>
                        </div>

                        <div className="ap-card-body">
                            <div className="ap-stats">
                                <div className="ap-stat">
                                    <span className="ap-stat-label">{t.quizzes}</span>
                                    <span className="ap-stat-value">{source.quiz_count}</span>
                                </div>
                                <div className="ap-stat">
                                    <span className="ap-stat-label">{t.questions}</span>
                                    <span className="ap-stat-value">{source.total_questions}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="ap-card">
                    <div className="ap-card-head">
                        <span className="ap-badge">
                            <Icon name="book-open" size={14} /> {t.sourceBreakdown}
                        </span>
                    </div>
                    <div className="ap-card-body">
                        <p className="ap-empty">{t.noDataHint}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverallStats;
