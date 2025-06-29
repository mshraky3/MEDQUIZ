import React from 'react';
import './analysis.css';



const LastQuizSummary = ({ latest_quiz }) => {
    return (
        <section className="summary-section">
            <h3 className="section-header">Last Quiz Summary</h3>
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