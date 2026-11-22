import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';

/** Rules screen, shown once the questions are in and before Part 1's clock starts. */
const ExamRules = ({ state, onBegin, onCancel }) => {
    const t = useCopy(examCopy);
    const { lang } = useLang();
    const fmt = (n) => formatNumber(n, lang);
    const label = String(state.examKey).toUpperCase();
    const parts = state.parts;
    const perPart = parts[0].minutes;
    const items = t.rules.items;
    const hasBreak = state.breakMinutes > 0 && parts.length > 1;

    return (
        <div className="exm-rules">
            <div className="exm-pick-head">
                <span className="exm-kicker">
                    <Icon name="clipboard" size={14} /> <bdi>{label}</bdi>
                    {state.mode === 'demo' ? ` · ${t.result.demoTag}` : ''}
                </span>
                <h1>{t.rules.title}</h1>
                <p>{t.rules.lead}</p>
            </div>

            {!state.confirmed && (
                <div className="exm-note exm-note-warn" role="note">
                    <Icon name="info" size={16} />
                    <div>
                        <strong>{t.pick.unconfirmedTitle}</strong>
                        <p>{t.pick.unconfirmedBody(label, fmt(state.served), parts.length, fmt(perPart))}</p>
                    </div>
                </div>
            )}
            {state.capped && state.confirmed && (
                <div className="exm-note" role="note">
                    <Icon name="info" size={16} />
                    <p>{t.pick.cappedNote(fmt(state.served), fmt(state.requested))}</p>
                </div>
            )}

            <ol className="exm-rule-list">
                <li>{items.format(fmt(state.served), parts.length, fmt(perPart))}</li>
                <li>{items.clock}</li>
                {hasBreak && <li>{items.breakRule(fmt(state.breakMinutes))}</li>}
                {parts.length > 1 && <li>{items.noBack}</li>}
                <li>{items.hardStop}</li>
                <li>{items.flag}</li>
                <li>{items.scoring}</li>
                {state.pilotUnscoredMaxPct > 0 && <li>{items.pilot}</li>}
                <li>{items.explanations}</li>
                <li>{items.tools}</li>
                <li>{items.keyboard}</li>
            </ol>

            {state.passMark && (
                <p className="exm-muted exm-small">{t.rules.passInfo(fmt(state.passMark.pass), fmt(state.passMark.scaleMin), fmt(state.passMark.scaleMax))}</p>
            )}
            <p className="exm-muted exm-small">{t.rules.disclaimer}</p>

            <div className="exm-actions">
                <button type="button" className="exm-btn exm-btn-primary" onClick={onBegin}>
                    <Icon name="rocket" size={17} /> {parts.length === 1 ? t.rules.beginSingle : t.rules.begin(1)}
                </button>
                <button type="button" className="exm-btn" onClick={onCancel}>{t.exit}</button>
            </div>
        </div>
    );
};

export default ExamRules;
