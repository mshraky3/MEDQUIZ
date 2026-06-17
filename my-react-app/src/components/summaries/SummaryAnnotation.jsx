import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Drawing overlay for the full-screen summary modal.
 *
 * The <canvas> is absolutely positioned inside the modal's scroll container
 * (`.panel-body`) and sized to its full scroll height, so annotations scroll
 * naturally with the content — no scroll-sync maths needed. Strokes are stored
 * in content-pixel space and replayed on resize / tab change.
 *
 * When `tool === 'move'` the canvas is click-through (pointer-events:none) so
 * the interactive questions underneath stay usable.
 *
 * Imperative ref: { undo(), clear() }.
 */
const TOOL_WIDTH = { pen: 3, highlighter: 16, eraser: 22 };

const SummaryAnnotation = forwardRef(({ tool, color, containerRef }, ref) => {
    const canvasRef = useRef(null);
    const strokes = useRef([]);   // [{ mode, color, width, points:[{x,y}] }]
    const drawing = useRef(null);

    const getCtx = () => canvasRef.current && canvasRef.current.getContext('2d');

    const applyStyle = (c, s) => {
        c.lineJoin = 'round';
        c.lineCap = 'round';
        if (s.mode === 'eraser') {
            c.globalCompositeOperation = 'destination-out';
            c.lineWidth = s.width;
            c.globalAlpha = 1;
        } else {
            c.globalCompositeOperation = 'source-over';
            c.strokeStyle = s.color;
            c.lineWidth = s.width;
            c.globalAlpha = s.mode === 'highlighter' ? 0.32 : 1;
        }
    };

    const strokePath = (c, s) => {
        if (s.points.length < 1) return;
        applyStyle(c, s);
        c.beginPath();
        c.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) c.lineTo(s.points[i].x, s.points[i].y);
        if (s.points.length === 1) c.lineTo(s.points[0].x + 0.1, s.points[0].y + 0.1);
        c.stroke();
    };

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        const c = getCtx();
        if (!canvas || !c) return;
        const dpr = window.devicePixelRatio || 1;
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        for (const s of strokes.current) strokePath(c, s);
        c.globalCompositeOperation = 'source-over';
        c.globalAlpha = 1;
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        const cont = containerRef.current;
        if (!canvas || !cont) return;
        const dpr = window.devicePixelRatio || 1;
        const w = cont.clientWidth;
        const h = Math.max(cont.scrollHeight, cont.clientHeight);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        redraw();
    }, [containerRef, redraw]);

    useEffect(() => {
        resize();
        const cont = containerRef.current;
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
        if (ro && cont) ro.observe(cont);
        window.addEventListener('resize', resize);
        return () => {
            if (ro) ro.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, [resize, containerRef]);

    useImperativeHandle(ref, () => ({
        undo: () => { strokes.current.pop(); redraw(); },
        clear: () => { strokes.current = []; redraw(); },
    }));

    const pos = (e) => {
        const r = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e) => {
        if (tool === 'move') return;
        e.preventDefault();
        try { canvasRef.current.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
        drawing.current = { mode: tool, color, width: TOOL_WIDTH[tool] || 3, points: [pos(e)] };
    };

    const onMove = (e) => {
        if (!drawing.current) return;
        drawing.current.points.push(pos(e));
        const c = getCtx();
        if (c) strokePath(c, drawing.current); // incremental draw; full redraw happens on pointer-up
    };

    const onUp = () => {
        if (!drawing.current) return;
        strokes.current.push(drawing.current);
        drawing.current = null;
        redraw();
    };

    return (
        <canvas
            ref={canvasRef}
            className="panel-canvas"
            style={{
                pointerEvents: tool === 'move' ? 'none' : 'auto',
                touchAction: tool === 'move' ? 'auto' : 'none',
                cursor: tool === 'move' ? 'default' : 'crosshair',
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
        />
    );
});

SummaryAnnotation.displayName = 'SummaryAnnotation';

export default SummaryAnnotation;
