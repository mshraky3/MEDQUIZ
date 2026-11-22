/**
 * Which Telegram channel each exam track posts to.
 *
 * Until the owner creates the SNLE and SDLE channels everything goes to the one
 * channel in TELEGRAM_CHANNEL (default @sqb_exam), exactly as before. Setting
 * TELEGRAM_CHANNEL_SNLE and/or TELEGRAM_CHANNEL_SDLE (for example @sqb_snle) gives
 * that track its own channel; the bot must be an administrator there. A track
 * without its own variable keeps using the main channel.
 */
import { MEDICAL, NURSING, DENTAL } from '../config/tracks.js';

export const mainChannel = (env = process.env) => env.TELEGRAM_CHANNEL || '@sqb_exam';

const clean = (v) => {
    const s = String(v || '').trim();
    return /^(@[A-Za-z][A-Za-z0-9_]{3,}|-100\d{6,})$/.test(s) ? s : '';
};

/** Channel (handle or numeric id) for a track. */
export function channelFor(track, env = process.env) {
    if (track === NURSING) return clean(env.TELEGRAM_CHANNEL_SNLE) || mainChannel(env);
    if (track === DENTAL) return clean(env.TELEGRAM_CHANNEL_SDLE) || mainChannel(env);
    return mainChannel(env); // medical, and anything unknown
}

/** True once at least one track has a channel of its own. */
export function hasSeparateChannels(env = process.env) {
    return channelFor(NURSING, env) !== mainChannel(env) || channelFor(DENTAL, env) !== mainChannel(env);
}

export const TRACK_CHANNEL_ORDER = [MEDICAL, NURSING, DENTAL];

/** The tracks whose posts go to `channel` (one channel can carry several). */
export function tracksOn(channel, env = process.env) {
    return TRACK_CHANNEL_ORDER.filter((t) => channelFor(t, env) === channel);
}
