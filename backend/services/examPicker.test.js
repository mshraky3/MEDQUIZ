/**
 * Exam question picking: the rules, the SNLE split, the medical proportions,
 * the cap and the part plan. All pure: no database.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    normaliseText, hasPlaceholderOption, hasIdenticalOptions, isUsableQuestion, shuffle,
    allocateProportional, planQuotas, pickExamQuestions, toExamQuestion,
} from './examPicker.js';
import { EXAMS, buildPartPlan, runConfig, publicExamConfig } from '../config/exams.js';

const q = (over = {}) => ({
    id: 1, question_text: 'A 5 year old child presents with fever?', option1: 'A one', option2: 'B two',
    option3: 'C three', option4: 'D four', correct_option: 'B two', question_type: 'pediatric',
    source: 'MedicalGameBoy', has_explanation: true, ...over,
});

// A deterministic generator so shuffles are reproducible.
const seeded = (seed = 7) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
};

/** A fake database: `pool` = { specialty: count }; ids are unique, texts unique unless `dupEvery` repeats them. */
function fakePool(pool, { dupEvery = 0, badEvery = 0 } = {}) {
    const rows = [];
    let id = 1;
    for (const [specialty, n] of Object.entries(pool)) {
        for (let i = 0; i < n; i += 1) {
            const dup = dupEvery && i % dupEvery === 0 && i > 0;
            const bad = badEvery && i % badEvery === 0 && i > 0;
            rows.push(q({
                id: id++,
                question_text: dup ? `${specialty} text 0` : `${specialty} text ${i}`,
                question_type: specialty,
                option4: bad ? "Didn't Recall " : 'D four',
            }));
        }
    }
    const fetchBucket = async ({ specialties, limit, excludeIds }) => {
        const ex = new Set(excludeIds);
        const candidates = shuffle(rows.filter((r) => specialties.includes(r.question_type) && !ex.has(r.id)), seeded(3));
        return candidates.slice(0, limit);
    };
    return { rows, fetchBucket };
}

test('normaliseText collapses space, case and curly apostrophes', () => {
    assert.equal(normaliseText("  Didn’t   RECALL "), "didn't recall");
    assert.equal(normaliseText(null), '');
});

test('placeholder option is caught in any option, any case, with spaces', () => {
    for (const k of ['option1', 'option2', 'option3', 'option4']) {
        assert.equal(hasPlaceholderOption(q({ [k]: " Didn't recall " })), true, k);
        assert.equal(hasPlaceholderOption(q({ [k]: "DIDN'T RECALL" })), true, k);
        assert.equal(hasPlaceholderOption(q({ [k]: 'didn’t recall' })), true, k);
    }
    assert.equal(hasPlaceholderOption(q()), false);
});

test('identical or empty options make a question unusable', () => {
    assert.equal(hasIdenticalOptions(q({ option3: ' a one ' })), true);
    assert.equal(hasIdenticalOptions(q({ option2: '' })), true);
    assert.equal(hasIdenticalOptions(q()), false);
});

test('isUsableQuestion: needs an explanation flag, four real options and a key that is one of them', () => {
    assert.equal(isUsableQuestion(q()), true);
    assert.equal(isUsableQuestion(q({ has_explanation: false })), false);
    assert.equal(isUsableQuestion(q({ has_explanation: undefined })), false);
    assert.equal(isUsableQuestion(q({ correct_option: 'not an option' })), false);
    assert.equal(isUsableQuestion(q({ question_text: '   ' })), false);
    assert.equal(isUsableQuestion(q({ option1: "didn't recall" })), false);
    assert.equal(isUsableQuestion(null), false);
});

test('allocateProportional sums to the total and follows the weights', () => {
    const a = allocateProportional({ a: 3, b: 1 }, 8);
    assert.deepEqual(a, { a: 6, b: 2 });
    const b = allocateProportional({ a: 1, b: 1, c: 1 }, 10);
    assert.equal(b.a + b.b + b.c, 10);
    assert.deepEqual(allocateProportional({ a: 0, b: 0 }, 5), { a: 0, b: 0 });
    assert.deepEqual(allocateProportional({ a: 5 }, 0), { a: 0 });
});

test('shuffle keeps every item and changes the order', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const out = shuffle(items, seeded(1));
    assert.deepEqual([...out].sort((x, y) => x - y), items);
    assert.notDeepEqual(out, items);
    assert.deepEqual(items, Array.from({ length: 50 }, (_, i) => i), 'input is not mutated');
});

