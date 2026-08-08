import React from 'react';
import Icon from '../components/common/Icon.jsx';
import { useLang } from './LanguageContext.jsx';
import './LanguageToggle.css';

/**
 * One-tap language switch. It always shows the language you would switch TO
 * (in that language's own script), which is the pattern people recognise
 * fastest — "العربية" while reading English, "English" while reading Arabic.
 *
 * `variant="dark"` is for the landing page's dark topbar; the default suits
 * the light app navbar.
 */
const LanguageToggle = ({ variant = 'light', compact = false, className = '' }) => {
    const { lang, toggleLang } = useLang();
    const next = lang === 'ar' ? 'en' : 'ar';
    const nextLabel = next === 'ar' ? 'العربية' : 'English';

    return (
        <button
            type="button"
            onClick={toggleLang}
            className={`lang-toggle lang-toggle-${variant}${compact ? ' lang-toggle-compact' : ''} ${className}`.trim()}
            // The accessible name is written in the target language so a screen
            // reader set to that language announces it correctly.
            aria-label={next === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'}
            title={next === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'}
            lang={next}
        >
            <Icon name="globe" size={16} />
            <span className="lang-toggle-label">{compact ? next.toUpperCase() : nextLabel}</span>
        </button>
    );
};

export default LanguageToggle;
