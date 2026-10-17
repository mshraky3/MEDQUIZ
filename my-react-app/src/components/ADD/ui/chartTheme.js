/**
 * Shared recharts theme — promoted from AdminAnalytics.jsx so every admin
 * chart (Overview, Growth) uses the same series colours and grid styling.
 */
export const PALETTE = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#db2777', '#65a30d'];
export const AXIS = '#64748b';
export const GRID = 'rgba(15, 23, 42, 0.08)';
// Inline style, so the tooltip takes the theme tokens directly (light values
// are exactly the old #fff / #d4deee / #0f1e3d). Axis, grid and bar colours
// are SVG attributes; their dark-theme twins are CSS rules in ui.css.
export const TOOLTIP = { background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 12, color: 'var(--text-dark)' };

export const AXIS_TICK = { fill: AXIS, fontSize: 11 };
