import React, { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import './ProductShowcase.css';

/**
 * "Every tool in one place" — shown rather than described.
 *
 * Each panel is a working replica of a real screen, animated when it scrolls
 * into view. Screenshots were the obvious alternative and are worse on every
 * axis that matters here: they go stale the first time the UI changes, they
 * ship hundreds of kilobytes of PNG to a mobile visitor on the LCP route, they
 * cannot be translated, and they cannot flip to RTL. A replica is ~4 KB of
 * markup that is always current, always in the reader's language, and reads
 * correctly in both directions.
 *
 * Everything below is inert: no inputs are real, no state leaves the panel.
 * The mock content is intentionally recognisable clinical material rather than
 * lorem ipsum, because a landing page that shows fake-looking questions is
 * arguing against itself.
 */

/**
 * Fires once when the element is ~30% visible, then disconnects.
 *
 * Deliberately one-shot: an animation that replays every time you scroll past
 * turns a landing page into a fidget toy. Falls back to "already visible" when
 * IntersectionObserver is missing or the visitor has asked for reduced motion,
 * so the panels render in their FINISHED state — never blank, never mid-way.
 */
function useRevealed(ref) {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const reduced = typeof window !== 'undefined'
            && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduced || typeof IntersectionObserver === 'undefined') {
            setRevealed(true);
            return;
        }

        const io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
                setRevealed(true);
                io.disconnect();
            }
        }, { threshold: 0.3 });

        io.observe(node);
        return () => io.disconnect();
    }, [ref]);

    return revealed;
}

/* ── Panel 1 — a question, answered ──────────────────────────────────────
   The single most important thing a question bank has to prove: that you
   find out WHY, immediately. */
const QuizMock = ({ m, revealed }) => (
    <div className={`ps-screen ps-quiz${revealed ? ' is-on' : ''}`} aria-hidden="true">
        <div className="ps-screen-bar">
            <span className="ps-screen-dot" /><span className="ps-screen-dot" /><span className="ps-screen-dot" />
            <span className="ps-screen-title">{m.quizProgress}</span>
        </div>
        <div className="ps-screen-body">
            <p className="ps-quiz-stem">{m.quizStem}</p>
            <ul className="ps-quiz-options">
                {m.quizOptions.map((opt, i) => (
                    <li
                        key={opt}
                        className={`ps-quiz-option${i === m.quizCorrectIndex ? ' is-correct' : ''}`}
                        style={{ '--i': i }}
                    >
                        <span className="ps-quiz-key">{String.fromCharCode(65 + i)}</span>
                        <span className="ps-quiz-text">{opt}</span>
                        {i === m.quizCorrectIndex && (
                            <span className="ps-quiz-check"><Icon name="check" size={13} /></span>
                        )}
                    </li>
                ))}
            </ul>
            <div className="ps-quiz-explain">
                <span className="ps-quiz-tag">{m.quizCorrectTag}</span>
                <p>{m.quizExplain}</p>
            </div>
        </div>
    </div>
);

/* ── Panel 2 — accuracy rings ────────────────────────────────────────────
   The same SVG rings the hub draws, at the same radius, so what a visitor
   sees here is literally what they get after their first quiz. */
const RINGS = [
    { pct: 78, key: 'r1' },
    { pct: 64, key: 'r2' },
    { pct: 41, key: 'r3', weak: true },
    { pct: 71, key: 'r4' },
];
const RING_C = 2 * Math.PI * 26;

const AnalysisMock = ({ m, revealed, labels }) => (
    <div className={`ps-screen ps-analysis${revealed ? ' is-on' : ''}`} aria-hidden="true">
        <div className="ps-screen-bar">
            <span className="ps-screen-dot" /><span className="ps-screen-dot" /><span className="ps-screen-dot" />
            <span className="ps-screen-title">{m.analysisTitle}</span>
        </div>
        <div className="ps-screen-body">
            <div className="ps-rings">
                {RINGS.map((r, i) => (
                    <div className={`ps-ring${r.weak ? ' is-weak' : ''}`} key={r.key} style={{ '--i': i }}>
                        <span className="ps-ring-svg">
                            <svg viewBox="0 0 64 64">
                                <circle className="ps-ring-bg" cx="32" cy="32" r="26" />
                                <circle
                                    className="ps-ring-fg"
                                    cx="32" cy="32" r="26"
                                    style={{
                                        strokeDasharray: RING_C,
                                        strokeDashoffset: revealed ? RING_C * (1 - r.pct / 100) : RING_C,
                                    }}
                                />
                            </svg>
                            <span className="ps-ring-pct">{r.pct}%</span>
                        </span>
                        <span className="ps-ring-label">{labels[i]}</span>
                        {r.weak && <span className="ps-ring-tag">{m.analysisWeak}</span>}
                    </div>
                ))}
            </div>
            <div className="ps-analysis-foot">
                <span className="ps-analysis-foot-label">{m.analysisOverall}</span>
                <span className="ps-analysis-bar"><i style={{ '--w': '64%' }} /></span>
                <span className="ps-analysis-foot-val">64%</span>
            </div>
        </div>
    </div>
);

/* ── Panel 3 — the annotation tool ───────────────────────────────────────
   A highlighter sweeping across a line and a pen circling a finding, drawn
   with SVG stroke-dashoffset so nothing is rasterised.

   The rail is the real one: SummariesPage.jsx's TOOLS in its own order
   (pen → highlighter → eraser) as 18px icons in square buttons, not a row of
   word chips. `copyIndex` points back into the ar/en `annotateTools` labels,
   which stay in their existing order so neither copy file has to move. The
   highlighter is the active tool because highlighting is what the panel then
   shows happening. */
