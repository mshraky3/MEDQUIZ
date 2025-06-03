import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QUIZ.css';

const QUIZ = () => {
    const { numQuestions } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [quizFinished, setQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch questions from backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/questions`, {
                    params: { limit: numQuestions }
                });

                if (response.data.questions?.length > 0) {
                    setQuestions(response.data.questions);
                    setLoading(false);
                } else {
                    setError("No questions were returned.");
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to load questions.");
                setLoading(false);
                alert("Could not load quiz. Redirecting...");
                navigate("/quizs"); // Go back to selection
            }
        };

        fetchQuestions();
    }, [numQuestions, navigate]);

    // Handle answer selection
    const handleSelectOption = (option) => {
        setSelectedAnswer(option);
    };

    // Submit answer and move to next question
    const handleSubmitAnswer = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        setAnswers(prev => [
            ...prev,
            {
                question: currentQuestion.question_text,
                selected: selectedAnswer,
                correct: currentQuestion.correct_answer,
                isCorrect
            }
        ]);

        setSelectedAnswer(null);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };

    // Restart quiz
    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswers([]);
        setQuizFinished(false);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="quiz-container">
                <h2>Loading questions...</h2>
            </div>
        );
    }

    // Show error
    if (error) {
        return (
            <div className="quiz-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/quizs")}>Go Back</button>
            </div>
        );
    }

    // If no questions found
    if (questions.length === 0) {
        return (
            <div className="quiz-container">
                <h2>No Questions Found</h2>
                <p>There are no questions available in the database.</p>
                <button onClick={() => navigate("/quizs")}>Go Back</button>
            </div>
        );
    }

    // If quiz finished
    if (quizFinished) {
        const correctCount = answers.filter(a => a.isCorrect).length;

        return (
            <div className="quiz-result">
                <h2>Quiz Completed!</h2>
                <p>You got <strong>{correctCount}</strong> out of <strong>{answers.length}</strong> correct.</p>
                <button onClick={handleRestartQuiz} className="restart-button">Try Again</button>
                <button onClick={() => navigate("/")} className="home-button">Go Home</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="progress">
                Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{questions.length}</strong>
            </div>

            <h2 className="question-text">{currentQuestion.question_text}</h2>

            <div className="options">
                {['option1', 'option2', 'option3', 'option4'].map((optKey, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedAnswer === currentQuestion[optKey] ? "selected" : ""}`}
                        onClick={() => handleSelectOption(currentQuestion[optKey])}
                    >
                        {currentQuestion[optKey]}
                    </button>
                ))}
            </div>

            <div className="submit-section">
                <button
                    className="submit-button"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                >
                    {currentQuestionIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                </button>
            </div>
        </div>
    );
};

export default QUIZ;