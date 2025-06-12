import React from 'react';
import './analysis.css';

const getRelativeDate = (dateString) => {
    if (!dateString) return "Never";
    const now = new Date();
    const date = new Date(dateString + 'Z');
    if (isNaN(date.getTime())) return "Invalid Date";

    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;

    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
};

const LastQuizSummary = ({ latest_quiz }) => {
    return (
        <section className="summary-section">
            <h3 className="section-header"> Last Quiz Summary</h3>
            {latest_quiz?.id ? (
                <div className="table-wrapper">
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Questions</td>
                                <td>{latest_quiz.total_questions}</td>
                            </tr>
                            <tr>
                                <td>Correct Answers</td>
                                <td>{latest_quiz.correct_answers}</td>
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

                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data">No previous quiz found.</p>
            )}
        </section>
    );
};

export default LastQuizSummary;
