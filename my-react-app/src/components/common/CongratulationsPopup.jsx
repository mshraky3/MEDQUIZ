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
            <div
                className="congratulations-popup"
                dir={dir}
                role="dialog"
                aria-modal="true"
                aria-labelledby="congratulations-title"
            >
                <div className="congratulations-header">
                    <div className="congratulations-icon"><Icon name="sparkles" size={32} /></div>
                    <h2 id="congratulations-title">{t.title}</h2>
                </div>

                <div className="congratulations-content">
                    <div className="congratulations-achievement">
                        <div className="congratulations-achievement-icon"><Icon name="trophy" size={30} /></div>
                        <h3>{achievementName}</h3>
                        <p>{achievementDescription}</p>
                    </div>

                    <div className="congratulations-scope">
                        <p>{t.completedAll}</p>
                        <div className="congratulations-chips">
                            <span className="congratulations-chip">{type}</span>
                            <span className="congratulations-chip">{source}</span>
                        </div>
                    </div>
                </div>

                <div className="congratulations-actions">
                    <button
                        type="button"
                        className="congratulations-btn congratulations-btn--primary"
                        onClick={onRestart}
                    >
                        <Icon name="refresh" size={16} /> {t.restart}
                    </button>
                    <button
                        type="button"
                        className="congratulations-btn congratulations-btn--secondary"
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
