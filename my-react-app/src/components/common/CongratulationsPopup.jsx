import React from 'react';
import Icon from './Icon.jsx';
import './CongratulationsPopup.css';

const CongratulationsPopup = ({ 
    isOpen, 
    onClose, 
    onRestart, 
    achievementName, 
    achievementDescription,
    type,
    source 
}) => {
    if (!isOpen) return null;

    return (
        <div className="congratulations-overlay">
            <div className="congratulations-popup">
                <div className="congratulations-header">
                    <div className="celebration-icon"><Icon name="sparkles" size={40} /></div>
                    <h2>Congratulations!</h2>
                </div>
                
                <div className="congratulations-content">
                    <div className="achievement-badge">
                        <div className="badge-icon"><Icon name="trophy" size={36} /></div>
                        <h3>{achievementName}</h3>
                        <p>{achievementDescription}</p>
                    </div>
                    
                    <div className="achievement-details">
                        <p>You've completed all questions from:</p>
                        <div className="cardinality-info">
                            <span className="type-badge">{type}</span>
                            <span className="source-badge">{source}</span>
                        </div>
                    </div>
                </div>
                
                <div className="congratulations-actions">
                    <button 
                        className="restart-button"
                        onClick={onRestart}
                    >
                        <Icon name="refresh" size={16} /> Restart & Start Again
                    </button>
                    <button 
                        className="close-button"
                        onClick={onClose}
                    >
                        <Icon name="x" size={16} /> Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongratulationsPopup;
