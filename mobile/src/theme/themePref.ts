/**
 * The theme choice, as pure logic (no React Native import: unit-tested).
 *
 * The student picks System / Light / Dark. "system" follows the phone and is the
 * default; anything stored that is not one of the three reads as the default.
 * The storage key is the website's (`sqb_theme`, same three values).
 */
export const THEME_PREFS = ['system', 'light', 'dark'] as const;
export type ThemePref = (typeof THEME_PREFS)[number];
export type ThemeScheme = 'light' | 'dark';

export const DEFAULT_THEME_PREF: ThemePref = 'system';

export function normalizeThemePref(value: unknown): ThemePref {
  return (THEME_PREFS as readonly unknown[]).includes(value) ? (value as ThemePref) : DEFAULT_THEME_PREF;
}

/** The scheme to paint. `system` is what the phone reports (null/unknown = light). */
export function resolveScheme(pref: ThemePref, system: string | null | undefined): ThemeScheme {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}

/** What to tell the OS (`Appearance.setColorScheme`): 'unspecified' hands control back to the phone. */
export function nativeSchemeFor(pref: ThemePref): ThemeScheme | 'unspecified' {
  return pref === 'system' ? 'unspecified' : pref;
}
