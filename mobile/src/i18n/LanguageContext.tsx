import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';
import { KEYS, getItem, setItem } from '@/lib/storage';
import type { Lang } from '@/lib/tracks';

/**
 * Site language ("ar" | "en").
 *
 * The whole UI is available in both languages. STUDY CONTENT is not translated
 * and never should be: questions, explanations, the summaries decks and exam
 * names (SMLE, SNLE, Prometric) stay English in both modes, because that is the
 * language the real exam is written in.
 *
 * Direction is handled by the app, not by Android's RTL machinery: the language
 * can be switched at any moment and must take effect instantly, without the
 * reload that I18nManager.forceRTL needs. Every layout primitive in src/ui
 * reads `isRTL` from here.
 */

export const LANGUAGES: Lang[] = ['ar', 'en'];
const DEFAULT_LANG: Lang = 'ar';

export const dirFor = (lang: Lang): 'rtl' | 'ltr' => (lang === 'ar' ? 'rtl' : 'ltr');

/** Normalises anything (a stored value, a device tag) to a supported language. */
export function normalizeLang(value: unknown): Lang | null {
  if (typeof value !== 'string') return null;
  const tag = value.toLowerCase();
  if (tag.startsWith('ar')) return 'ar';
  if (tag.startsWith('en')) return 'en';
  return null;
}

/**
 * First launch: the device language. Arabic and English map to themselves, any
 * third language gets English (the likelier second language), same rule as the
 * website. No locale information at all means Arabic, the product default.
 */
export function detectDeviceLang(tags: readonly (string | null | undefined)[]): Lang {
  const clean = tags.filter(Boolean) as string[];
  for (const tag of clean) {
    const match = normalizeLang(tag);
    if (match) return match;
  }
  return clean.length > 0 ? 'en' : DEFAULT_LANG;
}

type LanguageValue = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  /** false until the stored preference has been read (avoid a language flash). */
  ready: boolean;
  setLang: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageValue>({
  lang: DEFAULT_LANG,
  dir: 'rtl',
  isRTL: true,
  ready: false,
  setLang: () => {},
});

// The app lays itself out; Android's own mirroring must never kick in on top of
// that, or every explicit row-reverse would be flipped back.
try {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
} catch {
  /* not available on web */
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = normalizeLang(await getItem(KEYS.lang));
      let next = stored;
      if (!next) {
        try {
          next = detectDeviceLang(getLocales().map((l) => l.languageTag || l.languageCode));
        } catch {
          next = DEFAULT_LANG;
        }
      }
      if (alive) {
        setLangState(next);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    const normalized = normalizeLang(next);
    if (!normalized) return;
    setLangState(normalized);
    void setItem(KEYS.lang, normalized);
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({ lang, dir: dirFor(lang), isRTL: lang === 'ar', ready, setLang }),
    [lang, ready, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

/**
 * Picks the active language out of a copy dictionary shaped
 * `{ ar: {...}, en: {...} }`. Values may be strings, arrays or functions (for
 * sentences that interpolate).
 */
export function useCopy<T extends { ar: any; en: any }>(dictionary: T): T['ar'] {
  const { lang } = useLang();
  return (dictionary[lang] || dictionary.ar) as T['ar'];
}
