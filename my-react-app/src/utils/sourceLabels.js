// Single source of truth for turning a DB `source` key into a human label.
// Used across the analysis/history views so raw ids like "MidgardGameBoy" or
// "May26" never leak into the UI. Legacy keys (general/Midgard/GameBoy) are
// kept so historical quiz sessions still render a friendly name.
//
// Bank names students know by their English name ("Midgard & GameBoy2026",
// "Most Repeated", "Confirmed") are proper names and stay identical in both
// languages; only the month collections actually differ.
export const SOURCE_LABELS = {
    ar: {
        MidgardGameBoy: 'Midgard & GameBoy2026',
        January25: 'يناير 2026',
        FebMarApr25: 'فبراير – مارس – أبريل 2026',
        May26: 'مايو 2026',
        June26: 'يونيو 2026',
        // nursing track — the bank is split the same way the medical one is:
        // the core EMS review file vs. the block appended in its September edition.
        NursingMostRepeated: 'Most Repeated',
        NursingConfirmed: 'Confirmed',
        // legacy — retired from the bank but present in old sessions
        NursingEMS: 'الأسئلة المؤكدة والأكثر تكراراً',
        October25: 'أكتوبر 2025',
        November25: 'نوفمبر 2025',
        December25: 'ديسمبر 2025',
        general: 'عام',
        Midgard: 'Midgard',
        GameBoy: 'GameBoy',
    },
    en: {
        MidgardGameBoy: 'Midgard & GameBoy2026',
        January25: 'January 2026',
        FebMarApr25: 'February – March – April 2026',
        May26: 'May 2026',
        June26: 'June 2026',
        NursingMostRepeated: 'Most Repeated',
        NursingConfirmed: 'Confirmed',
        NursingEMS: 'Confirmed & Most Repeated questions',
        October25: 'October 2025',
        November25: 'November 2025',
        December25: 'December 2025',
        general: 'General',
        Midgard: 'Midgard',
        GameBoy: 'GameBoy',
    },
};

export const getSourceLabel = (key, lang = 'ar') => {
    const map = SOURCE_LABELS[lang] || SOURCE_LABELS.ar;
    return map[key] || key || map.general;
};
