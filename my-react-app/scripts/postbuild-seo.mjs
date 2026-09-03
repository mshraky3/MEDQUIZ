/**
 * Post-build SEO prerender.
 *
 * Runs after `vite build` (invoked by the `postbuild` script in package.json).
 * For every public route that defines `prerenderHtml` in src/seo/siteMetadata.js
 * it emits a static `dist/<route>/index.html` whose <head> carries the route's
 * title / description / canonical / robots / og / twitter tags and JSON-LD, and
 * whose <div id="root"> is pre-filled with crawler-visible Arabic SMLE content.
 * React replaces that content on hydrate, so runtime behaviour is unchanged —
 * this only improves what crawlers and no-JS clients see in the initial HTML.
 *
 * It also regenerates dist/sitemap.xml from the indexable routes with a fresh
 * `lastmod`, so the sitemap never goes stale.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { getPrerenderRoutes, SITE_ORIGIN } from '../src/seo/siteMetadata.js';
import { siteFooterNavHtml } from '../src/seo/prerenderHtml.js';
import { buildPublicQuestionRoutes, QUESTIONS_ROOT } from '../src/seo/publicQuestions.js';
import { buildPastPaperRoutes, PAST_PAPERS_ROOT } from '../src/seo/pastPapers.js';
import { buildDemoRoutes, DEMO_ROOT } from '../src/seo/demo.js';
import { buildSuccessStoriesRoutes, SUCCESS_STORIES_ROOT } from '../src/seo/successStories.js';
import { buildExamRoutes, EXAMS_ROOT } from '../src/seo/examGuides.js';
import { SUPPORTED_LANGS, dirFor, stripLocale } from '../src/seo/locales.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(scriptDir, '../dist');
const templatePath = path.join(distDir, 'index.html');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const escapeAttr = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Replace the `content="…"` of a single <meta> matched by its identifying
// attribute (e.g. `name="description"` or `property="og:title"`).
const setMeta = (html, attr, value) => {
  if (value == null) return html;
  const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(<meta ${escapedAttr} content=")[^"]*(")`);
  return html.replace(re, (_m, pre, post) => `${pre}${escapeAttr(value)}${post}`);
};

const setAttr = (html, re, value) =>
  html.replace(re, (_m, pre, post) => `${pre}${escapeAttr(value)}${post}`);

function buildRouteHtml(template, seo, prerenderHtml) {
  let html = template;

  // <html lang/dir>. The template is Arabic/RTL; an English page that keeps
  // those attributes tells both the browser and the crawler the wrong thing,
  // and renders left-aligned English inside an RTL document.
  const lang = seo.lang || 'ar';
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}" dir="${dirFor(lang)}">`);

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(seo.title)}</title>`);

  // Head meta tags
  html = setMeta(html, 'name="description"', seo.description);
  html = setMeta(html, 'name="keywords"', seo.keywords);
  html = setMeta(html, 'name="robots"', seo.robots);
  html = setMeta(html, 'property="og:type"', seo.type);
  html = setMeta(html, 'property="og:title"', seo.title);
  html = setMeta(html, 'property="og:description"', seo.description);
  html = setMeta(html, 'property="og:url"', seo.url);
  html = setMeta(html, 'name="twitter:title"', seo.title);
  html = setMeta(html, 'name="twitter:description"', seo.description);
  html = setMeta(html, 'name="twitter:url"', seo.url);
  html = setMeta(html, 'property="og:locale"', seo.locale);

  // <link rel="canonical">
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, seo.url);

  // hreflang. The template hardcodes three alternates all pointing at the
  // homepage, which is worse than none: it tells Google every page's Arabic
  // and default version is `/`. Drop them and emit this route's real set.
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>/g, '');
  const alternateLinks = (seo.alternates || [])
    .map((alt) => `
    <link rel="alternate" hreflang="${escapeAttr(alt.hreflang)}" href="${escapeAttr(alt.href)}" />`)
    .join('');
  html = html.replace('</head>', `${alternateLinks}
  </head>`);

  // Replace the static JSON-LD blocks with this route's structured data.
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const ldBlocks = (seo.structuredData || [])
    .map((item) => `\n    <script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('');
  html = html.replace('</head>', `${ldBlocks}\n  </head>`);

  // Pre-fill the React root so crawlers/no-JS clients get real content.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${prerenderHtml.trim()}</div>`
  );

  return html;
}

function outputPathForRoute(routePath) {
  if (routePath === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, routePath, 'index.html');
}

// changefreq / priority hints for the sitemap; guide detail pages share a default.
const SITEMAP_HINTS = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/guides': { priority: '0.85', changefreq: 'weekly' },
  '/about': { priority: '0.7', changefreq: 'monthly' },
  '/faq': { priority: '0.7', changefreq: 'monthly' },
  '/groups': { priority: '0.7', changefreq: 'monthly' },
  '/privacy': { priority: '0.4', changefreq: 'yearly' },
  '/terms': { priority: '0.4', changefreq: 'yearly' },
  '/refund-policy': { priority: '0.4', changefreq: 'yearly' }
};
const GUIDE_DETAIL_HINT = { priority: '0.8', changefreq: 'weekly' };
// The published question set is a fixed sample that only changes when
// exportPublicQuestions.js is re-run, so it is deliberately NOT advertised as
// weekly — a sitemap that overstates freshness earns less crawl, not more.
const QUESTION_HUB_HINT = { priority: '0.8', changefreq: 'monthly' };
const QUESTION_PAGE_HINT = { priority: '0.6', changefreq: 'monthly' };

const PAST_PAPER_HINT = { priority: '0.75', changefreq: 'monthly' };
// The try-before-signup page. High priority because it is the one page that
// answers "free SMLE questions" with something playable rather than readable,
// but it is a fixed offer, not a feed — monthly, not weekly.
const DEMO_HINT = { priority: '0.9', changefreq: 'monthly' };
// Grows whenever a student adds one, so weekly is honest here.
const STORIES_HINT = { priority: '0.6', changefreq: 'weekly' };
// Exam logistics. High priority because these answer the highest-intent
// queries a candidate has, and yearly because they only change when SCFHS
// publishes a new applicant guide — claiming weekly on a page that is a
// transcription of a static PDF would be a lie the crawler learns to discount.
const EXAMS_HUB_HINT = { priority: '0.9', changefreq: 'yearly' };
const EXAMS_PAGE_HINT = { priority: '0.8', changefreq: 'yearly' };

function questionSitemapHint(routePath) {
    if (routePath === QUESTIONS_ROOT) return QUESTION_HUB_HINT;
    // /questions/<specialty> has two segments, /questions/<specialty>/<slug> has three.
    return routePath.split('/').length === 3 ? QUESTION_HUB_HINT : QUESTION_PAGE_HINT;
}

/**
 * Read the published question sample.
 *
 * Missing file is not an error: the site builds and deploys perfectly well
 * without the public library, and failing a deploy because a generated data
 * file has not been committed yet would be a bad trade. It logs loudly instead.
 */
