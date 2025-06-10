import React, { useState } from 'react';
import axios from 'axios';
import Global from '../../global.js';
import './QuestionAttemptsTable.css';



const QuestionAttemptsTable = ({ questionAttempts, questions }) => {


    const [showAll, setShowAll] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [loadingButtons, setLoadingButtons] = useState({}); 
    const [currentQuestion, setCurrentQuestion] = useState("");

    const sortedIncorrectAttempts = [...questionAttempts]
        .sort((a, b) => new Date(b.attempted_at) - new Date(a.attempted_at))
        .filter(attempt => !attempt.is_correct);

    const displayedAttempts = showAll ? sortedIncorrectAttempts : sortedIncorrectAttempts.slice(0, 5);

const handleSeeMore = async (attemptId, questionText, selectedAnswer, correctAnswer) => {
    setCurrentQuestion(questionText);
    setAiAnalysis("");
    
    // Set loading only for this question
    setLoadingButtons(prev => ({ ...prev, [attemptId]: true }));
    
    try {
        const response = await axios.post(Global.URL + '/ai-analysis', {
            question: questionText,
            selected_answer: selectedAnswer,
            correct_answer: correctAnswer
        });

        setAiAnalysis(response.data.answer || "No explanation received.");
    } catch (error) {
        console.error("Error fetching AI analysis:", error);
        setAiAnalysis("Failed to get AI analysis.");
    } finally {
        setLoadingButtons(prev => ({ ...prev, [attemptId]: false }));
        setModalOpen(true);
    }
};

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
                                                onClick={() => handleSeeMore(attempt.id, questionText, attempt.selected_option, correctAnswer)}
                                                className="see-more-button"
                                                disabled={loadingButtons[attempt.id]}
                                            >
                                                {loadingButtons[attempt.id] ? (
                                                    <span className="button-loader">
                                                        <span className="spinner"></span> Loading...
                                                    </span>
                                                ) : "See More"}
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

            {/* Modal */}

{/* Modal */}
{modalOpen && (
    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🧠 AI Analysis</h3>

            {/* Show loading state if aiAnalysis is empty AND there's a current question */}
            {aiAnalysis === "" && currentQuestion !== "" ? (
                <div className="loading-state">
                    <p>Analyzing this question:</p>
                    <p><strong>"{currentQuestion}"</strong></p>
                    <div className="spinner"></div>
                    <p className="loading-subtext">Please wait while we generate an explanation...</p>
                </div>
            ) : (
                <div className="analysis-result fade-in">
                    <p>{aiAnalysis}</p>
                </div>
            )}

            {/* Only show close button when analysis is done */}
            {aiAnalysis !== "" && (
                <button className="close-button" onClick={() => setModalOpen(false)}>Close</button>
            )}
        </div>
    </div>
)}
        </section>
    );
};

export default QuestionAttemptsTable;