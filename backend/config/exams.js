/**
 * Exam-mode templates, one per track. The ONLY place the shape of an exam
 * sitting is written down: how many questions, how many parts, how long each
 * part runs, whether there is a break, and how the questions are spread.
 * Backend picking (services/examPicker.js) and the site (it receives this
 * through GET /api/exam/config and POST /api/exam/start) both read it from here.
 *
 * Where the numbers come from
 *   SMLE and SNLE: the Commission's own applicant guides, transcribed on
 *   2026-08-31 and shown on the site's /exams pages (my-react-app/src/i18n/copy/
 *   examGuides.js): 200 multiple-choice questions, four options, two parts of
 *   100 questions, 120 minutes per part, a scheduled 30-minute break between
 *   the parts, up to 10% unscored pilot items, no negative marking. Pass mark
 *   560 (SMLE) and 500 (SNLE) on a 200-800 scaled score. SNLE blueprint:
 *   adult 40 / maternal-child 30 / fundamentals 20 / management 10 percent.
 *
 *   SDLE: NO verified format exists. `confirmed: false` makes the site say so
 *   on the rules screen. The numbers below are a clearly labelled PRACTICE
 *   length (100 questions, one part, 120 minutes), not the official format.
 *   When the official format is confirmed, change this block (and flip
 *   `confirmed`) and nothing else.
 *
 * `passMark` is information only. A scaled score cannot be reproduced from a
 * raw count (the guides say so), so the result screen shows a percentage and
 * never claims "you passed".
 *
 * Specialty keys are the literal questions.question_type strings from
 * config/tracks.js. A blueprint domain with `specialties: []` is a domain the
 * bank has no tagged questions for (SNLE management and leadership today); the
 * picker reports it as short and hands its share to the other domains.
 */

import { MEDICAL, NURSING, DENTAL } from './tracks.js';

export const EXAMS = {
    [MEDICAL]: {
        key: 'smle',
        track: MEDICAL,
        confirmed: true,
        practiceLength: false,
        questions: 200,
        parts: 2,
        questionsPerPart: 100,
        minutesPerPart: 120,
        breakMinutes: 30,
        optionsPerQuestion: 4,
        pilotUnscoredMaxPct: 10,
        negativeMarking: false,
        passMark: { scaleMin: 200, scaleMax: 800, pass: 560 },
        // No percentage blueprint is published for SMLE (item counts per topic
        // only), so the questions are spread across the specialties in
        // proportion to how many usable questions each one has.
        blueprint: null,
    },
    [NURSING]: {
        key: 'snle',
        track: NURSING,
        confirmed: true,
        practiceLength: false,
        questions: 200,
        parts: 2,
        questionsPerPart: 100,
        minutesPerPart: 120,
        breakMinutes: 30,
        optionsPerQuestion: 4,
        pilotUnscoredMaxPct: 10,
        negativeMarking: false,
        passMark: { scaleMin: 200, scaleMax: 800, pass: 500 },
        blueprint: [
            // Adult: medical, surgical, critical care, community, mental health.
            { key: 'adult', pct: 40, specialties: ['medical surgical nursing', 'mental health nursing'] },
            // Maternal-child: maternity, neonatal, paediatric.
            { key: 'maternal_child', pct: 30, specialties: ['maternal and newborn nursing', 'pediatric nursing'] },
            // Fundamentals: the guide lists pharmacology under this section.
            { key: 'fundamentals', pct: 20, specialties: ['nursing fundamentals', 'nursing pharmacology'] },
            // Management and leadership: the bank has no questions tagged for it.
            { key: 'management', pct: 10, specialties: [] },
        ],
    },
    [DENTAL]: {
        key: 'sdle',
        track: DENTAL,
        confirmed: false,
        practiceLength: true,
        questions: 100,
        parts: 1,
        questionsPerPart: 100,
        minutesPerPart: 120,
        breakMinutes: 0,
        optionsPerQuestion: 4,
        pilotUnscoredMaxPct: 0,
        negativeMarking: false,
        passMark: null,
        blueprint: null,
    },
};

/**
 * The free-tier demo: one per account, same interface, one short part. The pace
 * (minutes per question) matches the real exam's 120 minutes for 100 questions.
 */
export const DEMO_EXAM = {
    questions: 20,
    parts: 1,
    minutesPerQuestion: 1.2,
};

/** How long an unsubmitted demo can be resumed after it was started (hours). */
export const DEMO_RESUME_HOURS = 3;

export function examForTrack(track) {
    return EXAMS[track] || EXAMS[MEDICAL];
}

/**
 * The exam this run uses: the track's template, or its demo cut-down. A demo
 * keeps the track's key, blueprint and confirmed flag (so the nursing demo is
 * still spread 40/30/20/10 where the pool allows) but is one short part.
 */
export function runConfig(track, { demo = false } = {}) {
    const base = examForTrack(track);
    if (!demo) return base;
    return {
        ...base,
        questions: DEMO_EXAM.questions,
        parts: DEMO_EXAM.parts,
        questionsPerPart: DEMO_EXAM.questions,
        minutesPerPart: Math.ceil(DEMO_EXAM.questions * DEMO_EXAM.minutesPerQuestion),
        breakMinutes: 0,
        pilotUnscoredMaxPct: 0,
        demo: true,
    };
}

/**
 * Split `served` questions into the config's parts. A full pool gives the
 * published 100 + 100; a smaller pool (or a short demo) keeps the same pace
 * (minutes per question) instead of leaving 120 minutes for 40 questions.
 * Returns [{ index (1-based), questions, minutes, from, to }] where from/to are
 * 0-based positions in the served list (to is exclusive).
 */
export function buildPartPlan(config, served) {
    const total = Math.max(0, Math.floor(served));
    const parts = Math.max(1, config.parts);
    const out = [];
    let from = 0;
    for (let i = 0; i < parts; i += 1) {
        const remainingParts = parts - i;
        const count = i === parts - 1 ? total - from : Math.ceil((total - from) / remainingParts);
        const minutes = count >= config.questionsPerPart
            ? config.minutesPerPart
            : Math.max(1, Math.ceil((config.minutesPerPart * count) / config.questionsPerPart));
        out.push({ index: i + 1, questions: count, minutes, from, to: from + count });
        from += count;
    }
    return out.filter((p) => p.questions > 0);
}

/** What the client may see about a config (no internals, same keys for every track). */
export function publicExamConfig(config) {
    return {
        key: config.key,
        confirmed: config.confirmed,
        practiceLength: config.practiceLength,
        demo: !!config.demo,
        questions: config.questions,
        parts: config.parts,
        questionsPerPart: config.questionsPerPart,
        minutesPerPart: config.minutesPerPart,
        breakMinutes: config.breakMinutes,
        optionsPerQuestion: config.optionsPerQuestion,
        pilotUnscoredMaxPct: config.pilotUnscoredMaxPct,
        negativeMarking: config.negativeMarking,
        passMark: config.passMark,
        blueprint: config.blueprint
            ? config.blueprint.map((d) => ({ key: d.key, pct: d.pct, specialties: d.specialties }))
            : null,
    };
}
