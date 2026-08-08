import React from 'react';
import Icon from './Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
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
    const t = useCopy(quizCopy).congrats;
    const { dir } = useLang();

    if (!isOpen) return null;

    return (
        <div className="congratulations-overlay">
            <div className="congratulations-popup" dir={dir}>
                <div className="congratulations-header">
                    <div className="celebration-icon"><Icon name="sparkles" size={40} /></div>
                    <h2>{t.title}</h2>
                </div>

                <div className="congratulations-content">
                    <div className="achievement-badge">
                        <div className="badge-icon"><Icon name="trophy" size={36} /></div>
                        <h3>{achievementName}</h3>
                        <p>{achievementDescription}</p>
                    </div>

                    <div className="achievement-details">
                        <p>{t.completedAll}</p>
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
                        <Icon name="refresh" size={16} /> {t.restart}
                    </button>
                    <button
                        className="close-button"
                        onClick={onClose}
                    >
                        <Icon name="x" size={16} /> {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongratulationsPopup;
