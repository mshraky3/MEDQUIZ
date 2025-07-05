import React from 'react';
import './analysis.css';

const OverallStats = ({ userAnalysis }) => {

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
                </div>
            ) : (
                <p className="no-streak">No overall data available.</p>
            )}
        </section>
    );
};

export default OverallStats;