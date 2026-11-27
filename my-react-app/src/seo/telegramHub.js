/**
 * The crawler-visible body of /telegram, with the same words and class names as
 * components/telegram/TelegramHub.jsx. A signed-in student's reordering happens
 * only in the React page.
 *
 * React-free and browser-free: runs under Node at build time.
 */
import telegramHubCopy from '../i18n/copy/telegramHub.js';
import { orderedChannels } from '../utils/telegramChannels.js';
import { dirFor, localizedPath } from './locales.js';
import { escapeHtml } from './prerenderHtml.js';

export function telegramHubHtml(lang = 'ar') {
    const t = telegramHubCopy[lang] || telegramHubCopy.ar;

    const cards = orderedChannels()
        .map((c) => `        <li class="tgh-card">
          <h2><span class="tgh-exam">${c.exam}</span> <span class="tgh-field">${escapeHtml(t.fields[c.track])}</span></h2>
          <p class="tgh-handle"><bdi>${c.handle}</bdi></p>
          <a class="tgh-join" href="${c.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(t.join(c.exam))}</a>
        </li>`)
        .join('\n');

    return `
    <main class="tgh-page" dir="${dirFor(lang)}">
      <nav class="tgh-breadcrumb"><a href="${localizedPath('/', lang)}">${escapeHtml(t.home)}</a></nav>
      <header class="tgh-hero">
        <p class="tgh-kicker">${escapeHtml(t.kicker)}</p>
        <h1>${escapeHtml(t.title)}</h1>
        <p>${escapeHtml(t.intro)}</p>
      </header>
      <ul class="tgh-grid" aria-label="${escapeHtml(t.listLabel)}">
${cards}
      </ul>
      <section class="tgh-points">
        <h2>${escapeHtml(t.pointsTitle)}</h2>
        <ul>
${t.points.map((point) => `          <li>${escapeHtml(point)}</li>`).join('\n')}
        </ul>
      </section>
      <p class="tgh-note">${escapeHtml(t.note)}</p>
    </main>
  `;
}
