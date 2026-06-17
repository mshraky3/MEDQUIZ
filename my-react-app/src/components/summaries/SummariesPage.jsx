import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SECTIONS, { findSubtopic } from './content/index.js';
import QuestionCard from './QuestionCard.jsx';
import SummaryAnnotation from './SummaryAnnotation.jsx';
import './Summaries.css';

/**
 * Cards-in-cards summaries hub.
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
    { id: 'move', icon: '🖱️', label: 'تصفّح' },
    { id: 'pen', icon: '✏️', label: 'قلم' },
    { id: 'highlighter', icon: '🖊️', label: 'تظليل' },
    { id: 'eraser', icon: '🧽', label: 'ممحاة' },
];
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#fbbf24', '#f8fafc'];

const SummariesPage = () => {
    const { slug } = useParams();
    const [activeSpecialty, setActiveSpecialty] = useState(SECTIONS[0]?.id || null);
    const [openSub, setOpenSub] = useState(null); // { section, subtopic }
    const [tab, setTab] = useState('summary');     // 'summary' | 'questions'
    const [tool, setTool] = useState('move');
    const [color, setColor] = useState(COLORS[0]);
    const [isFs, setIsFs] = useState(false);

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
        <div className="summaries-hub">
            <header className="hub-head">
                <h1>📚 الملخصات</h1>
                <p>اختر تخصصاً لعرض مواضيعه، ثم افتح أي موضوع ليفتح بملء الشاشة للتركيز — مع أدوات رسم وتظليل أثناء المذاكرة.</p>
            </header>

            <div className="spec-cards">
                {SECTIONS.map((s) => {
                    const isActive = activeSpecialty === s.id;
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
                                <span className="spec-card-icon" aria-hidden="true">{s.icon}</span>
                                <span className="spec-card-text">
                                    <span className="spec-card-title">{s.title}</span>
                                    {s.title_en && <span className="spec-card-en">{s.title_en}</span>}
                                </span>
                                <span className="spec-card-count">{s.subtopics.length} مواضيع</span>
                                <span className={`spec-card-chev ${isActive ? 'open' : ''}`} aria-hidden="true">▾</span>
                            </button>

                            <div className={`subtopic-wrap ${isActive ? 'open' : ''}`}>
                                <div className="subtopic-grid">
                                    {s.subtopics.map((t, i) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            className="sub-card"
                                            onClick={() => openSubtopic(s, t)}
                                        >
                                            <span className="sub-card-index">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="sub-card-title">{t.title}</span>
                                            {t.title_en && <span className="sub-card-en">{t.title_en}</span>}
                                            {t.questions?.length > 0 && (
                                                <span className="sub-card-q">{t.questions.length} أسئلة</span>
                                            )}
                                        </button>
                                    ))}
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
                    dir="rtl"
                    ref={panelRef}
                    style={openSub.section.accent ? { '--accent': openSub.section.accent } : undefined}
                >
                    <header className="panel-head">
                        <div className="panel-head-text">
                            <span className="panel-spec">{openSub.section.icon} {openSub.section.title}</span>
                            <h2 className="panel-title">{openSub.subtopic.title}</h2>
                            {openSub.subtopic.title_en && (
                                <span className="panel-title-en">{openSub.subtopic.title_en}</span>
                            )}
                        </div>
                        <button type="button" className="panel-close" onClick={closePanel} aria-label="إغلاق">✕</button>
                    </header>

                    <div className="panel-tabs">
                        <button
                            type="button"
                            className={`panel-tab ${tab === 'summary' ? 'active' : ''}`}
                            onClick={() => changeTab('summary')}
                        >
                            الملخص
                        </button>
                        {questions.length > 0 && (
                            <button
                                type="button"
                                className={`panel-tab ${tab === 'questions' ? 'active' : ''}`}
                                onClick={() => changeTab('questions')}
                            >
                                اختبر نفسك <span className="panel-tab-badge">{questions.length}</span>
                            </button>
                        )}
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
                                >{t.icon}</button>
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
                                    aria-label={`لون ${c}`}
                                    onClick={() => pickColor(c)}
                                />
                            ))}
                        </div>
                        <div className="stb-sep" />
                        <div className="stb-group">
                            <button type="button" className="stb-btn" title="تراجع" aria-label="تراجع" onClick={() => annotationRef.current?.undo()}>↶</button>
                            <button type="button" className="stb-btn" title="مسح الكل" aria-label="مسح الكل" onClick={() => annotationRef.current?.clear()}>🗑️</button>
                            <button type="button" className="stb-btn" title={isFs ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'} aria-label="ملء الشاشة" onClick={toggleFs}>⛶</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummariesPage;
