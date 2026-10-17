// Colour maths for the dark-theme token generator (scripts/theme/convert-css.mjs).
// sRGB <-> OKLCH, WCAG contrast, and the role-aware light -> dark mapping.
// Pure functions, no dependencies, so the generator stays reproducible.

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const NAMED = { white: [255, 255, 255], black: [0, 0, 0] };

// Parse "#abc", "#aabbcc", "#aabbccdd", "rgb(..)", "rgba(..)", "white", "black".
// Returns { r, g, b, a } with r/g/b 0-255 and a 0-1, or null.
export function parseColor(str) {
    const s = str.trim().toLowerCase();
    if (NAMED[s]) { const [r, g, b] = NAMED[s]; return { r, g, b, a: 1 }; }
    let m = s.match(/^#([0-9a-f]{3,8})$/);
    if (m) {
        let h = m[1];
        if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
        if (h.length !== 6 && h.length !== 8) return null;
        const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
        return { r, g, b, a };
    }
    m = s.match(/^rgba?\(([^)]*)\)$/);
    if (m) {
        const parts = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean);
        if (parts.length < 3) return null;
        const num = (p, max) => (p.endsWith('%') ? (parseFloat(p) / 100) * max : parseFloat(p));
        const r = num(parts[0], 255), g = num(parts[1], 255), b = num(parts[2], 255);
        const a = parts[3] !== undefined ? num(parts[3], 1) : 1;
        if ([r, g, b, a].some((v) => Number.isNaN(v))) return null;
        return { r, g, b, a };
    }
    return null;
}

