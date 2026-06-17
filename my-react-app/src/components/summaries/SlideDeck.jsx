import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import sqbLogo from '../../tab_logo.png';

// Pen palette.
const COLORS = ['#22d3ee', '#ef4444', '#34d399', '#fbbf24', '#f8fafc', '#1e293b'];

/**
 * Split the authored summary HTML into slides: a title slide (.sum-head + any
 * leading tips callout) followed by one slide per topic section.
 */
function parseSlides(contentHtml) {
    if (typeof window === 'undefined' || !contentHtml) return [];
    const docEl = new DOMParser().parseFromString(contentHtml, 'text/html');
    const root = docEl.querySelector('.sum-doc');
    if (!root) return [];

    const slides = [];
    const head = root.querySelector('.sum-head');
    let intro = head ? head.outerHTML : '';
    for (const ch of Array.from(root.children)) {
        if (ch.classList && ch.classList.contains('sum-head')) continue;
        if (ch.tagName === 'SECTION') break;
        intro += ch.outerHTML; // e.g. the leading "SMLE TIPS" callout
    }
    slides.push({ type: 'intro', title: head?.querySelector('h2')?.textContent || 'SQB', html: intro });

    root.querySelectorAll('section.topic').forEach((sec) => {
        const h3 = sec.querySelector('h3');
        const title = h3 ? h3.textContent : '';
        const clone = sec.cloneNode(true);
        const ch3 = clone.querySelector('h3');
        if (ch3) ch3.remove();
        slides.push({ type: 'topic', title, html: clone.innerHTML });
    });
    return slides;
}

