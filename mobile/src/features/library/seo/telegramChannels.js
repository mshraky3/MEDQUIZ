// AUTO-COPIED from my-react-app/src/utils/telegramChannels.js. Do not edit here:
// change the website's file, then run `npm run sync:library` in mobile/.
/**
 * The site's Telegram channels, one per exam track, and which one a page or a
 * student should be sent to. The bot's side of the same map is
 * backend/services/telegramChannels.js (env driven).
 *
 * React-free and browser-free: the build-time prerender imports it too.
 */
import { localizedPath, stripLocale } from './locales.js';

export const TELEGRAM_CHANNELS = {
    medical: 'sqb_exam',
    nursing: 'sqb_snle',
    dental: 'sqb_sdle',
};

/** The one page that lists every channel (components/telegram/TelegramHub.jsx). */
export const TELEGRAM_HUB_PATH = '/telegram';

/** Display order of the channels when nothing says which one comes first. */
export const CHANNEL_ORDER = ['medical', 'nursing', 'dental'];

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

const EXAM = { medical: 'SMLE', nursing: 'SNLE', dental: 'SDLE' };

/**
 * Every channel, the student's own first and marked `own`. With no track (or an
 * unknown one) the default order is kept and nothing is marked.
 */
export function orderedChannels(ownTrack = null) {
    const own = CHANNEL_ORDER.includes(ownTrack) ? ownTrack : null;
    const order = own ? [own, ...CHANNEL_ORDER.filter((track) => track !== own)] : CHANNEL_ORDER;
    return order.map((track) => ({
        track,
        exam: EXAM[track],
        handle: `@${TELEGRAM_CHANNELS[track]}`,
        url: telegramUrl(track),
        own: track === own,
    }));
}

/**
 * The "this exam has its own channel" box for the prerendered public pages of one
 * track; '' for mixed pages (they use telegramHubBoxHtml). Same markup and words
 * as the React components/common/TrackTelegramLink.jsx. `copy` is
 * telegramCardCopy[lang].
 */
export function trackTelegramHtml(track, copy) {
    if (!CHANNEL_ORDER.includes(track)) return '';
    return `      <aside class="trk-tg">
        <p>${copy.trackTitle(EXAM[track])}</p>
        <a class="trk-tg-btn" href="${telegramUrl(track)}" target="_blank" rel="noopener noreferrer">${copy.cta}</a>
      </aside>`;
}

/** The box for a page about no single exam: it sends the reader to the hub. */
export function telegramHubBoxHtml(copy, lang) {
    return `      <aside class="trk-tg">
        <p>${copy.hubBoxTitle}</p>
        <a class="trk-tg-btn" href="${localizedPath(TELEGRAM_HUB_PATH, lang)}">${copy.hubBoxCta}</a>
      </aside>`;
}

export const trackExamName = (track) => (CHANNEL_ORDER.includes(track) ? EXAM[track] : '');
