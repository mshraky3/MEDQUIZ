import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import QuestionImages from '../Quiz/QuestionImages.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import { OPTION_KEYS, OPTION_LETTERS, partSummary } from './examEngine.js';
import { useExamClock } from './useExamClock.js';
import { formatClock, clockTone } from './examClock.js';
import ExamNavigator, { NavLegend } from './ExamNavigator.jsx';
import ExamReview from './ExamReview.jsx';
import { Drawer, Calculator, LabValues } from './ExamTools.jsx';

const isTypingTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

/**
 * The test-centre screen: header (question, part, clock, progress, Finish
 * Part), a numbered navigator, the question, and a footer with flag, tools and
 * Back / Next. It also renders the end-of-part review in place of the question
 * (the clock keeps running there). A full-screen layer above the app bar.
 */
const ExamRunner = ({
    state, questions, restored, onDismissRestored,
    onSelect, onFlag, onGo, onSpent, onOpenReview, onCloseReview, onFinishPart, onExpire,
}) => {
    const t = useCopy(examCopy);
    const r = t.run;
    const { lang, dir } = useLang();
    const fmt = (n) => formatNumber(n, lang);

    const part = state.parts[state.partIdx];
    const partCount = state.parts.length;
    const isLast = state.partIdx === partCount - 1;
    const total = part.to - part.from;
    const position = state.current - part.from + 1;
    const q = questions[state.current];
    const summary = partSummary(state, questions, state.partIdx);
    const inReview = state.stage === 'review';

    const { secondsLeft } = useExamClock(state.partDeadline, { onExpire });
    const tone = clockTone(secondsLeft, part.minutes * 60);
    const clockText = formatClock(secondsLeft);

    const [navOpen, setNavOpen] = useState(false);
    const [tool, setTool] = useState(null); // 'calc' | 'labs' | null
    const anyDrawer = navOpen || tool !== null;

    // ---- keep the page behind from scrolling, and warn before closing mid-part
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('beforeunload', warn);
        };
    }, []);

    // ---- time spent per question (saved with the attempt)
    const spentRef = useRef(onSpent);
    spentRef.current = onSpent;
    useEffect(() => {
        if (state.stage !== 'part') return undefined;
        const index = state.current;
        const at = Date.now();
        return () => spentRef.current(index, (Date.now() - at) / 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.current, state.stage]);

    // ---- keyboard: A to D answer, N next, P previous, F flag
    const keyState = useRef({});
    keyState.current = { state, anyDrawer, q, onSelect, onFlag, onGo, total, part };
    useEffect(() => {
        const onKey = (e) => {
            const k = keyState.current;
            if (e.ctrlKey || e.metaKey || e.altKey || k.anyDrawer || isTypingTarget(e.target)) return;
            if (k.state.stage !== 'part') return;
            const key = e.key.toLowerCase();
            const letterAt = ['a', 'b', 'c', 'd'].indexOf(key);
            if (letterAt >= 0) {
                const opt = k.q?.[OPTION_KEYS[letterAt]];
                if (opt) { e.preventDefault(); k.onSelect(k.state.current, opt); }
            } else if (key === 'n') {
                if (k.state.current < k.part.to - 1) k.onGo(k.state.current + 1);
            } else if (key === 'p') {
                if (k.state.current > k.part.from) k.onGo(k.state.current - 1);
            } else if (key === 'f') {
                k.onFlag(k.state.current);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const closeNav = useCallback(() => setNavOpen(false), []);
    const closeTool = useCallback(() => setTool(null), []);
    const goAndClose = (index) => { onGo(index); setNavOpen(false); };

    const answered = summary.answered;
    const flagged = !!state.flags[q?.id];
    const selected = q ? state.answers[q.id] : undefined;
    const atFirst = state.current <= part.from;
    const atEnd = state.current >= part.to - 1;
    const finishLabel = isLast ? r.finishExam : r.finishPart;

    return (
        <div className="exm exm-run" dir={dir}>
            <header className="exm-bar">
                <div className="exm-bar-id">
                    <span className="exm-part-tag">{r.partLabel(fmt(part.index), fmt(partCount))}</span>
                    <span className="exm-qof">{inReview ? t.review.title(fmt(part.index), partCount) : r.questionOf(fmt(position), fmt(total))}</span>
                </div>
                <div
                    className="exm-bar-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={answered}
                    aria-label={r.progress(fmt(answered), fmt(total))}
                    title={r.progress(fmt(answered), fmt(total))}
                >
                    <span style={{ width: `${total > 0 ? (answered / total) * 100 : 0}%` }} />
                </div>
                <div className="exm-bar-right">
                    <div className={`exm-clock tone-${tone}`} role="timer" aria-label={r.timeLeftAria(clockText)}>
                        <Icon name={tone === 'danger' ? 'alert-triangle' : 'clock'} size={16} />
                        <span className="exm-clock-label">{r.timeLeft}</span>
                        <span className="exm-clock-digits" dir="ltr">{clockText}</span>
                    </div>
                    {!inReview && (
                        <button type="button" className="exm-btn exm-btn-sm exm-btn-primary" onClick={onOpenReview}>
                            {finishLabel}
                        </button>
                    )}
                </div>
            </header>

            {tone === 'danger' && <p className="exm-banner exm-banner-danger" role="status">{r.fiveMinutes}</p>}
            {restored && (
                <p className="exm-banner" role="status">
                    {r.restored}
                    <button type="button" className="exm-banner-x" onClick={onDismissRestored} aria-label={t.calc.close}>
                        <Icon name="x" size={14} />
                    </button>
                </p>
            )}

            {inReview ? (
                <div className="exm-run-body is-review">
                    <ExamReview
                        summary={summary}
                        partNumber={part.index}
                        partCount={partCount}
                        isLast={isLast}
                        onGo={onGo}
                        onReturn={onCloseReview}
                        onEnd={onFinishPart}
                    />
                </div>
            ) : (
                <>
                    <div className="exm-run-body">
                        <aside className="exm-side" aria-label={r.navigator}>
                            <h2 className="exm-side-title">{r.navigator}</h2>
                            <ExamNavigator items={summary.items} current={state.current} onGo={onGo} label={r.navigator} />
                            <NavLegend />
                        </aside>

                        <section className="exm-qpane" aria-label={r.questionOf(fmt(position), fmt(total))}>
                            <article className="exm-q" key={q.id}>
                                <div className="exm-stem" dir="ltr" lang="en">{q.question_text}</div>
                                <QuestionImages images={q.images} />
                                <p className="exm-choose">{r.chooseOne}</p>
                                <div className="exm-options" role="radiogroup" aria-label={r.chooseOne}>
                                    {OPTION_KEYS.map((key, i) => {
                                        const text = q[key];
                                        const isSel = selected === text;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                role="radio"
                                                aria-checked={isSel}
                                                aria-label={r.optionAria(OPTION_LETTERS[i], text)}
                                                className={`exm-opt${isSel ? ' is-selected' : ''}`}
                                                onClick={() => onSelect(state.current, text)}
                                                disabled={!text}
                                                dir="ltr"
                                                lang="en"
                                            >
                                                <span className="exm-letter" aria-hidden="true">{OPTION_LETTERS[i]}</span>
                                                <span className="exm-opt-text" aria-hidden="true">{text}</span>
                                                <span className="exm-opt-mark" aria-hidden="true">{isSel && <Icon name="check" size={17} />}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </article>
                        </section>
                    </div>

                    <footer className="exm-foot">
                        <div className="exm-foot-tools">
                            <button type="button" className="exm-tool exm-tool-nav" onClick={() => setNavOpen(true)} aria-haspopup="dialog">
                                <Icon name="menu" size={18} /><span>{r.questions}</span>
                            </button>
                            <button type="button" className={`exm-tool${flagged ? ' is-on' : ''}`} onClick={() => onFlag(state.current)} aria-pressed={flagged}>
                                <Icon name="flag" size={18} /><span>{flagged ? r.unflag : r.flag}</span>
                            </button>
                            <button type="button" className="exm-tool" onClick={() => setTool('calc')} aria-haspopup="dialog">
                                <Icon name="gamepad" size={18} /><span>{r.calculator}</span>
                            </button>
                            <button type="button" className="exm-tool" onClick={() => setTool('labs')} aria-haspopup="dialog">
                                <Icon name="clipboard" size={18} /><span>{r.labValues}</span>
                            </button>
                        </div>
                        <div className="exm-foot-nav">
                            <button type="button" className="exm-btn" onClick={() => onGo(state.current - 1)} disabled={atFirst}>
                                <Icon name={dir === 'rtl' ? 'chevron-right' : 'chevron-left'} size={17} /> {r.prev}
                            </button>
                            {atEnd ? (
                                <button type="button" className="exm-btn exm-btn-primary" onClick={onOpenReview}>
                                    {r.reviewAll}
                                </button>
                            ) : (
                                <button type="button" className="exm-btn exm-btn-primary" onClick={() => onGo(state.current + 1)}>
                                    {r.next} <Icon name={dir === 'rtl' ? 'chevron-left' : 'chevron-right'} size={17} />
                                </button>
                            )}
                        </div>
                    </footer>
                </>
            )}

            <Drawer open={navOpen} title={r.navigator} onClose={closeNav} closeLabel={r.closeNavigator}>
                <ExamNavigator items={summary.items} current={state.current} onGo={goAndClose} label={r.navigator} />
                <NavLegend />
            </Drawer>
            <Drawer open={tool === 'calc'} title={t.calc.title} onClose={closeTool} closeLabel={t.calc.close}>
                <Calculator />
            </Drawer>
            <Drawer open={tool === 'labs'} title={t.labs.title} onClose={closeTool} closeLabel={t.labs.close} wide>
                <LabValues />
            </Drawer>
        </div>
    );
};

export default ExamRunner;
