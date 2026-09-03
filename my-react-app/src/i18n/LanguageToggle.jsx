import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon.jsx';
import { useLang } from './LanguageContext.jsx';
import { hasEnglishTwin, localizedPath, stripLocale } from '../seo/locales.js';
import './LanguageToggle.css';

/**
 * One-tap language switch. It always shows the language you would switch TO
 * (in that language's own script), which is the pattern people recognise
 * fastest — "العربية" while reading English, "English" while reading Arabic.
 *
 * On public content it NAVIGATES rather than just flipping state, because the
 * two languages are now two URLs: the English version of /questions/medicine
 * is /en/questions/medicine, with its own canonical and its own place in
 * search. Flipping in place would leave an English page insisting, in its own
 * <head>, that it was the Arabic one. On pages with no English twin (the
 * signed-in app, admin) there is nowhere to navigate to, so it flips in place
 * exactly as before.
 *
 * `variant="dark"` is for the landing page's dark topbar; the default suits
 * the light app navbar.
 */
const LanguageToggle = ({ variant = 'light', compact = false, className = '' }) => {
    const { lang, setLang } = useLang();
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();
    const next = lang === 'ar' ? 'en' : 'ar';
    const nextLabel = next === 'ar' ? 'العربية' : 'English';

    const switchLanguage = useCallback(() => {
        // Written either way: the choice has to outlive this page, so that the
        // app pages (which have no /en twin) follow it too.
        setLang(next);
        const { path } = stripLocale(pathname);
        if (!hasEnglishTwin(path)) return;
        navigate(`${localizedPath(path, next)}${search}${hash}`);
    }, [setLang, next, pathname, search, hash, navigate]);

    return (
        <button
            type="button"
            onClick={switchLanguage}
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
