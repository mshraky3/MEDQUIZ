import React, { useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLang } from './LanguageContext.jsx';
import { pathForLang } from '../seo/locales.js';

/**
 * Links that stay in the language you are reading.
 *
 * The English tree is a real set of URLs (/en/questions/…), not a client-side
 * mode, so a plain <Link to="/about"> inside an English page is a link OUT of
 * English: it lands on the Arabic document, which then correctly renders in
 * Arabic. A visitor arriving from Google on /en/questions/medicine/… and
 * clicking anything in the navbar would have had the site flip under them on
 * the second click.
 *
 * Import this in place of react-router-dom's Link anywhere the destination is
 * public content. Paths with no English twin (the signed-in app, admin) are
 * passed through untouched — see pathForLang.
 */
export function useLocalePath() {
    const { lang } = useLang();
    return useCallback((path) => pathForLang(path, lang), [lang]);
}

/** useNavigate, with the same localization applied to string destinations. */
export function useLocaleNavigate() {
    const navigate = useNavigate();
    const localePath = useLocalePath();
    return useCallback(
        (to, options) =>
            (typeof to === 'string' ? navigate(localePath(to), options) : navigate(to, options)),
        [navigate, localePath]
    );
}

const Link = ({ to, ...rest }) => {
    const localePath = useLocalePath();
    return <RouterLink to={typeof to === 'string' ? localePath(to) : to} {...rest} />;
};

export default Link;
