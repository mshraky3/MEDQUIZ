/**
 * The three study tracks (medical, nursing, dental) must stay cleanly partitioned.
 * Run with `npm test`. A specialty key that two tracks share would let a mislabelled
 * row straddle two banks; a dental source that leaked into another track's
 * selectable list would let a quiz draw from the wrong bank.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MEDICAL, NURSING, DENTAL, TRACK_KEYS, TRACKS, normalizeTrack, isValidTrack, specialtyKeys,
    trackForSpecialty, trackLabelAr,
} from './tracks.js';
import {
    DENTAL_SOURCES, MEDICAL_SOURCES, NURSING_SOURCES, SELECTABLE_SOURCES, ALL_SESSION_SOURCES, resolveSources,
} from './sources.js';
import { validateQuestion } from '../services/recallImportService.js';

test('dental is a real track with its own thirteen specialties', () => {
    assert.ok(TRACK_KEYS.includes(DENTAL));
    assert.ok(isValidTrack('dental'));
    assert.equal(normalizeTrack('Dental'), DENTAL);
    assert.equal(specialtyKeys(DENTAL).length, 13);
    assert.equal(trackLabelAr(DENTAL), 'طب الأسنان');
    assert.equal(TRACKS[DENTAL].labelEn, 'Dentistry');
});

test('no specialty key is shared between tracks', () => {
    const seen = new Map();
    for (const t of TRACK_KEYS) {
        for (const k of specialtyKeys(t)) {
            assert.ok(!seen.has(k), `"${k}" is in both ${seen.get(k)} and ${t}`);
            seen.set(k, t);
        }
    }
    assert.equal(trackForSpecialty('endodontics'), DENTAL);
    assert.equal(trackForSpecialty('oral surgery'), DENTAL);
    assert.equal(trackForSpecialty('surgery'), MEDICAL);
});

test('dental sources are selectable only for the dental track and are valid session sources', () => {
    assert.deepEqual(SELECTABLE_SOURCES[DENTAL], DENTAL_SOURCES);
    for (const s of DENTAL_SOURCES) {
        assert.ok(ALL_SESSION_SOURCES.includes(s), s);
        assert.ok(!MEDICAL_SOURCES.includes(s) && !NURSING_SOURCES.includes(s), s);
        assert.deepEqual(resolveSources(s, DENTAL), [s]);
        assert.notDeepEqual(resolveSources(s, MEDICAL), [s]);
        assert.notDeepEqual(resolveSources(s, NURSING), [s]);
    }
    // the dental track never falls back to an open (unconstrained) bank
    assert.deepEqual(resolveSources(undefined, DENTAL), DENTAL_SOURCES);
    assert.deepEqual(resolveSources('MedicalGameBoy', DENTAL), DENTAL_SOURCES);
});

test('the recall importer accepts a dental question and rejects another track\'s specialty', () => {
    const q = {
        question_text: 'Which irrigant dissolves organic tissue in the root canal?',
        option1: 'NaOCl', option2: 'EDTA', option3: 'Saline', option4: "didn't recall",
        correct_option: 'NaOCl', question_type: 'endodontics',
    };
    assert.equal(validateQuestion(q, specialtyKeys(DENTAL)), null);
    assert.match(validateQuestion({ ...q, question_type: 'surgery' }, specialtyKeys(DENTAL)), /not valid for the track/);
    assert.match(validateQuestion(q, specialtyKeys(MEDICAL)), /not valid for the track/);
});
