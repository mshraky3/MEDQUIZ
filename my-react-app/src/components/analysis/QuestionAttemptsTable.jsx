import React, { useState, useMemo, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisPanels.css';

/**
 * questionAttempts is already scoped to one quiz session and carries its own
 * question fields (question_text, source, question_type, correct_option,
 * explanation) joined in server-side — see GET /question-attempts/session/:id.
 * This used to cross-reference a separately-fetched full question bank
 * (/api/all-questions, ~5,000 rows) just to label a handful of attempts.
 *
 * Cards are the right shape here — each one is a separate question to read —
 * they only needed to stop being translucent panels inside translucent panels.
 */
const QuestionAttemptsTable = ({ questionAttempts }) => {
    const t = useCopy(analysisCopy).attempts;
    const { lang } = useLang();
    const [showAll, setShowAll] = useState(false);

    const attempts = useMemo(() => questionAttempts || [], [questionAttempts]);

    const displayedAttempts = useMemo(() => {
        return showAll ? attempts : attempts.slice(0, 5);
    }, [attempts, showAll]);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    if (attempts.length === 0) {
        return (
            <>
                <h4 className="ap-title">{t.title}</h4>
                <p className="ap-empty">{t.empty}</p>
            </>
        );
    }

    return (
        <>
            {/* Kept, unlike the other panels' headings: this drill holds two
                blocks, so they have to be told apart. */}
            <h4 className="ap-title">{t.title}</h4>

            <div className="ap-reviews">
                {displayedAttempts.map((attempt, index) => {
                    const isCorrect = attempt.is_correct;
                    return (
                        <article key={attempt.id || index} className="ap-review">
                            <div className="ap-review-head">
                                {attempt.question_type && (
                                    <span className="ap-badge">
                                        <Icon name="book" size={14} /> {getTypeLabel(attempt.question_type, lang)}
                                    </span>
                                )}
                                <span className="ap-badge">
                                    <Icon name="book-open" size={14} /> {getSourceLabel(attempt.source, lang)}
                                </span>
                                <span className={`ap-result ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                                    <Icon name={isCorrect ? 'check-circle' : 'x-circle'} size={13} />
                                    {isCorrect ? t.correct : t.wrong}
                                </span>
                            </div>

                            <div className="ap-review-body">
                                <p className="ap-question">{attempt.question_text || t.unknownQuestion}</p>

                                <div className="ap-answers">
                                    <div className={`ap-answer ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                                        <span className="ap-answer-label">{t.yourAnswer}</span>
                                        <span className="ap-answer-value">{attempt.selected_option}</span>
                                    </div>
                                    {!isCorrect && (
                                        <div className="ap-answer is-correct">
                                            <span className="ap-answer-label">{t.correctAnswer}</span>
                                            <span className="ap-answer-value">{attempt.correct_option || '—'}</span>
                                        </div>
                                    )}
                                </div>

                                <ExplanationPanel explanation={attempt.explanation} />
                            </div>
                        </article>
                    );
                })}
            </div>

            {attempts.length > 5 && (
                <div className="ap-more-wrap">
                    <button type="button" onClick={toggleShowAll} className="ap-more">
                        {showAll ? t.showLess : t.showAll(attempts.length)}
                    </button>
                </div>
            )}
        </>
    );
};

export default QuestionAttemptsTable;
