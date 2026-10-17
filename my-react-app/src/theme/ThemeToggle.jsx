import React from 'react';
import Icon from '../components/common/Icon.jsx';
import { common, useCommon } from '../i18n';
import { useTheme } from './ThemeContext.jsx';
import { nextTheme } from './theme.js';
import './ThemeToggle.css';

/**
 * One-tap light/dark switch for the navbars. It shows the theme you would
 * switch TO (a moon on the light page, a sun on the dark one), like the
 * language toggle shows the language you would switch to.
 *
 * A tap always picks light or dark explicitly. "Follow device" lives in the
 * full choice on /account (ThemeChoice below), where there is room to say
 * what it means.
 *
 * `variant="dark"` is for the landing page's dark topbar. `lang` pins the
 * label language — the admin shell is English-only whatever the site language.
 */
const ThemeToggle = ({ variant = 'light', className = '', lang }) => {
    const siteCopy = useCommon();
    const t = lang ? common[lang] : siteCopy;
    const { theme, setPref } = useTheme();
    const label = theme === 'dark' ? t.theme.toLight : t.theme.toDark;
    return (
        <button
            type="button"
            onClick={() => setPref(nextTheme(theme))}
            className={`theme-toggle theme-toggle-${variant} ${className}`.trim()}
            aria-label={label}
            title={label}
        >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
        </button>
    );
};

/** Light / Dark / Follow device — a labelled radio group for settings. */
export const ThemeChoice = ({ className = '' }) => {
    const t = useCommon();
    const { pref, setPref } = useTheme();
    const options = [
        { value: 'light', icon: 'sun', label: t.theme.light },
        { value: 'dark', icon: 'moon', label: t.theme.dark },
        { value: 'system', icon: 'monitor', label: t.theme.system },
    ];
    return (
        <div className={`theme-choice ${className}`.trim()} role="radiogroup" aria-label={t.theme.label}>
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={pref === o.value}
                    className={`theme-choice-opt${pref === o.value ? ' is-active' : ''}`}
                    onClick={() => setPref(o.value)}
                >
                    <Icon name={o.icon} size={16} />
                    <span>{o.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
