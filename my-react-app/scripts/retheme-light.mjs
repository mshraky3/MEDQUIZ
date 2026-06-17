// One-off: convert component CSS from the old dark theme to the clinical light theme.
// Single-pass tokenized replacement so no mapping output gets re-processed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '..', 'src');

// Files handled by hand — do NOT touch.
const EXCLUDE = new Set([
  path.join(SRC, 'index.css'),
  path.join(SRC, 'components', 'landing', 'Landing.css'),
]);

// 6-digit hex map (role-preserving). Keys lowercase, no '#'.
const HEX = {
  // accent cyan -> medical blue / teal
  '22d3ee': '0ea5e9', '06b6d4': '0284c7', '67e8f9': '38bdf8',
  '0891b2': '0d9488', '0e7490': '0f766e', '38bdf8': '38bdf8',
  // dark page / deep backgrounds -> light page
  '0b1021': 'f7fafc', '050814': 'f7fafc', '020617': 'f7fafc',
  '0a0e1a': 'f7fafc', '0a0f1f': 'f7fafc',
  '0c1224': 'eef2f6', '0d1226': 'eef2f6', '0b1220': 'eef2f6',
  // dark panels / cards / inputs -> white / light surfaces
  '111827': 'ffffff', '0f172a': 'ffffff', '101828': 'ffffff',
  '1e293b': 'e2e8f0', '1f2937': 'e9eef5', '24324a': 'e2e8f0',
  '162033': 'eef2f6', '152033': 'eef2f6',
  // light text -> slate text
  'e2e8f0': '1e293b', 'f8fafc': '1e293b', 'f1f5f9': '1e293b',
  'e5eef8': '1e293b', 'edf2f7': '1e293b',
  'cbd5e1': '475569', '94a3b8': '475569', 'a0aec0': '475569',
};

// rgba prefix map (keeps the alpha). [r,g,b] -> [r,g,b]
const RGBA = [
  [[34, 211, 238], [14, 165, 233]],   // accent glow
  [[6, 182, 212], [2, 132, 199]],
  [[103, 232, 249], [56, 189, 248]],
  [[8, 145, 178], [13, 148, 136]],
  [[255, 255, 255], [15, 23, 42]],     // white overlays -> slate overlays (fills/borders/text)
  [[11, 16, 33], [15, 23, 42]],        // dark scrim -> slate scrim
  [[2, 6, 18], [15, 23, 42]],
];

function transform(css) {
  // hex pass — each original token mapped once
  let out = css.replace(/#([0-9a-fA-F]{6})\b/g, (m, h) => {
    const k = h.toLowerCase();
    return HEX[k] ? '#' + HEX[k] : m;
  });
  // rgba prefix passes
  for (const [[r, g, b], [nr, ng, nb]] of RGBA) {
    const re = new RegExp(`rgba\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\s*,`, 'g');
    out = out.replace(re, `rgba(${nr}, ${ng}, ${nb},`);
  }
  return out;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.isFile() && p.endsWith('.css')) acc.push(p);
  }
  return acc;
}

const files = walk(SRC).filter((f) => !EXCLUDE.has(f));
let changed = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(f, after, 'utf8');
    changed++;
    console.log('themed:', path.relative(SRC, f));
  }
}
console.log(`\nDone. ${changed} files updated.`);
