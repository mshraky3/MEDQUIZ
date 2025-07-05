import React from 'react';
import './analysis.css';

const StreakInfo = ({ streakData }) => {
    console.log("Streak Data:", streakData);
    return (
        <section className="streak-section">
            <h3 className="section-header"> Your Streaks</h3>
            {streakData ? (
                <div className="streak-cards">
                    <div className={`streak-card ${streakData.current_streak > 0 ? 'active' : ''}`}>
                        <div className="streak-label">Current Streak</div>
                        <div className="streak-value">{streakData.current_streak ?? 0}</div>
                        <div className="streak-unit">days</div>
                    </div>
                    <div className="streak-card">
                        <div className="streak-label">Longest Streak</div>
                        <div className="streak-value">{streakData.longest_streak ?? 0}</div>
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
