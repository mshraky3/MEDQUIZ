import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './QuizComplete.css';

/**
 * Shown when the user has answered every question in the selected category
 * (type + source). A question never repeats until its whole category is
 * finished, so reaching here means the topic is fully covered.
 */
const QuizComplete = ({ sourceLabel, total, onRestart, onBack, resetting }) => {
    const t = useCopy(quizCopy).complete;
    const { lang, dir } = useLang();

    return (
        <div className="quiz-complete-wrap" dir={dir}>
            <div className="quiz-complete-card">
                <div className="quiz-complete-icon"><Icon name="trophy" size={44} /></div>
                <h2>{t.title}</h2>
                <p className="quiz-complete-msg">
                    {t.bodyBefore} <strong>{sourceLabel}</strong> {t.bodyAfter}
                </p>

                {total > 0 && (
                    <div className="quiz-complete-stat">
                        <span className="quiz-complete-stat-num">{formatNumber(total, lang)}</span>
                        <span className="quiz-complete-stat-label">{t.statLabel}</span>
                    </div>
                )}

                <div className="quiz-complete-actions">
                    <button
                        className="quiz-complete-restart"
                        onClick={onRestart}
                        disabled={resetting}
                    >
                        {resetting
                            ? <><Icon name="refresh" size={16} className="spin" /> {t.restarting}</>
                            : <><Icon name="refresh" size={16} /> {t.restart}</>}
                    </button>
                    <button className="quiz-complete-back" onClick={onBack} disabled={resetting}>
                        {t.back}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizComplete;
