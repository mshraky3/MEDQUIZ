import React, { useState } from 'react';
import axios from 'axios';
import Global from '../../global.js';
import './analysis.css';

const QuestionAttemptsTable = ({ questionAttempts, questions, latestQuiz }) => {
    const [showAll, setShowAll] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [loadingButtons, setLoadingButtons] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState('');


    // Filter attempts for the last quiz session only
    let lastQuizAttempts = [];
    if (latestQuiz && latestQuiz.id) {
        lastQuizAttempts = questionAttempts
            .filter(a => a.quiz_session_id === latestQuiz.id)
            .sort((a, b) => new Date(a.attempted_at) - new Date(b.attempted_at));
    }

    const displayedAttempts = showAll
        ? lastQuizAttempts
        : lastQuizAttempts.slice(0, 5);

    const handleSeeMore = async (attemptId, questionText, selectedAnswer, correctAnswer, event) => {
        setCurrentQuestion(questionText);
        setAiAnalysis('');
        setLoadingButtons((prev) => ({ ...prev, [attemptId]: true }));

        // Get button position for mobile
        if (window.innerWidth <= 768) {
            const buttonTop = event.target.getBoundingClientRect().top + window.scrollY;
            document.documentElement.style.setProperty('--modal-top', `${buttonTop + 40}px`);
        }

        try {
            const response = await axios.post(`${Global.URL}/ai-analysis`, {
                question: questionText,
                selected_answer: selectedAnswer,
                correct_option: correctAnswer,
            });
            setAiAnalysis(response.data.answer || 'No explanation received.');
        } catch (error) {
            setAiAnalysis('Failed to get AI analysis.');
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [attemptId]: false }));
            setModalOpen(true);
        }
    };

    return (
        <section className="streak-section">
            <h3 className="section-header">Last Quiz Questions</h3>

            {lastQuizAttempts.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <table className="analysis-tableQ">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Your Answer</th>
                                    <th>Correct Answer</th>
                                    <th>Result</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedAttempts.map((attempt, index) => {
                                    const questionRow = questions.find(q => q.id === attempt.question_id);
                                    const questionText = questionRow?.question_text || 'Unknown question';
                                    const correctAnswer = questionRow?.correct_option || 'N/A';
                                    const isCorrect = attempt.is_correct;
                                    return (
                                        <tr key={attempt.id || index}>
                                            <td>{questionText}</td>
                                            <td className={isCorrect ? 'user-answer right' : 'user-answer wrong'}>{attempt.selected_option}</td>
                                            <td className="correct-answer right">{correctAnswer}</td>
                                            <td>{isCorrect ? '✔️' : '❌'}</td>
                                            <td>
                                                <button
                                                    onClick={(e) =>
                                                        handleSeeMore(
                                                            attempt.id,
                                                            questionText,
                                                            attempt.selected_option,
                                                            correctAnswer,
                                                            e
                                                        )
                                                    }
                                                    className="see-more-button"
                                                    disabled={loadingButtons[attempt.id]}
                                                >
                                                    {loadingButtons[attempt.id] ? 'Loading...' : 'See More'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {lastQuizAttempts.length > 5 && (
                        <div className="see-all-container">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="see-all-button"
                            >
                                {showAll ? '▲ Show Less' : `▼ See All (${lastQuizAttempts.length})`}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="no-streak">No questions found for your last quiz.</p>
            )}

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="section-header">🧠 AI Analysis</h3>
                        {aiAnalysis === '' && currentQuestion !== '' ? (
                            <div className="loading-state">
                                <p>Analyzing:</p>
                                <p><strong>"{currentQuestion}"</strong></p>
                                <div className="spinner"></div>
                                <p className="loading-subtext">Please wait...</p>
                            </div>
                        ) : (
                            <div className="analysis-result">
                                <p>{aiAnalysis}</p>
                            </div>
                        )}
                        {aiAnalysis !== '' && (
                            <button className="close-button" onClick={() => setModalOpen(false)}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default QuestionAttemptsTable;