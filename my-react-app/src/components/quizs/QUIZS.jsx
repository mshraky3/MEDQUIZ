import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './QUIZS.css'; // Your existing QUIZS.css remains unchanged
import Globals from '../../global'; // Adjust the import path as necessary
const QUIZS = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id || location.state?.user?.id;

    const [currentStreak, setCurrentStreak] = useState(0);

    const quizOptions = [10, 30, 50, 100, 200];

    const handleOptionClick = (numQuestions) => {
        navigate(`/quiz/${numQuestions}`, { state: { id: id } });
    };

    useEffect(() => {
        const fetchStreaks = async () => {
            if (!id) return;
            try {
                const response = await axios.get(`${Globals.URL}/user-streaks/${id}`);
                setCurrentStreak(response.data.current_streak || 0);
            } catch (error) {
                console.error("Error fetching streak ", error);
            }
        };
        fetchStreaks();
    }, [id]);

    return (
        <div className="quiz-selection">
            {/* Streak Badge - Positioned at top-right */}
            <div className="streak-badge">
                <span className="streak-emoji">🔥</span>
                <span className="streak-count">{currentStreak}</span>
            </div>

            <h1>Choose Your Quiz</h1>

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

            <button
                className="analysis-btn"
                onClick={() => navigate('/analysis', { state: { id: id } })}
            >
                Go to Analysis
            </button>
            <footer>
                <button onClick={() => window.open("https://wa.link/wh0xrv", "_blank", "noopener,noreferrer")} className="contact-me-btn">
                    contact us  for any issues or suggestions

                </button>
            </footer>
            <div className="quiz-footer" />
        </div>
    );
};

export default QUIZS;