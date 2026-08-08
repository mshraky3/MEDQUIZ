/**
 * Shared admin formatters. One copy — replaces near-identical helpers that
 * used to live separately in Accounting.jsx, EngagementPanel.jsx, Admin.jsx
 * and AdminAnalytics.jsx (each with slightly different rounding/edge cases).
 */

/** SAR amount, 2 decimals, thousands separators. Accepts a plain number (not halalas). */
export const sar = (amount) => (Number(amount) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
});

/** halalas → "12.34" SAR string. */
export const sarFromHalalas = (halalas) => sar((Number(halalas) || 0) / 100);

/** 0-100 number → "12.3%" (1 decimal, trims trailing .0). */
export const pct = (value, digits = 0) => `${(Number(value) || 0).toFixed(digits)}%`;

/** Seconds → "2h 14m" / "14m" / "45s". */
export const dur = (seconds) => {
    const n = Number(seconds) || 0;
    if (n < 60) return `${n}s`;
    const h = Math.floor(n / 3600);
    const m = Math.round((n % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m`;
};

/** ISO date/datetime → "Just now" / "5m ago" / "3h ago" / "2d ago". */
export const timeAgo = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

/** ISO date → "Jan 5" (short month, no year — for chart axis labels). */
export const dayLabel = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/** "YYYY-MM" → "Jan 2026" (for monthly ledger labels). */
export const monthLabel = (key) => {
    const [y, m] = String(key).split('-');
    return new Date(Date.UTC(+y, +m - 1, 1))
        .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

/** Plain integer with thousands separators. */
export const num = (value) => (Number(value) || 0).toLocaleString('en-US');

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const daysAgoISO = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
