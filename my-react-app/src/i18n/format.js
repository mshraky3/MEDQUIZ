/**
 * Locale-aware formatting helpers.
 *
 * Arabic uses the ar-SA locale but with LATIN digits (`nu-latn`): the app is
 * full of scores, percentages and question counts that users cross-reference
 * with English study material, and Eastern-Arabic numerals (١٢٣) make that
 * needlessly hard. Dates use the Gregorian calendar for the same reason —
 * `ar-SA` alone would render Hijri dates, which is not what a subscription
 * expiry date should say.
 */

const LOCALES = {
    ar: 'ar-SA-u-ca-gregory-nu-latn',
    en: 'en-GB',
};

const localeFor = (lang) => LOCALES[lang] || LOCALES.ar;

export function formatDate(value, lang, options) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    try {
        return date.toLocaleDateString(localeFor(lang), options);
    } catch (_) {
        return date.toLocaleDateString();
    }
}

export function formatDateTime(value, lang, options) {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    try {
        return date.toLocaleString(localeFor(lang), options);
    } catch (_) {
        return date.toLocaleString();
    }
}

export function formatNumber(value, lang, options) {
    if (value === null || value === undefined || Number.isNaN(value)) return '';
    try {
        return Number(value).toLocaleString(localeFor(lang), options);
    } catch (_) {
        return String(value);
    }
}
