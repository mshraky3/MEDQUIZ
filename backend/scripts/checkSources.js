/**
 * Assertions for config/sources.js — the source-resolution rules that decide
 * which questions a quiz can draw from.
 *
 * The medical cases matter most: KEPT_SOURCES is the guard that keeps the
 * retired 2025 collections from being served, and a regression there would
 * silently put deleted content back in front of students.
 *
 *   node scripts/checkSources.js
 */

import assert from 'node:assert/strict';
import { MEDICAL, NURSING } from '../config/tracks.js';
import { KEPT_SOURCES, resolveSources } from '../config/sources.js';

const cases = [
    // --- medical: always constrained to the kept allowlist ------------------
    ['medical, no source', undefined, MEDICAL, KEPT_SOURCES],
    ['medical, "mix"', 'mix', MEDICAL, KEPT_SOURCES],
    ['medical, unified sentinel', 'MidgardGameBoy', MEDICAL, KEPT_SOURCES],
    ['medical, a kept collection', 'May26', MEDICAL, ['May26']],
    ['medical, RETIRED collection', 'October25', MEDICAL, KEPT_SOURCES],
    ['medical, unknown junk', 'nonsense', MEDICAL, KEPT_SOURCES],
    ['medical, other track\'s source', 'NursingConfirmed', MEDICAL, KEPT_SOURCES],

    // --- nursing: null means "no source condition", i.e. the whole bank -----
    // Rows still on the pre-split NursingEMS label stay servable that way.
    ['nursing, no source', undefined, NURSING, null],
    ['nursing, unified sentinel', 'MidgardGameBoy', NURSING, null],
    ['nursing, Most Repeated', 'NursingMostRepeated', NURSING, ['NursingMostRepeated']],
    ['nursing, Confirmed', 'NursingConfirmed', NURSING, ['NursingConfirmed']],
    ['nursing, legacy label', 'NursingEMS', NURSING, null],
    ['nursing, other track\'s source', 'May26', NURSING, null],

    // --- unknown track normalizes to medical --------------------------------
    ['unknown track', undefined, 'wat', KEPT_SOURCES],
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

console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
