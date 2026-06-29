import React, { useState, useEffect, useContext } from 'react';
import Icon from './Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import './AchievementBadges.css';

const AchievementBadges = ({ userId }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser, sessionToken } = useContext(UserContext);

    useEffect(() => {
        if (userId && user && sessionToken) {
            fetchAchievements();
        } else {
            setLoading(false);
        }
    }, [userId, user, sessionToken]);

    // Helper for protected GET requests
    const protectedGet = async (url, config = {}) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        try {
            return await axios.get(urlWithUser, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
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

    const fetchAchievements = async () => {
        try {
            const response = await protectedGet(`${Globals.URL}/api/user-achievements/${userId}`);
            setAchievements(response.data.achievements || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

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
