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
  '/privacy': { priority: '0.4', changefreq: 'yearly' },
  '/terms': { priority: '0.4', changefreq: 'yearly' },
  '/refund-policy': { priority: '0.4', changefreq: 'yearly' }
};
const GUIDE_DETAIL_HINT = { priority: '0.8', changefreq: 'weekly' };

function buildSitemap(routes) {
  const indexable = routes.filter(
    ({ seo }) => !(seo.robots || '').includes('noindex')
  );

  const urls = indexable
    .map(({ path: routePath, seo }) => {
      const hint =
        SITEMAP_HINTS[routePath] ||
        (routePath.startsWith('/guides/') ? GUIDE_DETAIL_HINT : { priority: '0.5', changefreq: 'monthly' });
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
  const routes = getPrerenderRoutes();
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
    `[postbuild-seo] Prerendered ${count} route(s) and regenerated sitemap.xml (lastmod ${BUILD_DATE}). Origin: ${SITE_ORIGIN}`
  );
}
