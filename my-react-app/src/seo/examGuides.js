/**
 * /exams — routes, metadata and crawler HTML for the exam logistics pages.
 *
 * S1-06 and S1-07. The prose lives in i18n/copy/examGuides.js; this module
 * turns it into thirteen language-neutral routes, doubled across ar/en by the
 * prerenderer:
 *
 *   /exams                       both exams side by side
 *   /exams/format                shared — the two exams are built identically
 *   /exams/test-day              shared — same centres, same rules
 *   /exams/{smle,snle}           per-exam hub
 *   /exams/{smle,snle}/blueprint
 *   /exams/{smle,snle}/passing-score
 *   /exams/{smle,snle}/eligibility
 *   /exams/{smle,snle}/attempts
 *
 * Pages reuse guideArticleHtml, so an exam page and a study guide render from
 * the same block shapes through the same code. The one thing added here is the
 * source section, appended to every page rather than written into each one —
 * twenty-six copies of a citation is twenty-six chances to let one go stale.
 *
 * React-free and browser-free: runs under Node at build time.
 */
import examGuidesCopy, {
    EXAMS_ROOT,
    EXAM_KEYS,
    EXAM_PAGES,
    SHARED_PAGES,
    SOURCES,
    examPagePath,
    examPath,
    sharedPagePath,
} from '../i18n/copy/examGuides.js';
import { guideArticleHtml } from './prerenderHtml.js';
import {
    SITE_ORIGIN,
    absoluteUrl,
    alternatesFor,
    localizedPath,
    ogLocale,
    schemaLang,
} from './locales.js';

export { EXAMS_ROOT, EXAM_KEYS, EXAM_PAGES, SHARED_PAGES, examPagePath, examPath, sharedPagePath };

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1';

const copyFor = (lang) => examGuidesCopy[lang] || examGuidesCopy.ar;

/**
 * A meta description, taken from the page's own opening paragraph.
 *
 * Derived rather than authored because a hand-written description that repeats
 * the intro in different words is one more string to keep true. Cut at a
 * sentence boundary where one falls in range, so the snippet never ends
 * mid-clause.
 */
function describe(intro = '', max = 165) {
    const text = String(intro).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    if (text.length <= max) return text;
    const window = text.slice(0, max);
    const stop = Math.max(window.lastIndexOf('. '), window.lastIndexOf('، '), window.lastIndexOf('؟ '));
    if (stop > max * 0.5) return window.slice(0, stop + 1).trim();
    const space = window.lastIndexOf(' ');
    return `${window.slice(0, space > 0 ? space : max).trim()}…`;
}

const KEYWORDS = {
    ar: {
        root: 'اختبارات الهيئة السعودية للتخصصات الصحية, SMLE, SNLE, اختبار الرخصة السعودية',
        'format': 'شكل اختبار SMLE, عدد أسئلة SNLE, مدة اختبار الهيئة, الأسئلة التجريبية',
        'test-day': 'يوم اختبار SMLE, ما تحتاجه في مركز بروميتريك, هوية اختبار الهيئة, التأخر عن الاختبار',
        blueprint: (label) => `توزيع اختبار ${label}, ${label} blueprint, مواضيع اختبار ${label}, نسب اختبار ${label}`,
        'passing-score': (label) => `درجة النجاح في ${label}, نتيجة اختبار ${label}, مقياس 200 800, متى تظهر نتيجة ${label}`,
        eligibility: (label) => `شروط التقديم على ${label}, تسجيل اختبار ${label}, تصريح الجدولة, حجز موعد بروميتريك`,
        attempts: (label) => `عدد محاولات ${label}, إعادة اختبار ${label}, تحسين درجة ${label}, الرسوب في ${label}`,
    },
    en: {
        root: 'SCFHS exams, SMLE, SNLE, Saudi licensing exam, Saudi Commission for Health Specialties',
        'format': 'SMLE format, SNLE format, how many questions SMLE, pilot questions, exam timing',
        'test-day': 'SMLE test day, Prometric Saudi, exam ID requirements, arriving late for SMLE',
        blueprint: (label) => `${label} blueprint, ${label} content outline, ${label} topics, what is on the ${label}`,
        'passing-score': (label) => `${label} passing score, ${label} results, 200-800 scale, when do ${label} results come out`,
        eligibility: (label) => `${label} eligibility, ${label} registration, scheduling permit, book ${label} Prometric`,
        attempts: (label) => `${label} attempts, retake ${label}, improve ${label} score, failed the ${label}`,
    },
};

function keywordsFor(lang, kind, label) {
    const set = KEYWORDS[lang] || KEYWORDS.ar;
    const entry = set[kind];
    return typeof entry === 'function' ? entry(label) : entry;
}

/* ------------------------------------------------------------------ */
/* Page resolution                                                     */
/* ------------------------------------------------------------------ */

/**
 * The source note, appended to every page.
 *
 * The shared pages cite the nursing guide by link and name both, because the
 * facts on them are stated identically in the two documents and a reader of
 * either should be able to check them.
 */
function sourceSectionFor(lang, sourceKey) {
    const t = copyFor(lang);
    const src = SOURCES[sourceKey] || SOURCES.shared;
    return t.sourceSection(
        lang === 'en' ? src.nameEn : src.nameAr,
        src.url,
        lang === 'en' ? src.retrievedEn : src.retrievedAr
    );
}

const withSource = (page, lang, sourceKey) => ({
    ...page,
    sections: [...page.sections, sourceSectionFor(lang, sourceKey)],
});