function readPublicQuestions() {
    const dataPath = path.resolve(scriptDir, '../src/seo/data/publicQuestions.json');
    if (!fs.existsSync(dataPath)) {
        console.warn('[postbuild-seo] src/seo/data/publicQuestions.json not found — skipping the public question library. Run backend/scripts/exportPublicQuestions.js --apply to generate it.');
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.warn(`[postbuild-seo] Could not parse publicQuestions.json (${err.message}) — skipping the public question library.`);
        return null;
    }
}

function buildSitemap(routes) {
  const indexable = routes.filter(
    ({ seo }) => !(seo.robots || '').includes('noindex')
  );

  const urls = indexable
    .map(({ path: localizedRoutePath, seo }) => {
      // Hints are keyed by the language-neutral path, so /en/about gets the
      // same priority as /about instead of silently falling through to the
      // catch-all.
      const { path: routePath } = stripLocale(localizedRoutePath);
      const hint =
        SITEMAP_HINTS[routePath] ||
        (routePath === DEMO_ROOT ? DEMO_HINT : null) ||
        (routePath === SUCCESS_STORIES_ROOT ? STORIES_HINT : null) ||
        (routePath === EXAMS_ROOT ? EXAMS_HUB_HINT : null) ||
        (routePath.startsWith(`${EXAMS_ROOT}/`) ? EXAMS_PAGE_HINT : null) ||
        (routePath === QUESTIONS_ROOT || routePath.startsWith(`${QUESTIONS_ROOT}/`)
          ? questionSitemapHint(routePath)
          : routePath === PAST_PAPERS_ROOT || routePath.startsWith(`${PAST_PAPERS_ROOT}/`)
            ? PAST_PAPER_HINT
            : routePath.startsWith('/guides/')
            ? GUIDE_DETAIL_HINT
            : { priority: '0.5', changefreq: 'monthly' });
      return [
        '  <url>',
        `    <loc>${seo.url}</loc>`,
        `    <lastmod>${BUILD_DATE}</lastmod>`,
        `    <changefreq>${hint.changefreq}</changefreq>`,
        `    <priority>${hint.priority}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Generate /llms.txt — the site index written for assistants rather than
 * crawlers (see llmstxt.org).
 *
 * Worth having because assistants are already a channel here: more visits
 * arrived from ChatGPT and Perplexity last month than from Bing. An assistant
 * that has to guess the shape of a site from one page guesses badly, and the
 * thing it most often gets wrong about this one is the affiliation — hence the
 * disclaimer near the top, in the same words the footer uses.
 *
 * Generated from the same route list the sitemap is built from, so it cannot
 * drift from what actually exists. Individual question pages are left out on
 * purpose: 502 near-identical entries would bury the twenty links that matter.
 * The English tree is named once rather than mirrored, since every path below
 * has an /en twin by construction.
 */
function buildLlmsTxt(routes) {
  const arabic = routes.filter(
    ({ path: routePath, seo }) =>
      !routePath.startsWith('/en')
      && !(seo.robots || '').includes('noindex')
      // /questions/<specialty>/<slug> — the leaves, not the hubs.
      && !(routePath.startsWith(`${QUESTIONS_ROOT}/`) && routePath.split('/').length > 3)
  );

  const GROUPS = [
    // First, because it is the part of the site an assistant is most likely to
    // be asked about and the part it is most likely to get wrong from memory:
    // the two exams do not share a pass mark.
    ['Exam logistics, transcribed from the SCFHS applicant guides', (p) => p === EXAMS_ROOT || p.startsWith(`${EXAMS_ROOT}/`)],
    ['Study guides', (p) => p === '/guides' || p.startsWith('/guides/')],
    ['Practice questions, open to everyone', (p) => p === DEMO_ROOT || p === QUESTIONS_ROOT || p.startsWith(`${QUESTIONS_ROOT}/`)],
    ['Past-paper collections', (p) => p === PAST_PAPERS_ROOT || p.startsWith(`${PAST_PAPERS_ROOT}/`)],
    ['About the platform', (p) => ['/', '/about', '/faq', '/contact', '/groups', SUCCESS_STORIES_ROOT].includes(p)],
    ['Policies', (p) => ['/privacy', '/terms', '/refund-policy'].includes(p)],
  ];

  const line = ({ path: routePath, seo }) =>
    `- [${seo.title.replace(/\s*\|\s*SQB\s*$/, '')}](${seo.url}): ${seo.description}`;

  const used = new Set();
  const sections = GROUPS.map(([heading, match]) => {
    const items = arabic.filter(({ path: p }) => {
      if (used.has(p) || !match(p)) return false;
      used.add(p);
      return true;
    });
    return items.length ? `## ${heading}\n\n${items.map(line).join('\n')}` : null;
  }).filter(Boolean);

  return `# SQB — SMLE & SNLE question bank

> A preparation platform for the Saudi Commission for Health Specialties
> licensing exams: the SMLE for medicine and the SNLE for nursing. A question
> bank with a written explanation for every answer, illustrated topic
> summaries, performance analytics, and study guides. Two separate tracks —
> medical and nursing — with their own questions, summaries and analytics.

SQB is an independent educational platform. It is **not affiliated with the
Saudi Commission for Health Specialties (SCFHS) or with Prometric**, and
nothing on it is an official source for exam rules. Where a page states exam
logistics it names the SCFHS document it was taken from; the Commission's own
applicant guide at scfhs.org.sa is what governs.

Pages below are the Arabic versions, which are canonical. Every one of them has
an English twin at the same path under \`/en\` (for example
${SITE_ORIGIN}/en/guides). Individual question pages are not listed here —
browse them from the specialty hubs under ${SITE_ORIGIN}${QUESTIONS_ROOT}.

Free without an account: a 20-question demo, and every question page listed
under practice questions. A free account adds 40 questions from the bank and
the first lesson of each specialty.

${sections.join('\n\n')}
`;
}

/**
 * Read the exported success stories.
 *
 * An absent or empty file is the NORMAL state, not an error: the page only
 * exists once a student has written something and it has been approved. Same
 * tolerance as the question export — a missing generated file must never fail
 * a deploy.
 */
function readSuccessStories() {
    const dataPath = path.resolve(scriptDir, '../src/seo/data/successStories.json');
    if (!fs.existsSync(dataPath)) return null;
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.warn(`[postbuild-seo] Could not parse successStories.json (${err.message}) — skipping the stories page.`);
        return null;
    }
}

