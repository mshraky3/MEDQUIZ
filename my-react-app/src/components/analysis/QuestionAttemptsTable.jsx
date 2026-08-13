import React, { useState, useMemo, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisShared.css';

/**
 * questionAttempts is already scoped to one quiz session and carries its own
 * question fields (question_text, source, question_type, correct_option,
 * explanation) joined in server-side — see GET /question-attempts/session/:id.
 * This used to cross-reference a separately-fetched full question bank
 * (/api/all-questions, ~5,000 rows) just to label a handful of attempts.
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

    return (
        <section className="streak-section">
            <h3 className="section-header">{t.title}</h3>

            {attempts.length > 0 ? (
                <>
                    <div className="questions-grid">
                        {displayedAttempts.map((attempt, index) => {
                            const questionText = attempt.question_text || t.unknownQuestion;
                            const correctAnswer = attempt.correct_option || '—';
                            const questionSource = getSourceLabel(attempt.source, lang);
                            const questionType = attempt.question_type
                                ? getTypeLabel(attempt.question_type, lang)
                                : '';
                            const isCorrect = attempt.is_correct;
                            return (
                                <div key={attempt.id || index} className="question-card">
                                    <div className="question-header">
                                        <div className="question-meta">
                                            <span className="type-badge">
                                                <Icon name="book" size={15} /> {questionType}
                                            </span>
                                            <span className="source-badge">
                                                <Icon name="book-open" size={15} /> {questionSource}
                                            </span>
                                            <span className={`result-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                                                {isCorrect ? <><Icon name="check-circle" size={13} /> {t.correct}</> : <><Icon name="x-circle" size={13} /> {t.wrong}</>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="question-content">
                                        <div className="question-text">
                                            {questionText}
                                        </div>

                                        <div className="answers-section">
                                            <div className="answer-row">
                                                <span className="answer-label wrong">{t.yourAnswer}</span>
                                                <span className={`answer-text ${isCorrect ? 'correct' : 'wrong'}`}>
                                                    {attempt.selected_option}
                                                </span>
                                            </div>
                                            <div className="answer-row">
                                                <span className="answer-label correct">{t.correctAnswer}</span>
                                                <span className="answer-text correct">{correctAnswer}</span>
                                            </div>
                                        </div>

                                        <ExplanationPanel explanation={attempt.explanation} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {attempts.length > 5 && (
                        <div className="see-all-container">
                            <button
                                onClick={toggleShowAll}
                                className="see-all-button"
                            >
                                {showAll ? t.showLess : t.showAll(attempts.length)}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="no-streak">{t.empty}</p>
            )}

        </section>
    );
};

export default QuestionAttemptsTable;