/** The cards an exam hub links to: its four pages plus the two shared ones. */
export function hubCards(lang, exam) {
    const t = copyFor(lang);
    const own = t.exams[exam].pages;
    return [
        ...EXAM_PAGES.map((page) => ({ path: examPagePath(exam, page), title: own[page].title })),
        ...SHARED_PAGES.map((page) => ({ path: sharedPagePath(page), title: t.shared[page].title })),
    ];
}

/** Every page on the site's exam section, for the root hub's card list. */
function rootCards(lang) {
    const t = copyFor(lang);
    return [
        ...EXAM_KEYS.map((exam) => ({ path: examPath(exam), title: t.exams[exam].hub.title })),
        ...SHARED_PAGES.map((page) => ({ path: sharedPagePath(page), title: t.shared[page].title })),
    ];
}

/**
 * One page's copy, ready to render — the same object the React component and
 * the prerenderer both use, so the two cannot describe the page differently.
 *
 * Returns null for a path that is not an exam route, which is what lets the
 * component render a 404 rather than an empty article.
 */
export function resolveExamRoute(path, lang = 'ar') {
    const t = copyFor(lang);
    if (path === EXAMS_ROOT) {
        return { kind: 'root', page: { ...t.root, listLabel: t.root.listLabel }, cards: rootCards(lang) };
    }
    const rest = path.startsWith(`${EXAMS_ROOT}/`) ? path.slice(EXAMS_ROOT.length + 1) : null;
    if (!rest) return null;

    const segments = rest.split('/');
    if (segments.length === 1) {
        const [key] = segments;
        if (SHARED_PAGES.includes(key)) {
            return { kind: 'shared', page: withSource(t.shared[key], lang, 'shared'), cards: rootCards(lang) };
        }
        if (EXAM_KEYS.includes(key)) {
            return { kind: 'hub', exam: key, page: t.exams[key].hub, cards: hubCards(lang, key) };
        }
        return null;
    }
    if (segments.length === 2) {
        const [exam, page] = segments;
        if (!EXAM_KEYS.includes(exam) || !EXAM_PAGES.includes(page)) return null;
        return {
            kind: 'page',
            exam,
            page: withSource(t.exams[exam].pages[page], lang, exam),
            cards: hubCards(lang, exam),
        };
    }
    return null;
}

/** Every language-neutral path in the section, in link order. */
export function examRoutePaths() {
    return [
        EXAMS_ROOT,
        ...SHARED_PAGES.map(sharedPagePath),
        ...EXAM_KEYS.flatMap((exam) => [
            examPath(exam),
            ...EXAM_PAGES.map((page) => examPagePath(exam, page)),
        ]),
    ];
}

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

function breadcrumbFor(path, lang) {
    const t = copyFor(lang);
    const crumbs = [
        { name: t.breadcrumbHome, path: '/' },
        { name: t.breadcrumbRoot, path: EXAMS_ROOT },
    ];
    const rest = path.startsWith(`${EXAMS_ROOT}/`) ? path.slice(EXAMS_ROOT.length + 1).split('/') : [];
    if (rest.length === 2) {
        crumbs.push({ name: t.exams[rest[0]].label, path: examPath(rest[0]) });
    }
    if (path !== EXAMS_ROOT) {
        const resolved = resolveExamRoute(path, lang);
        if (resolved) crumbs.push({ name: resolved.page.title, path });
    }
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: absoluteUrl(localizedPath(item.path, lang)),
        })),
    };
}

export function examSeo(path, lang = 'ar') {
    const resolved = resolveExamRoute(path, lang);
    if (!resolved) return null;
    const t = copyFor(lang);
    const { kind, exam, page } = resolved;
    const url = absoluteUrl(localizedPath(path, lang));
    const description = describe(page.intro);

    const kindKey = kind === 'root' ? 'root'
        : kind === 'shared' ? path.slice(EXAMS_ROOT.length + 1)
            : kind === 'hub' ? 'blueprint'
                : path.split('/').pop();
    const label = exam ? t.exams[exam].label : 'SMLE / SNLE';

    return {
        title: `${page.title} | SQB`,
        description,
        keywords: keywordsFor(lang, kindKey, label),
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: page.title,
        url,
        type: kind === 'root' || kind === 'hub' ? 'website' : 'article',
        siteName: 'SQB',
        robots: DEFAULT_ROBOTS,
        lang,
        locale: ogLocale(lang),
        alternates: alternatesFor(path),
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': kind === 'root' || kind === 'hub' ? 'CollectionPage' : 'Article',
                name: page.title,
                headline: page.title,
                description,
                url,
                inLanguage: schemaLang(lang),
                isPartOf: { '@type': 'WebSite', name: 'SQB', url: SITE_ORIGIN },
            },
            breadcrumbFor(path, lang),
        ],
    };
}

/* ------------------------------------------------------------------ */
/* Build-time routes                                                   */
/* ------------------------------------------------------------------ */

/** Every /exams route for one language, in the prerenderer's shape. */
export function buildExamRoutes({ lang = 'ar', footerNav = '' } = {}) {
    return examRoutePaths().map((path) => {
        const resolved = resolveExamRoute(path, lang);
        const hub = { cards: resolved.cards, listLabel: copyFor(lang).listLabel };
        return {
            path: localizedPath(path, lang),
            html: `${guideArticleHtml(resolved.page, { lang, hub, currentPath: path })}${footerNav}`,
            seo: examSeo(path, lang),
        };
    });
}
