import { createContext, useContext } from 'react';

// The theme context lives apart from its provider (ThemeContext.jsx) so that
// file exports components only and keeps React fast refresh working.
export const ThemeContext = createContext({
    pref: 'light',
    theme: 'light',
    setPref: () => { },
});

export const useTheme = () => useContext(ThemeContext);
