/**
 * /success-stories — the page, its metadata, and its crawler HTML.
 *
 * Built from src/seo/data/successStories.json, which is produced by
 * backend/scripts/exportSuccessStories.js from rows that are BOTH approved and
 * carry recorded consent. If that file is absent or empty, this module emits no
 * route at all and the page does not exist.
 *
 * That is deliberate. A testimonials page with no testimonials is a thin page
 * that says the opposite of what it is for, and there is no version of this
 * feature where inventing example quotes is acceptable — the entire value of a
 * testimonial is that a real person said it. So the page appears the day there
 * is something true to put on it, and not before.
 *
 * React-free and browser-free: runs under Node at build time.
 */
import successStoriesCopy from '../i18n/copy/successStories.js';
import {
    absoluteUrl,
    alternatesFor,
    dirFor,
    localizedPath,
    ogLocale,
    schemaLang,
} from './locales.js';

export const SUCCESS_STORIES_ROOT = '/success-stories';

const SITE_ORIGIN = 'https://www.smle-question-bank.com';

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

/** The published stories, or [] when none have been exported. */
export function storiesFrom(payload) {
    const stories = payload && Array.isArray(payload.stories) ? payload.stories : [];
    return stories.filter((s) => s && s.quote && s.name);
}

export function successStoriesSeo(count, lang = 'ar') {
    const t = successStoriesCopy[lang] || successStoriesCopy.ar;
    const url = absoluteUrl(localizedPath(SUCCESS_STORIES_ROOT, lang));
    return {
        title: t.meta.title,
        description: t.meta.description(count),
        keywords: lang === 'en'
            ? 'SMLE success stories, SNLE pass, SMLE testimonials, passed the Saudi licensing exam'
            : 'قصص نجاح SMLE, تجارب اجتياز سملي, آراء طلاب SQB, اجتزت اختبار الهيئة',
        image: `${SITE_ORIGIN}/og-image.svg`,
        imageAlt: t.meta.title,
        url,
        type: 'website',
        siteName: 'SQB',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1',
        lang,
        locale: ogLocale(lang),
        alternates: alternatesFor(SUCCESS_STORIES_ROOT),
        structuredData: [
            {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: t.title,
                description: t.meta.description(count),
                url,
                inLanguage: schemaLang(lang),
                isPartOf: { '@type': 'WebSite', name: 'SQB', url: SITE_ORIGIN },
            },
        ],
        // No Review or AggregateRating schema. Google's review-snippet policy
        // does not allow self-serving reviews of your own business, and these
        // are exactly that — marking them up as ratings would be asking for a
        // manual action rather than a rich result.
    };
}

/** The crawler-visible body. */
export function successStoriesHtml(stories, lang = 'ar', { footerNav = '' } = {}) {
    const t = successStoriesCopy[lang] || successStoriesCopy.ar;
    const p = (path) => localizedPath(path, lang);

    const items = stories.map((s) => `
        <figure class="ss-story">
          <blockquote>${escapeHtml(s.quote)}</blockquote>
          <figcaption>
            <strong>${escapeHtml(s.name)}</strong>${s.examResult ? ` — ${escapeHtml(s.examResult)}` : ''}
          </figcaption>
        </figure>`).join('\n');

    return `
    <main class="ss-page" dir="${dirFor(lang)}">
      <header class="ss-hero">
        <p class="ss-kicker">${escapeHtml(t.kicker)}</p>
        <h1>${escapeHtml(t.title)}</h1>
        <p>${escapeHtml(t.intro(stories.length))}</p>
      </header>
      <section>
${items}
      </section>
      <section>
        <h2>${escapeHtml(t.ctaTitle)}</h2>
        <p>${escapeHtml(t.ctaBody)}</p>
        <p><a href="${p('/demo')}">${escapeHtml(t.ctaDemo)}</a></p>
        <p><a href="${p('/signup')}">${escapeHtml(t.ctaSignup)}</a></p>
      </section>
${footerNav}
    </main>
  `;
}

/**
 * The build-time route, or an empty array when there is nothing to publish.
 *
 * Returning [] is what keeps the page from existing — postbuild-seo.mjs
 * flat-maps this, so no stories means no file, no sitemap entry, and no
 * indexable page claiming social proof that does not exist yet.
 */
export function buildSuccessStoriesRoutes(payload, { footerNav = '', lang = 'ar' } = {}) {
    const stories = storiesFrom(payload);
    if (!stories.length) return [];
    return [{
        path: localizedPath(SUCCESS_STORIES_ROOT, lang),
        html: successStoriesHtml(stories, lang, { footerNav }),
        seo: successStoriesSeo(stories.length, lang),
    }];
}
