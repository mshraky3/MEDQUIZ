/**
 * Crawler-visible HTML for the prerendered routes, generated from the SAME
 * copy the React components render.
 *
 * Why this file exists: the guide routes used to carry a hand-written
 * `prerenderHtml` stub in siteMetadata.js — an <h1> and one sentence, about 30
 * words — while the real article (thousands of words, already written, already
 * translated) lived only in src/i18n/copy/guides.js and only appeared after
 * React hydrated. Google crawled those URLs and declined to index them:
 * "Discovered — currently not indexed". Search Console still shows 690
 * impressions and zero clicks for the exact query /guides/how-to-use-a-question-bank
 * answers, because the page Google was handed did not answer it.
 *
 * Generating the HTML from `guidesCopy` instead of hand-writing it means the
 * stub can never drift from the article again: edit the copy, and the crawler
 * HTML changes with it.
 *
 * Constraints — this module is imported by scripts/postbuild-seo.mjs under
 * plain Node at build time, so it must stay free of React, JSX, browser
 * globals and any non-.js import specifier.
 *
 * The emitted markup mirrors the components' DOM (components/guides/
 * GuideArticle.jsx and GuidesHub.jsx) so the existing Guides.css styles it for
 * the no-JS case. React does not hydrate this — main.jsx uses createRoot(),
 * which replaces the container outright — so a divergence costs styling for
 * crawlers, never a hydration mismatch.
 */

// Same token grammar GuideArticle.jsx parses: **bold** and [[/path|label]].
const INLINE_TOKEN = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g;

export function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Escape first, then tokenise. Neither `**` nor `[[…|…]]` contains a character
 * that escaping rewrites, so the tokens survive intact — and by the time a
 * captured href or label is interpolated it is already attribute-safe.
 */
export function inlineHtml(value = '') {
    return escapeHtml(value)
        .split(INLINE_TOKEN)
        .filter(Boolean)
        .map((part) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return `<strong>${part.slice(2, -2)}</strong>`;
            }
            if (part.startsWith('[[') && part.endsWith(']]')) {
                const [href, label = href] = part.slice(2, -2).split('|');
                return `<a href="${href}">${label}</a>`;
            }
            return part;
        })
        .join('');
}

function blockHtml(block) {
    if (block.h3) return `<h3>${inlineHtml(block.h3)}</h3>`;
    if (block.ul) {
        return `<ul>${block.ul.map((item) => `<li>${inlineHtml(item)}</li>`).join('')}</ul>`;
    }
    return `<p>${inlineHtml(block.p)}</p>`;
}

/**
 * A guide article, matching GuideArticle.jsx.
 *
 * `{ ad: true }` sections are dropped: they render an AdSense slot, which is
 * nothing for a crawler to read and would only dilute the page.
 *
 * Throws on a missing guide rather than emitting an empty <article>. A typo in
 * a route key should fail the build loudly, not ship another thin page — that
 * failure mode is the entire reason this file exists.
 */
export function guideArticleHtml(guide, { dir = 'rtl', hub = null, currentPath = null } = {}) {
    if (!guide || !guide.title || !Array.isArray(guide.sections)) {
        throw new Error('[prerenderHtml] guideArticleHtml called with a guide that has no title/sections');
    }

    const sections = guide.sections
        .filter((section) => !section.ad)
        .map((section) => {
            const blocks = (section.blocks || []).map(blockHtml).join('\n        ');
            return `      <section>\n        <h2>${inlineHtml(section.heading)}</h2>\n        ${blocks}\n      </section>`;
        })
        .join('\n');

    // Sibling links, so the five articles form a connected cluster rather than
    // five leaves hanging off one hub. Real titles as anchor text, and the
    // current article filtered out so no page links to itself.
    let related = '';
    if (hub && Array.isArray(hub.cards)) {
        const siblings = hub.cards
            .filter((card) => card.path !== currentPath)
            .map((card) => `        <a href="${escapeHtml(card.path)}">${inlineHtml(card.title)}</a>`)
            .join('\n');
        if (siblings) {
            related = `\n      <nav class="guide-related" aria-label="أدلة ذات صلة">\n        <h2>${escapeHtml(hub.listLabel)}</h2>\n${siblings}\n      </nav>`;
        }
    }

    return `
    <article class="guide-article" dir="${dir}">
      <header class="guide-header">
        <p class="guides-kicker">${escapeHtml(guide.kicker)}</p>
        <h1>${inlineHtml(guide.title)}</h1>
        <p>${inlineHtml(guide.intro)}</p>
      </header>
${sections}${related}
    </article>
  `;
}

