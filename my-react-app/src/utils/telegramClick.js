import { trackFunnel } from './analytics.js';

/**
 * One click on a link to a Telegram channel, stored in funnel_events.
 * `track` is the CHANNEL clicked (medical | nursing | dental); `placement` is
 * where the link sat: landing, hub, result_nudge, public_page, contact,
 * footer or study_home.
 */
export function trackTelegramClick(track, placement) {
    trackFunnel('telegram_channel_click', { track, placement });
}
