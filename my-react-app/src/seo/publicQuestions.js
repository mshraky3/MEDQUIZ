/**
 * The public question library: URL scheme, lookups, SEO config and crawler HTML.
 *
 * Background: the bank holds 5,033 questions, every one with a written
 * explanation, and all of them sit behind the login. Google has five pages of
 * this site indexed. scripts/exportPublicQuestions.js (in backend/) selects a
 * bounded sample into src/seo/data/publicQuestions.json, and this module turns
 * that file into routes — one static page per question, plus a per-specialty
 * index and a hub.
 *
 * Deliberately does NOT import the JSON. The payload is ~415 KB and
 * siteMetadata.js is imported by the running app, so importing it here would
 * put the whole question set in the main client bundle. Instead:
 *   - scripts/postbuild-seo.mjs reads the file with fs and passes it in,
 *   - the React routes `await import()` it, so it lands in its own async chunk
 *     that only visitors to /questions/* ever download.
 *
 * Also stays React-free and browser-free: it runs under plain Node at build
 * time.
 */

import publicQuestionsCopy from '../i18n/copy/publicQuestions.js';
import { faqHtml, faqPageSchema } from './faqSchema.js';
import {
    SITE_ORIGIN,
    absoluteUrl,
    alternatesFor,
    dirFor,
    localizedPath,
    ogLocale,
    schemaLang,
} from './locales.js';

// Specialty keys are the literal `questions.question_type` values, which
// contain spaces ("obstetrics and gynecology"). URLs get the hyphenated form.
export function specialtySlug(specialtyKey) {
    return String(specialtyKey).trim().toLowerCase().replace(/\s+/g, '-');
}

export const QUESTIONS_ROOT = '/questions';

export function specialtyPath(specialtyKey) {
    return `${QUESTIONS_ROOT}/${specialtySlug(specialtyKey)}`;
}

export function questionPath(question) {
    return `${specialtyPath(question.specialty)}/${question.slug}`;
}

/**
 * Group the flat export into the shape every consumer wants: ordered
 * specialties, questions per specialty, and slug lookups.
 */
export function buildQuestionIndex(payload) {
    const questions = (payload && payload.questions) || [];
    const bySpecialty = new Map();

    for (const question of questions) {
        if (!bySpecialty.has(question.specialty)) {
            bySpecialty.set(question.specialty, {
                key: question.specialty,
                slug: specialtySlug(question.specialty),
                track: question.track,
                labelEn: question.specialtyLabelEn,
                labelAr: question.specialtyLabelAr,
                path: specialtyPath(question.specialty),
                questions: [],
            });
        }
        bySpecialty.get(question.specialty).questions.push(question);
    }

    const specialties = [...bySpecialty.values()];
    const bySpecialtySlug = new Map(specialties.map((s) => [s.slug, s]));
    const byQuestionSlug = new Map(questions.map((q) => [q.slug, q]));

    return {
        generatedAt: payload?.generatedAt || null,
        // The whole bank, not just what is published — the FAQ answers compare
        // the two, and getting that backwards would understate the product.
        bankTotal: payload?.bankTotal || null,
        total: questions.length,
        questions,
        specialties,
        bySpecialtySlug,
        byQuestionSlug,
        tracks: ['medical', 'nursing'].map((track) => ({
            key: track,
            specialties: specialties.filter((s) => s.track === track),
        })).filter((t) => t.specialties.length > 0),
    };
}

/**
 * Up to `limit` other questions from the same specialty.
 *
 * Every published page linking to siblings is what makes the library a
 * connected cluster instead of 240 orphans — the same problem that left the
 * five study guides at "Discovered — currently not indexed".
 */
export function relatedQuestions(index, question, limit = 6) {
    const group = index.bySpecialtySlug.get(specialtySlug(question.specialty));
    if (!group) return [];
    const others = group.questions.filter((q) => q.slug !== question.slug);
    const start = others.findIndex((q) => q.id > question.id);
    const from = start === -1 ? 0 : start;
    // Wrap around so the last question in a specialty still gets six links.
    return [...others.slice(from), ...others.slice(0, from)].slice(0, limit);
}

/**
 * The vignette minus the sentence already shown as the <h1>.
 *
 * `headline` is the stem's first sentence, so rendering both verbatim printed
 * it twice on every page. When the headline is the exact opening sentence the
 * body starts after it and the two read as one continuous vignette; when it
 * had to be truncated (trailing ellipsis) the body keeps the full stem, since
 * a shortened heading is not a substitute for the sentence.
 *
 * The structured data and the search snippet always use the complete `stem` —
 * only what a reader sees below the heading is trimmed.
 */
