import { ANNOTATION_JS } from './annotation';
import { SUMMARY_CSS } from './styles.generated';

/**
 * Extra rules for running the website's lesson stylesheet in a bare WebView
 * rather than inside the website's page chrome.
 */
const PAGE_CSS = `
  html, body { margin: 0; padding: 0; background: #ffffff; color: #1e293b; }
  body { position: relative; padding: 14px 14px 96px; font-family: -apple-system, Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
         -webkit-text-size-adjust: 100%; overflow-wrap: anywhere; }
  .sum-doc { max-width: 760px; margin: 0 auto; }
  img, svg { max-width: 100%; height: auto; }
  #sqb-canvas { position: absolute; top: 0; left: 0; z-index: 20; }
  /* Selecting text while drawing would fight the stroke. */
  #sqb-root { -webkit-tap-highlight-color: transparent; }
`;

/** CSS colour values only: this goes into a style attribute. */
const safeColor = (value: string | undefined) => (value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : '#2563eb');

/**
 * One lesson as a self-contained page: the website's own lesson CSS and HTML,
 * plus the drawing canvas. The lesson content is bundled with the app (it is
 * first-party and authored by us), so it is inlined as is.
 *
 * The lessons are English study material in both UI languages, so the page is
 * pinned left-to-right.
 */
export function buildLessonHtml(args: { summaryHtml: string; accent?: string }): string {
  const accent = safeColor(args.accent);
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes">
<style>${SUMMARY_CSS}</style>
<style>${PAGE_CSS}</style>
</head>
<body style="--accent: ${accent}">
<div id="sqb-root" class="sum-doc sub-summary" dir="ltr">${args.summaryHtml}</div>
<canvas id="sqb-canvas"></canvas>
<script>${ANNOTATION_JS}</script>
</body>
</html>`;
}
