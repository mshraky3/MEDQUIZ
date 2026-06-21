import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SECTIONS, { findSubtopic } from './content/index.js';
import QuestionCard from './QuestionCard.jsx';
import SummaryAnnotation from './SummaryAnnotation.jsx';
import Icon from '../common/Icon.jsx';
import { UserContext } from '../../UserContext';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';
import './Summaries.css';

/**
 * Cards-in-cards summaries hub (English UI).
 *
 *  Level 1 — specialty cards (accordion, one open at a time)
 *  Level 2 — sub-topic cards revealed inside the open specialty
 *  Level 3 — a FULL-SCREEN focused study modal (summary + interactive questions)
 *            with drawing tools (pen / highlighter / eraser) for active study.
 *
 * Deep links (/summaries/:slug) open the matching specialty and, when the slug
 * is a sub-topic, its modal directly.
 */
const TOOLS = [
    { id: 'move', icon: 'cursor', label: 'Browse' },
    { id: 'pen', icon: 'pen', label: 'Pen' },
    { id: 'highlighter', icon: 'highlighter', label: 'Highlighter' },
    { id: 'eraser', icon: 'eraser', label: 'Eraser' },
];
const COLORS = ['#2563eb', '#ef4444', '#16a34a', '#f59e0b', '#0f172a'];

// Each section/subtopic carries an Arabic `title` + English `title_en`. When the
// title is already English (e.g. OB/GYN), keep it as the heading and use title_en
// as a descriptive subtitle; otherwise show title_en as the (single) English name.
const enLabel = (item) => {
    const hasLatin = /[A-Za-z]/.test(item?.title || '');
    return {
        primary: hasLatin ? item.title : (item.title_en || item.title),
        secondary: hasLatin ? item.title_en : null,
    };
};

