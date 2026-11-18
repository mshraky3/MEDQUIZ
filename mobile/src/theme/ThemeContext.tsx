import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { KEYS, getItem, setItem } from '@/lib/storage';
import { Palette, darkColors, lightColors } from './palettes';
import { DEFAULT_THEME_PREF, ThemePref, ThemeScheme, nativeSchemeFor, normalizeThemePref, resolveScheme } from './themePref';

type ThemeValue = {
  /** What the student chose: system / light / dark. */
  pref: ThemePref;
  /** What is actually painted. */
  scheme: ThemeScheme;
  isDark: boolean;
  colors: Palette;
  /** false until the stored choice has been read (avoids a light flash for dark users). */
  ready: boolean;
  setPref: (next: ThemePref) => void;
};

// Outside the provider (the router's error boundary can render there) the app is light.
const ThemeContext = createContext<ThemeValue>({
  pref: DEFAULT_THEME_PREF,
  scheme: 'light',
  isDark: false,
  colors: lightColors,
  ready: false,
  setPref: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(DEFAULT_THEME_PREF);
  const [ready, setReady] = useState(false);
  const system = useColorScheme();

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = normalizeThemePref(await getItem(KEYS.theme));
      if (alive) {
        setPrefState(stored);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Keep the OS in step (dialogs, keyboard, scrollbars): a forced theme is passed
  // down, "system" hands control back. Not available everywhere (web preview).
  useEffect(() => {
    try {
      Appearance.setColorScheme(nativeSchemeFor(pref));
    } catch {
      /* best effort */
    }
  }, [pref]);

  const setPref = useCallback((next: ThemePref) => {
    const value = normalizeThemePref(next);
    setPrefState(value);
    void setItem(KEYS.theme, value);
  }, []);

  const value = useMemo<ThemeValue>(() => {
    const scheme = resolveScheme(pref, system);
    return { pref, scheme, isDark: scheme === 'dark', colors: scheme === 'dark' ? darkColors : lightColors, ready, setPref };
  }, [pref, system, ready, setPref]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

/** The active palette. Call it at the top of a component and name the result `colors`. */
export const useColors = (): Palette => useContext(ThemeContext).colors;

/** Accuracy-tone colours (high / mid / low / neutral) for the active theme. */
export function useTones() {
  const c = useColors();
  return useMemo(
    () => ({
      color: { high: c.accuracyHigh, mid: c.accuracyMid, low: c.accuracyLow, neutral: c.textLight },
      bg: { high: c.accuracyHighBg, mid: c.accuracyMidBg, low: c.accuracyLowBg, neutral: c.surfaceTint },
    }),
    [c]
  );
}
