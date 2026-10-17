import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    THEME_STORAGE_KEY,
    applyTheme,
    normalizeThemePref,
    readThemePref,
    resolveTheme,
    saveThemePref,
} from './theme.js';

/**
 * Holds the visitor's theme preference and keeps <html data-theme> in step.
 * The very first paint is handled by the inline script in index.html; this
 * provider takes over from there (toggle clicks, the device switching between
 * light and dark while "follow device" is chosen, another tab changing it).
 */

const getStorage = () => {
    try {
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch (_) {
        return null;
    }
};

const darkQuery = () => {
    try {
        return typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;
    } catch (_) {
        return null;
    }
};

export const ThemeContext = createContext({
    pref: 'light',
    theme: 'light',
    setPref: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [pref, setPrefState] = useState(() => readThemePref(getStorage()));
    const [systemDark, setSystemDark] = useState(() => Boolean(darkQuery()?.matches));
    const theme = resolveTheme(pref, systemDark);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const mq = darkQuery();
        if (!mq) return undefined;
        const onChange = (e) => setSystemDark(e.matches);
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', onChange);
            else if (mq.removeListener) mq.removeListener(onChange);
        };
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === THEME_STORAGE_KEY) setPrefState(normalizeThemePref(e.newValue));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const setPref = useCallback((next) => {
        const normalized = normalizeThemePref(next);
        setPrefState(normalized);
        saveThemePref(getStorage(), normalized);
    }, []);

    const value = useMemo(() => ({ pref, theme, setPref }), [pref, theme, setPref]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
