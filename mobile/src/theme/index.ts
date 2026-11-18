/**
 * Design tokens. Colours come from the active theme (`useColors()` in
 * ThemeContext, palettes in palettes.ts); radii, spacing, type and shadows are
 * theme-independent (tokens.ts).
 */
export * from './tokens';
export { lightColors, darkColors } from './palettes';
export type { Palette } from './palettes';
export { THEME_PREFS, DEFAULT_THEME_PREF, normalizeThemePref, resolveScheme, nativeSchemeFor } from './themePref';
export type { ThemePref, ThemeScheme } from './themePref';
export { ThemeProvider, useTheme, useColors, useTones } from './ThemeContext';
