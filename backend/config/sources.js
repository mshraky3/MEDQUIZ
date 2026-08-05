/**
 * Question-bank sources — the collections *within* a track's bank.
 *
 * `track` is the hard partition (see config/tracks.js): a student only ever
 * sees their own track's questions, enforced from the session on every content
 * query. `source` is the soft partition underneath it — which collection inside
 * that bank a quiz should be drawn from.
 *
 * Both tracks now work the same way: a real, student-facing choice between the
 * collections their source material was split into.
 *
 *   medical — the 2026H2 rebuild replaced the old unified "MidgardGameBoy"
 *     bank with three genuine collections: GameBoy, Confirmed and Midgard.
 *     KEPT_SOURCES/UNIFIED_BANK describe the retired single-bank era; they stay
 *     exported only because historical quiz sessions and a couple of test
 *     scripts still reference them, not because they route any live query.
 *
 *   nursing — the bank is split the way its source material is:
 *       NursingConfirmed    — the block added in the September edition
 *       NursingMostRepeated — the core, most-repeated block
 *     Rows still on the pre-split `NursingEMS` label belong to the bank and
 *     must stay servable, which is why the nursing fallback adds no source
 *     condition at all rather than an allowlist.
 */

import { MEDICAL, NURSING, DEFAULT_TRACK, normalizeTrack } from './tracks.js';

/**
 * Sentinel the client sends for "the whole of my track's bank". Predates the
 * three-way medical split and no longer names a real source any question
 * carries — kept only because resolveSources() still special-cases it and
 * historical quiz sessions reference it literally.
 */
export const UNIFIED_BANK = 'MidgardGameBoy';

/**
 * The old single-bank-era medical allowlist. No longer used to resolve live
 * queries (see MEDICAL_SOURCES) — kept for historical `user_quiz_sessions`
 * rows and the scripts that still assert against it
 * (checkSources.js, verifyCompletionQueries.js).
 */
export const KEPT_SOURCES = ['MidgardGameBoy', 'January25', 'FebMarApr25', 'May26', 'June26'];

/**
 * The medical bank's three collections, ordered by recommended study
 * priority (see SOURCE_PRIORITY) — GameBoy first, Midgard last.
 */
export const MEDICAL_SOURCES = ['MedicalGameBoy', 'MedicalConfirmed', 'MedicalMidgard'];

/**
 * The nursing bank's two collections, ordered by recommended study priority
 * (see SOURCE_PRIORITY) — Confirmed first.
 */
export const NURSING_SOURCES = ['NursingConfirmed', 'NursingMostRepeated'];

/**
 * Which `source` values resolveSources() will honour for a track. A value not
 * listed for the caller's track is ignored, so a crafted one can never reach
 * another bank (and `track` filtering would block it regardless).
 */
export const SELECTABLE_SOURCES = {
    [MEDICAL]: MEDICAL_SOURCES,
    [NURSING]: NURSING_SOURCES,
};

/**
 * Which collections the quiz launcher offers as a choice — identical to
 * SELECTABLE_SOURCES for both tracks now that medical genuinely has three
 * collections to choose between, same as nursing's two.
 *
 * The client hides the picker when a track offers fewer than two, so this is
 * only ever a UI convenience, not a content restriction.
 */
export const PICKABLE_SOURCES = {
    [MEDICAL]: MEDICAL_SOURCES,
    [NURSING]: NURSING_SOURCES,
};

/**
 * Recommended study order per track, most important first. A separate export
 * from PICKABLE_SOURCES (even though the values match today) because "what
 * order to query/display" and "what order to recommend studying" are
 * conceptually different things that happen to coincide right now.
 *
 * Consumed by /api/track-content-status to attach a `priority` rank to each
 * selectable source, rendered as a numbered badge in QuizLauncher.jsx.
 */
export const SOURCE_PRIORITY = {
    [MEDICAL]: MEDICAL_SOURCES,
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
    return t === MEDICAL ? MEDICAL_SOURCES : null;
}
