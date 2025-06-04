import React from 'react';

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
        <section className="analysis-section">
            <h3>🕒 Last Quiz Summary</h3>
            {latest_quiz?.id ? (
                <table className="analysis-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Total Questions:</strong></td>
                            <td>{latest_quiz.total_questions}</td>
                        </tr>
                        <tr>
                            <td><strong>Correct Answers:</strong></td>
                            <td>{latest_quiz.correct_answers}</td>
                        </tr>
                        <tr>
                            <td><strong>Accuracy:</strong></td>
                            <td>
                                {latest_quiz.total_questions > 0
                                    ? ((latest_quiz.correct_answers / latest_quiz.total_questions) * 100).toFixed(2)
                                    : "0.00"
                                }%
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Total Questions Answered:</strong></td>
                            <td>{latest_quiz.total_questions}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No previous quiz found.</p>
            )}
        </section>
    );
};

export default LastQuizSummary;