// Aggregated summaries catalog for the continuous-scroll page.
// Level 1 = the 4 exam specialties; Level 2 = subtopics; Level 3 = each
// subtopic's summary then its interactive questions.
import medicine from './medicine.js';
import pediatrics from './pediatrics.js';
import surgery from './surgery.js';
import obgyn from './obgyn.js';

// Order: Pediatrics, OB/GYN, Medicine, Surgery (kept consistent with the
// product's specialty ordering; medicine is the deepest per the /critical set).
export const SECTIONS = [pediatrics, obgyn, medicine, surgery];

// Quick lookup helpers used by the viewer + deep links (/summaries/:slug).
export const SECTION_BY_ID = SECTIONS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});

export const findSubtopic = (key) => {
    if (!key) return null;
    for (const section of SECTIONS) {
        const match = section.subtopics.find((t) => t.id === key);
        if (match) return { section, subtopic: match };
    }
    // also allow matching a whole section by id
    if (SECTION_BY_ID[key]) return { section: SECTION_BY_ID[key], subtopic: null };
    return null;
};

export default SECTIONS;
