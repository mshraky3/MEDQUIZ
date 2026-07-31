import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Drawing overlay for the full-screen summary modal.
 *
 * The <canvas> is absolutely positioned inside the modal's scroll container
 * (`.panel-body`) and sized to its full scroll height, so annotations scroll
 * naturally with the content.
 *
 * ── Strokes are anchored to the CONTENT, not to the screen ────────────────
 * Each point is stored as "element #N, at (fx, fy) within that element's box"
 * rather than as a position on the canvas. This is the whole point: rotating
 * the device REFLOWS the text, so a paragraph that was 30% down the document
 * in portrait might be 45% down in landscape. Canvas-relative coordinates —
 * pixels OR fractions — therefore drift away from the sentence they were
 * drawn over. Element-relative coordinates move with the paragraph, so a
 * highlight over "VSD: small → asymptomatic…" stays on that sentence no
 * matter how the page reflows.
 *
 * Elements are identified by their index in a document-order walk of the
 * container, captured once per mount. The DOM structure never changes while a
 * summary is open (only its layout does), so the index is stable.
 *
 * Points that land in the gaps between elements fall back to container-
 * relative fractions, which is the best available anchor for empty space.
 *
 * ── Two-finger zoom while a tool is active ────────────────────────────────
 * `touch-action: pinch-zoom` hands pinch gestures to the browser while we
 * keep single-finger input for drawing. `none` (the old value) swallowed
 * every touch gesture, which is why zooming was impossible without switching
 * back to the move tool. A stroke started with one finger is discarded the
 * moment a second finger lands, so beginning a pinch never leaves a stray
 * line behind.
 *
 * When `tool === 'move'` the canvas is click-through (pointer-events:none) so
 * the interactive questions underneath stay usable.
 *
 * Imperative ref: { undo(), clear() }.
 */
const TOOL_WIDTH = { pen: 3, highlighter: 16, eraser: 22 };

// Elements worth anchoring to: the ones that actually carry text or figures.
const ANCHOR_SELECTOR = 'p, li, h1, h2, h3, h4, h5, td, th, figure, figcaption,'
    + ' pre, blockquote, .deck-card, .deck-block, .sum-callout, img, svg, table';

const SummaryAnnotation = forwardRef(({ tool, color, containerRef }, ref) => {
    const canvasRef = useRef(null);
    // [{ mode, color, width, points:[{ el, fx, fy }] }]
    //   el = index into anchors.current, or -1 for "container-relative"
    const strokes = useRef([]);
    const drawing = useRef(null);
    const activePointers = useRef(new Set());
    // Ordered list of anchorable elements, rebuilt whenever the content changes.
    const anchors = useRef([]);
    const box = useRef({ w: 0, h: 0 });

    const getCtx = () => canvasRef.current && canvasRef.current.getContext('2d');

    /** Snapshot the anchorable elements in document order. */
    const indexAnchors = useCallback(() => {
        const cont = containerRef.current;
        anchors.current = cont ? Array.from(cont.querySelectorAll(ANCHOR_SELECTOR)) : [];
    }, [containerRef]);

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

    /**
     * Resolve a stored point to canvas pixels using the element's CURRENT
     * position — this is what makes an annotation follow its paragraph.
     * `rectCache` avoids re-measuring the same element for every point.
     */
    const toPx = (p, canvasRect, rectCache) => {
        if (p.el < 0) return { x: p.fx * box.current.w, y: p.fy * box.current.h };
        const el = anchors.current[p.el];
        if (!el || !el.isConnected) return null; // content changed — drop the point
        let r = rectCache.get(p.el);
        if (!r) { r = el.getBoundingClientRect(); rectCache.set(p.el, r); }
        return {
            x: (r.left - canvasRect.left) + p.fx * r.width,
            y: (r.top - canvasRect.top) + p.fy * r.height,
        };
    };

    const strokePath = (c, s, canvasRect, rectCache) => {
        if (!s.points.length) return;
        const pts = s.points.map((p) => toPx(p, canvasRect, rectCache)).filter(Boolean);
        if (!pts.length) return;
        applyStyle(c, s);
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
        const canvasRect = canvas.getBoundingClientRect();
        const rectCache = new Map();
        for (const s of strokes.current) strokePath(c, s, canvasRect, rectCache);
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
        box.current = { w, h };
        // The canvas is an absolutely-positioned child of the observed
        // container and is sized to its scroll height, so resizing it feeds
        // straight back into the ResizeObserver. Bail out when nothing actually
        // changed — otherwise the observer ping-pongs and the browser reports
        // "ResizeObserver loop completed with undelivered notifications".
        const sameSize = canvas.width === Math.floor(w * dpr)
            && canvas.height === Math.floor(h * dpr);
        if (!sameSize) {
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
        }
        // Redraw regardless: a reflow can move paragraphs without changing the
        // container's overall size, and the strokes follow the paragraphs.
        redraw();
    }, [containerRef, redraw]);

    useEffect(() => {
        indexAnchors();
        resize();
        const cont = containerRef.current;
        let frame = 0;
        const scheduleResize = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => { frame = 0; resize(); });
        };
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleResize) : null;
        if (ro && cont) ro.observe(cont);
        window.addEventListener('resize', scheduleResize);
        // Rotation reflows the text. orientationchange can fire before layout
        // settles, so run a second pass shortly after to pick up the final
        // positions of every paragraph.
        const onOrientation = () => { scheduleResize(); setTimeout(scheduleResize, 250); };
        window.addEventListener('orientationchange', onOrientation);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            if (ro) ro.disconnect();
            window.removeEventListener('resize', scheduleResize);
            window.removeEventListener('orientationchange', onOrientation);
        };
    }, [resize, indexAnchors, containerRef]);

    useImperativeHandle(ref, () => ({
        undo: () => { strokes.current.pop(); redraw(); },
        clear: () => { strokes.current = []; redraw(); },
    }));

    /**
     * Turn a pointer event into a content-anchored point: find the innermost
     * anchorable element under the cursor and record the position *within* it.
     */
    const pos = (e) => {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // The canvas sits above the text, so hide it for the hit-test.
        const prev = canvasRef.current.style.pointerEvents;
        canvasRef.current.style.pointerEvents = 'none';
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        canvasRef.current.style.pointerEvents = prev;

        const el = hit && hit.closest(ANCHOR_SELECTOR);
        const idx = el ? anchors.current.indexOf(el) : -1;
        if (idx >= 0) {
            const r = el.getBoundingClientRect();
            return {
                el: idx,
                fx: r.width ? (e.clientX - r.left) / r.width : 0,
                fy: r.height ? (e.clientY - r.top) / r.height : 0,
            };
        }
        // Empty space between elements — anchor to the container instead.
        return {
            el: -1,
            fx: box.current.w ? (e.clientX - canvasRect.left) / box.current.w : 0,
            fy: box.current.h ? (e.clientY - canvasRect.top) / box.current.h : 0,
        };
    };

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
        if (activePointers.current.size > 1 || !drawing.current) return;
        drawing.current.points.push(pos(e));
        const c = getCtx();
        if (!c) return;
        // Incremental draw; the full redraw happens on pointer-up.
        strokePath(c, drawing.current, canvasRef.current.getBoundingClientRect(), new Map());
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
