import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';

/** The facts row: questions, parts, minutes, break. Figures come from the server's exam config. */
export const ExamFacts = ({ plan, exam, t, fmt }) => {
    const parts = plan.parts || [];
    const minutes = parts.reduce((s, p) => s + p.minutes, 0);
    const perPart = parts.length > 0 ? parts[0].minutes : exam.minutesPerPart;
    return (
        <ul className="exm-facts">
            <li><b><bdi>{fmt(plan.served)}</bdi></b> {t.pick.facts.questions}</li>
            <li>{t.pick.facts.parts(parts.length)}</li>
            <li>{parts.length > 1 ? t.pick.facts.perPart(fmt(perPart)) : t.pick.facts.total(fmt(minutes))}</li>
            <li>{exam.breakMinutes > 0 && parts.length > 1 ? t.pick.facts.breakLabel(fmt(exam.breakMinutes)) : t.pick.facts.noBreak}</li>
        </ul>
    );
};

/**
 * Pick the exam. The account has one track, so one exam: SMLE, SNLE or SDLE
 * (the server decides, nothing is chosen here). A paid account starts it; a
 * free account gets the one-time demo in the same interface.
 */
const ExamPick = ({ config, onStart }) => {
    const t = useCopy(examCopy);
    const { lang } = useLang();
    const navigate = useNavigate();
    const fmt = (n) => formatNumber(n, lang);

    const { entitlement, full, demo } = config;
    const exam = full.exam;
    const label = String(exam.key).toUpperCase();
    const isFull = entitlement === 'full';
    const demoMinutes = demo.parts.reduce((s, p) => s + p.minutes, 0);

    return (
        <div className="exm-pick">
            <div className="exm-pick-head">
                <span className="exm-kicker"><Icon name="clipboard" size={14} /> {t.simulation}</span>
                <h1>{t.pick.heading}</h1>
                <p>{t.pick.lead}</p>
            </div>

            <section className="exm-card exm-exam-card" aria-labelledby="exm-exam-name">
                <div className="exm-exam-top">
                    <div>
                        <span className="exm-label">{t.pick.examLabel}</span>
                        <h2 id="exm-exam-name" className="exm-exam-name"><bdi>{label}</bdi></h2>
                    </div>
                    {!isFull && <span className="exm-chip exm-chip-lock"><Icon name="lock" size={13} /> {t.pick.subscribe}</span>}
                </div>

                <ExamFacts plan={full} exam={exam} t={t} fmt={fmt} />

                {!exam.confirmed && (
                    <div className="exm-note exm-note-warn" role="note">
                        <Icon name="info" size={16} />
                        <div>
                            <strong>{t.pick.unconfirmedTitle}</strong>
                            <p>{t.pick.unconfirmedBody(label, fmt(full.served), full.parts.length, fmt(exam.minutesPerPart))}</p>
                        </div>
                    </div>
                )}
                {full.capped && exam.confirmed && (
                    <div className="exm-note" role="note">
                        <Icon name="info" size={16} />
                        <p>{t.pick.cappedNote(fmt(full.served), fmt(exam.questions))}</p>
                    </div>
                )}

                {isFull ? (
                    <button type="button" className="exm-btn exm-btn-primary exm-btn-wide" onClick={() => onStart({ demo: false })} disabled={full.served < 1}>
                        <Icon name="rocket" size={17} /> {t.pick.startFull}
                    </button>
                ) : (
                    <>
                        <p className="exm-muted">{entitlement === 'demo_used' ? t.pick.demoUsedBody : t.pick.fullLockedBody}</p>
                        {entitlement === 'demo_used' && (
                            <div className="exm-actions">
                                <button type="button" className="exm-btn exm-btn-primary" onClick={() => navigate('/subscribe')}>{t.pick.subscribe}</button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {!isFull && entitlement !== 'demo_used' && (
                <section className="exm-card exm-demo-card" aria-labelledby="exm-demo-title">
                    <h2 id="exm-demo-title" className="exm-h2">{t.pick.demoTitle}</h2>
                    <p className="exm-muted">{t.pick.demoBody(fmt(demo.served), fmt(demoMinutes))}</p>
                    <div className="exm-actions">
                        <button type="button" className="exm-btn exm-btn-primary" onClick={() => onStart({ demo: true })} disabled={demo.served < 1}>
                            {entitlement === 'demo_resume' ? t.pick.resumeDemo : t.pick.startDemo}
                        </button>
                        <button type="button" className="exm-btn" onClick={() => navigate('/subscribe')}>{t.pick.subscribe}</button>
                    </div>
                </section>
            )}

            <p className="exm-pick-foot"><Link to="/quizs?view=custom" className="exm-link">{t.pick.backToQuizzes}</Link></p>
        </div>
    );
};

export default ExamPick;
