/**
 * Assertions for config/sources.js — the source-resolution rules that decide
 * which questions a quiz can draw from.
 *
 * Both tracks now offer a real picker: medical's three 2026H2 collections
 * (GameBoy, Confirmed, Midgard) and nursing's two. A regression that widens
 * MEDICAL_SOURCES/NURSING_SOURCES to include a retired or foreign source would
 * silently let a quiz draw from the wrong bank, which is what this guards.
 *
 *   node scripts/checkSources.js
 */

import assert from 'node:assert/strict';
import { MEDICAL, NURSING } from '../config/tracks.js';
import {
    MEDICAL_SOURCES, NURSING_SOURCES, PICKABLE_SOURCES, SELECTABLE_SOURCES, resolveSources,
} from '../config/sources.js';

const cases = [
    // --- medical: always constrained to the current 2026H2 collections ------
    ['medical, no source', undefined, MEDICAL, MEDICAL_SOURCES],
    ['medical, "mix"', 'mix', MEDICAL, MEDICAL_SOURCES],
    ['medical, unified sentinel', 'MidgardGameBoy', MEDICAL, MEDICAL_SOURCES],
    ['medical, GameBoy', 'MedicalGameBoy', MEDICAL, ['MedicalGameBoy']],
    ['medical, Confirmed', 'MedicalConfirmed', MEDICAL, ['MedicalConfirmed']],
    ['medical, Midgard', 'MedicalMidgard', MEDICAL, ['MedicalMidgard']],
    ['medical, RETIRED monthly collection', 'May26', MEDICAL, MEDICAL_SOURCES],
    ['medical, unknown junk', 'nonsense', MEDICAL, MEDICAL_SOURCES],
    ['medical, other track\'s source', 'NursingConfirmed', MEDICAL, MEDICAL_SOURCES],

    // --- nursing: null means "no source condition", i.e. the whole bank -----
    // Rows still on the pre-split NursingEMS label stay servable that way.
    ['nursing, no source', undefined, NURSING, null],
    ['nursing, unified sentinel', 'MidgardGameBoy', NURSING, null],
    ['nursing, Most Repeated', 'NursingMostRepeated', NURSING, ['NursingMostRepeated']],
    ['nursing, Confirmed', 'NursingConfirmed', NURSING, ['NursingConfirmed']],
    ['nursing, legacy label', 'NursingEMS', NURSING, null],
    ['nursing, other track\'s source', 'MedicalGameBoy', NURSING, null],

    // --- unknown track normalizes to medical --------------------------------
    ['unknown track', undefined, 'wat', MEDICAL_SOURCES],
];

let failed = 0;
for (const [name, source, track, expected] of cases) {
    try {
        assert.deepEqual(resolveSources(source, track), expected);
        console.log(`  ok   ${name}`);
    } catch (e) {
        failed++;
        console.error(`  FAIL ${name}\n       got      ${JSON.stringify(resolveSources(source, track))}` +
            `\n       expected ${JSON.stringify(expected)}`);
    }
}

// --- what the launcher is allowed to OFFER -------------------------------
// Distinct from what resolveSources will honour, though both tracks now offer
// exactly their full selectable set (a real picker on both sides).
const pickableCases = [
    ['medical offers all three collections', PICKABLE_SOURCES[MEDICAL], MEDICAL_SOURCES],
    ['nursing offers both collections', PICKABLE_SOURCES[NURSING], NURSING_SOURCES],
];

for (const [name, actual, expected] of pickableCases) {
    try {
        assert.deepEqual(actual, expected);
        console.log(`  ok   ${name}`);
    } catch {
        failed++;
        console.error(`  FAIL ${name}\n       got      ${JSON.stringify(actual)}` +
            `\n       expected ${JSON.stringify(expected)}`);
    }
}

// Anything offerable must also be resolvable, or the picker would hand the
// server a source it then ignores.
for (const track of [MEDICAL, NURSING]) {
    for (const s of PICKABLE_SOURCES[track]) {
        try {
            assert.deepEqual(resolveSources(s, track), [s]);
            assert.ok(SELECTABLE_SOURCES[track].includes(s));
            console.log(`  ok   ${track}: offered "${s}" resolves to itself`);
        } catch {
            failed++;
            console.error(`  FAIL ${track}: offered "${s}" does not resolve to itself`);
        }
    }
}

const total = cases.length + pickableCases.length
    + Object.values(PICKABLE_SOURCES).reduce((n, a) => n + a.length, 0);
console.log(`\n${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
