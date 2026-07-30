// Arabic display names for the raw question_type values stored in the DB.
// Single source of truth — import this instead of redefining the map.
//
// The map is derived from tracks.js so a specialty added to a track is
// automatically labelled everywhere, across both the medical and nursing banks.
import { TRACKS, TRACK_KEYS } from './tracks.js';

export const TYPE_AR = TRACK_KEYS.reduce((acc, track) => {
    TRACKS[track].specialties.forEach((s) => { acc[s.key] = s.labelAr; });
    return acc;
}, {});

export function getTypeLabel(type) {
    return TYPE_AR[type] || type;
}
