// Learning-path layer over the summaries catalog.
//
// The catalog in ./content is a flat set of specialties × N subtopics, one set
// per study track. This module turns a track's set into an ordered study path —
// milestones (specialties) made of numbered steps (subtopics), with a
// checkpoint after each milestone — without touching the content files
// themselves. Nothing here filters or hides content within a track: every step
// stays open at all times, the ordering is guidance only.
//
// Use loadPath(track). It is async because the catalog itself is now loaded per
// track on demand (see ./content/index.js). The result is built once per track
// and memoised, so the (fairly expensive) reading-time estimate over ~800 KB of
// markup is not redone on every render.
import { loadSections } from './content/index.js';
import { normalizeTrack } from '../../utils/tracks.js';

/* ------------------------------------------------------------------ */
/* Beginner-facing copy                                                */
/* ------------------------------------------------------------------ */

// One line per milestone: what finishing it actually gets the student.
const MILESTONE_COPY = {
    pediatrics: {
        tagline: 'Read a sick child',
        goal: 'Recognise the classic pediatric presentations, know the first move in each, and walk into the pediatrics block without guessing.',
    },
    obgyn: {
        tagline: 'Pregnancy, start to finish',
        goal: 'Follow a pregnancy from the booking visit to delivery, then cover the gynecology topics that make up the rest of the block.',
    },
    medicine: {
        tagline: 'The adult core',
        goal: 'Build the reasoning patterns every other specialty borrows — chest pain, breathlessness, electrolytes and sepsis.',
    },
    surgery: {
        tagline: 'Who needs an operation',
        goal: 'Decide who needs surgery, how urgently, and what has to happen before and after it.',
    },
    /* ---- Nursing track ---- */
    'nursing-fundamentals': {
        tagline: 'How a nurse decides',
        goal: 'Learn the reasoning the whole exam rests on — which patient comes first, what you may delegate, what the law and the consent form require, and how infection is stopped.',
    },
    'medical-surgical-nursing': {
        tagline: 'The adult ward',
        goal: 'Work through the systems the biggest part of the paper covers: before and after surgery, the heart, the chest, the kidneys, the gut, the endocrine emergencies, burns and shock.',
    },
    'maternal-newborn-nursing': {
        tagline: 'Mother and baby, start to finish',
        goal: 'Follow a pregnancy from the booking visit through labour and delivery to the newborn and the postpartum ward, including the bleeding and blood-pressure emergencies.',
    },
    'pediatric-nursing': {
        tagline: 'Care that changes with age',
        goal: 'Match your assessment and your teaching to the child in front of you, and recognise the paediatric conditions the exam returns to every sitting.',
    },
    'mental-health-nursing': {
        tagline: 'What to say, and when',
        goal: 'Master therapeutic communication and the vocabulary of thought and mood disorders — the two things almost every mental-health question actually tests.',
    },
    'nursing-pharmacology': {
        tagline: 'Give it safely, calculate it right',
        goal: 'Get every dosage and drip-rate calculation correct, then learn the checks, antidotes and side effects that decide the drug questions.',
    },
};

