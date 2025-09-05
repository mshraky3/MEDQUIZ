import React from 'react';
import './analysis.css';

const LastQuizSummary = ({ latest_quiz }) => {
    // Debug logging
    console.log("LastQuizSummary - latest_quiz:", latest_quiz);
    console.log("LastQuizSummary - latest_quiz.source:", latest_quiz?.source);
    
    return (
        <section className="streak-section">
            <h3 className="section-header">Last Quiz Summary</h3>
            {latest_quiz?.id ? (
                <div className="table-wrapper">
                    <table className="analysis-tableQ">
                        <thead >
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Questions</td>
                                <td>{latest_quiz.total_questions ?? 0}</td>
                            </tr>
                            <tr>
                                <td>Correct Answers</td>
                                <td>{latest_quiz.correct_answers ?? 0}</td>
                            </tr>
                            <tr>
                                <td>Accuracy</td>
                                <td>
                                    {latest_quiz.total_questions > 0
                                        ? ((latest_quiz.correct_answers / latest_quiz.total_questions) * 100).toFixed(2)
                                        : "0.00"
                                    }%
                                </td>
                            </tr>
                            <tr>
                                <td>Duration</td>
                                <td>
                                    {latest_quiz.duration ? Math.floor(latest_quiz.duration / 60) : 0}m {latest_quiz.duration ? latest_quiz.duration % 60 : 0}s
                                </td>
                            </tr>
                            <tr>
                                <td>Avg. Time per Question</td>
                                <td>
                                    {latest_quiz.avg_time_per_question ? parseFloat(latest_quiz.avg_time_per_question).toFixed(1) : 0}s
                                </td>
                            </tr>
                            <tr>
                                <td>Question Source</td>
                                <td>
                                    <span className="source-badge">
                                        📚 {latest_quiz.source || 'general'}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>Topics Covered</td>
                                <td>
                                    <span className="topic-badge">
                                        📖 {latest_quiz.topics_covered && latest_quiz.topics_covered.length > 0 
                                            ? latest_quiz.topics_covered.join(', ') 
                                            : 'mix'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-streak">No previous quiz found.</p>
            )}
        </section>
    );
};

export default LastQuizSummary;