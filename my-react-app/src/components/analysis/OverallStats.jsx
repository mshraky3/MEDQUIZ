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
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    📊 Performance Overview
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
                                <h4>Your Learning Journey</h4>
                                <p>Here's a comprehensive overview of your progress:</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">Total Sessions:</span>
                                    <span className="answer-text primary">{userAnalysis.total_quizzes ?? 0}</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label accuracy">Average Accuracy:</span>
                                    <span className="answer-text accuracy">{calculateAccuracy()}%</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label correct">Questions Answered:</span>
                                    <span className="answer-text correct">{userAnalysis.total_questions_answered ?? 0}</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label time">Total Time Spent:</span>
                                    <span className="answer-text time">
                                        {userAnalysis.total_duration ? (userAnalysis.total_duration/60).toFixed(1) : 0} min
                                    </span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label time">Avg. Session Duration:</span>
                                    <span className="answer-text time">
                                        {userAnalysis.avg_duration ? (userAnalysis.avg_duration/60).toFixed(1) : 0} min
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
                                        <h4>Performance by Source</h4>
                                        <p>Your performance in {source.source} questions:</p>
                                    </div>
                                    
                                    <div className="answers-section">
                                        <div className="answer-row">
                                            <span className="answer-label primary">Quizzes:</span>
                                            <span className="answer-text primary">{source.quiz_count}</span>
                                        </div>
                                        
                                        <div className="answer-row">
                                            <span className="answer-label correct">Questions:</span>
                                            <span className="answer-text correct">{source.total_questions}</span>
                                        </div>
                                        
                                        <div className="answer-row">
                                            <span className="answer-label accuracy">Accuracy:</span>
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
                                        📚 Source Breakdown
                                    </span>
                                </div>
                            </div>
                            
                            <div className="question-content">
                                <div className="topic-performance-text">
                                    <h4>No Source Data Yet</h4>
                                    <p>Take quizzes with specific sources to see detailed breakdowns!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="no-streak">No overall data available.</p>
            )}
        </section>
    );
};

export default OverallStats;