import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';

/**
 * The numbered grid of a part. Status is never colour alone: an answered
 * number is a filled tile with a tick, an unanswered one is hollow, a flagged
 * one carries a flag icon, the current one a heavy ring; every button also
 * says all of that in its accessible name.
 */
export const NavLegend = () => {
    const t = useCopy(examCopy).run.legend;
    return (
        <ul className="exm-legend" aria-hidden="true">
            <li><span className="exm-cell exm-cell-sample is-answered"><Icon name="check" size={11} /></span>{t.answered}</li>
            <li><span className="exm-cell exm-cell-sample" />{t.unanswered}</li>
            <li><span className="exm-cell exm-cell-sample is-flagged"><Icon name="flag" size={11} /></span>{t.flagged}</li>
            <li><span className="exm-cell exm-cell-sample is-current" />{t.current}</li>
        </ul>
    );
};

const ExamNavigator = ({ items, current, onGo, label }) => {
    const t = useCopy(examCopy).run;
    const { lang } = useLang();
    const fmt = (n) => formatNumber(n, lang);
    return (
        <div className="exm-grid" role="group" aria-label={label}>
            {items.map((it) => {
                const isCurrent = it.index === current;
                const cls = ['exm-cell', it.answered ? 'is-answered' : '', it.flagged ? 'is-flagged' : '', isCurrent ? 'is-current' : '']
                    .filter(Boolean).join(' ');
                return (
                    <button
                        key={it.index}
                        type="button"
                        className={cls}
                        onClick={() => onGo(it.index)}
                        aria-label={t.qAria(fmt(it.number), it.answered, it.flagged, isCurrent)}
                        aria-current={isCurrent ? 'true' : undefined}
                    >
                        <bdi>{fmt(it.number)}</bdi>
                        {it.answered && <span className="exm-cell-tick" aria-hidden="true"><Icon name="check" size={10} /></span>}
                        {it.flagged && <span className="exm-cell-flag" aria-hidden="true"><Icon name="flag" size={11} /></span>}
                    </button>
                );
            })}
        </div>
    );
};

export default ExamNavigator;