const toHex2 = (v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
export const hexOf = ({ r, g, b }) => `${toHex2(r)}${toHex2(g)}${toHex2(b)}`;

// Alpha written the way a stylesheet would: 0.06, 0.1, 0.035.
const fmtAlpha = (a) => String(Math.round(a * 1000) / 1000);

export function formatColor({ r, g, b, a }) {
    if (a >= 1) return `#${hexOf({ r, g, b })}`;
    // #rrggbbaa alphas are n/255 (0x22 = 0.1333...): three decimals would move
    // the rendered colour by one step, so those stay in hex.
    if (Math.abs(Math.round(a * 1000) / 1000 - a) > 1e-6) return `#${hexOf({ r, g, b })}${toHex2(a * 255)}`;
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${fmtAlpha(a)})`;
}

// --- sRGB / OKLab ---------------------------------------------------------
const srgbToLinear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const linearToSrgb = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function toOklch({ r, g, b }) {
    const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const C = Math.sqrt(A * A + B * B);
    let H = (Math.atan2(B, A) * 180) / Math.PI;
    if (H < 0) H += 360;
    return { L, C, H };
}

function oklchToRgbRaw({ L, C, H }) {
    const hr = (H * Math.PI) / 180;
    const A = C * Math.cos(hr), B = C * Math.sin(hr);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return {
        r: linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        g: linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        b: linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    };
}

// Back to sRGB, reducing chroma until the colour fits the gamut.
export function fromOklch({ L, C, H }) {
    let c = C;
    for (let i = 0; i < 40; i += 1) {
        const rgb = oklchToRgbRaw({ L, C: c, H });
        if ([rgb.r, rgb.g, rgb.b].every((v) => v >= -0.5 && v <= 255.5)) {
            return { r: Math.round(clamp(rgb.r, 0, 255)), g: Math.round(clamp(rgb.g, 0, 255)), b: Math.round(clamp(rgb.b, 0, 255)), a: 1 };
        }
        c *= 0.9;
    }
    const rgb = oklchToRgbRaw({ L, C: 0, H });
    return { r: Math.round(clamp(rgb.r, 0, 255)), g: Math.round(clamp(rgb.g, 0, 255)), b: Math.round(clamp(rgb.b, 0, 255)), a: 1 };
}

// --- WCAG -----------------------------------------------------------------
export function luminance({ r, g, b }) {
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
export function contrast(c1, c2) {
    const a = luminance(c1), b = luminance(c2);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// --- The dark palette anchors ---------------------------------------------
// Hand-picked; index.css carries the same values for the semantic tokens.
export const DARK = {
    bg: parseColor('#0b1220'),
    surface: parseColor('#121a2b'),
    surface2: parseColor('#172238'),
};
// Neutral greys pick up the Scholar-blue hue in dark, so the theme reads as
// navy rather than flat charcoal.
const NAVY_HUE = 262;
const VIVID = 0.14; // OKLCH chroma above which a light colour is a "brand fill", not a surface

const isNeutral = (lch) => lch.C < 0.02;

function tint(lch, L, cScale, cMax, neutralC) {
    const neutral = isNeutral(lch);
    return {
        L,
        C: neutral ? neutralC : Math.min(lch.C * cScale, cMax),
        H: neutral ? NAVY_HUE : lch.H,
    };
}

// Text in dark: mirror the lightness (darker ink in light -> brighter ink in
// dark, so the hierarchy survives), then push it up until it clears AA on the
// lightest common dark panel.
export function darkInk(rgb) {
    const lch = toOklch(rgb);
    let L = clamp(0.96 - (lch.L - 0.2) * 0.5, 0.72, 0.96);
    let out = fromOklch(tint(lch, L, 1, 0.16, 0.02));
    while (contrast(out, DARK.surface2) < 4.6 && L < 0.99) {
        L += 0.01;
        out = fromOklch(tint(lch, L, 1, 0.16, 0.02));
    }
    return out;
}

// A light surface (white-ish panel, pastel chip, track) in dark.
export function darkSurface(rgb) {
    const lch = toOklch(rgb);
    const L = 0.235 + (1 - lch.L) * 0.75;
    return fromOklch(tint(lch, L, 1.1, 0.065, 0.035));
}

export function darkLine(rgb) {
    const lch = toOklch(rgb);
    const L = 0.3 + (1 - lch.L) * 0.55;
    return fromOklch(tint(lch, L, 1.1, 0.07, 0.04));
}

/**
 * role: 'bg' | 'fg' | 'line' | 'shade' | 'graphic'
 * Returns the dark colour, or null when the light colour already works on
 * the dark theme and should stay a literal.
 */
export function mapToDark(color, role) {
    const lch = toOklch(color);
    const a = color.a;
    const light = lch.L >= 0.8;
    const dark = lch.L < 0.45;
    const vivid = lch.C >= VIVID;
    const darkNeutral = lch.L < 0.35 && lch.C < 0.06;
    const withA = (rgb, alpha = a) => ({ ...rgb, a: clamp(alpha, 0, 1) });

    if (role === 'shade') {
        if (darkNeutral) return { r: 0, g: 0, b: 0, a: clamp(Math.max(a * 2.2, 0.2), 0, 0.6) };
        if (light && lch.C < 0.03) return withA(color, a * 0.12);
        return null;
    }

    if (a < 1) {
        if (role === 'fg') return dark ? withA(darkInk(color)) : null;
        if (darkNeutral) {
            // Small dark tints (hover washes, input fills) darken a light page;
            // on a dark page the same job is done by a light wash. Big ones are
            // scrims and stay.
            if (a < 0.2) return { r: 226, g: 232, b: 240, a: clamp(a * 1.3, 0, 1) };
            return null;
        }
        // A faint white wash or rule is only visible on a dark band (hero,
        // footer, banner) — it already belongs to a dark surface. A strong one
        // (>= 0.5) is a frosted panel on a light page and goes dark with it.
        if (light && lch.C < 0.03 && lch.L > 0.97 && a < 0.5 && role !== 'fg') return null;
        if (light && lch.C < VIVID) return withA(role === 'line' ? darkLine(color) : darkSurface(color));
        // Chromatic tints get a little more presence on navy.
        if (role !== 'line' && lch.C >= 0.05 && a < 0.25) return withA(color, a * 1.5);
        return null;
    }

    if (role === 'fg') return lch.L < 0.75 ? darkInk(color) : null;
    if (role === 'line') {
        if (lch.L >= 0.75 && !vivid) return darkLine(color);
        if (dark) return darkInk(color);
        return null;
    }
    if (role === 'graphic') {
        if (light && !vivid) return darkSurface(color);
        if (dark && lch.C < 0.06) return darkInk(color);
        return null;
    }
    // bg
    if (light && !vivid) return darkSurface(color);
    return null;
}
