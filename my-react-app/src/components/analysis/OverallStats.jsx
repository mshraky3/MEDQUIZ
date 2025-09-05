import React from 'react';
import './analysis.css';

const OverallStats = ({ userAnalysis }) => {
    // Debug logging
    console.log("OverallStats - userAnalysis:", userAnalysis);
    console.log("OverallStats - source_breakdown:", userAnalysis?.source_breakdown);

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
            <h3 className="section-header">Overall Performance</h3>

            {userAnalysis ? (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Sessions</div>
                            <div className="stat-value">{userAnalysis.total_quizzes ?? 0}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Average Accuracy</div>
                            <div className="stat-value">
                                {calculateAccuracy()}%
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Questions Answered</div>
                            <div className="stat-value">{userAnalysis.total_questions_answered ?? 0}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Time Spent</div>
                            <div className="stat-value">
                                {userAnalysis.total_duration ? (userAnalysis.total_duration/60).toFixed(1) : 0} min
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Avg. Session Duration</div>
                            <div className="stat-value">
                                {userAnalysis.avg_duration ? (userAnalysis.avg_duration/60).toFixed(1) : 0} min
                            </div>
                        </div>
                    </div>

                    {/* Source Breakdown */}
                    <div className="source-breakdown">
                        <h4 className="source-breakdown-title">📚 Performance by Source</h4>
                        {userAnalysis.source_breakdown && userAnalysis.source_breakdown.length > 0 ? (
                            <div className="source-grid">
                                {userAnalysis.source_breakdown.map((source, index) => (
                                    <div key={index} className="source-card">
                                        <div className="source-name">{source.source}</div>
                                        <div className="source-stats">
                                            <div className="source-stat">
                                                <span className="source-stat-label">Quizzes:</span>
                                                <span className="source-stat-value">{source.quiz_count}</span>
                                            </div>
                                            <div className="source-stat">
                                                <span className="source-stat-label">Questions:</span>
                                                <span className="source-stat-value">{source.total_questions}</span>
                                            </div>
                                            <div className="source-stat">
                                                <span className="source-stat-label">Accuracy:</span>
                                                <span className="source-stat-value">{source.avg_accuracy}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-source-data">No source-specific data available yet. Take a quiz with a specific source to see breakdown!</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="no-streak">No overall data available.</p>
            )}
        </section>
    );
};

export default OverallStats;