test('SMLE: 200 questions spread by specialty in proportion to the pool', () => {
    const counts = { medicine: 2582, 'obstetrics and gynecology': 1389, pediatric: 1280, surgery: 725 };
    const plan = planQuotas(EXAMS.medical, counts);
    assert.equal(plan.served, 200);
    assert.equal(plan.capped, false);
    const by = Object.fromEntries(plan.buckets.map((b) => [b.key, b.target]));
    assert.equal(Object.values(by).reduce((s, n) => s + n, 0), 200);
    // ranking follows the pool ranking
    assert.ok(by.medicine > by['obstetrics and gynecology']);
    assert.ok(by['obstetrics and gynecology'] > by.pediatric);
    assert.ok(by.pediatric > by.surgery);
    assert.ok(Math.abs(by.medicine - (2582 / 5976) * 200) < 1.01);
});

test('SNLE follows 40/30/20/10 when the pool allows', () => {
    const counts = {
        'medical surgical nursing': 507, 'mental health nursing': 81,
        'maternal and newborn nursing': 317, 'pediatric nursing': 337,
        'nursing fundamentals': 411, 'nursing pharmacology': 133,
        __management__: 400,
    };
    const config = { ...EXAMS.nursing, blueprint: EXAMS.nursing.blueprint.map((d) => (d.key === 'management' ? { ...d, specialties: ['__management__'] } : d)) };
    const plan = planQuotas(config, counts);
    const by = Object.fromEntries(plan.buckets.map((b) => [b.key, b.target]));
    assert.deepEqual(by, { adult: 80, maternal_child: 60, fundamentals: 40, management: 20 });
    assert.equal(plan.served, 200);
    assert.deepEqual(plan.notes, []);
});

test('SNLE with no management questions: reported short, share goes to the other domains, total stays 200', () => {
    const counts = {
        'medical surgical nursing': 507, 'mental health nursing': 81,
        'maternal and newborn nursing': 317, 'pediatric nursing': 337,
        'nursing fundamentals': 411, 'nursing pharmacology': 133,
    };
    const plan = planQuotas(EXAMS.nursing, counts);
    const by = Object.fromEntries(plan.buckets.map((b) => [b.key, b.target]));
    assert.equal(by.management, 0);
    assert.equal(plan.served, 200);
    assert.equal(plan.capped, false);
    assert.deepEqual(plan.notes, [{ code: 'domain_short', domain: 'management', wanted: 20, got: 0 }]);
    // the 20 extra were placed in proportion to 40/30/20
    assert.ok(by.adult > 80 && by.maternal_child > 60 && by.fundamentals > 40);
    assert.equal(by.adult + by.maternal_child + by.fundamentals, 200);
});

test('a small domain is capped by its pool and the rest is redistributed', () => {
    const counts = { 'medical surgical nursing': 10, 'maternal and newborn nursing': 300, 'nursing fundamentals': 300 };
    const plan = planQuotas(EXAMS.nursing, counts);
    const by = Object.fromEntries(plan.buckets.map((b) => [b.key, b.target]));
    assert.equal(by.adult, 10);
    assert.equal(plan.served, 200);
    assert.ok(plan.notes.some((n) => n.domain === 'adult' && n.got === 10));
});

test('question count is capped by the pool and says so', () => {
    const plan = planQuotas(EXAMS.medical, { medicine: 30, surgery: 20 });
    assert.equal(plan.served, 50);
    assert.equal(plan.capped, true);
    assert.equal(plan.requested, 200);
    assert.deepEqual(plan.notes, [{ code: 'pool_short', requested: 200, served: 50 }]);
});

test('empty pool serves nothing', () => {
    const plan = planQuotas(EXAMS.dental, {});
    assert.equal(plan.served, 0);
    assert.equal(plan.capped, true);
});

test('pickExamQuestions: unique texts, usable only, shuffled, exact count', async () => {
    const { fetchBucket } = fakePool({ medicine: 400, surgery: 300, pediatric: 300, 'obstetrics and gynecology': 200 }, { dupEvery: 5, badEvery: 7 });
    const out = await pickExamQuestions({ config: EXAMS.medical, counts: { medicine: 400, surgery: 300, pediatric: 300, 'obstetrics and gynecology': 200 }, fetchBucket, rng: seeded(11) });
    assert.equal(out.questions.length, 200);
    assert.equal(out.served, 200);
    assert.equal(out.capped, false);
    const texts = out.questions.map((x) => normaliseText(x.question_text));
    assert.equal(new Set(texts).size, 200, 'no repeated text');
    assert.equal(new Set(out.questions.map((x) => x.id)).size, 200, 'no repeated id');
    for (const x of out.questions) assert.equal(isUsableQuestion(x), true);
    // shuffled: not grouped by specialty in the order they were planned
    const firstFifty = new Set(out.questions.slice(0, 50).map((x) => x.question_type));
    assert.ok(firstFifty.size > 1);
});