if (!fs.existsSync(templatePath)) {
  console.warn('[postbuild-seo] dist/index.html not found — skipping prerender.');
} else {
  const template = fs.readFileSync(templatePath, 'utf8');
  const questionPayload = readPublicQuestions();
  // Approved, consented stories only — and an empty list is the normal
  // state until somebody writes one. See readSuccessStories.
  const storiesPayload = readSuccessStories();
  // Every route, in every language. The Arabic tree keeps the bare paths so
  // nothing already indexed moves; English lives under /en.
  const routes = SUPPORTED_LANGS.flatMap((lang) => {
    const footerNav = siteFooterNavHtml(lang);
    return [
      ...getPrerenderRoutes(lang),
      ...buildExamRoutes({ lang, footerNav }),
      ...buildDemoRoutes(lang, { footerNav }),
      ...buildSuccessStoriesRoutes(storiesPayload, { footerNav, lang }),
      ...(questionPayload ? buildPublicQuestionRoutes(questionPayload, { footerNav, lang }) : []),
      ...(questionPayload ? buildPastPaperRoutes(questionPayload, { footerNav, lang }) : [])
    ];
  });
  const questionRoutes = routes.filter((r) => r.path.includes(QUESTIONS_ROOT));
  const pastPaperRoutes = routes.filter((r) => r.path.includes(PAST_PAPERS_ROOT));
  let count = 0;
  for (const { path: routePath, html: prerenderHtml, seo } of routes) {
    const outPath = outputPathForRoute(routePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buildRouteHtml(template, seo, prerenderHtml), 'utf8');
    count += 1;
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildSitemap(routes), 'utf8');
  fs.writeFileSync(path.join(distDir, 'llms.txt'), buildLlmsTxt(routes), 'utf8');
  console.log(
    `[postbuild-seo] Prerendered ${count} route(s) across ${SUPPORTED_LANGS.length} languages — ${questionRoutes.length} question pages, ${pastPaperRoutes.length} collection pages — and regenerated sitemap.xml and llms.txt (lastmod ${BUILD_DATE}). Origin: ${SITE_ORIGIN}`
  );
}
