import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global';

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
                <div className="trial-streak-notice">
                    <span className="trial-emoji">⭐</span>
                    <span className="trial-text">Streak tracking available with full access</span>
                </div>
            ) : data ? (
                <div className="streak-cards">
                    <div className={`streak-card ${data.current_streak > 0 ? 'active' : ''}`}>
                        <div className="streak-label">Current Streak</div>
                        <div className="streak-value">{data.current_streak ?? 0}</div>
                        <div className="streak-unit">days</div>
                    </div>
                    <div className="streak-card">
                        <div className="streak-label">Longest Streak</div>
                        <div className="streak-value">{data.longest_streak ?? 0}</div>
                        <div className="streak-unit">days</div>
                    </div>
                </div>
            ) : (
                <p className="no-streak">No streak data available. Complete your first quiz to start a streak!</p>
            )}
        </section>
    );
};

export default StreakInfo;
