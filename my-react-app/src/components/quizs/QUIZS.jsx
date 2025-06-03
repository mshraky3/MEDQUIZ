import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QUIZS.css';

const QUIZS = () => {
    const navigate = useNavigate();

    const quizOptions = [10, 30, 50, 100, 200];

    const handleOptionClick = (numQuestions) => {
        navigate(`/quiz/${numQuestions}`);
    };

    return (
        <div className="quiz-selection">
            <h1>Choose Your Quiz</h1>
            <p>Select the number of questions you'd like to answer:</p>
            <div className="options-container">
                {quizOptions.map((num) => (
                    <button
                        key={num}
                        className="quiz-option-btn"
                        onClick={() => handleOptionClick(num)}
                    >
                        {num} Questions
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QUIZS;