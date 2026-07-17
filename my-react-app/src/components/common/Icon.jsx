import React from 'react';

/**
 * Lightweight inline-SVG icon set (Lucide-style, stroke = currentColor).
 * Replaces emoji throughout the UI so glyphs are crisp, theadable and inherit
 * the surrounding text colour. Use: <Icon name="book-open" size={20} />.
 *
 * Filled glyphs (check / x / flag dot) use fill where noted; the rest are
 * 2px stroked line icons on a 24×24 grid.
 */
const PATHS = {
    'book-open': <><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    'trending-up': <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>,
    'bar-chart': <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
    brain: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.1 14c.2-1 .7-1.7 1.4-2.5A4.7 4.7 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.2 1.5 1.4 2.5" /></>,
    baby: <><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" /></>,
    venus: <><circle cx="12" cy="8" r="5" /><path d="M12 13v8" /><path d="M9 18h6" /></>,
    stethoscope: <><path d="M4.5 3v5a4 4 0 0 0 8 0V3" /><path d="M4.5 3H3m9.5 0H14" /><path d="M8.5 17a5.5 5.5 0 0 0 11 0v-2.5" /><circle cx="19.5" cy="11" r="2.2" /></>,
    scalpel: <><path d="M14 4l6 6-9 9H5v-6z" /><path d="M11 7l3 3" /></>,
    cursor: <><path d="m3 3 7.5 18 2.6-7.9L21 10.5z" /></>,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
    highlighter: <><path d="m9 11-6 6v3h9l3-3" /><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" /></>,
    eraser: <><path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></>,
    undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></>,
    maximize: <><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></>,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    flame: <><path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.7-2.5C9.5 8 10 6 12 2z" /><path d="M9 14a3 3 0 0 0 6 0c0-2-1.5-2.8-1.5-4.5" /></>,
    trophy: <><path d="M6 9a6 6 0 0 0 12 0V4H6z" /><path d="M6 5H4a2 2 0 0 0 0 4h2" /><path d="M18 5h2a2 2 0 0 1 0 4h-2" /><path d="M9 21h6" /><path d="M12 15v6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    rocket: <><path d="M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3-.2z" /><path d="M9 12a14 14 0 0 1 8-9c2 0 3 1 3 3a14 14 0 0 1-9 8" /><path d="M14.5 9.5 9 15" /></>,
    sparkles: <><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" /><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>,
    lightbulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.1 14c.2-1 .7-1.7 1.4-2.5A4.7 4.7 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.2 1.5 1.4 2.5" /></>,
    flag: <><path d="M4 22V4" /><path d="M4 4h13l-2 4 2 4H4" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 4v5h-5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    star: <><path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9z" /></>,
    users: <><path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 19v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1A4 4 0 0 1 16 11" /></>,
    'alert-triangle': <><path d="M12 3 2 20h20z" /><path d="M12 9v5" /><path d="M12 17h.01" /></>,
    'trending-down': <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></>,
    moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></>,
    'check-circle': <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5" /></>,
    'x-circle': <><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>,
    gamepad: <><rect x="2" y="6" width="20" height="12" rx="4" /><path d="M7 12h4" /><path d="M9 10v4" /><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="18" cy="14" r="1" fill="currentColor" stroke="none" /></>,
    zap: <><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
    'help-circle': <><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    circle: <><circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" /></>,
    clipboard: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></>,
    folder: <><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    'eye-off': <><path d="M9.9 4.2A10 10 0 0 1 12 4c6 0 10 8 10 8a18 18 0 0 1-2.3 3.3" /><path d="M6.6 6.6A18 18 0 0 0 2 12s4 8 10 8a10 10 0 0 0 4.9-1.3" /><path d="m2 2 20 20" /></>,
    ban: <><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></>,
    cookie: <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="M8.2 13.4 7 22l5-3 5 3-1.2-8.6" /></>,
    palette: <><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none" /><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2c0-.6-.4-1-1-1.5-.4-.5-.6-1-.5-1.5a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 8 8 0 0 0-8-8z" /></>,
    bug: <><path d="M8 9V6a4 4 0 0 1 8 0v3" /><rect x="6" y="9" width="12" height="9" rx="6" /><path d="M3 13h3M18 13h3M4 7l2 2M20 7l-2 2M4 19l2.5-2M20 19l-2.5-2M12 18v4" /></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></>,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5 5h14l3 7v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6z" /></>,
    hourglass: <><path d="M6 2h12M6 22h12" /><path d="M6 2c0 5 12 5 12 0M6 22c0-5 12-5 12 0" /></>,
    'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    'shield-check': <><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" /><path d="m8.5 11.5 2.5 2.5 4.5-4.5" /></>,
};

const Icon = ({ name, size = 20, strokeWidth = 2, className = '', title, ...rest }) => {
    const glyph = PATHS[name];
    if (!glyph) return null;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`app-icon ${className}`.trim()}
            aria-hidden={title ? undefined : true}
            role={title ? 'img' : undefined}
            focusable="false"
            {...rest}
        >
            {title ? <title>{title}</title> : null}
            {glyph}
        </svg>
    );
};

export default Icon;
