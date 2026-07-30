import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Drawing overlay for the full-screen summary modal.
 *
 * The <canvas> is absolutely positioned inside the modal's scroll container
 * (`.panel-body`) and sized to its full scroll height, so annotations scroll
 * naturally with the content — no scroll-sync maths needed.
 *
 * ── Coordinates are normalized ────────────────────────────────────────────
 * Points are stored as fractions of the canvas box (0..1 on each axis), not
 * as pixels. Pixels broke on every reflow: rotating the device changes the
 * container's width and its scroll height, so replaying absolute pixel paths
 * dropped strokes somewhere else entirely on the page. Fractions scale with
 * the content, so a mark stays over the passage it was drawn on when the
 * screen turns from portrait to landscape.
 *
 * Line widths stay in CSS pixels (they are NOT scaled) so a stroke doesn't
 * become fat or hairline after a resize.
 *
 * ── Two-finger zoom while a tool is active ────────────────────────────────
 * `touch-action: pinch-zoom` hands pinch gestures to the browser while we
 * keep single-finger input for drawing. The old value (`none`) swallowed
 * every touch gesture, which is why zooming was impossible without first
 * switching back to the move tool. A stroke started with one finger is
 * discarded the moment a second finger lands, so beginning a pinch never
 * leaves a stray line behind.
 *
 * Pinch-zoom is *visual viewport* zoom: it magnifies without reflowing, so
 * the canvas and the text underneath scale together and annotations stay
 * exactly where they were drawn.
 *
 * When `tool === 'move'` the canvas is click-through (pointer-events:none) so
 * the interactive questions underneath stay usable.
 *
 * Imperative ref: { undo(), clear() }.
 */
const TOOL_WIDTH = { pen: 3, highlighter: 16, eraser: 22 };

const SummaryAnnotation = forwardRef(({ tool, color, containerRef }, ref) => {
    const canvasRef = useRef(null);
    // [{ mode, color, width, points:[{ nx, ny }] }] — nx/ny are 0..1 fractions
    const strokes = useRef([]);
    const drawing = useRef(null);
    // Every pointer currently on the canvas. Size > 1 means the user is making
    // a gesture (pinch), not drawing.
    const activePointers = useRef(new Set());
    // Live CSS size of the canvas, used to convert fractions → pixels.
    const box = useRef({ w: 0, h: 0 });

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

    /** Fraction → CSS pixel, against the canvas's current box. */
    const toPx = (p) => ({ x: p.nx * box.current.w, y: p.ny * box.current.h });

    const strokePath = (c, s) => {
        if (s.points.length < 1) return;
        applyStyle(c, s);
        const pts = s.points.map(toPx);
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
        if (pts.length === 1) c.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
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
        // The canvas is an absolutely-positioned child of the observed
        // container and is sized to its scroll height, so resizing it feeds
        // straight back into the ResizeObserver. Bail out when nothing actually
        // changed — otherwise the observer ping-pongs and the browser reports
        // "ResizeObserver loop completed with undelivered notifications".
        if (canvas.width === Math.floor(w * dpr) && canvas.height === Math.floor(h * dpr)) {
            box.current = { w, h };
            return;
        }
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        // Strokes are fractions, so the new box is all the replay needs.
        box.current = { w, h };
        redraw();
    }, [containerRef, redraw]);

    useEffect(() => {
        resize();
        const cont = containerRef.current;
        // Never resize during observer delivery — defer to the next frame so
        // the layout write lands outside the ResizeObserver callback.
        let frame = 0;
        const scheduleResize = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => { frame = 0; resize(); });
        };
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleResize) : null;
        if (ro && cont) ro.observe(cont);
        window.addEventListener('resize', scheduleResize);
        // Rotation reflows the text. The ResizeObserver catches the box change,
        // but orientationchange can fire before layout settles, so run a second
        // pass shortly after to pick up the final size.
        const onOrientation = () => { scheduleResize(); setTimeout(scheduleResize, 250); };
        window.addEventListener('orientationchange', onOrientation);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            if (ro) ro.disconnect();
            window.removeEventListener('resize', scheduleResize);
            window.removeEventListener('orientationchange', onOrientation);
        };
    }, [resize, containerRef]);

    useImperativeHandle(ref, () => ({
        undo: () => { strokes.current.pop(); redraw(); },
        clear: () => { strokes.current = []; redraw(); },
    }));

    /** Pointer position as a 0..1 fraction of the canvas box. */
    const pos = (e) => {
        const r = canvasRef.current.getBoundingClientRect();
        const w = r.width || 1;
        const h = r.height || 1;
        return { nx: (e.clientX - r.left) / w, ny: (e.clientY - r.top) / h };
    };

    /** Drop the in-progress stroke and repaint without it. */
    const abortStroke = () => {
        if (!drawing.current) return;
        drawing.current = null;
        redraw();
    };

    const onDown = (e) => {
        if (tool === 'move') return;
        activePointers.current.add(e.pointerId);

        // Second finger down → this is a pinch, not a stroke. Hand the gesture
        // to the browser and remove whatever the first finger had started.
        if (activePointers.current.size > 1) {
            abortStroke();
            return;
        }

        e.preventDefault();
        try { canvasRef.current.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
        drawing.current = { mode: tool, color, width: TOOL_WIDTH[tool] || 3, points: [pos(e)] };
    };

    const onMove = (e) => {
        // Ignore movement entirely while more than one pointer is down.
        if (activePointers.current.size > 1 || !drawing.current) return;
        drawing.current.points.push(pos(e));
        const c = getCtx();
        if (c) strokePath(c, drawing.current); // incremental; full redraw on pointer-up
    };

    const endPointer = (e) => {
        if (e && e.pointerId != null) activePointers.current.delete(e.pointerId);
        if (!drawing.current) return;
        strokes.current.push(drawing.current);
        drawing.current = null;
        redraw();
    };

    // Fired when the browser takes the gesture over (e.g. a pinch begins).
    const onCancel = (e) => {
        if (e && e.pointerId != null) activePointers.current.delete(e.pointerId);
        abortStroke();
    };

    return (
        <canvas
            ref={canvasRef}
            className="panel-canvas"
            style={{
                pointerEvents: tool === 'move' ? 'none' : 'auto',
                // 'pinch-zoom' (not 'none'): the browser keeps two-finger zoom
                // while single-finger input stays ours for drawing.
                touchAction: tool === 'move' ? 'auto' : 'pinch-zoom',
                cursor: tool === 'move' ? 'default' : 'crosshair',
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={endPointer}
            onPointerLeave={endPointer}
            onPointerCancel={onCancel}
        />
    );
});

SummaryAnnotation.displayName = 'SummaryAnnotation';

export default SummaryAnnotation;
