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
import {
    KEPT_SOURCES, NURSING_SOURCES, PICKABLE_SOURCES, SELECTABLE_SOURCES, resolveSources,
} from '../config/sources.js';

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

// --- what the launcher is allowed to OFFER -------------------------------
// Distinct from what resolveSources will honour. Medical must stay empty: that
// bank was deliberately unified in 2026 and the monthly collections behind it
// are an implementation detail students are not meant to choose between.
const pickableCases = [
    ['medical offers no picker', PICKABLE_SOURCES[MEDICAL], []],
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
