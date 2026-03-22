import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global.js';

const StreakInfo = ({ streakData, userId, isTrial }) => {
    const [trialStreakData, setTrialStreakData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStreakData = async () => {
            if (isTrial) {
                // For trial users, show no streak data
                setTrialStreakData(null);
                setLoading(false);
                return;
            }

            if (userId && !streakData) {
                // Only fetch if we don't have streakData and we have a userId
                setLoading(true);
                try {
                    const res = await axios.get(`${Globals.URL}/user-streaks/${userId}`);
                    setTrialStreakData(res.data);
                } catch (error) {
                    console.error('Error fetching streak data:', error);
                    setTrialStreakData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStreakData();
    }, [userId, isTrial, streakData]);

    // Use provided streakData if available (normal accounts), otherwise use fetched data (trial accounts)
    const data = streakData || trialStreakData;

    if (loading) {
        return (
            <section className="streak-section">
                <h3 className="section-header">Your Streaks</h3>
                <div className="loading">Loading streak data...</div>
            </section>
        );
    }

    return (
        <section className="streak-section">
            <h3 className="section-header">Your Streaks</h3>
            {isTrial ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge" style={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white'
                                }}>
                                    ⭐ Trial Mode
                                </span>
                            </div>
                        </div>
                        
                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>Streak Tracking Available</h4>
                                <p>Track your daily learning streaks with full access!</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label accuracy">Feature:</span>
                                    <span className="answer-text accuracy">Daily Streak Tracking</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label primary">Status:</span>
                                    <span className="answer-text primary">Available with Full Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : data ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge" style={{
                                    background: data.current_streak > 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                    color: 'white'
                                }}>
                                    🔥 Current Streak
                                </span>
                                <span className="accuracy-badge" style={{
                                    background: data.current_streak > 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                    color: 'white'
                                }}>
                                    ⏱️ {data.current_streak ?? 0} days
                                </span>
                            </div>
                        </div>
                        
                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>Keep Going!</h4>
                                <p>{data.current_streak > 0 ? 'You\'re on fire! Keep up the momentum!' : 'Start a new streak today!'}</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label correct">Current Streak:</span>
                                    <span className="answer-text correct">{data.current_streak ?? 0} days</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label accuracy">Status:</span>
                                    <span className="answer-text accuracy">{data.current_streak > 0 ? 'Active' : 'No active streak'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge" style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: 'white'
                                }}>
                                    🏆 Longest Streak
                                </span>
                                <span className="accuracy-badge" style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: 'white'
                                }}>
                                    📈 {data.longest_streak ?? 0} days
                                </span>
                            </div>
                        </div>
                        
                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>Personal Best</h4>
                                <p>Your longest learning streak so far!</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">Longest Streak:</span>
                                    <span className="answer-text primary">{data.longest_streak ?? 0} days</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label accuracy">Achievement:</span>
                                    <span className="answer-text accuracy">{data.longest_streak > 0 ? 'Great consistency!' : 'Start your first streak'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge" style={{
                                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                    color: 'white'
                                }}>
                                    📊 No Streak Data
                                </span>
                            </div>
                        </div>
                        
                        <div className="question-content">
                            <div className="topic-performance-text">
                                <h4>Start Your Streak Today!</h4>
                                <p>Complete your first quiz to begin tracking your learning streak!</p>
                            </div>
                            
                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label wrong">Current Status:</span>
                                    <span className="answer-text wrong">No streak started</span>
                                </div>
                                
                                <div className="answer-row">
                                    <span className="answer-label primary">Next Step:</span>
                                    <span className="answer-text primary">Take a quiz to begin!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default StreakInfo;
