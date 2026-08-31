/**
 * Language and URL: the two things hreflang needs to agree on.
 *
 * Until now both languages were served from ONE url and switched client-side,
 * with the template emitting `hreflang="ar"`, `hreflang="ar-SA"` and
 * `hreflang="x-default"` all pointing at the homepage. That combination tells
 * Google nothing — an alternate that resolves to the same document as the
 * canonical is not an alternate, and every page claiming the homepage as its
 * Arabic version is worse than claiming nothing. Meanwhile 43% of the site's
 * search clicks come from outside Saudi Arabia and the English copy, which has
 * existed all along, was invisible to search.
 *
 * The scheme: Arabic keeps the bare path (no URL moves, nothing already
 * indexed changes), English lives under /en.
 *
 *   Arabic   /questions/medicine/foo
 *   English  /en/questions/medicine/foo
 *
 * x-default points at the Arabic URL, because the audience is predominantly
 * Saudi and Arabic is what the site defaults to.
 *
 * React-free and browser-free: this runs under Node at build time.
 */

export const SITE_ORIGIN = 'https://www.smle-question-bank.com';

export const DEFAULT_LANG = 'ar';
export const SUPPORTED_LANGS = ['ar', 'en'];
export const EN_PREFIX = '/en';

/** Absolute URL for a site-relative path. */
export function absoluteUrl(routePath) {
    return new URL(routePath, `${SITE_ORIGIN}/`).toString();
}

/**
 * The path a route lives at in a given language.
 * `/` becomes `/en` rather than `/en/`, so there is exactly one English root.
 */
export function localizedPath(routePath, lang = DEFAULT_LANG) {
    const path = routePath.startsWith('/') ? routePath : `/${routePath}`;
    if (lang !== 'en') return path;
    return path === '/' ? EN_PREFIX : `${EN_PREFIX}${path}`;
}

/**
 * Split a pathname into its language and its language-neutral path.
 *
 * `/en` and `/en/…` are English; everything else is Arabic. Note `/english` or
 * `/enrolment` must NOT match — hence the explicit boundary check rather than
 * a bare startsWith.
 */
export function stripLocale(pathname = '/') {
    const path = pathname || '/';
    if (path === EN_PREFIX) return { lang: 'en', path: '/' };
    if (path.startsWith(`${EN_PREFIX}/`)) {
        return { lang: 'en', path: path.slice(EN_PREFIX.length) || '/' };
    }
    return { lang: DEFAULT_LANG, path };
}

/**
 * The hreflang set for a route, as {hreflang, href} pairs.
 *
 * Every page in a language set must list every variant INCLUDING itself, and
 * the URLs must differ — that is the whole contract, and it is what the old
 * bare-string alternates could not express.
 */
export function alternatesFor(routePath) {
    const arUrl = absoluteUrl(localizedPath(routePath, 'ar'));
    const enUrl = absoluteUrl(localizedPath(routePath, 'en'));
    return [
        { hreflang: 'ar', href: arUrl },
        { hreflang: 'en', href: enUrl },
        { hreflang: 'x-default', href: arUrl },
    ];
}

export const dirFor = (lang) => (lang === 'ar' ? 'rtl' : 'ltr');

/** The `inLanguage` value for structured data. */
export const schemaLang = (lang) => (lang === 'en' ? 'en' : 'ar-SA');

/** The `og:locale` value. */
export const ogLocale = (lang) => (lang === 'en' ? 'en_US' : 'ar_SA');

/**
 * Which routes exist in both languages.
 *
 * The English tree is public content only. The signed-in app, the admin panel
 * and the payment flow are noindex, have no English prerender and no reason to
 * live at a second URL — they follow the language context alone, as they
 * always have. Linking to /en/analysis would just 404.
 *
 * Kept here rather than in main.jsx because three things have to agree on
 * exactly one list: the router (which registers the twins), the runtime link
 * helper (which decides whether to prefix a href) and the prerender (which
 * writes the files). A path in this list with no English body prerendered for
 * it would be a live English URL that no sitemap mentions and no crawler can
 * make sense of — /suggestions and /forgot-password are left out for exactly
 * that reason, and keep serving both languages from their one Arabic URL.
 */
export const EN_TWIN_PATHS = [
    '/',
    '/about',
    '/faq',
    '/contact',
    '/demo',
    '/groups',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/login',
    '/signup',
];

/** Route subtrees that exist in both languages, including their children. */
export const EN_TWIN_PREFIXES = ['/guides', '/questions', '/past-papers'];

const EN_TWIN_SET = new Set(EN_TWIN_PATHS);

/** True when `path` (language-neutral) is served in English at its /en twin. */
export function hasEnglishTwin(path = '/') {
    const clean = path.split('?')[0].split('#')[0];
    const normalized = clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;
    if (EN_TWIN_SET.has(normalized)) return true;
    return EN_TWIN_PREFIXES.some(
        (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
    );
}

/**
 * The href a link should use, given the language being rendered.
 *
 * Unlike `localizedPath` — which is the build-time primitive and prefixes
 * whatever it is handed — this refuses to send a visitor to an /en URL that
 * does not exist. Query strings and hashes survive the round trip.
 */
export function pathForLang(path = '/', lang = DEFAULT_LANG) {
    if (lang !== 'en' || typeof path !== 'string' || !path.startsWith('/')) return path;
    const match = /^([^?#]*)(.*)$/.exec(path);
    const [, base, suffix] = match;
    if (!hasEnglishTwin(base)) return path;
    return `${localizedPath(base, 'en')}${suffix}`;
}
