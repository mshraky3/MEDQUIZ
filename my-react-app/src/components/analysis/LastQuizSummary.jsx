import React from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisShared.css';

const LastQuizSummary = ({ latest_quiz, onRefresh }) => {
    const t = useCopy(analysisCopy).lastQuiz;
    const { lang } = useLang();

    return (
        <section className="streak-section">
            <h3 className="section-header">{t.title}</h3>
            {latest_quiz?.id ? (
                <div className="questions-grid">
                    <div className="question-card">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="type-badge">
                                    <Icon name="bar-chart" size={15} /> {t.badge}
                                </span>
                                <span className="source-badge">
                                    <Icon name="book-open" size={15} /> {getSourceLabel(latest_quiz.source, lang)}
                                </span>
                                <span className="date-badge">
                                    <Icon name="calendar" size={15} /> {t.dateBadge}
                                </span>
                            </div>
                        </div>

                        <div className="question-content">
                            <div className="quiz-summary-text">
                                <h4>{t.heading}</h4>
                                <p>{t.hint}</p>
                            </div>

                            <div className="answers-section">
                                <div className="answer-row">
                                    <span className="answer-label primary">{t.total}</span>
                                    <span className="answer-text primary">{latest_quiz.total_questions ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label correct">{t.correct}</span>
                                    <span className="answer-text correct">{latest_quiz.correct_answers ?? 0}</span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label accuracy">{t.accuracy}</span>
                                    <span className="answer-text accuracy">
                                        {latest_quiz.total_questions > 0
                                            ? ((latest_quiz.correct_answers / latest_quiz.total_questions) * 100).toFixed(2)
                                            : "0.00"
                                        }%
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">{t.duration}</span>
                                    <span className="answer-text time">
                                        {latest_quiz.duration && latest_quiz.duration > 0
                                            ? t.durationValue(Math.floor(latest_quiz.duration / 60), latest_quiz.duration % 60)
                                            : t.notRecorded}
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label time">{t.avgPerQuestion}</span>
                                    <span className="answer-text time">
                                        {latest_quiz.avg_time_per_question && latest_quiz.avg_time_per_question > 0
                                            ? t.seconds(parseFloat(latest_quiz.avg_time_per_question).toFixed(1))
                                            : t.notRecorded}
                                    </span>
                                </div>

                                <div className="answer-row">
                                    <span className="answer-label topics">{t.topics}</span>
                                    <span className="answer-text topics">
                                        {latest_quiz.topics_covered && latest_quiz.topics_covered.length > 0
                                            ? latest_quiz.topics_covered.join(', ')
                                            : 'mix'}
                                    </span>
                                </div>
                            </div>

                            <div className="question-actions">
                                <button
                                    onClick={onRefresh || (() => window.location.reload())}
                                    className="see-more-button"
                                >
                                    <Icon name="refresh" size={15} /> {t.refresh}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="no-streak">{t.noPrevious}</p>
            )}
        </section>
    );
};

export default LastQuizSummary;