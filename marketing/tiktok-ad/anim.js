// Shared timeline helpers for the ad pages. Everything is a pure function of t,
// so any frame can be rendered on its own.
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeIn = x => x * x * x;
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// Fade/slide element in over [a, a+d] and out over [b, b+d2]. Extra transform appended via `extra`.
function show(el, t, a, b, { dy = 60, dx = 0, s0 = 1, r0 = 0, d = 0.45, d2 = 0.3, ease = easeOut, outDy = -40, outS = 1, extra = '' } = {}) {
  el = typeof el === 'string' ? $(el) : el;
  const pin = ease(prog(t, a, a + d));
  const pout = b == null ? 0 : easeIn(prog(t, b, b + d2));
  const o = clamp(pin) * (1 - pout);
  const y = (1 - pin) * dy + pout * outDy;
  const s = (s0 + (1 - s0) * pin) * (1 + (outS - 1) * pout);
  el.style.opacity = o.toFixed(3);
  el.style.transform = `translate(${((1 - pin) * dx).toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(4)}) rotate(${((1 - pin) * r0).toFixed(2)}deg) ${extra}`;
  el.style.visibility = o < 0.002 ? 'hidden' : 'visible';
  return o;
}

// Deterministic pseudo-random numbers.
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

// Confetti: call makeConfetti(container, n, colors, seed) once, then confetti(t, bursts) per frame.
function makeConfetti(container, n, colors, seed = 11) {
  const r = rng(seed), parts = [];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    const w = 14 + r() * 18, h = r() < .5 ? w : w * 0.45;
    el.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;border-radius:${r() < .3 ? '50%' : '3px'};background:${colors[i % colors.length]};opacity:0`;
    container.appendChild(el);
    const ang = r() * Math.PI * 2, sp = 500 + r() * 1300;
    parts.push({ el, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 700, rot: r() * 720 - 360, spin: r() * 900 - 450, delay: r() * .12 });
  }
  return parts;
}
function confetti(parts, t, bursts) {
  // bursts: [{t, x, y}] — each particle belongs to the most recent burst.
  const b = bursts.filter(b => t >= b.t).pop();
  parts.forEach(p => {
    if (!b) { p.el.style.opacity = 0; return; }
    const dt = t - b.t - p.delay;
    if (dt < 0 || dt > 2.6) { p.el.style.opacity = 0; return; }
    const drag = (1 - Math.exp(-dt * 2.2)) / 2.2;
    const x = b.x + p.vx * drag, y = b.y + p.vy * drag + 900 * dt * dt * .5;
    p.el.style.opacity = clamp(1.4 - dt / 2);
    p.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(p.rot + p.spin * dt).toFixed(1)}deg)`;
  });
}

// White flash on cuts.
function flash(el, t, cuts, peak = .35) {
  let f = 0;
  cuts.forEach(c => { const d = t - c; if (d >= 0 && d < .18) f = Math.max(f, peak * (1 - d / .18)); });
  el.style.opacity = f.toFixed(3);
}
