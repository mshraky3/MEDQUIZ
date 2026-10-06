/**
 * Locale-aware formatting. Arabic uses ar-SA but with LATIN digits (`nu-latn`)
 * and the Gregorian calendar, the same decision as the website: scores,
 * percentages and counts are cross-referenced with English study material.
 */
import type { Lang } from './tracks';

const LOCALES: Record<Lang, string> = {
  ar: 'ar-SA-u-ca-gregory-nu-latn',
  en: 'en-GB',
};

const localeFor = (lang: Lang) => LOCALES[lang] || LOCALES.ar;

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: unknown, lang: Lang, options?: Intl.DateTimeFormatOptions): string {
  const date = toDate(value);
  if (!date) return '';
  try {
    return date.toLocaleDateString(localeFor(lang), options);
  } catch {
    return date.toDateString();
  }
}

export function formatDateTime(value: unknown, lang: Lang, options?: Intl.DateTimeFormatOptions): string {
  const date = toDate(value);
  if (!date) return '';
  try {
    return date.toLocaleString(localeFor(lang), options);
  } catch {
    return date.toISOString();
  }
}

export function formatNumber(value: unknown, lang: Lang, options?: Intl.NumberFormatOptions): string {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '';
  try {
    return Number(value).toLocaleString(localeFor(lang), options);
  } catch {
    return String(value);
  }
}