const SummariesPage = () => {
    const { slug } = useParams();
    const { user } = useContext(UserContext);
    const [activeSpecialty, setActiveSpecialty] = useState(SECTIONS[0]?.id || null);
    const [openSub, setOpenSub] = useState(null); // { section, subtopic }
    const [tab, setTab] = useState('summary');     // 'summary' | 'questions'
    const [tool, setTool] = useState('move');
    const [color, setColor] = useState(COLORS[0]);
    const [isFs, setIsFs] = useState(false);

    // Manual completion tracking — a map of { [subtopicId]: true }, persisted per
    // user in localStorage so finished topics stay marked across sessions/devices
    // (same browser). Toggled from the study modal; reflected on the hub cards.
    const progressKey = `summaries.progress.${user?.username || user?.email || 'guest'}`;
    const [done, setDone] = useState({});

    useEffect(() => {
        try {
            const raw = safeGetItem(progressKey);
            setDone(raw ? JSON.parse(raw) : {});
        } catch (_) {
            setDone({});
        }
    }, [progressKey]);

    const isDone = (subId) => !!done[subId];
    const toggleDone = (subId) => {
        setDone((prev) => {
            const next = { ...prev };
            if (next[subId]) delete next[subId];
            else next[subId] = true;
            safeSetItem(progressKey, JSON.stringify(next));
            return next;
        });
    };
    const doneCount = (section) => section.subtopics.reduce((n, t) => n + (done[t.id] ? 1 : 0), 0);

    const panelRef = useRef(null);
    const bodyRef = useRef(null);
    const annotationRef = useRef(null);

    const openSubtopic = (section, subtopic) => {
        setOpenSub({ section, subtopic });
        setTab('summary');
        setTool('move');
    };
    const closePanel = () => {
        if (document.fullscreenElement) document.exitFullscreen?.();
        setOpenSub(null);
    };
    // Switching tab resets to the browse tool so questions are clickable by default.
    const changeTab = (t) => { setTab(t); setTool('move'); };

    // Deep link → open the right specialty + sub-topic modal.
    useEffect(() => {
        if (!slug) return;
        const hit = findSubtopic(slug);
        if (!hit) return;
        setActiveSpecialty(hit.section.id);
        if (hit.subtopic) openSubtopic(hit.section, hit.subtopic);
    }, [slug]);

    // Esc closes the modal; lock background scroll while it's open.
    useEffect(() => {
        if (!openSub) return;
        const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [openSub]);

    // Track native fullscreen state.
    useEffect(() => {
        const onChange = () => setIsFs(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    const toggleFs = () => {
        if (!document.fullscreenElement) panelRef.current?.requestFullscreen?.();
        else document.exitFullscreen?.();
    };

    const pickColor = (c) => {
        setColor(c);
        if (tool === 'move' || tool === 'eraser') setTool('pen');
    };

    const questions = openSub?.subtopic.questions || [];

    return (
        <div className="summaries-hub" dir="ltr">
            <header className="hub-head">
                <h1><Icon name="book-open" size={28} className="hub-head-icon" /> Summaries</h1>
                <p>Pick a specialty to browse its topics, then open any topic full-screen to focus — with pen &amp; highlighter tools for active study.</p>
            </header>

            <div className="spec-cards">
                {SECTIONS.map((s) => {
                    const isActive = activeSpecialty === s.id;
                    const { primary, secondary } = enLabel(s);
                    const nDone = doneCount(s);
                    const nTotal = s.subtopics.length;
                    const allDone = nDone === nTotal && nTotal > 0;
                    return (
                        <div
                            key={s.id}
                            className={`spec-card ${isActive ? 'is-active' : ''}`}
                            style={s.accent ? { '--accent': s.accent } : undefined}
                        >
                            <button
                                type="button"
                                className="spec-card-head"
                                aria-expanded={isActive}
                                onClick={() => setActiveSpecialty(isActive ? null : s.id)}
                            >
                                <span className="spec-card-icon" aria-hidden="true"><Icon name={s.icon} size={24} /></span>
                                <span className="spec-card-text">
                                    <span className="spec-card-title">{primary}</span>
                                    {secondary && <span className="spec-card-en">{secondary}</span>}
                                </span>
                                {nDone > 0 ? (
                                    <span className={`spec-card-progress ${allDone ? 'all-done' : ''}`}>
                                        <Icon name="check" size={13} /> {nDone}/{nTotal} done
                                    </span>
                                ) : (
                                    <span className="spec-card-count">{nTotal} topic{nTotal !== 1 ? 's' : ''}</span>
                                )}
                                <span className={`spec-card-chev ${isActive ? 'open' : ''}`} aria-hidden="true">▾</span>
                            </button>

                            <div className={`subtopic-wrap ${isActive ? 'open' : ''}`}>
                                <div className="subtopic-grid">
                                    {s.subtopics.map((t, i) => {
                                        const tl = enLabel(t);
                                        const completed = isDone(t.id);
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                className={`sub-card ${completed ? 'is-done' : ''}`}
                                                onClick={() => openSubtopic(s, t)}
                                            >
                                                {completed && (
                                                    <span className="sub-card-done" aria-label="Completed">
                                                        <Icon name="check" size={13} />
                                                    </span>
                                                )}
                                                <span className="sub-card-index">{String(i + 1).padStart(2, '0')}</span>
                                                <span className="sub-card-title">{tl.primary}</span>
                                                {tl.secondary && <span className="sub-card-en">{tl.secondary}</span>}
                                                {t.questions?.length > 0 && (
                                                    <span className="sub-card-q">{t.questions.length} question{t.questions.length !== 1 ? 's' : ''}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Level 3 — full-screen focused study modal */}
            {openSub && (
                <div
                    className="summary-panel"
                    dir="ltr"
                    ref={panelRef}
                    style={openSub.section.accent ? { '--accent': openSub.section.accent } : undefined}
                >
                    <header className="panel-head">
                        <div className="panel-head-text">
                            <span className="panel-spec">
                                <Icon name={openSub.section.icon} size={18} /> {enLabel(openSub.section).primary}
                            </span>
                            <h2 className="panel-title">{enLabel(openSub.subtopic).primary}</h2>
                            {enLabel(openSub.subtopic).secondary && (
                                <span className="panel-title-en">{enLabel(openSub.subtopic).secondary}</span>
                            )}
                        </div>
                        <button type="button" className="panel-close" onClick={closePanel} aria-label="Close">
                            <Icon name="x" size={20} />
                        </button>
                    </header>

                    <div className="panel-tabs">
                        <button
                            type="button"
                            className={`panel-tab ${tab === 'summary' ? 'active' : ''}`}
                            onClick={() => changeTab('summary')}
                        >
                            Summary
                        </button>
                        {questions.length > 0 && (
                            <button
                                type="button"
                                className={`panel-tab ${tab === 'questions' ? 'active' : ''}`}
                                onClick={() => changeTab('questions')}
                            >
                                Test yourself <span className="panel-tab-badge">{questions.length}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className={`panel-done-btn ${isDone(openSub.subtopic.id) ? 'on' : ''}`}
                            onClick={() => toggleDone(openSub.subtopic.id)}
                            aria-pressed={isDone(openSub.subtopic.id)}
                            title={isDone(openSub.subtopic.id) ? 'Marked as done — click to undo' : 'Mark this topic as done'}
                        >
                            <Icon name={isDone(openSub.subtopic.id) ? 'check' : 'circle'} size={16} />
                            <span className="label">{isDone(openSub.subtopic.id) ? 'Done' : 'Mark as done'}</span>
                        </button>
                    </div>

                    <div className="panel-body" ref={bodyRef}>
                        <div className="panel-inner">
                            {tab === 'summary' ? (
                                <div
                                    className="sum-doc sub-summary"
                                    dir="ltr"
                                    dangerouslySetInnerHTML={{ __html: openSub.subtopic.summaryHtml }}
                                />
                            ) : (
                                <div className="sub-questions">
                                    {questions.map((qq, i) => (
                                        <QuestionCard key={i} question={qq} number={i + 1} />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* drawing overlay — remounts (clears) per subtopic + tab */}
                        <SummaryAnnotation
                            key={`${openSub.subtopic.id}-${tab}`}
                            ref={annotationRef}
                            tool={tool}
                            color={color}
                            containerRef={bodyRef}
                        />
                    </div>

                    {/* floating study toolbar */}
                    <div className="summary-fab" dir="ltr">
                        <div className="stb-group">
                            {TOOLS.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    className={`stb-btn ${tool === t.id ? 'on' : ''}`}
                                    title={t.label}
                                    aria-label={t.label}
                                    aria-pressed={tool === t.id}
                                    onClick={() => setTool(t.id)}
                                ><Icon name={t.icon} size={18} /></button>
                            ))}
                        </div>
                        <div className="stb-sep" />
                        <div className="stb-group">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`stb-color ${color === c ? 'on' : ''}`}
                                    style={{ background: c }}
                                    aria-label={`Color ${c}`}
                                    onClick={() => pickColor(c)}
                                />
                            ))}
                        </div>
                        <div className="stb-sep" />
                        <div className="stb-group">
                            <button type="button" className="stb-btn" title="Undo" aria-label="Undo" onClick={() => annotationRef.current?.undo()}><Icon name="undo" size={18} /></button>
                            <button type="button" className="stb-btn" title="Clear all" aria-label="Clear all" onClick={() => annotationRef.current?.clear()}><Icon name="trash" size={18} /></button>
                            <button type="button" className="stb-btn" title={isFs ? 'Exit full screen' : 'Full screen'} aria-label="Full screen" onClick={toggleFs}><Icon name="maximize" size={18} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummariesPage;
