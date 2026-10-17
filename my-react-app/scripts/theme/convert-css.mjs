#!/usr/bin/env node
// Dark-theme migration: rewrites hardcoded colours in stylesheets to theme
// tokens and generates src/theme/palette.css.
//
//   node scripts/theme/convert-css.mjs --report  src/components/Quiz/QUIZ.css ...
//   node scripts/theme/convert-css.mjs --write   src/components/Quiz/QUIZ.css ...
//
// The one guarantee: the LIGHT theme does not change. Every colour that is
// replaced becomes a token whose light value is that same colour — either a
// semantic token from index.css that already holds exactly that value
// (#ffffff background -> var(--surface)) or a generated one whose name carries
// the value it replaces (#dbeafe background -> var(--bg-dbeafe), light value
// #dbeafe). The dark value is decided by the colour's ROLE, read from the
// property it sits in, because the same hex is a card in one rule and the text
// on a blue button in another:
//
//   bg      background*            light panels/chips -> dark navy panels
//   fg      color, caret-color...  dark ink -> light ink (AA on dark panels)
//   line    border*, outline*      light rules -> dark rules
//   shade   box-shadow, filter...  slate shadows -> deeper black shadows
//   graphic fill, stroke, stop-*   light shapes -> dark, dark shapes -> light
//
// Colours that already work on navy (saturated brand fills, white text on
// them, dark scrims) stay literal. Text in a rule that also paints a solid
// saturated background is left alone — it is ink on that fill, not on the page.
// Comments, strings, url()s and var() fallbacks are never touched. Line
// endings are preserved byte for byte (34 files in this repo are CRLF).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseColor, hexOf, formatColor, mapToDark, toOklch } from './colorMath.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..', '..');
const PALETTE = path.join(appRoot, 'src', 'theme', 'palette.css');

const SEMANTIC = {
    bg: { ffffff: '--surface', eef2fb: '--bg', f5f8fd: '--surface-2', e1eafb: '--surface-tint' },
    fg: { '0f1e3d': '--text-dark', 475569: '--text-medium', '5b6779': '--text-light' },
    line: { d4deee: '--border-color', e6ecf7: '--border-light' },
};

// Brand/status tokens that are fills in one rule and text in another. As text
// they become var(--X-ink, var(--X)): --X-ink is defined only in the dark
// theme, so the light theme resolves to exactly what it did before, including
// any page-local override of --X.
const INK_TOKENS = ['primary-color', 'primary-dark', 'primary-light', 'accent', 'accent-strong',
    'accent-color', 'accent-light', 'secondary-color', 'success-color', 'error-color', 'warning-color', 'info-color'];
const FILL_VAR = /var\(--(primary-color|primary-dark|primary-light|accent|accent-strong|accent-color|accent-light|secondary-color|secondary-dark|success-color|error-color|warning-color|info-color|nd-[a-z-]+|gm-[a-z-]+)[,)]/;

function roleOf(prop) {
    const p = prop.toLowerCase();
    if (p.startsWith('--')) return null;
    if (p.startsWith('background')) return 'bg';
    if (['color', 'caret-color', 'text-decoration', 'text-decoration-color', '-webkit-text-fill-color',
        '-webkit-text-stroke', '-webkit-text-stroke-color', 'text-emphasis-color', '-webkit-tap-highlight-color'].includes(p)) return 'fg';
    if (p.startsWith('border') || p.startsWith('outline') || p.startsWith('column-rule')) return 'line';
    if (['box-shadow', '-webkit-box-shadow', 'text-shadow', 'filter', '-webkit-filter'].includes(p)) return 'shade';
    if (['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'].includes(p)) return 'graphic';
    return null;
}

// Blank out comments and string literals (same length) so offsets still line up.
function mask(text) {
    const out = text.split('');
    let i = 0;
    while (i < text.length) {
        if (text[i] === '/' && text[i + 1] === '*') {
            const end = text.indexOf('*/', i + 2);
            const stop = end === -1 ? text.length : end + 2;
            for (let k = i; k < stop; k += 1) if (out[k] !== '\n' && out[k] !== '\r') out[k] = ' ';
            i = stop;
        } else if (text[i] === '"' || text[i] === "'") {
            const q = text[i];
            let k = i + 1;
            while (k < text.length && text[k] !== q) { if (text[k] === '\\') k += 1; k += 1; }
            for (let j = i + 1; j < k && j < text.length; j += 1) out[j] = '_';
            i = k + 1;
        } else i += 1;
    }
    return out.join('');
}

