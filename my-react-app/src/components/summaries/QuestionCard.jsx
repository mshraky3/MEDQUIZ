import React, { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Interactive single-best-answer MCQ. Clicking an option reveals the correct
 * answer (green), marks a wrong pick (red) and shows the explanation. Local
 * state only — no network.
 */
const QuestionCard = ({ question, number }) => {
    const [selected, setSelected] = useState(null);
    const revealed = selected !== null;
    const { q, options, answer, explanation, source } = question;

    const choose = (i) => { if (!revealed) setSelected(i); };

    return (
        <div className={`sq-card ${revealed ? 'is-revealed' : ''}`} dir="ltr">
            <p className="sq-stem">
                <span className="sq-num">Q{number}</span>{q}
            </p>
            <div className="sq-options">
                {options.map((opt, i) => {
                    let state = '';
                    if (revealed) {
                        if (i === answer) state = 'correct';
                        else if (i === selected) state = 'wrong';
                    }
                    return (
                        <button
                            type="button"
                            key={i}
                            className={`sq-option ${state}`}
                            onClick={() => choose(i)}
                            disabled={revealed}
                        >
                            <span className="sq-letter">{LETTERS[i]}</span>
                            <span className="sq-opt-text">{opt}</span>
                            {revealed && i === answer && <span className="sq-mark">✓</span>}
                            {revealed && i === selected && i !== answer && <span className="sq-mark">✕</span>}
                        </button>
                    );
                })}
            </div>
            {revealed && (
                <div className="sq-explain">
                    <b>{selected === answer ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✕'}</b>
                    {explanation ? <span> — {explanation}</span> : null}
                    {source && source !== 'general' && <span className="sq-source">{source}</span>}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
