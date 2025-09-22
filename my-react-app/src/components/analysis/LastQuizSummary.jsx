import React from 'react';
import './analysis.css';

const LastQuizSummary = ({ latest_quiz }) => {
    // Debug logging
    console.log("LastQuizSummary - latest_quiz:", latest_quiz);
    console.log("LastQuizSummary - latest_quiz.source:", latest_quiz?.source);
    console.log("LastQuizSummary - latest_quiz.topics_covered:", latest_quiz?.topics_covered);
    console.log("LastQuizSummary - topics_covered type:", typeof latest_quiz?.topics_covered);
    
    return (
        <section className="streak-section">
            <h3 className="section-header">Last Quiz Summary</h3>
            {latest_quiz?.id ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    📊 Quiz Summary
                                </span>
                                <span className="source-badge">
                                    📚 {latest_quiz.source || 'general'}
                                </span>
                                <span className="date-badge">
                                    📅 Latest Quiz
                                </span>
                            </div>
                        </div>
                        
                        <div className="question-content">
                            <div className="quiz-summary-text">
                                <h4>Your Last Quiz Performance</h4>
                                <p>Here's a detailed breakdown of your most recent quiz attempt:</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">Total Questions:</span>
                                    <span className="answer-text primary">{latest_quiz.total_questions ?? 0}</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label correct">Correct Answers:</span>
                                    <span className="answer-text correct">{latest_quiz.correct_answers ?? 0}</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label accuracy">Accuracy:</span>
                                    <span className="answer-text accuracy">
                                        {latest_quiz.total_questions > 0
                                            ? ((latest_quiz.correct_answers / latest_quiz.total_questions) * 100).toFixed(2)
                                            : "0.00"
                                        }%
                                    </span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label time">Duration:</span>
                                    <span className="answer-text time">
                                        {latest_quiz.duration ? Math.floor(latest_quiz.duration / 60) : 0}m {latest_quiz.duration ? latest_quiz.duration % 60 : 0}s
                                    </span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label time">Avg. Time per Question:</span>
                                    <span className="answer-text time">
                                        {latest_quiz.avg_time_per_question ? parseFloat(latest_quiz.avg_time_per_question).toFixed(1) : 0}s
                                    </span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label topics">Topics Covered:</span>
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
                                    🔄 Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="no-streak">No previous quiz found.</p>
            )}
        </section>
    );
};

export default LastQuizSummary;