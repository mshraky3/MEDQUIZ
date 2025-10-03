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

    const quizOptions = [10, 30, 50, 100, 200];
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
        "url": "https://medquiz.vercel.app/quizs",
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
        setNumQuestions(num);
        setShowSourceSelector(true);
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

    const checkboxRef = useRef(null);

    // Check completion for a specific source and type combination
    const checkCompletion = async (type, source) => {
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
                url="https://medquiz.vercel.app/quizs"
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

                <div className="quiz-footer" />

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