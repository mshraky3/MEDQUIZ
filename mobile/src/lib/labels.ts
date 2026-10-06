/**
 * Display names for the raw `question_type` and `source` values stored in the
 * DB (ports of the website's typeLabels.js and sourceLabels.js). Bank names
 * students know by their English name are proper names and stay identical in
 * both languages; only the month collections differ. Legacy source keys are
 * kept so historical quiz sessions still render a friendly name.
 */
import { Lang, TRACKS, TRACK_KEYS, pick } from './tracks';

const typeMapFor = (lang: Lang): Record<string, string> => {
  const out: Record<string, string> = {};
  TRACK_KEYS.forEach((track) => {
    TRACKS[track].specialties.forEach((s) => {
      out[s.key] = pick(s.label, lang);
    });
  });
  return out;
};

const TYPE_MAPS: Record<Lang, Record<string, string>> = { ar: typeMapFor('ar'), en: typeMapFor('en') };

export function getTypeLabel(type: string | null | undefined, lang: Lang = 'ar'): string {
  if (!type) return '';
  return (TYPE_MAPS[lang] || TYPE_MAPS.ar)[type] || type;
}

export const SOURCE_LABELS: Record<Lang, Record<string, string>> = {
  ar: {
    MedicalSeptemberRecall: 'تجميعة سبتمبر 2026',
    MedicalMonthlyRecall: 'التجميعات الشهرية (حتى أغسطس)',
    MedicalGameBoy: 'GameBoy',
    MedicalConfirmed: 'Confirmed',
    MedicalMidgard: 'Midgard',
    NursingMostRepeated: 'Most Repeated',
    NursingConfirmed: 'Confirmed',
    MidgardGameBoy: 'Midgard & GameBoy2026',
    January25: 'يناير 2026',
    FebMarApr25: 'فبراير – مارس – أبريل 2026',
    May26: 'مايو 2026',
    June26: 'يونيو 2026',
    NursingEMS: 'الأسئلة المؤكدة والأكثر تكراراً',
    October25: 'أكتوبر 2025',
    November25: 'نوفمبر 2025',
    December25: 'ديسمبر 2025',
    general: 'عام',
    Midgard: 'Midgard',
    GameBoy: 'GameBoy',
  },
  en: {
    MedicalSeptemberRecall: 'September 2026 Recalls',
    MedicalMonthlyRecall: 'Monthly Recalls (through August)',
    MedicalGameBoy: 'GameBoy',
    MedicalConfirmed: 'Confirmed',
    MedicalMidgard: 'Midgard',
    NursingMostRepeated: 'Most Repeated',
    NursingConfirmed: 'Confirmed',
    MidgardGameBoy: 'Midgard & GameBoy2026',
    January25: 'January 2026',
    FebMarApr25: 'February – March – April 2026',
    May26: 'May 2026',
    June26: 'June 2026',
    NursingEMS: 'Confirmed & Most Repeated questions',
    October25: 'October 2025',
    November25: 'November 2025',
    December25: 'December 2025',
    general: 'General',
    Midgard: 'Midgard',
    GameBoy: 'GameBoy',
  },
};

export function getSourceLabel(key: string | null | undefined, lang: Lang = 'ar'): string {
  const map = SOURCE_LABELS[lang] || SOURCE_LABELS.ar;
  return (key && map[key]) || key || map.general;
}