// One line per step, written for someone starting from zero: what the step
// covers and why it is worth the time. Keyed by subtopic id.
const WHY = {
    /* ---- Pediatrics ---- */
    'peds-cardiology': 'Learn to tell a harmless murmur from a real heart defect — the most common way the pediatric block opens.',
    'peds-er-icu': 'The emergencies you cannot miss: how much fluid, how fast, and what to give first.',
    'peds-endocrinology': 'Growth, puberty and diabetes questions all trace back to the handful of hormone patterns you meet here.',
    'peds-gastroenterology': 'Vomiting is the most common pediatric complaint — this teaches you which vomiting is dangerous.',
    'peds-general': 'Short everyday scenarios — bites, stings, SIDS — that turn into quick, reliable marks.',
    'peds-genetics': 'Syndromes are recognised by pattern, not memorised. Learn the few patterns examiners reuse.',
    'peds-growth': 'What a child should be able to do at each age. Pure recall, and free points once known.',
    'peds-heme-onc': 'A pale child, a bruising child, a child with bone pain — this tells you which is anemia and which is leukemia.',
    'peds-immunology': 'Every "recurrent infections" question reduces to which part of the immune system is missing.',
    'peds-neonatology': 'The first month of life has its own rules — jaundice, sepsis and breathing trouble are heavily tested.',
    'peds-nephrology': 'Swelling versus blood in the urine: two syndromes and one clean distinction examiners love.',
    'peds-neurology': 'Seizures, weakness and headache — and the red flags that decide who gets scanned.',
    'peds-pulmonology': 'Wheeze is the most-tested sound in pediatrics. Here you learn its causes and the stepwise treatment.',
    'peds-rheumatology': 'Fever plus rash plus sore joints — the classic triads and how to tell them apart.',
    'peds-uro-ophtho-ortho': 'A short set of surgical-referral topics that are easy marks once you have seen them once.',
    'peds-vaccination': 'Schedule and contraindication questions are guaranteed marks and take minutes to learn.',
    'peds-infectious': 'Stridor, rashes and meningitis — the last piece of pediatrics, and one of the highest-yield.',

    /* ---- OB/GYN ---- */
    'obgyn-obstetrics': 'Start with bleeding in pregnancy — when in the pregnancy it happens is what gives the diagnosis away.',
    'obgyn-labor-delivery': 'Learn normal labour first; every abnormal-labour question is just a deviation from it.',
    'obgyn-complications': 'Pre-eclampsia and gestational diabetes are the two conditions this block asks about most.',
    'obgyn-antenatal': 'What gets checked at each visit — and why pregnancy shifts the lab values you already know.',
    'obgyn-gynecology': 'The non-pregnant half of the block: bleeding, pelvic pain and masses, sorted by age.',
    'obgyn-urogynecology': 'Incontinence and prolapse — a small topic with a very predictable set of questions.',
    'obgyn-infertility': 'Contraception and menopause counselling come up constantly and are easy once the rules are clear.',

    /* ---- Internal Medicine ---- */
    'med-cardiology': 'Chest pain and breathlessness are the most common adult presentations — the highest-yield topic on the whole path.',
    'med-pulmonology': 'Separate the four causes of breathlessness that get mixed together in every paper.',
    'med-gastro': 'GI bleeding and liver failure carry the most marks here; the rest follows the same reasoning.',
    'med-endocrine': 'Diabetes and thyroid appear almost everywhere, and DKA is a near-guaranteed emergency question.',
    'med-nephrology': 'Sodium, potassium and acid–base look intimidating until you learn the small set of rules in this step.',
    'med-heme-onc': 'Anaemia is classified by a single number (MCV); the oncologic emergencies are the must-not-miss half.',
    'med-infectious': 'Spotting sepsis and acting in the first hour — the most repeated management question in medicine.',
    'med-rheum-neuro': 'Autoimmune patterns and stroke care close the medicine block with two heavily tested topics.',

    /* ---- Surgery ---- */
    'surg-anal': 'Common complaints where the exact site and the pain pattern hand you the answer.',
    'surg-bariatric': 'A short, rules-based step: who qualifies for surgery and what must happen before it.',
    'surg-breast': 'Breast lump questions are frequent, and the patient’s age usually decides the answer.',
    'surg-vascular': 'Painful and pulseless limbs — learn the time limits that decide whether the leg is saved.',
    'surg-colon': 'The biggest surgical topic: obstruction, appendicitis and colon cancer all live here.',
    'surg-fluid': 'How much fluid, which fluid, and how to correct electrolytes — the basis of every surgical patient.',
    'surg-endocrine': 'Thyroid nodules and calcium problems, with the classification systems examiners quote directly.',
    'surg-gastro': 'Which symptoms demand an urgent endoscopy — a favourite single-best-answer question.',
    'surg-hepatobiliary': 'Right upper quadrant pain has four likely answers; this step teaches you how to choose.',
    'surg-neuro': 'Head-injury bleeds are told apart by one scan appearance and one detail in the history each.',
    'surg-ortho': 'The fractures with complications — the ones that cost a limb or a nerve when missed.',
    'surg-pediatric': 'Surgical problems specific to children, mostly defined by the age at which they show up.',
    'surg-plastic': 'Burns need a calculation and a formula. Learn them once and these questions become automatic.',
    'surg-periop': 'What goes wrong before and after an operation, day by day — a reliably tested sequence.',
    'surg-shock': 'One table of numbers separates the types of shock. Learn it and this becomes free marks.',
    'surg-trauma': 'The ABC survey in the exact order examiners expect — the most protocol-driven step here.',
    'surg-gib': 'Upper versus lower GI bleeding: where the blood comes from decides the scope and the drug.',
    'surg-urology': 'Testicular torsion is the classic do-not-miss emergency; stones and prostate fill out the rest.',
};

/* ------------------------------------------------------------------ */
/* Time estimates                                                      */
/* ------------------------------------------------------------------ */

// Rough reading estimate. Summaries are HTML (including inline SVG figures), so
// strip tags, then approximate words from character count — precise enough for a
// "roughly how long" hint and far cheaper than tokenising ~800 KB of markup.
const WORDS_PER_MIN = 190;
const MIN_PER_QUESTION = 0.75;
const CHARS_PER_WORD = 6;

