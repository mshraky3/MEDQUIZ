/**
 * Measure the nursing question bank against the official SNLE blueprint.
 *
 * The blueprint below is transcribed from the SCFHS *Saudi Nursing Licensure
 * Examination (SNLE) — Examination Content Guideline*, the version published at
 *   https://scfhs.org.sa/sites/default/files/2025-09/SNLE%20Applicant%20Guide%20.pdf
 * retrieved 2026-08-31. Four sections, fixed weights, and an explicit tolerance:
 * "Blueprint distributions of the examination may differ up to +/-5% in each
 * level." That tolerance is what BAND below encodes.
 *
 * Why this exists as a script and not a one-off answer: the bank gets swapped
 * (see replaceQuestionBank2026H2.js, swapQuestionBank2026.js) and every swap
 * silently changes the mix. A number in a document rots. This re-measures.
 *
 * Read-only. It runs SELECTs and nothing else, so it is safe against the live
 * database — but it still needs credentials, so there is a second mode that
 * reads the committed source files instead:
 *
 *   node scripts/auditNursingBlueprint.js                 # live DB
 *   node scripts/auditNursingBlueprint.js --from-source   # source-material/clean
 *   node scripts/auditNursingBlueprint.js --strict        # exit 1 if out of band
 *
 * See docs/SNLE_BLUEPRINT_AUDIT.md for what the current numbers mean.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { NURSING } from '../config/tracks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const FROM_SOURCE = process.argv.includes('--from-source');
const STRICT = process.argv.includes('--strict');

/** SCFHS allows the real exam to drift this far from the stated weight. */
const BAND = 5;

/**
 * The blueprint, plus which of our question_type values feeds each section.
 *
 * `ours: []` is not an oversight — Nursing Management and Leadership is a tenth
 * of the exam and has no specialty of its own in config/tracks.js. The probes
 * are what tell us whether the topic is nevertheless present, filed elsewhere.
 */
const BLUEPRINT = [
    {
        section: 'Nursing Fundamentals',
        weight: 20,
        subsections: [
            'Fundamentals of nursing', 'Professionalism', 'Patient Centered',
            'Evidence Based Practice and Research', 'Leadership and Management',
            'Quality and Safety Management', 'Health Education and Promotion',
            'Communication and Information Technology', 'Physical assessment',
            'Pharmacology', 'Basic sciences',
        ],
        ours: ['nursing fundamentals', 'nursing pharmacology'],
    },
    {
        section: 'Adult Nursing',
        weight: 40,
        subsections: [
            'Medical nursing', 'Surgical nursing', 'Critical care nursing',
            'Community nursing', 'Mental/psychiatric nursing',
        ],
        ours: ['medical surgical nursing', 'mental health nursing'],
    },
    {
        section: 'Maternal-Child Nursing',
        weight: 30,
        subsections: [
            'Maternity nursing', 'Gynecology', 'Neonatal nursing',
            'Pediatric medical', 'Pediatric surgical',
        ],
        ours: ['maternal and newborn nursing', 'pediatric nursing'],
    },
    {
        section: 'Nursing Management and Leadership',
        weight: 10,
        subsections: [
            'Resources to support and coordinate patient care',
            'Quality and safe patient care at the frontline',
            'Nursing teams and interprofessional relations',
            'Nursing informatics for safe and legal delivery of patient care',
            'Research and Evidence Based Practice',
        ],
        ours: [],
    },
];

/**
 * Keyword probes for the blueprint sub-sections that no specialty owns.
 *
 * Deliberately crude. A hit means "this question at least mentions the topic",
 * which is enough to answer "is there anything here at all" and not enough to
 * answer "is the coverage adequate" — read the sampled stems for that.
 */
