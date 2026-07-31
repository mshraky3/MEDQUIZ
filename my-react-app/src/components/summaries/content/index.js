// Aggregated summaries catalog for the continuous-scroll page.
// Level 1 = the exam specialties; Level 2 = subtopics; Level 3 = each
// subtopic's summary then its interactive questions.
//
// The catalog is partitioned by study track. A student only ever sees the
// sections of their own track — including through deep links, because
// findSubtopic is track-scoped. A track with no authored content yet resolves
// to an empty list, which the page renders as an explicit "coming soon" state.
//
// ---------------------------------------------------------------------------
// Loaded per track, on demand.
//
// These ten modules are ~1.2 MB of authored prose — by far the largest thing in
// the app. Importing them all statically meant the single /summaries chunk
// carried every track's content: a nursing student downloaded the 800 KB of
// medical summaries they can never see, and a medical student the 400 KB of
// nursing ones. Splitting the import per track means each student downloads
// only their own, and Rollup emits them as separate chunks.
//
// The tradeoff is that the catalog is now async. Callers await loadSections()
// (or loadPath() in pathMeta.js), both of which cache per track, so it is one
// network round-trip on first visit and a resolved promise afterwards.
// ---------------------------------------------------------------------------
import { MEDICAL, NURSING, normalizeTrack } from '../../../utils/tracks.js';

// Order matters — it is the order the sections appear in the guided path.
const LOADERS = {
    // Pediatrics, OB/GYN, Medicine, Surgery (kept consistent with the product's
    // specialty ordering; medicine is the deepest per the /critical set).
    [MEDICAL]: [
        () => import('./pediatrics.js'),
        () => import('./obgyn.js'),
        () => import('./medicine.js'),
        () => import('./surgery.js'),
    ],
    // Order follows the SNLE blueprint: the foundations first, then the biggest
    // clinical block, then the life-stage specialties, then pharmacology.
    [NURSING]: [
        () => import('./nursingFundamentals.js'),
        () => import('./medicalSurgicalNursing.js'),
        () => import('./maternalNewbornNursing.js'),
        () => import('./pediatricNursing.js'),
        () => import('./mentalHealthNursing.js'),
        () => import('./nursingPharmacology.js'),
    ],
};

// Promise cache: one entry per track, so a remount or a second consumer
// (SummariesPage + pathMeta) shares a single fetch rather than racing.
const cache = new Map();

/** The authored sections for a track, in display order. Always resolves. */
export function loadSections(track) {
    const key = normalizeTrack(track);
    if (!cache.has(key)) {
        const loaders = LOADERS[key] || [];
        cache.set(
            key,
            Promise.all(loaders.map((load) => load().then((m) => m.default)))
                .catch((err) => {
                    // A failed chunk must not poison the cache — a retry (or the
                    // stale-chunk reload after a deploy) should be able to work.
                    cache.delete(key);
                    throw err;
                })
        );
    }
    return cache.get(key);
}

/**
 * Resolve a deep-link slug to its { section, subtopic } within the caller's own
 * track. Returns null for an unknown slug or a slug belonging to another track.
 */
export async function findSubtopic(key, track) {
    if (!key) return null;
    const sections = await loadSections(track);
    for (const section of sections) {
        const match = section.subtopics.find((t) => t.id === key);
        if (match) return { section, subtopic: match };
    }
    // also allow matching a whole section by id
    const section = sections.find((s) => s.id === key);
    if (section) return { section, subtopic: null };
    return null;
}
