/**
 * Study tracks — client mirror of backend/config/tracks.js.
 *
 * Keep the two in sync: same track keys, same specialty `key` strings (they are
 * the raw questions.question_type values stored in the DB). The server is the
 * authority — it filters every content query by the caller's own track — so
 * this file only drives what the UI *offers* and how it is labelled.
 *
 * Every user-facing label is `{ ar, en }`; the `key` fields are DB values and
 * never translated. Exam names (SMLE, SNLE) stay in English in both languages.
 */

export const MEDICAL = 'medical';
export const NURSING = 'nursing';
export const DEFAULT_TRACK = MEDICAL;

export const TRACKS = {
    [MEDICAL]: {
        key: MEDICAL,
        label: { ar: 'طب بشري', en: 'Medicine' },
        exam: { ar: 'اختبار الترخيص الطبي (SMLE)', en: 'Saudi Medical Licensing Exam (SMLE)' },
        // Shown on the signup track picker.
        blurb: {
            ar: 'بنك أسئلة وملخصات SMLE للباطنة والجراحة والأطفال والنساء.',
            en: 'SMLE questions and summaries for medicine, surgery, paediatrics and OB/GYN.',
        },
        // Display name of the track's question bank, shown on the launcher.
        // A proper name — identical in both languages.
        bank: { ar: 'Midgard & GameBoy2026', en: 'Midgard & GameBoy2026' },
        icon: 'stethoscope',
        specialties: [
            { key: 'medicine', label: { ar: 'الباطنة', en: 'Internal Medicine' }, icon: 'stethoscope' },
            { key: 'surgery', label: { ar: 'الجراحة', en: 'Surgery' }, icon: 'scalpel' },
            { key: 'pediatric', label: { ar: 'الأطفال', en: 'Paediatrics' }, icon: 'baby' },
            { key: 'obstetrics and gynecology', label: { ar: 'النساء والولادة', en: 'Obstetrics & Gynaecology' }, icon: 'venus' },
        ],
    },
    [NURSING]: {
        key: NURSING,
        label: { ar: 'تمريض', en: 'Nursing' },
        exam: { ar: 'اختبار SNLE للتمريض', en: 'Saudi Nursing Licensure Exam (SNLE)' },
        blurb: {
            ar: 'مسار التمريض: الأساسيات، الباطني والجراحي، الأمومة، الأطفال، الصحة النفسية والأدوية.',
            en: 'The nursing track: fundamentals, med-surg, maternal, paediatric, mental health and pharmacology.',
        },
        bank: { ar: 'الأسئلة المؤكدة والأكثر تكراراً', en: 'Confirmed & Most Repeated questions' },
        icon: 'shield-check',
        specialties: [
            { key: 'nursing fundamentals', label: { ar: 'أساسيات التمريض', en: 'Nursing Fundamentals' }, icon: 'shield-check' },
            { key: 'medical surgical nursing', label: { ar: 'التمريض الباطني والجراحي', en: 'Medical-Surgical Nursing' }, icon: 'stethoscope' },
            { key: 'maternal and newborn nursing', label: { ar: 'تمريض الأمومة والمواليد', en: 'Maternal & Newborn Nursing' }, icon: 'venus' },
            { key: 'pediatric nursing', label: { ar: 'تمريض الأطفال', en: 'Paediatric Nursing' }, icon: 'baby' },
            { key: 'mental health nursing', label: { ar: 'الصحة النفسية', en: 'Mental Health Nursing' }, icon: 'brain' },
            { key: 'nursing pharmacology', label: { ar: 'الأدوية وحسابات الجرعات', en: 'Pharmacology & Dosage Calculations' }, icon: 'pill' },
        ],
    },
};

export const TRACK_KEYS = Object.keys(TRACKS);

/** Picks a language out of an `{ ar, en }` label, defaulting to Arabic. */
export const pick = (label, lang = 'ar') => (label ? (label[lang] ?? label.ar) : '');

export function normalizeTrack(value) {
    if (typeof value !== 'string') return DEFAULT_TRACK;
    const v = value.trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(TRACKS, v) ? v : DEFAULT_TRACK;
}

/** The user's track, read from the stored session user object. */
export function userTrack(user) {
    return normalizeTrack(user?.track);
}

/** Specialty descriptors ({key, label, icon}) for a track, in display order. */
export function specialtiesOf(track) {
    return TRACKS[normalizeTrack(track)].specialties;
}

/** Raw question_type strings for a track. */
export function specialtyKeys(track) {
    return specialtiesOf(track).map((s) => s.key);
}

export function trackLabel(track, lang) {
    return pick(TRACKS[normalizeTrack(track)].label, lang);
}

export function examLabel(track, lang) {
    return pick(TRACKS[normalizeTrack(track)].exam, lang);
}

export function bankLabel(track, lang) {
    return pick(TRACKS[normalizeTrack(track)].bank, lang);
}
