import React, { useState } from 'react';
import { clampStep } from '../../utils/androidApp.js';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';

/**
 * The install steps, one at a time. Tapping a step's button opens the Google page
 * in a new tab and moves on by itself, so the next step is waiting when the
 * student comes back (no "done" button to press). The step is remembered because
 * phones often reload a tab left in the background.
 */
const AndroidTesterGuide = ({ steps, guide, email, storageKey, onOpen, noLink }) => {
    const [index, setIndex] = useState(() => clampStep(safeGetItem(storageKey), steps.length));
    const step = steps[index];

    const go = (next) => {
        const safe = clampStep(next, steps.length);
        safeSetItem(storageKey, String(safe));
        setIndex(safe);
    };

    const opened = () => {
        onOpen(step.key);
        // After the browser has followed the link, not before.
        setTimeout(() => go(index + 1), 600);
    };

    return (
        <div className="atl-guide" aria-live="polite">
            <p className="atl-guide-progress">
                {guide.progress.replace('{n}', index + 1).replace('{total}', steps.length)}
            </p>
            <h3 className="atl-guide-title">{step.title}</h3>
            <p className="atl-guide-account">{guide.account} <bdi>{email}</bdi></p>
            <ol className="atl-steps">
                {step.lines.map((line) => <li key={line}><span>{line}</span></li>)}
            </ol>
            {step.href ? (
                <a key={step.key} className="btn primary atl-btn" href={step.href} target="_blank" rel="noopener noreferrer" onClick={opened}>
                    {step.button}
                </a>
            ) : null}
            {!step.href && step.button ? <p className="atl-hint">{noLink}</p> : null}
            {index > 0 ? (
                <button type="button" className="atl-textbtn" onClick={() => go(index - 1)}>{guide.back}</button>
            ) : null}
            <details className="atl-help">
                <summary>{guide.helpTitle}</summary>
                <ul>{guide.help.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </details>
        </div>
    );
};

export default AndroidTesterGuide;
