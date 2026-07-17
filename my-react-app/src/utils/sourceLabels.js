// Single source of truth for turning a DB `source` key into a human label.
// Used across the analysis/history views so raw ids like "MidgardGameBoy" or
// "May26" never leak into the UI. Legacy keys (general/Midgard/GameBoy) are
// kept so historical quiz sessions still render a friendly name.
export const SOURCE_LABELS = {
    MidgardGameBoy: 'Midgard & GameBoy',
    October25: 'أكتوبر 2025',
    November25: 'نوفمبر 2025',
    December25: 'ديسمبر 2025',
    January25: 'يناير 2026',
    FebMarApr25: 'فبراير – مارس – أبريل 2026',
    May26: 'مايو 2026',
    June26: 'يونيو 2026',
    // legacy — retired from the bank but present in old sessions
    general: 'عام',
    Midgard: 'Midgard',
    GameBoy: 'GameBoy',
};

export const getSourceLabel = (key) => SOURCE_LABELS[key] || key || 'عام';