export function stemBody(question) {
    const { stem, headline } = question;
    if (headline && !headline.endsWith('…') && stem.startsWith(headline)) {
        const rest = stem.slice(headline.length).trim();
        // Guard against a one-sentence stem, where trimming would leave nothing.
        if (rest) return rest;
    }
    return stem;
}

/* ------------------------------------------------------------------ *
 * Crawler HTML
 * ------------------------------------------------------------------ */

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * One question page.
 *
 * The explanation renders as ordinary visible prose — not inside a collapsed
 * <details>, and not hidden behind a "reveal" the crawler is served open. A
 * page that shows Google more than it shows a reader is cloaking, and the
 * whole point of publishing these is to be a page that genuinely answers the
 * question someone searched for.
 */
export function questionPageHtml(question, related = [], lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const dir = dirFor(lang);
    const specialtyLabel = lang === 'en' ? question.specialtyLabelEn : question.specialtyLabelAr;

    const options = question.options
        .map((option, i) => {
            const isCorrect = i === question.correctIndex;
            return `        <li${isCorrect ? ' class="is-correct"' : ''}>
          <span class="pq-letter">${OPTION_LETTERS[i]}</span>
          <span>${escapeHtml(option)}</span>
${isCorrect ? `          <span class="pq-correct-tag">${escapeHtml(t.question.answerLabel)}</span>\n` : ''}        </li>`;
        })
        .join('\n');

    const relatedLinks = related
        .map((q) => `        <li><a href="${localizedPath(questionPath(q), lang)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    return `
    <main class="pq-page" dir="${dir}">
      <nav class="pq-breadcrumb" aria-label="${escapeHtml(t.breadcrumbLabel)}">
        <a href="${localizedPath('/', lang)}">${escapeHtml(t.breadcrumbHome)}</a>
        <a href="${localizedPath(QUESTIONS_ROOT, lang)}">${escapeHtml(t.breadcrumbRoot)}</a>
        <a href="${localizedPath(specialtyPath(question.specialty), lang)}">${escapeHtml(specialtyLabel)}</a>
      </nav>
      <article class="pq-question" lang="en" dir="ltr">
        <p class="pq-kicker">${escapeHtml(question.specialtyLabelEn)}</p>
        <h1>${escapeHtml(question.headline)}</h1>
        <p class="pq-stem">${escapeHtml(stemBody(question))}</p>
        <ol class="pq-options">
${options}
        </ol>
        <section class="pq-explanation">
          <h2>${escapeHtml(t.question.explanationTitle)}</h2>
          <p>${escapeHtml(question.explanation)}</p>
        </section>
      </article>
${ctaHtml(t, lang)}
${related.length ? `      <nav class="pq-related" aria-label="${escapeHtml(t.question.relatedTitle(specialtyLabel))}" dir="${dir}">
        <h2>${escapeHtml(t.question.relatedTitle(specialtyLabel))}</h2>
        <ul>
${relatedLinks}
        </ul>
        <p><a href="${localizedPath(specialtyPath(question.specialty), lang)}">${escapeHtml(t.question.allInSpecialty(specialtyLabel))}</a></p>
      </nav>` : ''}
    </main>
  `;
}

/**
 * The signup CTA, shared by all three page types.
 *
 * It reads the same `cta` block the React <SignupCta> renders, so the
 * prerendered page and the hydrated page now make the same offer in the same
 * words — they used to differ slightly per page, for no reason anyone could
 * have defended.
 */
function ctaHtml(t, lang) {
    return `      <section class="pq-cta" dir="${dirFor(lang)}">
        <h2>${escapeHtml(t.cta.title)}</h2>
        <p>${escapeHtml(t.cta.body)}</p>
        <a class="pq-cta-btn" href="${localizedPath('/signup', lang)}">${escapeHtml(t.cta.button)}</a>
        <p class="pq-cta-note">${escapeHtml(t.cta.note)}</p>
      </section>`;
}

/** A specialty index — every published question in one specialty. */
export function specialtyPageHtml(group, allSpecialties = [], lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const dir = dirFor(lang);
    const label = lang === 'en' ? group.labelEn : group.labelAr;

    const items = group.questions
        .map((q) => `          <li><a href="${localizedPath(questionPath(q), lang)}">${escapeHtml(q.headline)}</a></li>`)
        .join('\n');

    const siblings = allSpecialties
        .filter((s) => s.slug !== group.slug)
        .map((s) => `        <a href="${localizedPath(s.path, lang)}">${escapeHtml(lang === 'en' ? s.labelEn : s.labelAr)}</a>`)
        .join('\n');

    return `
    <main class="pq-page" dir="${dir}">
      <nav class="pq-breadcrumb" aria-label="${escapeHtml(t.breadcrumbLabel)}">
        <a href="${localizedPath('/', lang)}">${escapeHtml(t.breadcrumbHome)}</a>
        <a href="${localizedPath(QUESTIONS_ROOT, lang)}">${escapeHtml(t.breadcrumbRoot)}</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(group.labelEn)}</p>
        <h1>${escapeHtml(t.specialty.title(label))}</h1>
        <p>${escapeHtml(t.specialty.intro(group.questions.length, label))}</p>
      </header>
      <section>
        <h2>${escapeHtml(t.specialty.listTitle)}</h2>
        <ol class="pq-list">
${items}
        </ol>
      </section>
${ctaHtml(t, lang)}
${siblings ? `      <nav class="pq-siblings" aria-label="${escapeHtml(t.specialty.siblingsTitle)}">
        <h2>${escapeHtml(t.specialty.siblingsTitle)}</h2>
${siblings}
      </nav>` : ''}
    </main>
  `;
}

/** The library hub. */
export function questionsHubHtml(index, lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const dir = dirFor(lang);

    const groups = index.tracks
        .map((track) => {
            const items = track.specialties
                .map((s) => `          <li><a href="${localizedPath(s.path, lang)}">${escapeHtml(lang === 'en' ? s.labelEn : s.labelAr)}</a> — ${escapeHtml(t.hub.countLabel(s.questions.length))}</li>`)
                .join('\n');
            return `      <section>
        <h2>${escapeHtml(t.hub.tracks[track.key] || track.key)}</h2>
        <ul>
${items}
        </ul>
      </section>`;
        })
        .join('\n');

    return `
    <main class="pq-page" dir="${dir}">
      <nav class="pq-breadcrumb" aria-label="${escapeHtml(t.breadcrumbLabel)}">
        <a href="${localizedPath('/', lang)}">${escapeHtml(t.breadcrumbHome)}</a>
      </nav>
      <header class="pq-hero">
        <p class="pq-kicker">${escapeHtml(t.hub.kicker)}</p>
        <h1>${escapeHtml(t.hub.title)}</h1>
        <p>${escapeHtml(t.hub.intro(index.total))}</p>
      </header>
${groups}
${ctaHtml(t, lang)}
${faqHtml(hubFaqItems(index, lang), t.faqTitle)}
    </main>
  `;
}

/**
 * The hub FAQ, from the same copy the React page renders.
 *
 * Kept as a function of the index so the counts in the answers come from the
 * published data rather than being typed in and going stale the next time the
 * export runs.
 */
export function hubFaqItems(index, lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    return t.faq(index.total, index.bankTotal || index.total);
}

/* ------------------------------------------------------------------ *
 * SEO config
 * ------------------------------------------------------------------ */

function breadcrumbList(items, lang) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: absoluteUrl(localizedPath(item.path, lang)),
        })),
    };
}

/**
 * Question pages get Quiz + Question/Answer schema.
 *
 * This is the markup answer engines read to quote a page, and it is the reason
 * a question page can be cited by AI search — which already sends this site
 * more traffic than Bing does, with nothing done to earn it.
 *
 * `inLanguage` stays "en" in both trees: the clinical content is English on
 * the Arabic page too, and this schema describes the question, not the chrome.
 */
function quizSchema(question, routePath, lang) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        url: absoluteUrl(localizedPath(routePath, lang)),
        inLanguage: 'en',
        about: { '@type': 'Thing', name: question.specialtyLabelEn },
        educationalLevel: 'Professional',
        hasPart: {
            '@type': 'Question',
            eduQuestionType: 'Multiple choice',
            text: question.stem,
            acceptedAnswer: {
                '@type': 'Answer',
                text: question.options[question.correctIndex],
                explanation: question.explanation,
            },
            suggestedAnswer: question.options
                .filter((_, i) => i !== question.correctIndex)
                .map((option) => ({ '@type': 'Answer', text: option })),
        },
    };
}

export function questionSeo(question, lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const routePath = questionPath(question);
    const label = lang === 'en' ? question.specialtyLabelEn : question.specialtyLabelAr;
    return {
        path: routePath,
        title: t.seo.questionTitle(question.headline, question.specialtyLabelEn),
        description: t.seo
            .questionDescription(question.headline, question.specialtyLabelAr, question.specialtyLabelEn)
            .slice(0, 300),
        keywords: t.seo.questionKeywords(question.specialtyLabelAr, question.specialtyLabelEn),
        structuredData: [
            quizSchema(question, routePath, lang),
            breadcrumbList([
                { name: t.breadcrumbHome, path: '/' },
                { name: t.breadcrumbRoot, path: QUESTIONS_ROOT },
                { name: label, path: specialtyPath(question.specialty) },
                { name: question.headline, path: routePath },
            ], lang),
        ],
    };
}

export function specialtySeo(group, lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const label = lang === 'en' ? group.labelEn : group.labelAr;
    return {
        path: group.path,
        title: t.seo.specialtyTitle(group.labelAr, group.labelEn),
        description: t.seo.specialtyDescription(group.questions.length, group.labelAr, group.labelEn),
        keywords: t.seo.specialtyKeywords(group.labelAr, group.labelEn),
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: t.seo.specialtyCollectionName(group.labelAr, group.labelEn),
                url: absoluteUrl(localizedPath(group.path, lang)),
                inLanguage: schemaLang(lang),
                hasPart: group.questions.slice(0, 24).map((q) => ({
                    '@type': 'Question',
                    name: q.headline,
                    url: absoluteUrl(localizedPath(questionPath(q), lang)),
                })),
            },
            breadcrumbList([
                { name: t.breadcrumbHome, path: '/' },
                { name: t.breadcrumbRoot, path: QUESTIONS_ROOT },
                { name: label, path: group.path },
            ], lang),
        ],
    };
}

export function hubSeo(index, lang = 'ar') {
    const t = publicQuestionsCopy[lang] || publicQuestionsCopy.ar;
    const hubUrl = absoluteUrl(localizedPath(QUESTIONS_ROOT, lang));
    return {
        path: QUESTIONS_ROOT,
        title: t.seo.hubTitle(index.total),
        description: t.seo.hubDescription(index.total),
        keywords: t.seo.hubKeywords,
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: t.seo.hubCollectionName,
                url: hubUrl,
                inLanguage: schemaLang(lang),
            },
            faqPageSchema(hubFaqItems(index, lang), hubUrl, lang),
            breadcrumbList([
                { name: t.breadcrumbHome, path: '/' },
                { name: t.breadcrumbRoot, path: QUESTIONS_ROOT },
            ], lang),
        ].filter(Boolean),
    };
}

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

/**
 * Fill in the fields buildRouteHtml() and buildSitemap() read, so these routes
 * are interchangeable with the ones getPrerenderRoutes() returns.
 *
 * `url` is the localized URL and `alternates` are the {hreflang, href} pairs
 * for this route's language set — the two things that make an /en twin a real
 * alternate rather than a duplicate.
 */
export function completeSeo(partial, lang = 'ar') {
    return {
        title: partial.title,
        description: partial.description,
        keywords: partial.keywords,
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: partial.title,
        url: absoluteUrl(localizedPath(partial.path, lang)),
        type: 'article',
        siteName: 'SQB',
        robots: DEFAULT_ROBOTS,
        lang,
        locale: ogLocale(lang),
        alternates: alternatesFor(partial.path),
        structuredData: partial.structuredData || [],
    };
}

/**
 * Every public-question route for one language, ready for the prerenderer.
 *
 * Returns `{ path, html, seo }` in the same shape getPrerenderRoutes() returns,
 * so scripts/postbuild-seo.mjs can concatenate the lists and treat them
 * identically — including in the sitemap. `path` is already localized, so the
 * Arabic and English trees write to different files.
 */
export function buildPublicQuestionRoutes(payload, { footerNav = '', lang = 'ar' } = {}) {
    const index = buildQuestionIndex(payload);
    if (!index.total) return [];

    const routes = [
        { path: QUESTIONS_ROOT, html: questionsHubHtml(index, lang), seo: hubSeo(index, lang) },
    ];

    for (const group of index.specialties) {
        routes.push({
            path: group.path,
            html: specialtyPageHtml(group, index.specialties, lang),
            seo: specialtySeo(group, lang),
        });
    }

    for (const question of index.questions) {
        routes.push({
            path: questionPath(question),
            html: questionPageHtml(question, relatedQuestions(index, question), lang),
            seo: questionSeo(question, lang),
        });
    }

    return routes.map((route) => ({
        path: localizedPath(route.path, lang),
        html: `${route.html}${footerNav}`,
        seo: completeSeo(route.seo, lang),
    }));
}
