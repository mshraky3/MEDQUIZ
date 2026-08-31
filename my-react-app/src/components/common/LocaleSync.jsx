import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../../i18n';

/**
 * Keeps the site language in step with the URL on client-side navigation.
 *
 * LanguageProvider wraps RouterProvider, so it reads the URL once at mount and
 * then never again — fine when both languages shared one URL, wrong now that
 * /en/x is its own document. Without this, a soft navigation from /about into
 * /en/about would leave English content under Arabic chrome.
 *
 * Mounted once in the router's root shell so it sees every route, rather than
 * in Layout, which the landing route does not use.
 */
const LocaleSync = () => {
    const { pathname } = useLocation();
    const { syncLangFromPath } = useLang();

    useEffect(() => {
        syncLangFromPath(pathname);
    }, [pathname, syncLangFromPath]);

    return null;
};

export default LocaleSync;
