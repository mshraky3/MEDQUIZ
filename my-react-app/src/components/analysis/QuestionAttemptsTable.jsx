import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuestionAttemptsTable = ({ questionAttempts, questions }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAll, setShowAll] = useState(false);

    const sortedIncorrectAttempts = [...questionAttempts]
        .sort((a, b) => new Date(b.attempted_at) - new Date(a.attempted_at))
        .filter(attempt => !attempt.is_correct);

    const displayedAttempts = showAll ? sortedIncorrectAttempts : sortedIncorrectAttempts.slice(0, 5);

    return (
        <section className="analysis-section">
            <h3>✍️ Questions You Got Wrong</h3>

            {sortedIncorrectAttempts.length > 0 ? (
                <>
                    <p>The following questions were answered incorrectly (newest first):</p>
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Your Answer</th>
                                <th>Correct Answer</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAttempts.map((attempt, index) => {
                                const questionRow = questions.find(q => q.id === attempt.question_id);
                                const questionText = questionRow?.question_text || "Unknown question";
                                const correctAnswer = questionRow?.correct_answer || "N/A";

                                return (
                                    <tr key={attempt.id || index}>
                                        <td>{questionText}</td>
                                        <td style={{ color: "red" }}>{attempt.selected_option}</td>
                                        <td style={{ color: "green" }}>{correctAnswer}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    navigate(`/review-question/${attempt.question_id}`, {
                                                        state: { id: location.state?.id }
                                                    })
                                                }
                                                className="see-more-button"
                                            >
                                                See More
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {sortedIncorrectAttempts.length > 5 && (
                        <div className="see-all-container">
                            <button 
                                onClick={() => setShowAll(!showAll)} 
                                className="see-all-button"
                            >
                                {showAll ? (
                                    <>
                                        <span>Show Less</span>
                                        <span className="arrow">↑</span>
                                    </>
                                ) : (
                                    <>
                                        <span>See All ({sortedIncorrectAttempts.length} questions)</span>
                                        <span className="arrow">↓</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>No incorrect attempts recorded yet.</p>
            )}
        </section>
    );
};

export default QuestionAttemptsTable;