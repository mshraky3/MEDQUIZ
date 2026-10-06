/**
 * Study tracks, a mirror of the website's utils/tracks.js and of
 * backend/config/tracks.js. Keep all three in sync: same track keys, same
 * specialty `key` strings (they are the raw questions.question_type values).
 * The server is the authority (it filters every content query by the caller's
 * own track); this file only drives what the UI offers and how it is labelled.
 *
 * Every user-facing label is `{ ar, en }`. Exam names (SMLE, SNLE) stay English.
 */

export type Lang = 'ar' | 'en';
export type Label = { ar: string; en: string };

export type Specialty = { key: string; label: Label; icon: string };

export const MEDICAL = 'medical';
export const NURSING = 'nursing';
export type TrackKey = typeof MEDICAL | typeof NURSING;
export const DEFAULT_TRACK: TrackKey = MEDICAL;

export type TrackDef = {
  key: TrackKey;
  label: Label;
  exam: Label;
  blurb: Label;
  bank: Label;
  icon: string;
  specialties: Specialty[];
};

export const TRACKS: Record<TrackKey, TrackDef> = {
  medical: {
    key: 'medical',
    label: { ar: 'طب بشري', en: 'Medicine' },
    exam: { ar: 'اختبار الترخيص الطبي (SMLE)', en: 'Saudi Medical Licensing Exam (SMLE)' },
    blurb: {
      ar: 'بنك أسئلة وملخصات SMLE للباطنة والجراحة والأطفال والنساء.',
      en: 'SMLE questions and summaries for medicine, surgery, paediatrics and OB/GYN.',
    },
    bank: {
      ar: 'تجميعات سبتمبر والتجميعات الشهرية وGameBoy وConfirmed وMidgard',
      en: 'September & Monthly Recalls, GameBoy, Confirmed & Midgard questions',
    },
    icon: 'stethoscope',
    specialties: [
      { key: 'medicine', label: { ar: 'الباطنة', en: 'Internal Medicine' }, icon: 'stethoscope' },
      { key: 'surgery', label: { ar: 'الجراحة', en: 'Surgery' }, icon: 'scalpel' },
      { key: 'pediatric', label: { ar: 'الأطفال', en: 'Paediatrics' }, icon: 'baby' },
      {
        key: 'obstetrics and gynecology',
        label: { ar: 'النساء والولادة', en: 'Obstetrics & Gynaecology' },
        icon: 'venus',
      },
    ],
  },
  nursing: {
    key: 'nursing',
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
      {
        key: 'medical surgical nursing',
        label: { ar: 'التمريض الباطني والجراحي', en: 'Medical-Surgical Nursing' },
        icon: 'stethoscope',
      },
      {
        key: 'maternal and newborn nursing',
        label: { ar: 'تمريض الأمومة والمواليد', en: 'Maternal & Newborn Nursing' },
        icon: 'venus',
      },
      { key: 'pediatric nursing', label: { ar: 'تمريض الأطفال', en: 'Paediatric Nursing' }, icon: 'baby' },
      { key: 'mental health nursing', label: { ar: 'الصحة النفسية', en: 'Mental Health Nursing' }, icon: 'brain' },
      {
        key: 'nursing pharmacology',
        label: { ar: 'الأدوية وحسابات الجرعات', en: 'Pharmacology & Dosage Calculations' },
        icon: 'pill',
      },
    ],
  },
};

export const TRACK_KEYS = Object.keys(TRACKS) as TrackKey[];

/** Picks a language out of an `{ ar, en }` label, defaulting to Arabic. */
export const pick = (label: Label | undefined | null, lang: Lang = 'ar'): string =>
  label ? (label[lang] ?? label.ar) : '';

export function normalizeTrack(value: unknown): TrackKey {
  if (typeof value !== 'string') return DEFAULT_TRACK;
  const v = value.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(TRACKS, v) ? (v as TrackKey) : DEFAULT_TRACK;
}

export const userTrack = (user?: { track?: unknown } | null): TrackKey => normalizeTrack(user?.track);

export const specialtiesOf = (track: unknown): Specialty[] => TRACKS[normalizeTrack(track)].specialties;
export const specialtyKeys = (track: unknown): string[] => specialtiesOf(track).map((s) => s.key);
export const trackLabel = (track: unknown, lang: Lang): string => pick(TRACKS[normalizeTrack(track)].label, lang);
export const examLabel = (track: unknown, lang: Lang): string => pick(TRACKS[normalizeTrack(track)].exam, lang);
export const bankLabel = (track: unknown, lang: Lang): string => pick(TRACKS[normalizeTrack(track)].bank, lang);
