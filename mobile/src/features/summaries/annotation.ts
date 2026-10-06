/**
 * The drawing layer that sits over a lesson, as plain browser JavaScript for the
 * lesson WebView. A port of the website's SummaryAnnotation.jsx with the same
 * behaviour:
 *
 *  - Strokes are anchored to the CONTENT, not to the screen: each point is stored
 *    as "element #N, at (fx, fy) within that element's box". Rotating the device
 *    reflows the text, so canvas-relative coordinates would drift away from the
 *    sentence they were drawn over; element-relative ones move with the paragraph.
 *    Points that land in the gaps between elements fall back to page fractions.
 *  - `touch-action: pinch-zoom` while a tool is active keeps two-finger zoom while
 *    single-finger input draws; a stroke begun with one finger is discarded the
 *    moment a second lands, so starting a pinch never leaves a stray line.
 *  - With the 'move' tool the canvas is click-through, so the page scrolls.
 *
 * Commands from the app: window.sqb.setTool(name) / setColor(hex) / undo() / clear().
 * Messages to the app: { type: 'ready' | 'link', url? }.
 */
export const ANNOTATION_JS = String.raw`
(function () {
  var canvas = document.getElementById('sqb-canvas');
  var root = document.getElementById('sqb-root');
  if (!canvas || !root) return;

  function send(msg) {
    try {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      else if (window.parent !== window) window.parent.postMessage({ sqb: msg }, '*');
    } catch (e) {}
  }

  var TOOL_WIDTH = { pen: 3, highlighter: 16, eraser: 22 };
  var ANCHOR = 'p, li, h1, h2, h3, h4, h5, td, th, figure, figcaption, pre, blockquote, .deck-card, .deck-block, .sum-callout, img, svg, table';
  var tool = 'move', color = '#2563eb';
  var strokes = [], drawing = null, pointers = {}, anchors = [], box = { w: 0, h: 0 };

  function ctx() { return canvas.getContext('2d'); }
  function indexAnchors() { anchors = Array.prototype.slice.call(root.querySelectorAll(ANCHOR)); }

  function applyStyle(c, s) {
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
  }

  // Resolve a stored point against the element's CURRENT position: this is what
  // makes an annotation follow its paragraph.
  function toPx(p, canvasRect, cache) {
    if (p.el < 0) return { x: p.fx * box.w, y: p.fy * box.h };
    var el = anchors[p.el];
    if (!el || !el.isConnected) return null;
    var r = cache[p.el];
    if (!r) { r = el.getBoundingClientRect(); cache[p.el] = r; }
    return { x: (r.left - canvasRect.left) + p.fx * r.width, y: (r.top - canvasRect.top) + p.fy * r.height };
  }

  function strokePath(c, s, canvasRect, cache) {
    if (!s.points.length) return;
    var pts = [];
    for (var i = 0; i < s.points.length; i++) { var q = toPx(s.points[i], canvasRect, cache); if (q) pts.push(q); }
    if (!pts.length) return;
    applyStyle(c, s);
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    for (var j = 1; j < pts.length; j++) c.lineTo(pts[j].x, pts[j].y);
    if (pts.length === 1) c.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
    c.stroke();
  }

  function redraw() {
    var c = ctx();
    var dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    var rect = canvas.getBoundingClientRect(), cache = {};
    for (var i = 0; i < strokes.length; i++) strokePath(c, strokes[i], rect, cache);
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var w = document.documentElement.clientWidth;
    var h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    box = { w: w, h: h };
    // Bail out when nothing changed: the canvas is sized to the document, so
    // resizing it must not feed back into the observer that triggered it.
    var same = canvas.width === Math.floor(w * dpr) && canvas.height === Math.floor(h * dpr);
    if (!same) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    redraw();
  }

  var frame = 0;
  function schedule() { if (frame) return; frame = requestAnimationFrame(function () { frame = 0; resize(); }); }

  // Wide tables scroll sideways inside their own box, with an edge shadow while
  // more is off-screen, so horizontal scroll is discoverable.
  function wrapTables() {
    var tables = root.querySelectorAll('.sub-summary table, table');
    Array.prototype.forEach.call(tables, function (table) {
      if (table.closest && table.closest('.table-scroll')) return;
      var outer = document.createElement('div'); outer.className = 'table-scroll';
      var inner = document.createElement('div'); inner.className = 'table-scroll-inner';
      table.parentNode.insertBefore(outer, table);
      inner.appendChild(table); outer.appendChild(inner);
      var update = function () {
        var more = inner.scrollWidth - inner.clientWidth - inner.scrollLeft > 1;
        outer.classList.toggle('can-scroll', more);
      };
      update();
      inner.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    });
  }

  function pos(e) {
    var rect = canvas.getBoundingClientRect();
    // The canvas sits above the text, so hide it for the hit-test.
    var prev = canvas.style.pointerEvents;
    canvas.style.pointerEvents = 'none';
    var hit = document.elementFromPoint(e.clientX, e.clientY);
    canvas.style.pointerEvents = prev;
    var el = hit && hit.closest ? hit.closest(ANCHOR) : null;
    var idx = el ? anchors.indexOf(el) : -1;
    if (idx >= 0) {
      var r = el.getBoundingClientRect();
      return { el: idx, fx: r.width ? (e.clientX - r.left) / r.width : 0, fy: r.height ? (e.clientY - r.top) / r.height : 0 };
    }
    return { el: -1, fx: box.w ? (e.clientX - rect.left) / box.w : 0, fy: box.h ? (e.clientY - rect.top) / box.h : 0 };
  }

  function count() { var n = 0; for (var k in pointers) if (pointers[k]) n++; return n; }
  function abortStroke() { if (!drawing) return; drawing = null; redraw(); }

  canvas.addEventListener('pointerdown', function (e) {
    if (tool === 'move') return;
    pointers[e.pointerId] = true;
    if (count() > 1) { abortStroke(); return; }
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    drawing = { mode: tool, color: color, width: TOOL_WIDTH[tool] || 3, points: [pos(e)] };
  });
  canvas.addEventListener('pointermove', function (e) {
    if (count() > 1 || !drawing) return;
    drawing.points.push(pos(e));
    strokePath(ctx(), drawing, canvas.getBoundingClientRect(), {});
  });
  function end(e) {
    if (e && e.pointerId != null) delete pointers[e.pointerId];
    if (!drawing) return;
    strokes.push(drawing);
    drawing = null;
    redraw();
  }
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointerleave', end);
  canvas.addEventListener('pointercancel', function (e) { if (e && e.pointerId != null) delete pointers[e.pointerId]; abortStroke(); });

  function applyTool() {
    var move = tool === 'move';
    canvas.style.pointerEvents = move ? 'none' : 'auto';
    canvas.style.touchAction = move ? 'auto' : 'pinch-zoom';
  }

  // External links open in the system browser, never inside the lesson.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    e.preventDefault();
    send({ type: 'link', url: a.href });
  });

  window.sqb = {
    setTool: function (t) { tool = t; applyTool(); },
    setColor: function (c) { color = c; },
    undo: function () { strokes.pop(); redraw(); },
    clear: function () { strokes = []; redraw(); }
  };

  wrapTables();
  indexAnchors();
  applyTool();
  resize();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(document.body);
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', function () { schedule(); setTimeout(schedule, 250); });
  // Images and fonts finishing late change the document height.
  window.addEventListener('load', function () { indexAnchors(); schedule(); });
  send({ type: 'ready' });
})();
`;
