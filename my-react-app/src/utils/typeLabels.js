// Display names for the raw question_type values stored in the DB.
// Single source of truth — import this instead of redefining the map.
//
// The map is derived from tracks.js so a specialty added to a track is
// automatically labelled everywhere, across both the medical and nursing banks.
import { TRACKS, TRACK_KEYS, pick } from './tracks.js';

const byLang = (lang) => TRACK_KEYS.reduce((acc, track) => {
    TRACKS[track].specialties.forEach((s) => { acc[s.key] = pick(s.label, lang); });
    return acc;
}, {});

const MAPS = { ar: byLang('ar'), en: byLang('en') };

export function getTypeLabel(type, lang = 'ar') {
    return (MAPS[lang] || MAPS.ar)[type] || type;
}