// Declarations grouped by the rule block they sit in.
function parseBlocks(masked) {
    const blocks = [];
    const stack = [];
    let segStart = 0;
    let current = null;
    const pushDecl = (start, end) => {
        const seg = masked.slice(start, end);
        const colon = seg.indexOf(':');
        if (colon === -1 || !current) return;
        const prop = seg.slice(0, colon).trim();
        if (!/^-?-?[a-zA-Z][\w-]*$/.test(prop)) return;
        current.decls.push({ prop, valueStart: start + colon + 1, valueEnd: end });
    };
    for (let i = 0; i < masked.length; i += 1) {
        const ch = masked[i];
        if (ch === '{') {
            const prelude = masked.slice(segStart, i).trim();
            current = { prelude, decls: [] };
            blocks.push(current);
            stack.push(current);
            segStart = i + 1;
        } else if (ch === ';') {
            pushDecl(segStart, i);
            segStart = i + 1;
        } else if (ch === '}') {
            pushDecl(segStart, i);
            stack.pop();
            current = stack[stack.length - 1] || null;
            segStart = i + 1;
        }
    }
    return blocks;
}

const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^()]*\)|\b(?:white|black)\b/g;

// Ranges inside var(...) (its fallback) and url(...): never rewritten.
function protectedRanges(value) {
    const ranges = [];
    const re = /\b(var|url)\(/g;
    let m;
    while ((m = re.exec(value))) {
        let depth = 0;
        let k = m.index + m[0].length - 1;
        for (; k < value.length; k += 1) {
            if (value[k] === '(') depth += 1;
            else if (value[k] === ')') { depth -= 1; if (depth === 0) break; }
        }
        ranges.push([m.index, k + 1]);
        re.lastIndex = k + 1;
    }
    return ranges;
}

const tokenName = (role, c) => {
    const base = `--${role}-${hexOf(c)}`;
    return c.a >= 1 ? base : `${base}-a${String(Math.round(c.a * 1000)).padStart(3, '0')}`;
};

function colorsIn(value) {
    const prot = protectedRanges(value);
    const found = [];
    let m;
    COLOR_RE.lastIndex = 0;
    while ((m = COLOR_RE.exec(value))) {
        if (prot.some(([a, b]) => m.index >= a && m.index < b)) continue;
        const c = parseColor(m[0]);
        if (c) found.push({ index: m.index, text: m[0], color: c });
    }
    return found;
}

const isSolidKept = (c, role) => c.a >= 0.6 && mapToDark(c, role) === null;

export function convertCss(text, tokens) {
    const masked = mask(text);
    const blocks = parseBlocks(masked);
    const edits = [];
    const stats = { replaced: 0, kept: 0, ink: 0 };

    for (const block of blocks) {
        if (/^@keyframes|^@font-face/.test(block.prelude)) continue;
        // Already theme-specific: written by hand for one theme.
        if (/data-theme/.test(block.prelude)) continue;
        const declInfo = block.decls.map((d) => ({ ...d, role: roleOf(d.prop), value: masked.slice(d.valueStart, d.valueEnd) }));
        // Does this rule paint its own solid, theme-proof fill?
        const keptFill = declInfo.some((d) => d.role === 'bg' && (
            FILL_VAR.test(d.value) || (() => {
                const cs = colorsIn(d.value);
                return cs.length > 0 && cs.every((c) => isSolidKept(c.color, 'bg'));
            })()
        ));
        const lightInk = declInfo.some((d) => d.role === 'fg' && colorsIn(d.value).some((c) => toOklch(c.color).L >= 0.9 && c.color.a >= 0.8));

        for (const d of declInfo) {
            if (!d.role) continue;
            const original = text.slice(d.valueStart, d.valueEnd);
            if (d.role === 'fg' && !keptFill) {
                // Brand/status tokens used as ink.
                const re = new RegExp(`var\\(--(${INK_TOKENS.join('|')})(?=[,)])`, 'g');
                let m;
                while ((m = re.exec(d.value))) {
                    // Find the end of this var(...) to wrap it whole.
                    let depth = 0; let k = m.index + 3;
                    for (; k < d.value.length; k += 1) {
                        if (d.value[k] === '(') depth += 1;
                        else if (d.value[k] === ')') { depth -= 1; if (depth === 0) break; }
                    }
                    const whole = original.slice(m.index, k + 1);
                    if (original.slice(0, m.index).endsWith('-ink, ')) continue; // already wrapped
                    edits.push({ start: d.valueStart + m.index, end: d.valueStart + k + 1, text: `var(--${m[1]}-ink, ${whole})` });
                    stats.ink += 1;
                    re.lastIndex = k + 1;
                }
            }
            for (const c of colorsIn(d.value)) {
                const role = d.role;
                if ((role === 'fg' || role === 'graphic') && keptFill) { stats.kept += 1; continue; }
                // A white wash under white text sits on a dark banner, not a panel.
                if (role === 'bg' && c.color.a < 1 && lightInk && toOklch(c.color).L >= 0.9) { stats.kept += 1; continue; }
                const hex = hexOf(c.color);
                let name = null;
                if (c.color.a >= 1 && SEMANTIC[role] && SEMANTIC[role][hex]) name = SEMANTIC[role][hex];
                else {
                    const dark = mapToDark(c.color, role);
                    if (!dark) { stats.kept += 1; continue; }
                    name = tokenName(role, c.color);
                    tokens.set(name, { light: formatColor(c.color), dark: formatColor(dark) });
                }
                edits.push({ start: d.valueStart + c.index, end: d.valueStart + c.index + c.text.length, text: `var(${name})` });
                stats.replaced += 1;
            }
        }
    }
    edits.sort((a, b) => b.start - a.start);
    let out = text;
    for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    return { out, stats };
}

// --- palette.css ------------------------------------------------------------
const HEADER = `/* GENERATED by scripts/theme/convert-css.mjs — do not edit by hand.

   The dark-theme migration layer. Each token replaced one hardcoded colour in
   a stylesheet, and its name carries that colour: --bg-dbeafe was
   \`background: #dbeafe\`, so its light value is #dbeafe by construction and
   the light theme renders exactly as it did before. The dark value is derived
   from the colour's role (bg / fg / line / shade / graphic) — see the header
   of convert-css.mjs and colorMath.mjs.

   New code should not add to this file: use the semantic tokens in index.css
   (--surface, --text-dark, --border-color, --primary-color-ink ...). To change the
   dark look of one of these, adjust the mapping in colorMath.mjs and re-run
   the script, or override the token in index.css's dark block. */
`;

function readPalette() {
    const tokens = new Map();
    if (!fs.existsSync(PALETTE)) return tokens;
    const css = fs.readFileSync(PALETTE, 'utf8');
    const light = css.match(/:root\s*\{([^}]*)\}/);
    const dark = css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);
    const grab = (body) => Object.fromEntries([...(body || '').matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
    const L = grab(light && light[1]);
    const D = grab(dark && dark[1]);
    for (const k of Object.keys(L)) tokens.set(k, { light: L[k], dark: D[k] });
    return tokens;
}

function writePalette(tokens) {
    const order = ['bg', 'fg', 'line', 'shade', 'graphic'];
    const names = [...tokens.keys()].sort((a, b) => {
        const ra = order.indexOf(a.split('-')[2]); const rb = order.indexOf(b.split('-')[2]);
        return ra - rb || a.localeCompare(b);
    });
    const lines = (pick) => names.map((n) => `  ${n}: ${tokens.get(n)[pick]};`).join('\n');
    const css = `${HEADER}\n:root {\n${lines('light')}\n}\n\n:root[data-theme="dark"] {\n${lines('dark')}\n}\n`;
    fs.mkdirSync(path.dirname(PALETTE), { recursive: true });
    fs.writeFileSync(PALETTE, css);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const args = process.argv.slice(2);
    const write = args.includes('--write');
    const files = args.filter((a) => !a.startsWith('--'));
    const tokens = readPalette();
    // Re-derive dark values from the current mapping so a tweak to colorMath
    // re-colours every existing token, not only new ones.
    for (const [name, t] of tokens) {
        const role = name.split('-')[2];
        const c = parseColor(t.light);
        const d = c && mapToDark(c, role);
        if (d) t.dark = formatColor(d);
    }
    let total = { replaced: 0, kept: 0, ink: 0 };
    for (const f of files) {
        const abs = path.resolve(f);
        const text = fs.readFileSync(abs, 'utf8');
        const { out, stats } = convertCss(text, tokens);
        total = { replaced: total.replaced + stats.replaced, kept: total.kept + stats.kept, ink: total.ink + stats.ink };
        console.log(`${path.relative(appRoot, abs)}: replaced ${stats.replaced}, ink ${stats.ink}, kept ${stats.kept}`);
        if (write && out !== text) fs.writeFileSync(abs, out);
    }
    console.log(`TOTAL replaced ${total.replaced}, ink ${total.ink}, kept ${total.kept}; palette tokens ${tokens.size}`);
    if (write) writePalette(tokens);
}
