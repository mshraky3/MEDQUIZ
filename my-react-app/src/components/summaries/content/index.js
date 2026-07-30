// Aggregated summaries catalog for the continuous-scroll page.
// Level 1 = the exam specialties; Level 2 = subtopics; Level 3 = each
// subtopic's summary then its interactive questions.
//
// The catalog is partitioned by study track. A student only ever sees the
// sections of their own track — including through deep links, because
// findSubtopic is track-scoped. A track with no authored content yet resolves
// to an empty list, which the page renders as an explicit "coming soon" state.
import medicine from './medicine.js';
import pediatrics from './pediatrics.js';
import surgery from './surgery.js';
import obgyn from './obgyn.js';
import { MEDICAL, NURSING, normalizeTrack } from '../../../utils/tracks.js';

// Order: Pediatrics, OB/GYN, Medicine, Surgery (kept consistent with the
// product's specialty ordering; medicine is the deepest per the /critical set).
export const SECTIONS_BY_TRACK = {
    [MEDICAL]: [pediatrics, obgyn, medicine, surgery],
    // Nursing summaries are not authored yet. Add the section modules here —
    // one per specialty in tracks.js — and the whole guided path builds itself.
    [NURSING]: [],
};

export const sectionsFor = (track) => SECTIONS_BY_TRACK[normalizeTrack(track)] || [];

export const findSubtopic = (key, track) => {
    if (!key) return null;
    const sections = sectionsFor(track);
    for (const section of sections) {
        const match = section.subtopics.find((t) => t.id === key);
        if (match) return { section, subtopic: match };
    }
    // also allow matching a whole section by id
    const section = sections.find((s) => s.id === key);
    if (section) return { section, subtopic: null };
    return null;
};

export default SECTIONS_BY_TRACK;
