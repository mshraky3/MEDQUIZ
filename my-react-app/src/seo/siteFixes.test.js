import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPrerenderRoutes } from './siteMetadata.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const vercel = JSON.parse(read('vercel.json'));

// A rewrite is pattern -> "/". Turn a Vercel source like /quiz/:n into a regex.
const rewriteRegexes = vercel.rewrites
  .filter((r) => r.destination === '/')
  .map((r) => new RegExp(`^${r.source.replace(/:[A-Za-z]+/g, '[^/]+')}$`));
const covered = (p) => rewriteRegexes.some((re) => re.test(p));

test('vercel.json has no catch-all rewrite (unknown URLs must 404)', () => {
  for (const r of vercel.rewrites) {
    assert.notEqual(r.source, '/(.*)');
    assert.notEqual(r.source, '/:path*');
    assert.notEqual(r.source, '/(.*)/');
  }
});

test('vercel.json sends the security headers on every path', () => {
  const block = vercel.headers.find((h) => h.source === '/(.*)');
  assert.ok(block, 'a headers block for every path');
  const get = (k) => block.headers.find((h) => h.key === k)?.value;
  assert.equal(get('X-Content-Type-Options'), 'nosniff');
  assert.equal(get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(get('X-Frame-Options'), 'DENY');
  assert.match(get('Content-Security-Policy'), /frame-ancestors 'none'/);
});

test('client-only app routes keep the SPA fallback', () => {
  for (const p of [
    '/quizs', '/quiz/20', '/analysis', '/wrong-questions', '/summaries', '/summaries/cardiology',
    '/subscribe', '/account', '/payment/callback', '/admin', '/admin/users',
    '/signup/abc123', '/join/abc123', '/forgot-password', '/suggestions',
    '/success-stories', '/en/success-stories', '/ADD_ACCOUNT', '/ADDQ', '/Bank', '/TEMP_LINKS', '/question-reports',
  ]) {
    assert.ok(covered(p), `${p} must be rewritten to the SPA shell`);
  }
});

test('unknown paths are not covered by any SPA rewrite', () => {
  for (const p of ['/nonexistent', '/.env', '/.git/config', '/favicon-x.ico', '/app.js.map', '/pricing']) {
    assert.ok(!covered(p), `${p} must fall through to the 404`);
  }
});

test('every router path is either prerendered or has a SPA rewrite', () => {
  const main = read('src/main.jsx');
  const paths = [...main.matchAll(/\b(?:pub|pubNoFooter|authed|authedNoFooter|admin|withBoundary)\('(\/[^']*)'/g)].map((m) => m[1]);
  assert.ok(paths.length > 30);
  const prerendered = new Set(getPrerenderRoutes('ar').map((r) => r.path));
  // Prerendered from data at build time: guides, exam pages, questions, past papers.
  const dataDriven = (p) => /^\/(exams|questions|past-papers|guides)(\/|$)/.test(p);
  for (const p of paths) {
    if (p === '/') continue;
    assert.ok(
      prerendered.has(p) || dataDriven(p) || covered(p.replace(/:[A-Za-z]+/g, 'x')),
      `${p} is neither prerendered nor rewritten: it would 404`
    );
  }
});

test('/delete-account is prerendered with its own title and a self canonical', () => {
  const route = getPrerenderRoutes('ar').find((r) => r.path === '/delete-account');
  assert.ok(route, 'prerender route exists');
  assert.match(route.html, /<h1>/);
  assert.equal(route.seo.url, 'https://www.smle-question-bank.com/delete-account');
  assert.notEqual(route.seo.title, getPrerenderRoutes('ar').find((r) => r.path === '/').seo.title);
  assert.ok(!(route.seo.robots || '').includes('noindex'));
});

test('sitemap script knows /delete-account, and the share image is a PNG', () => {
  assert.match(read('scripts/postbuild-seo.mjs'), /'\/delete-account': \{ priority/);
  const html = read('index.html');
  assert.match(html, /og:image" content="[^"]*og-image\.png"/);
  assert.match(html, /twitter:image" content="[^"]*og-image\.png"/);
  assert.match(html, /og:image:type" content="image\/png"/);
  assert.match(html, /og:image:width" content="1200"/);
  assert.match(html, /og:image:height" content="630"/);
  assert.ok(fs.existsSync(path.join(root, 'public/og-image.png')));
  assert.ok(fs.existsSync(path.join(root, 'public/favicon.ico')));
});

test('the old brand name is gone from the footer and the noscript block', () => {
  assert.ok(!/SMLE Question Bank/.test(read('index.html')));
  assert.ok(!/SMLE Question Bank/.test(read('src/components/common/Footer.jsx')));
});

test('/t is a short redirect to the tagged TikTok bio link (80 character bio limit)', () => {
  const r = (vercel.redirects || []).find((x) => x.source === '/t');
  assert.ok(r, 'a redirect for /t');
  assert.equal(r.permanent, false);
  assert.match(r.destination, /^\/\?utm_source=tiktok&utm_medium=bio&utm_campaign=tt_bio$/);
});
