/**
 * FAQ blocks: one source for the visible text and the FAQPage markup.
 *
 * The two must never diverge. Google's structured-data policy requires FAQPage
 * answers to be visible on the page, and emitting schema for text a reader
 * cannot see is exactly the kind of thing that earns a manual action. So both
 * the crawler HTML and the React component render from the same array these
 * helpers take, and the schema is built from that same array.
 *
 * Worth knowing why these exist at all: since 2023 Google shows FAQ rich
 * results only for authoritative government and health sites, so this is not
 * about star-style snippets. It is about being quotable — a clean question ->
 * answer pair is what an answer engine lifts, and ChatGPT and Perplexity
 * already send this site more traffic than Bing does.
 *
 * React-free and browser-free: runs under Node at build time.
 */
import { schemaLang } from './locales.js';

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * @param {{q: string, a: string}[]} items
 * @param {string} url Absolute URL of the page the FAQ lives on.
 */
export function faqPageSchema(items, url, lang = 'ar') {
    if (!Array.isArray(items) || !items.length) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        url,
        inLanguage: schemaLang(lang),
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
}

/** The same items as crawler-visible markup, matching the React component's DOM. */
export function faqHtml(items, heading) {
    if (!Array.isArray(items) || !items.length) return '';
    const blocks = items
        .map((item) => `        <div class="pq-faq-item">
          <h3>${escapeHtml(item.q)}</h3>
          <p>${escapeHtml(item.a)}</p>
        </div>`)
        .join('\n');

    return `      <section class="pq-faq">
        <h2>${escapeHtml(heading)}</h2>
${blocks}
      </section>`;
}