const ANNOTATE_TOOLS = [
    { icon: 'pen', copyIndex: 1 },
    { icon: 'highlighter', copyIndex: 0, active: true },
    { icon: 'eraser', copyIndex: 2 },
];

const AnnotateMock = ({ m, revealed }) => (
    <div className={`ps-screen ps-annotate${revealed ? ' is-on' : ''}`} aria-hidden="true">
        <div className="ps-screen-bar">
            <span className="ps-screen-dot" /><span className="ps-screen-dot" /><span className="ps-screen-dot" />
            <span className="ps-screen-title">{m.annotateTitle}</span>
        </div>
        <div className="ps-screen-body">
            <div className="ps-tools">
                {ANNOTATE_TOOLS.map(({ icon, copyIndex, active }) => (
                    <span
                        key={icon}
                        className={`ps-tool${active ? ' is-on' : ''}`}
                        title={m.annotateTools[copyIndex]}
                    >
                        <Icon name={icon} size={15} />
                    </span>
                ))}
            </div>

            {/* A stylised AP neck radiograph: the airway column narrowing to a
                point is the steeple sign the summary is about. */}
            <div className="ps-xray">
                <svg viewBox="0 0 200 120" className="ps-xray-svg">
                    <defs>
                        <linearGradient id="ps-xg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0b1021" />
                        </linearGradient>
                    </defs>
                    <rect width="200" height="120" fill="url(#ps-xg)" />
                    {/* soft tissue */}
                    <path d="M64 118 q10-70 36-96 q26 26 36 96 z" fill="rgba(148,163,184,.20)" />
                    {/* the airway itself, tapering — the "steeple" */}
                    <path d="M88 118 q6-58 12-78 q6 20 12 78 z" fill="rgba(226,232,240,.72)" />
                    {/* pen circle around the narrowing */}
                    <ellipse
                        className="ps-pen"
                        cx="100" cy="46" rx="22" ry="17"
                        fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
                    />
                </svg>
                <span className="ps-xray-note">{m.annotateNote}</span>
            </div>

            {/* Highlighter sweeping the key line of the summary text. */}
            <p className="ps-highlight-line">
                <span className="ps-highlight-mark" />
                <span className="ps-highlight-text">{m.annotateTitle}</span>
            </p>
            <p className="ps-fake-line" style={{ '--w': '92%' }} />
            <p className="ps-fake-line" style={{ '--w': '78%' }} />
        </div>
    </div>
);

/* ── Panel 4 — wrong answers, searched ───────────────────────────────────
   The search term types itself in, then the results appear: the feature
   requested for the review page, demonstrated rather than claimed. */
const WrongMock = ({ m, revealed }) => (
    <div className={`ps-screen ps-wrong${revealed ? ' is-on' : ''}`} aria-hidden="true">
        <div className="ps-screen-bar">
            <span className="ps-screen-dot" /><span className="ps-screen-dot" /><span className="ps-screen-dot" />
            <span className="ps-screen-title">{m.wrongCount}</span>
        </div>
        <div className="ps-screen-body">
            <div className="ps-search">
                <Icon name="search" size={14} />
                <span className="ps-search-typed">{m.wrongSearch}</span>
                <span className="ps-caret" />
            </div>
            <ul className="ps-wrong-list">
                {m.wrongItems.map((it, i) => (
                    <li key={it.q} className="ps-wrong-item" style={{ '--i': i }}>
                        <p className="ps-wrong-q">{it.q}</p>
                        <p className="ps-wrong-answers">
                            <span className="ps-wrong-bad">{m.wrongYou}: {it.you}</span>
                            <span className="ps-wrong-good">{m.wrongRight}: {it.right}</span>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const MOCKS = {
    quiz: QuizMock,
    analysis: AnalysisMock,
    annotate: AnnotateMock,
    wrong: WrongMock,
};

/** One item: prose on one side, its live replica on the other, alternating. */
const ShowcaseRow = ({ item, mock, liveTag, specialtyLabels, index }) => {
    const ref = useRef(null);
    const revealed = useRevealed(ref);
    const Mock = MOCKS[item.key];

    return (
        <article
            ref={ref}
            className={`ps-row${index % 2 ? ' is-flipped' : ''}${revealed ? ' is-visible' : ''}`}
        >
            <div className="ps-copy">
                <span className="ps-kicker">
                    <Icon name={item.icon} size={15} /> {item.kicker}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
            </div>
            <div className="ps-visual">
                <span className="ps-live-tag"><i /> {liveTag}</span>
                {Mock && <Mock m={mock} revealed={revealed} labels={specialtyLabels} />}
            </div>
        </article>
    );
};

const ProductShowcase = ({ copy, specialtyLabels }) => (
    <section className="ps-section" aria-labelledby="ps-h">
        <div className="section-head">
            <p className="pill subtle">{copy.pill}</p>
            <h2 id="ps-h">{copy.title}</h2>
            <p>{copy.body}</p>
        </div>

        <div className="ps-rows">
            {copy.items.map((item, i) => (
                <ShowcaseRow
                    key={item.key}
                    item={item}
                    index={i}
                    mock={copy.mock}
                    liveTag={copy.liveTag}
                    specialtyLabels={specialtyLabels}
                />
            ))}
        </div>
    </section>
);

export default ProductShowcase;
