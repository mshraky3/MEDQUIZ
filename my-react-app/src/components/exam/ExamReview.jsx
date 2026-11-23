import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import ExamNavigator, { NavLegend } from './ExamNavigator.jsx';

/** End-of-part review: answered / flagged / unanswered at a glance, then end the part or go back. */
const ExamReview = ({ summary, partNumber, partCount, isLast, onGo, onReturn, onEnd }) => {
    const t = useCopy(examCopy).review;
    const { lang } = useLang();
    const fmt = (n) => formatNumber(n, lang);
    return (
        <section className="exm-review" aria-labelledby="exm-review-title">
            <h1 id="exm-review-title" className="exm-h1">{t.title(partNumber, partCount)}</h1>
            <p className="exm-muted">{t.lead}</p>

            <div className="exm-counts">
                <span className="exm-count"><Icon name="check-circle" size={15} /> {t.answered(fmt(summary.answered))}</span>
                <span className="exm-count"><Icon name="flag" size={15} /> {t.flagged(fmt(summary.flagged))}</span>
                <span className="exm-count"><Icon name="circle" size={15} /> {t.unanswered(fmt(summary.unanswered))}</span>
            </div>

            <ExamNavigator items={summary.items} current={-1} onGo={onGo} label={t.gridLabel} />
            <NavLegend />

            <p className={`exm-note ${summary.unanswered > 0 ? 'exm-note-warn' : 'exm-note-info'}`} role="status">
                <Icon name={summary.unanswered > 0 ? 'alert-triangle' : 'check-circle'} size={16} />
                {summary.unanswered > 0 ? t.warnUnanswered(fmt(summary.unanswered)) : t.warnNone}
            </p>
            <p className="exm-muted exm-small">{t.noReturn(isLast)}</p>

            <div className="exm-actions">
                <button type="button" className="exm-btn" onClick={onReturn}>{t.returnToExam}</button>
                <button type="button" className="exm-btn exm-btn-primary" onClick={onEnd}>
                    {isLast ? t.endExam : t.endPart(fmt(partNumber))}
                </button>
            </div>
        </section>
    );
};

export default ExamReview;