/**
 * The guides teaser that goes into the prerendered landing page.
 *
 * Before this existed, the crawler HTML for `/` linked to about / faq /
 * contact / signup / login and nothing else — the only internal link to
 * /guides lived in the React footer, which never appears in prerendered
 * markup. So every guide was zero-linked from the crawlable site, which is
 * the usual cause of "Discovered — currently not indexed, last crawled: N/A".
 *
 * Anchor text is each guide's real title, not "read more", because the anchor
 * text is most of what a crawler learns about the destination.
 */
export function guidesTeaserHtml(hub, { heading, intro } = {}) {
    if (!hub || !Array.isArray(hub.cards)) {
        throw new Error('[prerenderHtml] guidesTeaserHtml called with a hub that has no cards');
    }

    const items = hub.cards
        .map((card) => `            <li>
              <a href="${escapeHtml(card.path)}">${inlineHtml(card.title)}</a>
              <p>${inlineHtml(card.excerpt)}</p>
            </li>`)
        .join('\n');

    return `        <section>
          <h2>${escapeHtml(heading || hub.title)}</h2>
          <p>${escapeHtml(intro || hub.intro)}</p>
          <ul>
${items}
          </ul>
          <p><a href="/guides">${escapeHtml(hub.listLabel)}</a></p>
        </section>`;
}

/**
 * The site-wide link row appended to every prerendered route.
 *
 * It mirrors components/common/Footer.jsx, which is the real site's only path
 * to several of these pages — and which a crawler reading the initial HTML has
 * never been able to see. Labels stay Arabic because the prerendered HTML is
 * the Arabic variant regardless of the visitor's chosen language.
 */
const FOOTER_NAV_LINKS = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/guides', label: 'أدلة التحضير لاختبار SMLE' },
    { href: '/questions', label: 'أسئلة تدريبية مجانية' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/groups', label: 'الاشتراك الجماعي' },
    { href: '/contact', label: 'اتصل بنا' },
    { href: '/signup', label: 'إنشاء حساب مجاني' },
    { href: '/login', label: 'تسجيل الدخول' },
    { href: '/terms', label: 'شروط الخدمة' },
    { href: '/refund-policy', label: 'سياسة الاسترداد' },
    { href: '/privacy', label: 'سياسة الخصوصية' },
];

export function siteFooterNavHtml() {
    const links = FOOTER_NAV_LINKS
        .map(({ href, label }) => `      <a href="${href}">${escapeHtml(label)}</a>`)
        .join('\n');
    return `
    <nav class="seo-footer-nav" aria-label="روابط الموقع" dir="rtl">
${links}
    </nav>
  `;
}

/** The guides hub, matching GuidesHub.jsx. */
export function guidesHubHtml(hub, { dir = 'rtl' } = {}) {
    if (!hub || !Array.isArray(hub.cards)) {
        throw new Error('[prerenderHtml] guidesHubHtml called with a hub that has no cards');
    }

    const cards = hub.cards
        .map((card) => `        <article class="guide-card">
          <h2><a href="${escapeHtml(card.path)}">${inlineHtml(card.title)}</a></h2>
          <p>${inlineHtml(card.excerpt)}</p>
          <a class="guide-cta" href="${escapeHtml(card.path)}">${escapeHtml(hub.readMore)}</a>
        </article>`)
        .join('\n');

    const notes = (hub.notes || []).map((note) => `<li>${inlineHtml(note)}</li>`).join('');

    return `
    <main class="guides-page" dir="${dir}">
      <header class="guides-hero">
        <p class="guides-kicker">${escapeHtml(hub.kicker)}</p>
        <h1>${inlineHtml(hub.title)}</h1>
        <p>${inlineHtml(hub.intro)}</p>
      </header>
      <section class="guides-list" aria-label="${escapeHtml(hub.listLabel)}">
${cards}
      </section>
      <section class="guides-note">
        <h2>${escapeHtml(hub.notesTitle)}</h2>
        <ul>${notes}</ul>
      </section>
    </main>
  `;
}
