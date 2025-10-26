import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './QUIZS.css';
import Globals from '../../global.js';
import SEO from '../common/SEO';
import Navbar from '../common/Navbar.jsx';
import AchievementBadges from '../common/AchievementBadges.jsx';
import CongratulationsPopup from '../common/CongratulationsPopup.jsx';
import { UserContext } from '../../UserContext';

const QUIZS = () => {
    const { user, setUser, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const id = user?.id || location.state?.id || location.state?.user?.id;
    const isTrial = location.state?.isTrial || false;
    const [currentStreak, setCurrentStreak] = useState(0);
    const [showSourceSelector, setShowSourceSelector] = useState(false);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [numQuestions, setNumQuestions] = useState(10);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [congratulationsData, setCongratulationsData] = useState(null);
    const [showTimerSelector, setShowTimerSelector] = useState(false);
    const [selectedTimer, setSelectedTimer] = useState(null);
    const [customTimerMinutes, setCustomTimerMinutes] = useState(15);
    const [showCustomQuestions, setShowCustomQuestions] = useState(false);
    const [customQuestionsCount, setCustomQuestionsCount] = useState(25);
    const [showFinalQuizType, setShowFinalQuizType] = useState(false);
    const [showFinalQuizSource, setShowFinalQuizSource] = useState(false);
    const [showFinalQuizTime, setShowFinalQuizTime] = useState(false);
    const [selectedFinalType, setSelectedFinalType] = useState('');
    const [selectedFinalSource, setSelectedFinalSource] = useState('');
    const [finalQuizQuestionsCount, setFinalQuizQuestionsCount] = useState(0);
    const [finalQuizTimeLimit, setFinalQuizTimeLimit] = useState(30);

    const quizOptions = [10, 50, 'custom'];
    const availableSources = [
        'general',
        'Midgard',
        'GameBoy'
    ];
    const availableTypes = [
        'pediatric',
        'obstetrics and gynecology',
        'medicine',
        'surgery'
    ];
    const timerOptions = [
        { label: '5 minutes', value: 5 },
        { label: '10 minutes', value: 10 },
        { label: '30 minutes', value: 30 },
        { label: '1 hour', value: 60 },
        { label: 'Custom', value: 'custom' }
    ];

    // SEO structured data for quiz selection page
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SMLE Quiz Selection - Choose Your Practice Questions",
        "description": "Select from 10 to 200 SMLE practice questions. Choose specific medical topics or mix all types. Start your SMLE preparation with targeted practice sessions.",
        "url": `${Globals.URL}/quizs`,
        "mainEntity": {
            "@type": "EducationalService",
            "name": "SMLE Quiz Selection",
            "description": "Choose your SMLE practice quiz with customizable question counts and topic selection",
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock"
            }
        }
    };

    const handleOptionClick = (num) => {
        if (num === 'custom') {
            setShowCustomQuestions(true);
        } else {
            setNumQuestions(num);
            setShowSourceSelector(true);
        }
    };

    const handleSourceSelect = async (source) => {
        setSelectedSource(source);
        setShowSourceSelector(false);
        setShowTypeSelector(true);
        
        // Check if user has completed this source for any type
        if (!isTrial && id) {
            await checkCompletionForSource(source);
        }
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
        setShowTypeSelector(false);
        setShowTimerSelector(true);
    };

    const handleTimerSelect = (timer) => {
        setSelectedTimer(timer);
    };

    const handleTimerConfirm = () => {
        console.log('Timer confirm clicked, selectedTimer:', selectedTimer);
        console.log('selectedTypes:', selectedTypes);
        console.log('numQuestions:', numQuestions);
        
        if (selectedTimer === undefined) {
            console.log('No timer selected, returning');
            return;
        }
        
        // Handle the case where user came from "Mix All Types"
        const typesStr = selectedTypes.length > 0 ? selectedTypes.join(',') : 'mix';
        let timerMinutes = selectedTimer === 'custom' ? customTimerMinutes : selectedTimer;
        
        console.log('Types string:', typesStr);
        console.log('Timer minutes:', timerMinutes);
        
        setShowTimerSelector(false);
        
        // Use different routes for trial vs regular users
        const quizRoute = isTrial ? `/temp-quiz/${numQuestions}` : `/quiz/${numQuestions}`;
        console.log('Navigating to:', quizRoute);
        
        navigate(quizRoute, {
            state: { 
                id: id, 
                types: typesStr,
                source: selectedSource,
                isTrial: isTrial,
                timer: timerMinutes
            }
        });
    };

    const handleMixAll = () => {
        setShowTypeSelector(false);
        setShowTimerSelector(true);
    };

    const handleCustomQuestionsConfirm = () => {
        if (customQuestionsCount < 1 || customQuestionsCount > 500) {
            alert('Please enter a number between 1 and 500');
            return;
        }
        setNumQuestions(customQuestionsCount);
        setShowCustomQuestions(false);
        setShowSourceSelector(true);
    };

    // Final Quiz handlers
    const handleFinalQuizClick = () => {
        setShowFinalQuizType(true);
    };

    const handleFinalTypeSelect = (type) => {
        setSelectedFinalType(type);
        setShowFinalQuizType(false);
        setShowFinalQuizSource(true);
    };

    const handleFinalSourceSelect = async (source) => {
        setSelectedFinalSource(source);
        
        // Check authentication before making API call
        if (!user || !sessionToken) {
            console.error('Not authenticated for final source select');
            setFinalQuizQuestionsCount(0);
            setShowFinalQuizSource(false);
            return;
        }
        
        // Fetch questions count for the selected criteria
        try {
            const response = await protectedGet(
                `${Globals.URL}/final-quiz/questions-count?questionType=${encodeURIComponent(selectedFinalType)}&source=${encodeURIComponent(source)}`
            );
            setFinalQuizQuestionsCount(response.data.totalQuestions);
        } catch (error) {
            console.error('Error fetching questions count:', error);
            setFinalQuizQuestionsCount(0);
        }
        
        setShowFinalQuizSource(false);
        setShowFinalQuizTime(true);
    };

    const handleFinalTimeSelect = (timeLimit) => {
        setFinalQuizTimeLimit(timeLimit);
        setShowFinalQuizTime(false);
        
        // Navigate to regular quiz with final quiz parameters
        navigate(`/quiz/${finalQuizQuestionsCount}`, {
            state: { 
                id: id,
                types: selectedFinalType,
                source: selectedFinalSource,
                timer: timeLimit,
                isTrial: isTrial,
                isFinalQuiz: true
            }
        });
    };

    const handleFinalTimeConfirm = () => {
        if (finalQuizTimeLimit < 30) {
            alert('Time limit must be at least 30 minutes');
            return;
        }
        
        setShowFinalQuizTime(false);
        
        // Navigate to regular quiz with final quiz parameters
        navigate(`/quiz/${finalQuizQuestionsCount}`, {
            state: { 
                id: id,
                types: selectedFinalType,
                source: selectedFinalSource,
                timer: finalQuizTimeLimit,
                isTrial: isTrial,
                isFinalQuiz: true
            }
        });
    };

    const checkboxRef = useRef(null);

    // Check completion for a specific source and type combination
    const checkCompletion = async (type, source) => {
        // Check authentication before making API call
        if (!user || !sessionToken) {
            console.error('Not authenticated for check completion');
            return;
        }
        
        try {
            const response = await protectedGet(`${Globals.URL}/api/check-completion/${id}?type=${encodeURIComponent(type)}&source=${encodeURIComponent(source)}`);
            const { isCompleted, total, completed } = response.data;
            
            if (isCompleted && total > 0) {
                // Award achievement if not already awarded
                await awardAchievement(type, source);
                
                // Show congratulations popup
                setCongratulationsData({
                    type,
                    source,
                    total,
                    completed
                });
                setShowCongratulations(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking completion:', error);
            return false;
        }
    };

    // Check completion for all types in a source
    const checkCompletionForSource = async (source) => {
        for (const type of availableTypes) {
            const isCompleted = await checkCompletion(type, source);
            if (isCompleted) {
                break; // Only show one popup at a time
            }
        }
    };

    // Award achievement for completing a cardinality
    const awardAchievement = async (type, source) => {
        // Check authentication before making API call
        if (!user || !sessionToken) {
            console.error('Not authenticated for award achievement');
            return;
        }
        
        try {
            const achievementKey = `${type}_${source}`;
            const achievementName = `Master of ${type} from ${source}`;
            const achievementDescription = `Completed all ${type} questions from ${source} source`;
            
            await protectedPost(`${Globals.URL}/api/award-achievement`, {
                userId: id,
                achievementType: 'cardinality_completion',
                achievementKey,
                achievementName,
                achievementDescription
            });
        } catch (error) {
            console.error('Error awarding achievement:', error);
        }
    };

    // Handle restart and reset progress
    const handleRestart = async () => {
        if (!congratulationsData) return;
        
        // Check authentication before making API call
        if (!user || !sessionToken) {
            console.error('Not authenticated for reset progress');
            return;
        }
        
        try {
            await protectedPost(`${Globals.URL}/api/reset-progress`, {
                userId: id,
                type: congratulationsData.type,
                source: congratulationsData.source
            });
            
            setShowCongratulations(false);
            setCongratulationsData(null);
            
            // Refresh the page or component to show updated state
            window.location.reload();
        } catch (error) {
            console.error('Error resetting progress:', error);
        }
    };

    // Handle close congratulations popup
    const handleCloseCongratulations = () => {
        setShowCongratulations(false);
        setCongratulationsData(null);
    };

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

    // Helper for protected GET
    const protectedGet = async (url, config = {}) => {
      if (!user || !sessionToken) throw new Error('Not authenticated');
      const urlWithCreds = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}&sessionToken=${encodeURIComponent(sessionToken)}`;
      try {
        return await axios.get(urlWithCreds, config);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setUser(null, null);
          localStorage.clear();
          window.location.href = '/login?session=expired';
          return;
        }
        throw err;
      }
    };

    // Helper for protected POST
    const protectedPost = async (url, data, config = {}) => {
      if (!user || !sessionToken) throw new Error('Not authenticated');
      const urlWithCreds = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}&sessionToken=${encodeURIComponent(sessionToken)}`;
      try {
        return await axios.post(urlWithCreds, data, config);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setUser(null, null);
          localStorage.clear();
          window.location.href = '/login?session=expired';
          return;
        }
        throw err;
      }
    };

    useEffect(() => {
        const fetchStreaks = async () => {
            if (!id || isTrial) return; // Don't fetch streaks for trial users
            if (!user || !sessionToken) return; // Don't fetch if not authenticated
            try {
                const response = await protectedGet(`${Globals.URL}/user-streaks/${id}`);
                setCurrentStreak(response.data.current_streak || 0);
            } catch (error) {
                console.error("Error fetching streak", error);
            }
        };
        fetchStreaks();
    }, [id, isTrial, user, sessionToken, setUser]);

    return (
        <>
            <Navbar />
            <SEO 
                title="Quiz Selection - Choose Your SMLE Practice Questions"
                description="Select from 10 to 200 SMLE practice questions. Choose specific medical topics (pediatrics, OB/GYN, medicine, surgery) or mix all types. Start your SMLE preparation with targeted practice sessions."
                keywords="SMLE quiz selection, medical practice questions, SMLE practice test, medical exam questions, Saudi medical license quiz, medical topic selection"
                url={`${Globals.URL}/quizs`}
                structuredData={structuredData}
            />
                <div className="quiz-selection">
                {/* Streak Badge - Only show for non-trial users */}
                {!isTrial && (
                    <div className="streak-badge">
                        <span className="streak-emoji">🔥</span>
                        <span className="streak-count">{currentStreak}</span>
                    </div>
                )}

                {/* Achievement Badges - Only show for non-trial users */}
                {!isTrial && <AchievementBadges userId={id} />}

                {/* Trial User Notice */}
                {isTrial && (
                    <div className="trial-notice">
                        <span className="trial-emoji">🎯</span>
                        <span className="trial-text">Free Trial Mode - 40+ Sample Questions Available</span>
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
                            {num === 'custom' ? 'Custom Number' : `${num} Questions`}
                        </button>
                    ))}
                    {!isTrial && user && sessionToken && (
                        <button
                            className="quiz-option-btn final-quiz-btn"
                            onClick={handleFinalQuizClick}
                        >
                            🎯 Final Quiz
                        </button>
                    )}
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


                {/* Source Selector Modal */}
                {showSourceSelector && (
                    <div className="custom-source-selector-modal">
                        <div className="custom-modal-content">
                            <h2>Select Question Source</h2>
                            {isTrial && (
                                <p className="trial-modal-notice">
                                    🎯 Free trial includes questions from all sources
                                </p>
                            )}
                            <div className="custom-source-buttons">
                                {availableSources.map((source) => (
                                    <button
                                        key={source}
                                        onClick={() => handleSourceSelect(source)}
                                        className="custom-source-btn"
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            <div className="custom-modal-buttons">
                                <button onClick={() => setShowSourceSelector(false)} className="custom-cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Type Selector Modal */}
                {showTypeSelector && (
                    <div className="custom-type-selector-modal">
                        <div className="custom-modal-content">
                            <h2>Select Question Types</h2>
                            <p className="source-info">
                                📚 Source: <strong>{selectedSource}</strong>
                            </p>
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
                                    Back to Source
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timer Selector Modal */}
                {showTimerSelector && (
                    <div className="custom-timer-selector-modal">
                        <div className="custom-modal-content">
                            <h2>Set Quiz Timer</h2>
                            <p className="timer-info">
                                ⏰ Choose a timer duration or select "No Timer" for unlimited time
                            </p>
                            <div className="timer-options">
                                <button
                                    className={`timer-option-btn ${selectedTimer === null ? 'selected' : ''}`}
                                    onClick={() => handleTimerSelect(null)}
                                >
                                    No Timer
                                </button>
                                {timerOptions.map((timer) => (
                                    <button
                                        key={timer.value}
                                        className={`timer-option-btn ${selectedTimer === timer.value ? 'selected' : ''}`}
                                        onClick={() => handleTimerSelect(timer.value)}
                                    >
                                        {timer.label}
                                    </button>
                                ))}
                            </div>
                            {selectedTimer === 'custom' && (
                                <div className="custom-timer-input">
                                    <label htmlFor="customMinutes">Custom Duration (minutes):</label>
                                    <input
                                        id="customMinutes"
                                        type="number"
                                        min="1"
                                        max="180"
                                        value={customTimerMinutes}
                                        onChange={(e) => setCustomTimerMinutes(parseInt(e.target.value) || 15)}
                                        className="custom-timer-number-input"
                                    />
                                </div>
                            )}
                            <div className="custom-modal-buttons">
                                <button
                                    onClick={handleTimerConfirm}
                                    className="custom-start-btn"
                                >
                                    Start Quiz
                                </button>
                                <button onClick={() => setShowTimerSelector(false)} className="custom-cancel-btn">
                                    Back to Types
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Questions Modal */}
                {showCustomQuestions && (
                    <div className="custom-questions-modal">
                        <div className="custom-modal-content">
                            <h2>Custom Number of Questions</h2>
                            <p className="questions-info">
                                📝 Enter the number of questions you want (1-500)
                            </p>
                            
                            {/* Mobile-friendly input with preset buttons */}
                            <div className="custom-questions-input">
                                <label htmlFor="customQuestions">Number of Questions:</label>
                                
                                {/* Quick preset buttons for mobile */}
                                <div className="quick-preset-buttons">
                                    <button 
                                        type="button"
                                        className="preset-btn"
                                        onClick={() => setCustomQuestionsCount(15)}
                                    >
                                        15
                                    </button>
                                    <button 
                                        type="button"
                                        className="preset-btn"
                                        onClick={() => setCustomQuestionsCount(25)}
                                    >
                                        25
                                    </button>
                                    <button 
                                        type="button"
                                        className="preset-btn"
                                        onClick={() => setCustomQuestionsCount(50)}
                                    >
                                        50
                                    </button>
                                    <button 
                                        type="button"
                                        className="preset-btn"
                                        onClick={() => setCustomQuestionsCount(75)}
                                    >
                                        75
                                    </button>
                                </div>
                                
                                <div className="input-container">
                                    <input
                                        id="customQuestions"
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={customQuestionsCount}
                                        onChange={(e) => setCustomQuestionsCount(parseInt(e.target.value) || 25)}
                                        className="custom-questions-number-input"
                                        placeholder="Enter number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    />
                                    <div className="input-controls">
                                        <button 
                                            type="button"
                                            className="control-btn minus"
                                            onClick={() => setCustomQuestionsCount(Math.max(1, customQuestionsCount - 1))}
                                        >
                                            −
                                        </button>
                                        <button 
                                            type="button"
                                            className="control-btn plus"
                                            onClick={() => setCustomQuestionsCount(Math.min(500, customQuestionsCount + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Range slider for mobile */}
                                <div className="range-slider-container">
                                    <label htmlFor="questionsRange">Or use slider:</label>
                                    <input
                                        id="questionsRange"
                                        type="range"
                                        min="1"
                                        max="500"
                                        value={customQuestionsCount}
                                        onChange={(e) => setCustomQuestionsCount(parseInt(e.target.value))}
                                        className="questions-range-slider"
                                    />
                                    <div className="range-labels">
                                        <span>1</span>
                                        <span>250</span>
                                        <span>500</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="custom-modal-buttons">
                                <button
                                    onClick={handleCustomQuestionsConfirm}
                                    className="custom-start-btn"
                                >
                                    Continue
                                </button>
                                <button 
                                    onClick={() => setShowCustomQuestions(false)} 
                                    className="custom-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="quiz-footer" />

                {/* Final Quiz Type Selection Modal */}
                {showFinalQuizType && (
                    <div className="custom-source-selector-modal">
                        <div className="custom-modal-content">
                            <h2>🎯 Final Quiz - Select Question Type</h2>
                            <p className="final-quiz-description">
                                Comprehensive review with all questions from selected criteria
                            </p>
                            <div className="custom-source-buttons">
                                {availableTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleFinalTypeSelect(type)}
                                        className="custom-source-btn"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <div className="custom-modal-buttons">
                                <button
                                    onClick={() => setShowFinalQuizType(false)}
                                    className="custom-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Final Quiz Source Selection Modal */}
                {showFinalQuizSource && (
                    <div className="custom-source-selector-modal">
                        <div className="custom-modal-content">
                            <h2>🎯 Final Quiz - Select Source</h2>
                            <p className="final-quiz-description">
                                Choose the source for {selectedFinalType} questions
                            </p>
                            <div className="custom-source-buttons">
                                {availableSources.map((source) => (
                                    <button
                                        key={source}
                                        onClick={() => handleFinalSourceSelect(source)}
                                        className="custom-source-btn"
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            <div className="custom-modal-buttons">
                                <button
                                    onClick={() => setShowFinalQuizSource(false)}
                                    className="custom-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Final Quiz Time Selection Modal */}
                {showFinalQuizTime && (
                    <div className="custom-timer-selector-modal">
                        <div className="custom-modal-content">
                            <h2>🎯 Final Quiz - Set Time Limit</h2>
                            <p className="final-quiz-description">
                                {finalQuizQuestionsCount} questions available from {selectedFinalType} - {selectedFinalSource}
                            </p>
                            <p className="final-quiz-note">
                                This will include ALL questions, even those you've answered before.
                            </p>
                            
                            <div className="timer-options">
                                <button
                                    onClick={() => handleFinalTimeSelect(30)}
                                    className="timer-option-btn"
                                >
                                    30 minutes
                                </button>
                                <button
                                    onClick={() => handleFinalTimeSelect(60)}
                                    className="timer-option-btn"
                                >
                                    1 hour
                                </button>
                                <button
                                    onClick={() => handleFinalTimeSelect(90)}
                                    className="timer-option-btn"
                                >
                                    1.5 hours
                                </button>
                                <button
                                    onClick={() => handleFinalTimeSelect(120)}
                                    className="timer-option-btn"
                                >
                                    2 hours
                                </button>
                            </div>

                            <div className="custom-timer-input">
                                <label htmlFor="finalQuizTime">Or set custom time (minimum 30 minutes):</label>
                                <div className="timer-input-container">
                                    <input
                                        id="finalQuizTime"
                                        type="number"
                                        min="30"
                                        max="300"
                                        value={finalQuizTimeLimit}
                                        onChange={(e) => setFinalQuizTimeLimit(parseInt(e.target.value) || 30)}
                                        className="custom-timer-number-input"
                                        placeholder="Enter minutes"
                                    />
                                    <span className="time-unit">minutes</span>
                                </div>
                            </div>

                            <div className="custom-modal-buttons">
                                <button
                                    onClick={handleFinalTimeConfirm}
                                    className="custom-start-btn"
                                >
                                    Start Final Quiz
                                </button>
                                <button
                                    onClick={() => setShowFinalQuizTime(false)}
                                    className="custom-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Congratulations Popup */}
                <CongratulationsPopup
                    isOpen={showCongratulations}
                    onClose={handleCloseCongratulations}
                    onRestart={handleRestart}
                    achievementName={congratulationsData ? `Master of ${congratulationsData.type} from ${congratulationsData.source}` : ''}
                    achievementDescription={congratulationsData ? `You've completed all ${congratulationsData.type} questions from ${congratulationsData.source} source!` : ''}
                    type={congratulationsData?.type || ''}
                    source={congratulationsData?.source || ''}
                />
            </div>
        </>
    );
};

export default QUIZS;