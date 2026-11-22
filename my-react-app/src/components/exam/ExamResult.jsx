import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import { SessionReviews } from '../analysis/QuizHistory.jsx';
import apiClient from '../../utils/apiClient.js';
import { getTypeLabel } from '../../utils/typeLabels';
import { formatDuration } from '../../utils/formatDuration';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import analysisCopy from '../../i18n/copy/analysis.js';

const tone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

/** The result: overall, per part, weak topics by specialty, saving state, and the review with explanations. */
const ExamResult = ({ state, score, saveStatus, onRetrySave, onNewExam }) => {
    const t = useCopy(examCopy);
    const finals = useCopy(analysisCopy).finals;
    const { lang } = useLang();
    const navigate = useNavigate();
    const fmt = (n) => formatNumber(n, lang);
    const pct = (n) => `${fmt(Math.round(n * 10) / 10)}%`;
    const label = String(state.examKey).toUpperCase();
    const isDemo = state.mode === 'demo';
    const partTotal = score.parts.length;

    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewItems, setReviewItems] = useState(null); // null | 'loading' | 'failed' | array
    const sessionId = state.saved?.sessionId;

    const toggleReview = async () => {
        if (reviewOpen) { setReviewOpen(false); return; }
        setReviewOpen(true);
        if (Array.isArray(reviewItems) || !sessionId) return;
        setReviewItems('loading');
        try {
            const res = await apiClient.get(`/final-quiz/session/${sessionId}/questions`);
            setReviewItems((res.data.questions || []).map((q) => ({
                ...q,
                answer: q.user_answer,
                extra: <ExplanationPanel explanation={q.explanation} />,
            })));
        } catch {
            setReviewItems('failed');
        }
    };

    const domainLabel = (key) => t.domains[key] || key;

    return (
        <div className="exm-result">
            <div className="exm-pick-head">
                <span className="exm-kicker">
                    <Icon name="trophy" size={14} /> <bdi>{label}</bdi>{isDemo ? ` · ${t.result.demoTag}` : ''}
                </span>
                <h1>{t.result.title}</h1>
            </div>

            <section className="exm-card exm-score-card" aria-label={t.result.overall}>
                <div className={`exm-score tone-${tone(score.percent)}`}>
                    <span className="exm-score-num"><bdi>{pct(score.percent)}</bdi></span>
                    <span className="exm-label">{t.result.overall}</span>
                </div>
                <ul className="exm-facts exm-facts-result">
                    <li>{t.result.correctOf(fmt(score.correct), fmt(score.total))}</li>
                    <li>{t.result.answered}: <b><bdi>{fmt(score.answered)}</bdi></b></li>
                    <li>{t.result.unanswered}: <b><bdi>{fmt(score.unanswered)}</bdi></b></li>
                    <li>{t.result.timeUsed}: <b><bdi>{formatDuration(score.secondsUsed)}</bdi></b></li>
                </ul>
                <p className="exm-muted exm-small">{t.result.percentNote}</p>
                {state.passMark && !isDemo && (
                    <p className="exm-muted exm-small">
                        {t.rules.passInfo(fmt(state.passMark.pass), fmt(state.passMark.scaleMin), fmt(state.passMark.scaleMax))}
                    </p>
                )}
            </section>

            {!state.confirmed && (
                <div className="exm-note exm-note-warn" role="note">
                    <Icon name="info" size={16} /> <p>{t.result.unconfirmed(label)}</p>
                </div>
            )}
            {state.notes.filter((n) => n.code === 'domain_short').map((n) => (
                <div key={n.domain} className="exm-note" role="note">
                    <Icon name="info" size={16} /> <p>{t.result.domainShort(domainLabel(n.domain), fmt(n.wanted), fmt(n.got))}</p>
                </div>
            ))}

            <div className={`exm-save is-${saveStatus}`} role="status" aria-live="polite">
                {saveStatus === 'saving' && <><Spinner size="sm" /> {t.result.saving}</>}
                {saveStatus === 'saved' && <><Icon name="check-circle" size={16} /> {t.result.saved}</>}
                {saveStatus === 'failed' && (
                    <>
                        <Icon name="alert-triangle" size={16} /> {t.result.saveFailed}
                        <button type="button" className="exm-btn exm-btn-sm" onClick={onRetrySave}>{t.result.saveRetry}</button>
                    </>
                )}
            </div>

            <section className="exm-card" aria-labelledby="exm-parts-title">
                <h2 id="exm-parts-title" className="exm-h2">{t.result.partsTitle}</h2>
                <div className="exm-parts">
                    {score.parts.map((p) => (
                        <div key={p.index} className="exm-part-row">
                            <div className="exm-part-head">
                                <strong>{t.result.part(fmt(p.index), partTotal)}</strong>
                                <span className={`exm-pill tone-${tone(p.percent)}`}><bdi>{pct(p.percent)}</bdi></span>
                            </div>
                            <p className="exm-muted exm-small">{t.result.partFacts(fmt(p.correct), fmt(p.questions), fmt(p.answered))}</p>
                            <p className="exm-muted exm-small">
                                {formatDuration(p.secondsUsed)} / {formatDuration(p.minutesAllowed * 60)}
                                {' · '}
                                {p.endedBy === 'timeout' ? t.result.endedByTimeout : t.result.endedByUser}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="exm-card" aria-labelledby="exm-topics-title">
                <h2 id="exm-topics-title" className="exm-h2">{t.result.topicsTitle}</h2>
                <p className="exm-muted exm-small">{t.result.topicsLead}</p>
                <ul className="exm-topics">
                    {score.topics.map((tp) => (
                        <li key={tp.type} className="exm-topic">
                            <div className="exm-topic-head">
                                <span>{getTypeLabel(tp.type, lang)}</span>
                                <span><bdi>{pct(tp.percent)}</bdi> <span className="exm-muted">({t.result.topicsCount(fmt(tp.correct), fmt(tp.total))})</span></span>
                            </div>
                            <div className={`exm-meter tone-${tone(tp.percent)}`} aria-hidden="true"><span style={{ width: `${tp.percent}%` }} /></div>
                        </li>
                    ))}
                </ul>
            </section>

            {isDemo && (
                <section className="exm-card exm-upsell">
                    <h2 className="exm-h2">{t.result.demoUpsellTitle}</h2>
                    <p className="exm-muted">{t.result.demoUpsellBody}</p>
                    <button type="button" className="exm-btn exm-btn-primary" onClick={() => navigate('/subscribe')}>{t.result.subscribe}</button>
                </section>
            )}

            {sessionId && (
                <section className="exm-card">
                    <button type="button" className="exm-btn" onClick={toggleReview} aria-expanded={reviewOpen}>
                        <Icon name="book-open" size={17} /> {reviewOpen ? t.result.reviewHide : t.result.reviewShow}
                    </button>
                    {reviewOpen && (
                        <div className="exm-review-list">
                            {reviewItems === 'loading' || reviewItems === null ? (
                                <div className="exm-inline"><Spinner size="sm" /> {t.result.reviewLoading}</div>
                            ) : reviewItems === 'failed' ? (
                                <p className="exm-error-text">{t.result.reviewFailed}</p>
                            ) : (
                                <SessionReviews t={finals} lang={lang} items={reviewItems} />
                            )}
                        </div>
                    )}
                </section>
            )}

            <div className="exm-actions">
                <button type="button" className="exm-btn exm-btn-primary" onClick={() => navigate('/analysis', { state: { activeTab: 'final-exams' } })}>
                    <Icon name="bar-chart" size={17} /> {t.result.history}
                </button>
                <button type="button" className="exm-btn" onClick={onNewExam}>{t.result.newExam}</button>
                <button type="button" className="exm-btn" onClick={() => navigate('/quizs?view=custom')}>{t.result.toQuizzes}</button>
            </div>
        </div>
    );
};

export default ExamResult;