const SlideDeck = ({ contentHtml, resumePct = 0, onProgress }) => {
    const slides = useMemo(() => parseSlides(contentHtml), [contentHtml]);
    const total = slides.length;

    const [index, setIndex] = useState(() => {
        if (!total) return 0;
        return Math.min(total - 1, Math.max(0, Math.round((resumePct / 100) * (total - 1))));
    });
    const [tool, setTool] = useState('move'); // move | pen | highlighter | eraser
    const [color, setColor] = useState(COLORS[0]);

    const stageRef = useRef(null);
    const slideRef = useRef(null);
    const canvasRef = useRef(null);
    const strokesRef = useRef({});   // slideIndex -> [stroke]
    const drawingRef = useRef(null);

    const drawMode = tool !== 'move';
    const ctx = () => canvasRef.current && canvasRef.current.getContext('2d');

    const strokeStyle = (c, s) => {
        c.lineJoin = 'round'; c.lineCap = 'round';
        if (s.mode === 'eraser') { c.globalCompositeOperation = 'destination-out'; c.lineWidth = s.width; c.globalAlpha = 1; }
        else {
            c.globalCompositeOperation = 'source-over';
            c.strokeStyle = s.color; c.lineWidth = s.width;
            c.globalAlpha = s.mode === 'highlighter' ? 0.35 : 1;
        }
    };

    const redraw = useCallback(() => {
        const canvas = canvasRef.current; const c = ctx();
        if (!canvas || !c) return;
        const w = canvas.clientWidth, h = canvas.clientHeight;
        c.clearRect(0, 0, w, h);
        (strokesRef.current[index] || []).forEach((s) => {
            c.save(); strokeStyle(c, s); c.beginPath();
            s.points.forEach((p, i) => { const x = p.x * w, y = p.y * h; i === 0 ? c.moveTo(x, y) : c.lineTo(x, y); });
            c.stroke(); c.restore();
        });
    }, [index]);

    const fitCanvas = useCallback(() => {
        const canvas = canvasRef.current, slide = slideRef.current; const c = ctx();
        if (!canvas || !slide || !c) return;
        const w = slide.clientWidth, h = slide.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }, [redraw]);

    useEffect(() => { fitCanvas(); }, [index, fitCanvas]);
    useEffect(() => {
        const onR = () => fitCanvas();
        window.addEventListener('resize', onR);
        return () => window.removeEventListener('resize', onR);
    }, [fitCanvas]);

    useEffect(() => {
        if (onProgress && total > 0) onProgress(Math.round(((index + 1) / total) * 100));
    }, [index, total, onProgress]);

    const norm = (e) => {
        const r = canvasRef.current.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    const onDown = (e) => {
        if (!drawMode) return;
        e.preventDefault();
        canvasRef.current.setPointerCapture && canvasRef.current.setPointerCapture(e.pointerId);
        const width = tool === 'highlighter' ? 18 : tool === 'eraser' ? 26 : 3;
        drawingRef.current = { color, width, mode: tool, points: [norm(e)] };
    };
    const onMove = (e) => {
        if (!drawMode || !drawingRef.current) return;
        const s = drawingRef.current; s.points.push(norm(e));
        const c = ctx(); const canvas = canvasRef.current;
        const w = canvas.clientWidth, h = canvas.clientHeight; const n = s.points.length;
        if (n < 2) return;
        c.save(); strokeStyle(c, s); c.beginPath();
        c.moveTo(s.points[n - 2].x * w, s.points[n - 2].y * h);
        c.lineTo(s.points[n - 1].x * w, s.points[n - 1].y * h);
        c.stroke(); c.restore();
    };
    const onUp = () => {
        if (!drawingRef.current) return;
        (strokesRef.current[index] || (strokesRef.current[index] = [])).push(drawingRef.current);
        drawingRef.current = null;
    };

    const undo = () => { const a = strokesRef.current[index]; if (a && a.length) { a.pop(); redraw(); } };
    const clearSlide = () => { strokesRef.current[index] = []; redraw(); };
    const go = (d) => setIndex((i) => Math.min(total - 1, Math.max(0, i + d)));

    useEffect(() => {
        const onKey = (e) => {
            if (drawMode || e.target.tagName === 'INPUT') return;
            if (e.key === 'ArrowLeft') go(1);
            else if (e.key === 'ArrowRight') go(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [drawMode, total]);

    const toggleFs = () => {
        const el = stageRef.current;
        if (!document.fullscreenElement) el && el.requestFullscreen && el.requestFullscreen();
        else document.exitFullscreen && document.exitFullscreen();
    };

    if (!total) return <div className="summary-stage-empty">لا يوجد محتوى لعرضه.</div>;
    const slide = slides[index];

    return (
        <div className="slide-stage" ref={stageRef}>
            <div className={`slide ${slide.type === 'intro' ? 'slide-intro' : ''}`} ref={slideRef}>
                {slide.type === 'topic' && (
                    <div className="slide-header">
                        <span className="slide-topic">{slide.title}</span>
                        <span className="slide-brand"><img src={sqbLogo} alt="" /> SQB</span>
                    </div>
                )}

                {slide.type === 'intro' ? (
                    <div className="slide-body slide-intro-body sum-doc" dir="rtl">
                        <div className="slide-hero">
                            <img className="slide-hero-logo" src={sqbLogo} alt="SQB" />
                            <span className="slide-hero-brand">SQB</span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: slide.html }} />
                    </div>
                ) : (
                    <div className="slide-body sum-doc" dir="rtl" dangerouslySetInnerHTML={{ __html: slide.html }} />
                )}

                {slide.type === 'topic' && (
                    <div className="slide-footer"><span>SQB</span><span>{index + 1} / {total}</span></div>
                )}

                <canvas
                    ref={canvasRef}
                    className="slide-canvas"
                    style={{ pointerEvents: drawMode ? 'auto' : 'none', cursor: drawMode ? 'crosshair' : 'default' }}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerLeave={onUp}
                />
            </div>

            <div className="slide-toolbar">
                <div className="stb-group">
                    <button className="stb-btn" onClick={() => go(-1)} disabled={index <= 0} aria-label="السابق">‹</button>
                    <span className="stb-counter">{index + 1} / {total}</span>
                    <button className="stb-btn" onClick={() => go(1)} disabled={index >= total - 1} aria-label="التالي">›</button>
                </div>
                <div className="stb-sep" />
                <div className="stb-group">
                    <button className={`stb-btn ${tool === 'move' ? 'on' : ''}`} title="تصفّح" onClick={() => setTool('move')}>🖱️</button>
                    <button className={`stb-btn ${tool === 'pen' ? 'on' : ''}`} title="قلم" onClick={() => setTool('pen')}>✏️</button>
                    <button className={`stb-btn ${tool === 'highlighter' ? 'on' : ''}`} title="تظليل" onClick={() => setTool('highlighter')}>🖊️</button>
                    <button className={`stb-btn ${tool === 'eraser' ? 'on' : ''}`} title="ممحاة" onClick={() => setTool('eraser')}>🧽</button>
                </div>
                <div className="stb-group">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            className={`stb-color ${color === c ? 'on' : ''}`}
                            style={{ background: c }}
                            aria-label={`لون ${c}`}
                            onClick={() => { setColor(c); if (tool === 'move' || tool === 'eraser') setTool('pen'); }}
                        />
                    ))}
                </div>
                <div className="stb-sep" />
                <div className="stb-group">
                    <button className="stb-btn" title="تراجع" onClick={undo}>↶</button>
                    <button className="stb-btn" title="مسح رسم الشريحة" onClick={clearSlide}>🗑️</button>
                    <button className="stb-btn" title="ملء الشاشة" onClick={toggleFs}>⛶</button>
                </div>
            </div>
        </div>
    );
};

export default SlideDeck;
