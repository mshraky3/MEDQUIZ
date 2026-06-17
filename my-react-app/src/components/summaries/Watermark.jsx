import React, { useMemo } from 'react';

/**
 * Translucent, repeated, rotated identity watermark rendered as a tiled SVG
 * background so it covers content of any height (long HTML summaries included).
 * Pure deterrent: ties any leaked screenshot back to the account.
 */
const Watermark = ({ text }) => {
    const bg = useMemo(() => {
        if (!text) return null;
        const safe = String(text).replace(/[<>&"]/g, '');
        const svg =
            `<svg xmlns='http://www.w3.org/2000/svg' width='340' height='200'>` +
            `<text x='10' y='110' fill='rgba(148,163,184,0.13)' font-size='15' ` +
            `font-family='sans-serif' transform='rotate(-26 170 100)'>${safe}</text></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }, [text]);

    if (!bg) return null;
    return (
        <div
            className="summary-watermark"
            aria-hidden="true"
            style={{ backgroundImage: bg }}
        />
    );
};

export default Watermark;
