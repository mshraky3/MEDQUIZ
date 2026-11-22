import React, { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import { initialCalc, pressKey } from './calcEngine.js';
import { LAB_GROUPS } from './labValues.js';

/**
 * A side panel on tablets and desktops, a bottom sheet on phones. Escape or the
 * scrim closes it; focus moves in on open and back to the opener on close.
 */
export const Drawer = ({ open, title, onClose, closeLabel, children, wide = false }) => {
    const panel = useRef(null);
    const opener = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        opener.current = document.activeElement;
        panel.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
        };
        document.addEventListener('keydown', onKey, true);
        return () => {
            document.removeEventListener('keydown', onKey, true);
            if (opener.current && typeof opener.current.focus === 'function') opener.current.focus();
        };
    }, [open, onClose]);

    if (!open) return null;
    return (
        <>
            <div className="exm-scrim" onClick={onClose} aria-hidden="true" />
            <aside
                ref={panel}
                tabIndex={-1}
                className={`exm-drawer${wide ? ' is-wide' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="exm-drawer-head">
                    <h2>{title}</h2>
                    <button type="button" className="exm-icon-btn" onClick={onClose} aria-label={closeLabel}>
                        <Icon name="x" size={18} />
                    </button>
                </div>
                <div className="exm-drawer-body">{children}</div>
            </aside>
        </>
    );
};

const KEYS = [
    ['C', 'clear', 'C', 'is-fn'], ['back', 'backspace', '⌫', 'is-fn'], ['sqrt', 'sqrt', '√', 'is-fn'], ['pct', 'percent', '%', 'is-fn'],
    ['7'], ['8'], ['9'], ['/', 'divide', '÷', 'is-op'],
    ['4'], ['5'], ['6'], ['*', 'multiply', '×', 'is-op'],
    ['1'], ['2'], ['3'], ['-', 'subtract', '−', 'is-op'],
    ['neg', 'negate', '±', 'is-fn'], ['0'], ['.', 'point', '.'], ['+', 'add', '+', 'is-op'],
    ['=', 'equals', '=', 'is-eq exm-calc-wide'],
];

/** A basic calculator: digits, + - x /, %, sign, square root, backspace. Numbers always read left to right. */
export const Calculator = () => {
    const t = useCopy(examCopy).calc;
    const [calc, setCalc] = useState(initialCalc);
    return (
        <div className="exm-calc">
            <output className="exm-calc-display" dir="ltr" aria-label={t.display} aria-live="polite">
                {calc.display}
            </output>
            <div className="exm-calc-keys" dir="ltr">
                {KEYS.map(([key, name, glyph, cls]) => (
                    <button
                        key={key}
                        type="button"
                        className={`exm-calc-key ${cls || ''}${calc.op === key ? ' is-pending' : ''}`}
                        onClick={() => setCalc((c) => pressKey(c, key))}
                        aria-label={name ? t[name] : undefined}
                    >
                        {glyph || key}
                    </button>
                ))}
            </div>
        </div>
    );
};

/** Adult reference ranges. Names and units are lab-report English; headings follow the site language. */
export const LabValues = () => {
    const t = useCopy(examCopy).labs;
    return (
        <div className="exm-labs">
            <p className="exm-labs-flag"><Icon name="info" size={15} /> {t.subtitle}</p>
            <p className="exm-muted exm-small">{t.note}</p>
            {LAB_GROUPS.map((g) => (
                <section key={g.group} className="exm-lab-group">
                    <h3>{t.groups[g.group]}</h3>
                    <table className="exm-lab-table">
                        <thead>
                            <tr>
                                <th scope="col">{t.columns.test}</th>
                                <th scope="col">{t.columns.range}</th>
                                <th scope="col">{t.columns.unit}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {g.rows.map(([name, range, unit]) => (
                                <tr key={name}>
                                    <th scope="row" dir="ltr">{name}</th>
                                    <td dir="ltr">{range}</td>
                                    <td dir="ltr">{unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
};
