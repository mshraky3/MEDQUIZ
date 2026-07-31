/**
 * Question-bank sources — the collections *within* a track's bank.
 *
 * `track` is the hard partition (see config/tracks.js): a student only ever
 * sees their own track's questions, enforced from the session on every content
 * query. `source` is the soft partition underneath it — which collection inside
 * that bank a quiz should be drawn from.
 *
 * The two tracks use it differently:
 *
 *   medical — the 2025 collections (October25/November25/December25) were
 *     retired. KEPT_SOURCES is a leak guard: every medical query is constrained
 *     to it, so deleted content cannot come back even in an environment where
 *     the deletion script has not been run. Students see one unified bank.
 *
 *   nursing — nothing was ever retired. The bank is split the way its source
 *     material is, and the split is a real choice a student makes:
 *       NursingMostRepeated — the core, most-repeated block
 *       NursingConfirmed    — the block added in the September edition
 *     Rows still on the pre-split `NursingEMS` label belong to the bank and
 *     must stay servable, which is why the nursing fallback adds no source
 *     condition at all rather than an allowlist.
 */

import { MEDICAL, NURSING, DEFAULT_TRACK, normalizeTrack } from './tracks.js';

/** Sentinel the client sends for "the whole of my track's bank". */
export const UNIFIED_BANK = 'MidgardGameBoy';

/** The only medical sources we ever serve. */
export const KEPT_SOURCES = ['MidgardGameBoy', 'January25', 'FebMarApr25', 'May26', 'June26'];

/** The nursing bank's two collections. */
export const NURSING_SOURCES = ['NursingMostRepeated', 'NursingConfirmed'];

/**
 * Which specific sources a track lets a student narrow to. A `source` not
 * listed for the caller's track is ignored, so a crafted value can never reach
 * another bank (and `track` filtering would block it regardless).
 */
export const SELECTABLE_SOURCES = {
    [MEDICAL]: KEPT_SOURCES,
    [NURSING]: NURSING_SOURCES,
};

/**
 * Resolve a requested `source` query param to the set of sources to query.
 *
 * Returns an array to constrain to, or `null` meaning "add no source
 * condition" — which also means a newly uploaded question is servable whatever
 * `source` label it carries.
 */
export function resolveSources(sourceParam, track = DEFAULT_TRACK) {
    const t = normalizeTrack(track);
    const selectable = SELECTABLE_SOURCES[t] || [];
    if (sourceParam && sourceParam !== 'mix' && sourceParam !== UNIFIED_BANK
        && selectable.includes(sourceParam)) {
        return [sourceParam];
    }
    return t === MEDICAL ? KEPT_SOURCES : null;
}
