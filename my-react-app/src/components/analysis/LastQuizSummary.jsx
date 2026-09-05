import React from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import { formatDuration } from '../../utils/formatDuration';
import './analysisPanels.css';

/**
 * One quiz's numbers.
 *
 * Was a card carrying a centred blurb and six full-width pastel bars, inside a
 * blurred panel, inside the drill that already names it. It is six figures, so
 * it is laid out as six figures.
 */
const LastQuizSummary = ({ latest_quiz, onRefresh }) => {
    const t = useCopy(analysisCopy).lastQuiz;
    const { lang } = useLang();

    if (!latest_quiz?.id) {
        return <p className="ap-empty">{t.noPrevious}</p>;
    }

    const total = latest_quiz.total_questions ?? 0;
    const correct = latest_quiz.correct_answers ?? 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const topicsCovered = latest_quiz.topics_covered?.length > 0
        ? latest_quiz.topics_covered.join('، ')
        : null;

    const figures = [
        { k: 'total', value: total, label: t.figQuestions },
        { k: 'correct', value: correct, label: t.figCorrect },
        { k: 'accuracy', value: `${accuracy}%`, label: t.figAccuracy },
        {
            k: 'duration',
            value: latest_quiz.duration > 0 ? formatDuration(latest_quiz.duration) : t.notRecorded,
            label: t.figDuration,
        },
        {
            k: 'per',
            value: latest_quiz.avg_time_per_question > 0
                ? t.seconds(parseFloat(latest_quiz.avg_time_per_question).toFixed(1))
                : t.notRecorded,
            label: t.figPerQuestion,
        },
    ];

    return (
        <div className="ap-strip">
            <div className="ap-strip-head">
                <span className="ap-badge">
                    <Icon name="book-open" size={14} /> {getSourceLabel(latest_quiz.source, lang)}
                </span>
                {topicsCovered && (
                    <span className="ap-badge"><Icon name="book" size={14} /> {topicsCovered}</span>
                )}
                <span className={`ap-acc tone-${accuracy >= 75 ? 'high' : accuracy >= 50 ? 'mid' : 'low'}`}>
                    <bdi>{accuracy}%</bdi>
                </span>
            </div>

            <div className="ap-figures">
                {figures.map((f) => (
                    <div className="ap-figure" key={f.k}>
                        <b><bdi>{f.value}</bdi></b>
                        <span>{f.label}</span>
                    </div>
                ))}
            </div>

            <div className="ap-strip-foot">
                <button
                    type="button"
                    className="ap-more"
                    onClick={onRefresh || (() => window.location.reload())}
                >
                    <Icon name="refresh" size={14} /> {t.refresh}
                </button>
            </div>
        </div>
    );
};

export default LastQuizSummary;
