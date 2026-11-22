import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import { useExamClock } from './useExamClock.js';
import { formatClock } from './examClock.js';

/**
 * Between the parts. Its own absolute deadline; when it passes the screen only
 * changes its message, because Part 2's clock starts when the student starts it.
 */
const ExamBreak = ({ state, onStart, onSkip }) => {
    const t = useCopy(examCopy);
    const { lang } = useLang();
    const fmt = (n) => formatNumber(n, lang);
    const { secondsLeft, expired } = useExamClock(state.breakDeadline);
    const finished = state.results[state.results.length - 1];
    const next = state.partIdx + 1;
    const timedOut = finished?.endedBy === 'timeout';

    return (
        <div className="exm-break">
            <div className="exm-card exm-card-narrow exm-break-card">
                <span className="exm-kicker"><Icon name="hourglass" size={14} /> {t.brk.title}</span>
                <h1>{timedOut ? t.brk.timedOut(finished.index) : t.brk.partDone(finished?.index ?? next - 1)}</h1>
                <p className="exm-muted">{t.brk.body(fmt(state.breakMinutes))}</p>

                <div className={`exm-break-clock${expired ? ' is-over' : ''}`} role="timer" aria-live="off">
                    <span className="exm-label">{t.brk.timeLeft}</span>
                    <span className="exm-clock-digits" dir="ltr">{formatClock(secondsLeft)}</span>
                </div>
                {expired && <p className="exm-note exm-note-info" role="status"><Icon name="info" size={16} /> {t.brk.over}</p>}

                <div className="exm-actions exm-actions-stack">
                    <button type="button" className="exm-btn exm-btn-primary" onClick={expired ? onStart : onSkip}>
                        <Icon name="rocket" size={17} /> {expired ? t.brk.start(next) : t.brk.skip(next)}
                    </button>
                </div>
                <p className="exm-muted exm-small">{t.brk.hiddenScore}</p>
            </div>
        </div>
    );
};

export default ExamBreak;