test('pickExamQuestions tops up when the plan overestimated the pool (duplicates inside it)', async () => {
    // 60 rows but only 30 distinct texts: the plan says 60 are usable, the picker can only find 30.
    const rows = [];
    for (let i = 0; i < 60; i += 1) rows.push(q({ id: i + 1, question_text: `same ${i % 30}`, question_type: 'medicine' }));
    const fetchBucket = async ({ specialties, limit, excludeIds }) => {
        const ex = new Set(excludeIds);
        return rows.filter((r) => specialties.includes(r.question_type) && !ex.has(r.id)).slice(0, limit);
    };
    const out = await pickExamQuestions({ config: { ...EXAMS.medical, questions: 50 }, counts: { medicine: 60 }, fetchBucket, rng: seeded(2) });
    assert.equal(out.questions.length, 30);
    assert.equal(out.capped, true);
    assert.ok(out.notes.some((n) => n.code === 'pool_short' && n.served === 30));
});

test('the exam payload carries no explanation and no internal fields', () => {
    const shaped = toExamQuestion({ ...q(), explanation: 'secret reasoning', has_explanation: true, sources: ['x'] });
    assert.equal('explanation' in shaped, false);
    assert.equal('has_explanation' in shaped, false);
    assert.equal('sources' in shaped, false);
    assert.deepEqual(Object.keys(shaped).sort(), ['correct_option', 'id', 'option1', 'option2', 'option3', 'option4', 'question_text', 'question_type', 'source'].sort());
});

test('part plan: SMLE is 100 + 100 at 120 minutes, a smaller pool keeps the pace, SDLE is split like the other two, a demo is one part', () => {
    const smle = buildPartPlan(EXAMS.medical, 200);
    assert.deepEqual(smle.map((p) => [p.questions, p.minutes]), [[100, 120], [100, 120]]);
    assert.deepEqual(smle.map((p) => [p.from, p.to]), [[0, 100], [100, 200]]);
    const small = buildPartPlan(EXAMS.medical, 50);
    assert.deepEqual(small.map((p) => [p.questions, p.minutes]), [[25, 30], [25, 30]]);
    const odd = buildPartPlan(EXAMS.medical, 51);
    assert.equal(odd[0].questions + odd[1].questions, 51);
    const sdle = buildPartPlan(EXAMS.dental, 100);
    assert.deepEqual(sdle.map((p) => [p.questions, p.minutes]), [[50, 60], [50, 60]]);
    const demo = buildPartPlan(runConfig('medical', { demo: true }), 20);
    assert.deepEqual(demo.map((p) => [p.questions, p.minutes]), [[20, 24]]);
    assert.deepEqual(buildPartPlan(EXAMS.medical, 0), []);
    assert.deepEqual(buildPartPlan(EXAMS.medical, 1).map((p) => p.questions), [1]);
});

test('config: the published numbers, and dental uses the same sitting (owner, 2026-11-23)', () => {
    assert.equal(EXAMS.medical.questions, 200);
    assert.equal(EXAMS.medical.minutesPerPart, 120);
    assert.equal(EXAMS.medical.breakMinutes, 30);
    assert.equal(EXAMS.medical.passMark.pass, 560);
    assert.equal(EXAMS.nursing.passMark.pass, 500);
    assert.deepEqual(EXAMS.nursing.blueprint.map((d) => d.pct), [40, 30, 20, 10]);
    assert.equal(EXAMS.dental.confirmed, true);
    assert.equal(EXAMS.dental.practiceLength, false);
    assert.equal(EXAMS.dental.questions, 200);
    assert.equal(EXAMS.dental.parts, 2);
    assert.equal(EXAMS.dental.passMark, null);
    assert.equal(publicExamConfig(EXAMS.dental).confirmed, true);
    const demo = runConfig('nursing', { demo: true });
    assert.equal(demo.questions, 20);
    assert.equal(demo.parts, 1);
    assert.equal(demo.breakMinutes, 0);
    assert.equal(demo.key, 'snle');
});

test('every nursing specialty of the blueprint exists in tracks.js, each exactly once', async () => {
    const { TRACKS } = await import('../config/tracks.js');
    const keys = TRACKS.nursing.specialties.map((s) => s.key);
    const used = EXAMS.nursing.blueprint.flatMap((d) => d.specialties);
    assert.deepEqual([...used].sort(), [...keys].sort());
});
