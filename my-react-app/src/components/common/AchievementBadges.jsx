import React, { useState, useEffect, useContext } from 'react';
import Icon from './Icon.jsx';
import apiClient from '../../utils/apiClient.js';
import { UserContext } from '../../UserContext';
import './AchievementBadges.css';

const AchievementBadges = ({ userId }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, sessionToken } = useContext(UserContext);

    useEffect(() => {
        if (!userId || !user || !sessionToken) {
            setLoading(false);
            return undefined;
        }
        const controller = new AbortController();
        (async () => {
            try {
                const response = await apiClient.get(`/api/user-achievements/${userId}`, { signal: controller.signal });
                setAchievements(response.data.achievements || []);
            } catch (error) {
                if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') return;
                console.error('Error fetching achievements:', error);
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [userId, user, sessionToken]);

    if (loading) {
        return null; // Don't show loading state for small badges
    }

    if (achievements.length === 0) {
        return null; // Don't show anything if no achievements
    }

    return (
        <div className="achievement-badges-container">
            {achievements.map((achievement) => (
                <div 
                    key={achievement.id} 
                    className="achievement-badge-small" 
                    data-type={achievement.achievement_type}
                    title={achievement.achievement_description}
                >
                    <span className="achievement-emoji">
                        <Icon name={getAchievementIcon(achievement.achievement_type)} size={22} />
                    </span>
                    <span className="achievement-text">
                        {getShortAchievementText(achievement.achievement_name)}
                    </span>
                </div>
            ))}
        </div>
    );
};

const getAchievementIcon = (type) => {
    switch (type) {
        case 'cardinality_completion':
            return 'target';
        case 'perfect_score':
            return 'star';
        case 'streak':
            return 'flame';
        default:
            return 'trophy';
    }
};

const getShortAchievementText = (achievementName) => {
    // Extract key words from achievement name
    const words = achievementName.toLowerCase().split(' ');
    
    // For cardinality completion achievements like "Master of surgery from GameBoy"
    if (words.includes('master') && words.includes('from')) {
        const typeIndex = words.indexOf('of') + 1;
        const fromIndex = words.indexOf('from');
        if (typeIndex > 0 && fromIndex > typeIndex) {
            const type = words[typeIndex];
            const source = words[fromIndex + 1];
            return `${type} ${source}`;
        }
    }
    
    // For other achievements, take first 1-3 meaningful words
    const meaningfulWords = words.filter(word => 
        !['the', 'of', 'from', 'and', 'or', 'in', 'on', 'at', 'to', 'for'].includes(word)
    );
    
    return meaningfulWords.slice(0, 3).join(' ').substring(0, 20);
};

export default AchievementBadges;
