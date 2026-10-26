import test from 'node:test';
import assert from 'node:assert/strict';
import { PAD_OPTION, validateQuestion } from './recallImportService.js';
import { buildQuestion, isFiller, specialtyFor } from '../scripts/buildOctoberRecallImport.js';
import { MEDICAL_SOURCES, ALL_SESSION_SOURCES, SOURCE_PRIORITY } from '../config/sources.js';
import { specialtyKeys, MEDICAL } from '../config/tracks.js';

const raw = (extra = {}) => ({
    qid: 'oct00001', stem: 'A 30-year-old man presents with chest pain. What is the diagnosis?',
    options: { A: 'MI', B: 'GERD', C: '?', D: 'PE' }, answer_letter: 'B', ...extra,
});

test('October is the first medical source and is allowed in the session CHECK list', () => {
    assert.equal(MEDICAL_SOURCES[0], 'MedicalOctoberRecall');
    assert.equal(MEDICAL_SOURCES[1], 'MedicalSeptemberRecall');
    assert.equal(SOURCE_PRIORITY[MEDICAL][0], 'MedicalOctoberRecall');
    assert.ok(ALL_SESSION_SOURCES.includes('MedicalOctoberRecall'));
    for (const s of MEDICAL_SOURCES) assert.ok(ALL_SESSION_SOURCES.includes(s), s);
});

test('filler options become the placeholder, real options and the answer are untouched', () => {
    assert.ok(isFiller('?') && isFiller('!!') && isFiller('Can’t remember') && isFiller('Not recalled'));
    assert.ok(!isFiller('CXR') && !isFiller('5') && !isFiller('2.5 mg'));
    const q = buildQuestion(raw());
    assert.deepEqual([q.option1, q.option2, q.option3, q.option4], ['MI', 'GERD', PAD_OPTION, 'PE']);
    assert.equal(q.correct_option, 'GERD');
    assert.equal(q.padded, 1);
    assert.equal(q.explanation, null);
    assert.equal(validateQuestion(q, specialtyKeys('medical')), null);
});

test('a short option list is padded to four and the answer is found by letter', () => {
    const q = buildQuestion(raw({ options: { A: 'Observe', B: 'Surgery' }, answer_letter: 'B' }));
    assert.deepEqual([q.option3, q.option4], [PAD_OPTION, PAD_OPTION]);
    assert.equal(q.correct_option, 'Surgery');
    assert.equal(q.padded, 2);
});

test('the answer option is never replaced even if it looks like filler', () => {
    assert.throws(() => buildQuestion(raw({ options: { A: 'x', B: '' }, answer_letter: 'B' })), /answer letter missing/);
});

test('specialty rules: pregnancy, children, trauma, and adults default to medicine', () => {
    const t = (stem) => specialtyFor({ stem, options: { A: 'a', B: 'b' } })[0];
    assert.equal(t('A 28-year-old primigravida at 39 weeks presents in labor.'), 'obstetrics and gynecology');
    assert.equal(t('A 4-year-old with fever and rash.'), 'pediatric');
    assert.equal(t('A newborn of a diabetic mother has hypoglycemia.'), 'pediatric');
    assert.equal(t('A patient sustained trauma and has a pelvic fracture.'), 'surgery');
    assert.equal(t('A 60-year-old man with hypertension and COPD on home oxygen.'), 'medicine');
});
