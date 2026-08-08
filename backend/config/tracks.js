/**
 * Study tracks — the top-level content partition of the platform.
 *
 * SQB serves two student populations from one deployment. Landing page, auth,
 * payment and layout are shared; everything that is *learning content*
 * (questions, summaries, and therefore every analytics number derived from
 * them) is strictly segregated by track.
 *
 * An account carries exactly one track, chosen at signup and changeable only by
 * an admin — otherwise a single subscription would unlock both banks.
 *
 * This module is the single source of truth for the backend. Its mirror is
 * my-react-app/src/utils/tracks.js — keep the two in sync (same keys, same
 * question_type strings). Adding a specialty here + there is all that's needed;
 * no query in the app hardcodes a specialty list.
 */

export const MEDICAL = 'medical';
export const NURSING = 'nursing';

export const DEFAULT_TRACK = MEDICAL;

/**
 * Nursing specialty keys follow the same convention as the medical ones:
 * lowercase, space-separated English stored verbatim in questions.question_type.
 * They are deliberately distinct strings from the medical set (e.g. "pediatric
 * nursing" vs "pediatric") so a mislabelled row can never straddle both tracks.
 *
 * The six nursing specialties mirror the blueprint of the source material:
 * Fundamentals, Med-Surg, Maternal & Newborn, Pediatrics, Mental Health and
 * Pharmacology.
 */
export const TRACKS = {
    [MEDICAL]: {
        key: MEDICAL,
        labelAr: 'طب بشري',
        labelEn: 'Medicine',
        // Used in email copy and page headings. The English variants exist
        // because lifecycle mail is now sent in the student's own language
        // (accounts.preferred_lang) — see services/userEmailService.js.
        examAr: 'اختبار الترخيص الطبي (SMLE)',
        examEn: 'the Saudi Medical Licensing Exam (SMLE)',
        audienceAr: 'طلاب وأطباء الامتياز',
        audienceEn: 'medical students and interns',
        specialties: [
            { key: 'medicine', labelAr: 'الباطنة', labelEn: 'Medicine', icon: 'stethoscope' },
            { key: 'surgery', labelAr: 'الجراحة', labelEn: 'Surgery', icon: 'scalpel' },
            { key: 'pediatric', labelAr: 'الأطفال', labelEn: 'Pediatrics', icon: 'baby' },
            { key: 'obstetrics and gynecology', labelAr: 'النساء والولادة', labelEn: 'OB/GYN', icon: 'venus' },
        ],
    },
    [NURSING]: {
        key: NURSING,
        labelAr: 'تمريض',
        labelEn: 'Nursing',
        examAr: 'اختبار SNLE للتمريض',
        examEn: 'the Saudi Nursing Licensing Exam (SNLE)',
        audienceAr: 'طلاب وخريجي التمريض',
        audienceEn: 'nursing students and graduates',
        specialties: [
            { key: 'nursing fundamentals', labelAr: 'أساسيات التمريض', labelEn: 'Fundamentals of Nursing', icon: 'shield-check' },
            { key: 'medical surgical nursing', labelAr: 'التمريض الباطني والجراحي', labelEn: 'Medical-Surgical Nursing', icon: 'stethoscope' },
            { key: 'maternal and newborn nursing', labelAr: 'تمريض الأمومة والمواليد', labelEn: 'Maternal & Newborn Nursing', icon: 'venus' },
            { key: 'pediatric nursing', labelAr: 'تمريض الأطفال', labelEn: 'Pediatric Nursing', icon: 'baby' },
            { key: 'mental health nursing', labelAr: 'الصحة النفسية', labelEn: 'Mental Health Nursing', icon: 'brain' },
            { key: 'nursing pharmacology', labelAr: 'الأدوية وحسابات الجرعات', labelEn: 'Pharmacology & Dosage Calculation', icon: 'pill' },
        ],
    },
};

export const TRACK_KEYS = Object.keys(TRACKS);

export function isValidTrack(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(TRACKS, value);
}

/**
 * Coerce anything (query param, body field, legacy NULL column) to a real track.
 * Unknown/missing always resolves to medical, which is what every pre-existing
 * account and question row is.
 */
export function normalizeTrack(value) {
    if (typeof value !== 'string') return DEFAULT_TRACK;
    const v = value.trim().toLowerCase();
    return isValidTrack(v) ? v : DEFAULT_TRACK;
}

/** The question_type strings that belong to a track. */
export function specialtyKeys(track) {
    return TRACKS[normalizeTrack(track)].specialties.map((s) => s.key);
}

/** Arabic label for a question_type, regardless of which track owns it. */
export function specialtyLabel(questionType) {
    for (const t of TRACK_KEYS) {
        const hit = TRACKS[t].specialties.find((s) => s.key === questionType);
        if (hit) return hit.labelAr;
    }
    return questionType;
}

/** Which track owns a given question_type (used to validate admin uploads). */
export function trackForSpecialty(questionType) {
    for (const t of TRACK_KEYS) {
        if (TRACKS[t].specialties.some((s) => s.key === questionType)) return t;
    }
    return null;
}

export function trackLabelAr(track) {
    return TRACKS[normalizeTrack(track)].labelAr;
}

/** English label — for admin surfaces, which stay English/LTR regardless of site language. */
export function trackLabelEn(track) {
    return TRACKS[normalizeTrack(track)].labelEn;
}
