/**
 * Site theme ("light" | "dark"), and the visitor's preference, which can also
 * be "system" (follow the device).
 *
 * Light is the default and stays the default: nothing here changes what a
 * visitor sees until they pick dark (or pick "follow device" on a device set
 * to dark). The chosen theme is written to <html data-theme="..."> and the
 * dark palette hangs off :root[data-theme="dark"] in index.css and
 * theme/palette.css.
 *
 * index.html carries a copy of readThemePref + resolveTheme as a tiny inline
 * script that runs before the first paint, so a dark-mode visitor never sees
 * a flash of the light page. Keep the two in step: same key, same values.
 */

export const THEME_STORAGE_KEY = 'sqb_theme';
export const THEME_PREFS = ['light', 'dark', 'system'];
export const DEFAULT_THEME_PREF = 'light';

// Browser chrome colour (Android address bar, iOS status bar) per theme.
export const THEME_COLORS = { light: '#0b1021', dark: '#0b1220' };

/** Anything that is not a known preference (missing, garbage, old) is light. */
export function normalizeThemePref(value) {
    return THEME_PREFS.includes(value) ? value : DEFAULT_THEME_PREF;
}

/** Reads the stored preference. Never throws: storage can be blocked. */
export function readThemePref(storage) {
    try {
        return normalizeThemePref(storage ? storage.getItem(THEME_STORAGE_KEY) : null);
    } catch (_) {
        return DEFAULT_THEME_PREF;
    }
}

/** Saves the preference; returns false when storage is unavailable. */
export function saveThemePref(storage, pref) {
    try {
        if (!storage) return false;
        storage.setItem(THEME_STORAGE_KEY, normalizeThemePref(pref));
        return true;
    } catch (_) {
        return false;
    }
}

/** The theme to actually paint for a preference. */
export function resolveTheme(pref, systemPrefersDark) {
    const p = normalizeThemePref(pref);
    if (p === 'system') return systemPrefersDark ? 'dark' : 'light';
    return p;
}

/** Light <-> dark, for the one-tap navbar button. */
export function nextTheme(theme) {
    return theme === 'dark' ? 'light' : 'dark';
}

export function applyTheme(theme, doc = typeof document !== 'undefined' ? document : null) {
    if (!doc) return;
    const t = theme === 'dark' ? 'dark' : 'light';
    const root = doc.documentElement;
    root.setAttribute('data-theme', t);
    root.style.colorScheme = t;
    const meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[t]);
}