const readingMinutes = (subtopic) => {
    const text = (subtopic.summaryHtml || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const words = text.length / CHARS_PER_WORD;
    const questions = subtopic.questions?.length || 0;
    return Math.max(3, Math.round(words / WORDS_PER_MIN + questions * MIN_PER_QUESTION));
};

/**
 * "45 دقيقة" / "45 min" — a reading-time hint shown in the page chrome, so its
 * units follow the UI language. The study material itself stays English; this
 * is a UI label, not content.
 */
export const formatMinutes = (mins, lang = 'ar') => {
    if (!mins || mins < 1) return '—';
    const ar = lang !== 'en';
    if (mins < 60) return ar ? `${mins} دقيقة` : `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (ar) return m ? `${h} س ${m} د` : `${h} س`;
    return m ? `${h} h ${m} min` : `${h} h`;
};

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

// Subtopic titles are prefixed with their in-specialty number ("01 — Cardiology").
// The path supplies its own global step number, so drop the prefix.
const stripIndex = (title) => (title || '').replace(/^\s*\d+\s*[—–-]\s*/, '').trim();

/* ------------------------------------------------------------------ */
/* Checkpoints                                                         */
/* ------------------------------------------------------------------ */

// Pick a few self-check questions spread across a milestone (first, middle,
// last topic) rather than clustered at its start. Deterministic, so the same
// checkpoint always shows the same questions.
const pickCheckQuestions = (subtopics, wanted = 3) => {
    const pool = subtopics.filter((t) => t.questions?.length);
    if (!pool.length) return [];
    const count = Math.min(wanted, pool.length);
    const span = Math.max(1, count - 1);
    const out = [];
    for (let i = 0; i < count; i += 1) {
        const t = pool[Math.round((i * (pool.length - 1)) / span)];
        out.push({ ...t.questions[0], fromId: t.id, fromTitle: stripIndex(t.title) });
    }
    return out;
};

/* ------------------------------------------------------------------ */
/* The path                                                            */
/* ------------------------------------------------------------------ */

const buildMilestones = (sections) => {
    // Step numbers are global across the whole path, so the counter lives here
    // (per build) rather than at module scope — otherwise building a second
    // track's path would continue numbering from where the first one stopped.
    let stepNo = 0;

    return sections.map((section, mIndex) => {
    const copy = MILESTONE_COPY[section.id] || {};
    const steps = section.subtopics.map((subtopic, i) => {
        stepNo += 1;
        return {
            id: subtopic.id,
            no: stepNo,                       // global position on the path (1-based)
            indexInMilestone: i,
            subtopic,
            section,
            milestoneId: section.id,
            title: stripIndex(subtopic.title),
            covers: subtopic.title_en || '',  // "what you'll learn" — authored in the content files
            why: WHY[subtopic.id] || 'A high-yield topic on the path — open it to see what it covers.',
            minutes: readingMinutes(subtopic),
            questionCount: subtopic.questions?.length || 0,
        };
    });

    return {
        id: section.id,
        section,
        order: mIndex + 1,
        title: section.title,
        subtitle: section.title_en,
        icon: section.icon,
        accent: section.accent,
        tagline: copy.tagline || section.title,
        goal: copy.goal || section.intro || '',
        steps,
        minutes: steps.reduce((n, s) => n + s.minutes, 0),
        questionCount: steps.reduce((n, s) => n + s.questionCount, 0),
        checkpoint: {
            id: `checkpoint-${section.id}`,
            title: `Checkpoint — ${section.title}`,
            prompt: 'A quick self-check before you move on. Answer these from memory — if any of them feel shaky, go back to that step and read it again.',
            questions: pickCheckQuestions(section.subtopics),
        },
    };
    });
};

const pathCache = new Map();

function buildPath(key, sections) {
    const milestones = buildMilestones(sections);
    const steps = milestones.flatMap((m) => m.steps);
    return {
        track: key,
        milestones,
        steps,
        totalSteps: steps.length,
        totalMinutes: steps.reduce((n, s) => n + s.minutes, 0),
        totalQuestions: steps.reduce((n, s) => n + s.questionCount, 0),
        stepById: steps.reduce((acc, s) => { acc[s.id] = s; return acc; }, {}),
        milestoneById: milestones.reduce((acc, m) => { acc[m.id] = m; return acc; }, {}),
        // Milestone boundaries as percentages along the header progress bar.
        ticks: (() => {
            const out = [];
            let acc = 0;
            milestones.forEach((m, i) => {
                acc += m.steps.length;
                if (i < milestones.length - 1) out.push({ id: m.id, pos: (acc / steps.length) * 100 });
            });
            return out;
        })(),
    };
}

/**
 * An empty but fully-shaped path. Callers render this while the catalog chunk
 * is in flight and for a track with no authored summaries yet, so neither case
 * needs special-casing against null.
 */
export const EMPTY_PATH_SHAPE = Object.freeze(buildPath(normalizeTrack(undefined), []));

/**
 * The guided path for one study track: milestones, flattened steps, totals and
 * id lookups. Async because the catalog is loaded per track on demand; memoised
 * per track, so it is one round-trip on first visit and instant afterwards.
 */
export async function loadPath(track) {
    const key = normalizeTrack(track);
    if (!pathCache.has(key)) {
        pathCache.set(
            key,
            loadSections(key)
                .then((sections) => buildPath(key, sections))
                .catch((err) => { pathCache.delete(key); throw err; })
        );
    }
    return pathCache.get(key);
}

export default loadPath;
