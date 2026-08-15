/**
 * Generated branded card image for the weekly channel topic-summary post —
 * no headless browser, no external screenshot service. An SVG template is
 * rasterized to PNG with sharp (which uses libvips' built-in SVG support).
 *
 * Colors pulled from the site's real light-theme palette (index.css / the
 * card/heading/primary tokens used everywhere else in the app) so this
 * actually looks like SQB rather than an invented palette.
 */

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
    bg: '#eef2fb',
    card: '#ffffff',
    heading: '#0f1e3d',
    muted: '#475569',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
};

function escapeXml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

/** Greedy word-wrap into at most `maxLines` lines of roughly `maxChars` characters each. */
function wrapTitle(text, maxChars = 22, maxLines = 3) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxChars && current) {
            lines.push(current);
            current = word;
        } else {
            current = next;
        }
        if (lines.length === maxLines - 1 && current.length >= maxChars) break;
    }
    if (current) lines.push(current);
    return lines.slice(0, maxLines);
}

/** PNG buffer for a "weekly topic" card. `titleEn` is the summary/specialty name. */
export async function renderTopicCard(titleEn, { eyebrow = 'THIS WEEK ON SQB' } = {}) {
    const lines = wrapTitle(titleEn);
    const titleStartY = HEIGHT / 2 - ((lines.length - 1) * 34);
    const titleTspans = lines
        .map((line, i) => `<tspan x="${WIDTH / 2}" y="${titleStartY + i * 68}">${escapeXml(line)}</tspan>`)
        .join('');

    const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${COLORS.primary}"/>
                <stop offset="100%" stop-color="${COLORS.primaryLight}"/>
            </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
        <rect x="0" y="0" width="${WIDTH}" height="14" fill="url(#accent)"/>
        <rect x="60" y="60" width="${WIDTH - 120}" height="${HEIGHT - 150}" rx="24"
              fill="${COLORS.card}" stroke="#e6ecf6" stroke-width="1"/>
        <text x="${WIDTH / 2}" y="150" text-anchor="middle"
              font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700"
              letter-spacing="3" fill="${COLORS.primary}">${escapeXml(eyebrow)}</text>
        <text text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="56"
              font-weight="800" fill="${COLORS.heading}">${titleTspans}</text>
        <text x="${WIDTH / 2}" y="${HEIGHT - 100}" text-anchor="middle"
              font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${COLORS.muted}">
            Study it in full on the site — link below
        </text>
        <text x="${WIDTH / 2}" y="${HEIGHT - 40}" text-anchor="middle"
              font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800"
              letter-spacing="2" fill="${COLORS.primary}">SQB</text>
    </svg>`;

    return sharp(Buffer.from(svg)).png().toBuffer();
}
