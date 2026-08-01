import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeGetItem, safeSetItem } from '../utils/safeStorage.js';

/**
 * Site language ("ar" | "en").
 *
 * The whole UI is available in both languages. STUDY CONTENT is not translated
 * and never should be: questions, answer explanations, the summaries decks and
 * exam names (SMLE, SNLE, Prometric) stay in English in both modes, because
 * that is the language the real exam is written in. Everything this module
 * covers is chrome — navigation, labels, buttons, marketing copy, errors.
 *
 * Admin pages are English-only and ignore this context entirely; they render
 * inside <AdminShell>, which pins dir="ltr".
 */

export const LANGUAGES = ['ar', 'en'];
const STORAGE_KEY = 'sqb_lang';
const DEFAULT_LANG = 'ar';

export const LanguageContext = createContext({
    lang: DEFAULT_LANG,
    dir: 'rtl',
    setLang: () => { },
    toggleLang: () => { },
    pushEnglishOnly: () => () => { },
});

/** Normalizes anything (stored value, navigator tag) to a supported language. */
const normalize = (value) => {
    if (typeof value !== 'string') return null;
    const tag = value.toLowerCase();
    if (tag.startsWith('ar')) return 'ar';
    if (tag.startsWith('en')) return 'en';
    return null;
};

/**
 * An explicit choice always wins. Otherwise we read the browser's languages in
 * priority order: an Arabic speaker lands on Arabic, everyone else on English.
 * Falls back to Arabic only when the browser tells us nothing usable, since
 * the audience is predominantly Saudi.
 */
export function detectLanguage() {
    const stored = normalize(safeGetItem(STORAGE_KEY));
    if (stored) return stored;

    if (typeof navigator !== 'undefined') {
        const tags = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language];
        for (const tag of tags) {
            const match = normalize(tag);
            if (match) return match;
        }
        // A browser set to some third language (fr, ur, hi…) gets English —
        // it is the more likely second language for a non-Arabic speaker.
        if (tags.some(Boolean)) return 'en';
    }

    return DEFAULT_LANG;
}

export const dirFor = (lang) => (lang === 'ar' ? 'rtl' : 'ltr');

export const LanguageProvider = ({ children }) => {
    const [lang, setLangState] = useState(detectLanguage);
    // Admin routes are English-only (see AdminShell). They flip the document to
    // en/ltr for as long as they are mounted without touching the visitor's
    // saved language, so leaving the admin panel restores the site language.
    const [englishOnlyRegions, setEnglishOnlyRegions] = useState(0);
    const englishOnly = englishOnlyRegions > 0;

    const dir = dirFor(lang);
    const documentLang = englishOnly ? 'en' : lang;
    const documentDir = englishOnly ? 'ltr' : dir;

    // Keep the document in sync so screen readers, spell-checkers, form
    // controls and `text-align: start` all behave. index.html ships with
    // lang="ar"/dir="rtl" for crawlers; this corrects it for English visitors.
    useEffect(() => {
        const root = document.documentElement;
        root.lang = documentLang;
        root.dir = documentDir;
    }, [documentLang, documentDir]);

    // Ref-counted rather than a boolean so nested/remounting admin screens
    // (StrictMode double-invokes effects in dev) can never leave it stuck on.
    const pushEnglishOnly = useCallback(() => {
        setEnglishOnlyRegions((n) => n + 1);
        return () => setEnglishOnlyRegions((n) => Math.max(0, n - 1));
    }, []);

    const setLang = useCallback((next) => {
        const normalized = normalize(next);
        if (!normalized) return;
        setLangState(normalized);
        safeSetItem(STORAGE_KEY, normalized);
    }, []);

    const toggleLang = useCallback(() => {
        setLangState((current) => {
            const next = current === 'ar' ? 'en' : 'ar';
            safeSetItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ lang, dir, setLang, toggleLang, pushEnglishOnly }),
        [lang, dir, setLang, toggleLang, pushEnglishOnly]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);

/**
 * Picks the active language out of a copy dictionary shaped
 * `{ ar: {...}, en: {...} }`.
 *
 * Page copy lives in a module next to (or imported by) the page itself rather
 * than in one global bundle, so a lazily-loaded route keeps shipping its text
 * in its own chunk — the landing page must not download the guides' prose.
 *
 * Values may be strings, arrays or functions; functions are for sentences that
 * interpolate, e.g. `remaining: (n) => \`${n} questions left\``.
 */
export function useCopy(dictionary) {
    const { lang } = useLang();
    return dictionary[lang] || dictionary[DEFAULT_LANG];
}

export default LanguageProvider;
