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

  // <link rel="canonical">
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, seo.url);

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
    .map(({ path: routePath, seo }) => {
      const hint =
        SITEMAP_HINTS[routePath] ||
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

if (!fs.existsSync(templatePath)) {
  console.warn('[postbuild-seo] dist/index.html not found — skipping prerender.');
} else {
  const template = fs.readFileSync(templatePath, 'utf8');
  const questionPayload = readPublicQuestions();
  const footerNav = siteFooterNavHtml();
  const questionRoutes = questionPayload
    ? buildPublicQuestionRoutes(questionPayload, { footerNav })
    : [];
  const pastPaperRoutes = questionPayload
    ? buildPastPaperRoutes(questionPayload, { footerNav })
    : [];
  const routes = [...getPrerenderRoutes(), ...questionRoutes, ...pastPaperRoutes];
  let count = 0;
  for (const { path: routePath, html: prerenderHtml, seo } of routes) {
    const outPath = outputPathForRoute(routePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buildRouteHtml(template, seo, prerenderHtml), 'utf8');
    count += 1;
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildSitemap(routes), 'utf8');
  console.log(
    `[postbuild-seo] Prerendered ${count} route(s) — ${questionRoutes.length} question pages, ${pastPaperRoutes.length} collection pages — and regenerated sitemap.xml (lastmod ${BUILD_DATE}). Origin: ${SITE_ORIGIN}`
  );
}
