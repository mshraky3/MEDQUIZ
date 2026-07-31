/**
 * Study tracks — client mirror of backend/config/tracks.js.
 *
 * Keep the two in sync: same track keys, same specialty `key` strings (they are
 * the raw questions.question_type values stored in the DB). The server is the
 * authority — it filters every content query by the caller's own track — so
 * this file only drives what the UI *offers* and how it is labelled.
 */

export const MEDICAL = 'medical';
export const NURSING = 'nursing';
export const DEFAULT_TRACK = MEDICAL;

export const TRACKS = {
    [MEDICAL]: {
        key: MEDICAL,
        labelAr: 'طب بشري',
        labelEn: 'Medicine',
        examAr: 'اختبار الترخيص الطبي (SMLE)',
        // Shown on the signup track picker.
        blurbAr: 'بنك أسئلة وملخصات SMLE للباطنة والجراحة والأطفال والنساء.',
        // Display name of the track's question bank, shown on the launcher.
        bankAr: 'Midgard & GameBoy2026',
        icon: 'stethoscope',
        specialties: [
            { key: 'medicine', labelAr: 'الباطنة', icon: 'stethoscope' },
            { key: 'surgery', labelAr: 'الجراحة', icon: 'scalpel' },
            { key: 'pediatric', labelAr: 'الأطفال', icon: 'baby' },
            { key: 'obstetrics and gynecology', labelAr: 'النساء والولادة', icon: 'venus' },
        ],
    },
    [NURSING]: {
        key: NURSING,
        labelAr: 'تمريض',
        labelEn: 'Nursing',
        examAr: 'اختبار SNLE للتمريض',
        blurbAr: 'مسار التمريض: الأساسيات، الباطني والجراحي، الأمومة، الأطفال، الصحة النفسية والأدوية.',
        bankAr: 'الأسئلة المؤكدة والأكثر تكراراً',
        icon: 'shield-check',
        specialties: [
            { key: 'nursing fundamentals', labelAr: 'أساسيات التمريض', icon: 'shield-check' },
            { key: 'medical surgical nursing', labelAr: 'التمريض الباطني والجراحي', icon: 'stethoscope' },
            { key: 'maternal and newborn nursing', labelAr: 'تمريض الأمومة والمواليد', icon: 'venus' },
            { key: 'pediatric nursing', labelAr: 'تمريض الأطفال', icon: 'baby' },
            { key: 'mental health nursing', labelAr: 'الصحة النفسية', icon: 'brain' },
            { key: 'nursing pharmacology', labelAr: 'الأدوية وحسابات الجرعات', icon: 'pill' },
        ],
    },
};

export const TRACK_KEYS = Object.keys(TRACKS);

export function normalizeTrack(value) {
    if (typeof value !== 'string') return DEFAULT_TRACK;
    const v = value.trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(TRACKS, v) ? v : DEFAULT_TRACK;
}

/** The user's track, read from the stored session user object. */
export function userTrack(user) {
    return normalizeTrack(user?.track);
}

/** Specialty descriptors ({key, labelAr, icon}) for a track, in display order. */
export function specialtiesOf(track) {
    return TRACKS[normalizeTrack(track)].specialties;
}

/** Raw question_type strings for a track. */
export function specialtyKeys(track) {
    return specialtiesOf(track).map((s) => s.key);
}

export function trackLabel(track) {
    return TRACKS[normalizeTrack(track)].labelAr;
}

export function examLabel(track) {
    return TRACKS[normalizeTrack(track)].examAr;
}

export function bankLabel(track) {
    return TRACKS[normalizeTrack(track)].bankAr;
}
