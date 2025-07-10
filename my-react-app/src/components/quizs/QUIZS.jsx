import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './QUIZS.css';
import Globals from '../../global';

const QUIZS = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id || location.state?.user?.id;
    const isTrial = location.state?.isTrial || false;
    const [currentStreak, setCurrentStreak] = useState(0);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [numQuestions, setNumQuestions] = useState(10);

    const quizOptions = [10, 30, 50, 100, 200];
    const availableTypes = [
        'pediatric',
        'obstetrics and gynecology',
        'medicine',
        'surgery'
    ];

    const handleOptionClick = (num) => {
        setNumQuestions(num);
        setShowTypeSelector(true);
    };

    const handleCheckboxChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    const handleStartQuiz = () => {
        if (selectedTypes.length === 0) return;
        const typesStr = selectedTypes.join(',');
        setShowTypeSelector(false);
        navigate(`/quiz/${numQuestions}`, {
            state: { 
                id: id, 
                types: typesStr,
                isTrial: isTrial 
            }
        });
    };

    const handleMixAll = () => {
        setShowTypeSelector(false);
        navigate(`/quiz/${numQuestions}`, {
            state: { 
                id: id, 
                types: 'mix',
                isTrial: isTrial 
            }
        });
    };

    const checkboxRef = useRef(null);

    useEffect(() => {
        const applyCustomCheckboxes = () => {
            const labels = document.querySelectorAll('.custom-checkbox-group label');
            labels.forEach(label => {
                let checkbox = label.querySelector('input[type="checkbox"]');
                if (!checkbox) return;

                let customBox = label.querySelector('.checkbox-custom');
                if (!customBox) {
                    customBox = document.createElement('span');
                    customBox.classList.add('checkbox-custom');
                    label.insertBefore(customBox, checkbox);
                }

                // Set initial state
                if (checkbox.checked) {
                    customBox.classList.add('checked');
                } else {
                    customBox.classList.remove('checked');
                }

                // Update on change
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        customBox.classList.add('checked');
                    } else {
                        customBox.classList.remove('checked');
                    }
                });
            });
        };

        if (showTypeSelector) {
            applyCustomCheckboxes();
        }
    }, [showTypeSelector, selectedTypes]);

    useEffect(() => {
        const fetchStreaks = async () => {
            if (!id || isTrial) return; // Don't fetch streaks for trial users
            try {
                const response = await axios.get(`${Globals.URL}/user-streaks/${id}`);
                setCurrentStreak(response.data.current_streak || 0);
            } catch (error) {
                console.error("Error fetching streak", error);
            }
        };
        fetchStreaks();
    }, [id, isTrial]);

    return (
        <div className="quiz-selection">
            {/* Streak Badge - Only show for non-trial users */}
            {!isTrial && (
                <div className="streak-badge">
                    <span className="streak-emoji">🔥</span>
                    <span className="streak-count">{currentStreak}</span>
                </div>
            )}

            {/* Trial User Notice */}
            {isTrial && (
                <div className="trial-notice">
                    <span className="trial-emoji">🎯</span>
                    <span className="trial-text">Free Trial Mode - 40 Sample Questions</span>
                </div>
            )}

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

            {/* Analysis button - Only show for non-trial users */}
            {!isTrial && (
                <button
                    className="analysis-btn"
                    onClick={() => navigate('/analysis', { state: { id: id } })}
                >
                    Go to Analysis
                </button>
            )}

            <footer>
                <button
                    onClick={() => window.open("https://wa.link/wh0xrv ", "_blank", "noopener,noreferrer")}
                    className="contact-me-btn"
                >
                    Contact us for any issues or suggestions
                </button>
            </footer>

            {/* Type Selector Modal */}
            {showTypeSelector && (
                <div className="custom-type-selector-modal">
                    <div className="custom-modal-content">
                        <h2>Select Question Types</h2>
                        {isTrial && (
                            <p className="trial-modal-notice">
                                🎯 Free trial includes questions from all selected types
                            </p>
                        )}
                        <div className="custom-checkbox-group">
                            {availableTypes.map((type) => (
                                <label key={type}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleCheckboxChange(type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                        <div className="custom-modal-buttons">
                            <button
                                onClick={handleStartQuiz}
                                disabled={selectedTypes.length === 0}
                                className="custom-start-btn"
                            >
                                Start Selected
                            </button>
                            <button onClick={handleMixAll} className="custom-mix-btn">
                                Mix All Types
                            </button>
                            <button onClick={() => setShowTypeSelector(false)} className="custom-cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="quiz-footer" />
        </div>
    );
};

export default QUIZS;