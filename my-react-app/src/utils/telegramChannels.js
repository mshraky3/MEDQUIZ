/**
 * The site's Telegram channels, one per exam track, and which one a page or a
 * student should be sent to. The bot's side of the same map is
 * backend/services/telegramChannels.js (env driven).
 *
 * React-free and browser-free: the build-time prerender imports it too.
 */
import { stripLocale } from '../seo/locales.js';

export const TELEGRAM_CHANNELS = {
    medical: 'sqb_exam',
    nursing: 'sqb_snle',
    dental: 'sqb_sdle',
};

/** The channel link for a track; anything unknown gets the main (medicine) channel. */
export function telegramUrl(track) {
    return `https://t.me/${TELEGRAM_CHANNELS[track] || TELEGRAM_CHANNELS.medical}`;
}

/**
 * The track a public page is about, or null when it is not about one track.
 * Covers /past-papers/<exam>-…, /exams/<exam>… and nursing question pages
 * (every nursing specialty slug contains "nursing").
 */
export function trackForPath(pathname = '/') {
    const { path } = stripLocale(pathname);
    const paper = /^\/past-papers\/(smle|snle|sdle)-/.exec(path) || /^\/exams\/(smle|snle)(\/|$)/.exec(path);
    if (paper) return { smle: 'medical', snle: 'nursing', sdle: 'dental' }[paper[1]];
    if (/^\/questions\/[^/]*nursing/.test(path)) return 'nursing';
    return null;
}

const EXAM = { nursing: 'SNLE', dental: 'SDLE' };

/**
 * The "this exam has its own channel" box for the prerendered nursing and dental
 * pages; '' for medicine and mixed pages. Same markup and words as the React
 * components/common/TrackTelegramLink.jsx. `copy` is telegramCardCopy[lang].
 */
export function trackTelegramHtml(track, copy) {
    if (!EXAM[track]) return '';
    return `      <aside class="trk-tg">
        <p>${copy.trackTitle(EXAM[track])}</p>
        <a class="trk-tg-btn" href="${telegramUrl(track)}" target="_blank" rel="noopener noreferrer">${copy.cta}</a>
      </aside>`;
}

export const trackExamName = (track) => EXAM[track] || '';