const PROBES = {
    'Mgmt — delegation & supervision': /\bdelegat|charge nurse|\bUAP\b|unlicensed assistive|nurse manager|head nurse|staffing|supervisor/i,
    'Mgmt — teams & conflict': /conflict|interprofessional|interdisciplinary|team leader|chain of command/i,
    'Mgmt — quality & incidents': /incident report|quality improvement|root cause|sentinel event|near miss|risk management|accreditation|\bJCI\b/i,
    'Mgmt — nursing informatics': /informatics|electronic (?:health|medical) record|\bEHR\b|\bEMR\b|health information system/i,
    'Adult — critical care': /\bICU\b|intensive care|mechanical ventilat|\bventilator\b|intubat|\bABG\b|arterial blood gas|vasopressor|code blue|cardiac arrest|\bCPR\b|\bACLS\b|\bCVP\b/i,
    'Adult — community nursing': /community (?:health|nurs)|home (?:health|visit|care)|public health|school nurse|outbreak|epidemiolog|screening program/i,
    'Fundamentals — evidence-based practice': /evidence[- ]based|\bRCT\b|randomi[sz]ed|qualitative stud|quantitative stud|sample size|literature review/i,
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** [{ question_type, text }] — one row per nursing question. */
async function loadFromSource() {
    const dir = path.join(__dirname, '..', '..', 'source-material', 'clean');
    const files = ['nursing-confirmed.json', 'nursing-most-repeated.json'];
    const rows = [];
    for (const f of files) {
        const full = path.join(dir, f);
        if (!fs.existsSync(full)) {
            console.warn(`  ! missing ${f} — skipping`);
            continue;
        }
        const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
        for (const q of Array.isArray(raw) ? raw : raw.questions || []) {
            rows.push({
                question_type: q.question_type,
                text: [q.question_text, q.option1, q.option2, q.option3, q.option4]
                    .filter(Boolean).join(' '),
            });
        }
    }
    // No de-duplication here, deliberately.
    //
    // An earlier version de-duplicated on stem+options, reasoning that the
    // insert script drops duplicates and so the source files must overstate the
    // live bank. They do not: the collection totals in
    // src/seo/data/publicQuestions.json come from a real COUNT(*) against the
    // database (see backend/scripts/exportPublicQuestions.js), and they are
    // 1514 + 591 = 2105 — exactly the row count of these two files. Every
    // source row is in the table. De-duplicating here made this mode disagree
    // with the live one by about 10% and shifted every percentage below.
    return rows;
}

async function loadFromDb() {
    const { Pool } = pg;
    const pool = new Pool(
        process.env.DATABASE_URL
            ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
            : {
                user: process.env.DBUSER,
                host: process.env.DBHOST,
                database: process.env.DBNAME,
                password: process.env.DBPASSWORD,
                port: process.env.DBPORT || 5432,
                ssl: { rejectUnauthorized: false },
            }
    );
    try {
        const { rows } = await pool.query(
            `SELECT question_type,
                    concat_ws(' ', question_text, option1, option2, option3, option4) AS text
             FROM questions
             WHERE track = $1`,
            [NURSING]
        );
        return rows;
    } finally {
        await pool.end();
    }
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const pct = (n, total) => (total ? (n / total) * 100 : 0);

function main(rows) {
    const total = rows.length;
    if (!total) {
        console.error('No nursing questions found. Nothing to audit.');
        process.exit(1);
    }

    const counts = {};
    for (const r of rows) counts[r.question_type] = (counts[r.question_type] || 0) + 1;

    console.log(`\nNursing bank: ${total} questions  (source: ${FROM_SOURCE ? 'source-material/clean' : 'live database'})\n`);

    console.log('By specialty');
    for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${String(v).padStart(5)}  ${pct(v, total).toFixed(1).padStart(5)}%  ${k}`);
    }

    console.log('\nAgainst the SNLE blueprint (target ±5%)');
    let outOfBand = 0;
    let mapped = 0;
    for (const b of BLUEPRINT) {
        const n = b.ours.reduce((sum, k) => sum + (counts[k] || 0), 0);
        mapped += n;
        const share = pct(n, total);
        const low = b.weight - BAND;
        const high = b.weight + BAND;
        const ok = share >= low && share <= high;
        if (!ok) outOfBand++;
        const delta = share - b.weight;
        const arrow = ok ? 'in band' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pts`;
        console.log(
            `  ${ok ? 'OK  ' : 'OFF '} ${b.section.padEnd(34)}`
            + ` ${share.toFixed(1).padStart(5)}%  target ${String(b.weight).padStart(2)}%`
            + ` (${low}–${high}%)  ${arrow}`
        );
        if (!b.ours.length) {
            console.log(`         └─ no question_type maps to this section at all`);
        }
    }

    const unmapped = total - mapped;
    if (unmapped) {
        console.log(`\n  ! ${unmapped} question(s) carry a question_type outside the nursing track's specialty list.`);
    }

    console.log('\nKeyword probe — blueprint topics with no specialty of their own');
    for (const [label, re] of Object.entries(PROBES)) {
        const hits = rows.filter((r) => re.test(r.text || ''));
        const where = {};
        for (const h of hits) where[h.question_type] = (where[h.question_type] || 0) + 1;
        const top = Object.entries(where).sort((a, b) => b[1] - a[1]).slice(0, 3)
            .map(([k, v]) => `${k} ${v}`).join(', ');
        console.log(`  ${String(hits.length).padStart(5)}  ${pct(hits.length, total).toFixed(1).padStart(5)}%  ${label}`);
        if (hits.length) console.log(`         └─ filed under: ${top}`);
    }

    console.log(
        outOfBand
            ? `\n${outOfBand} of ${BLUEPRINT.length} sections are outside the blueprint's own ±5% tolerance.`
            : `\nAll ${BLUEPRINT.length} sections are within the blueprint's ±5% tolerance.`
    );

    if (STRICT && outOfBand) process.exit(1);
}

(FROM_SOURCE ? loadFromSource() : loadFromDb())
    .then(main)
    .catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
