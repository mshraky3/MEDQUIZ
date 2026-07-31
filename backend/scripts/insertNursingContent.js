/**
 * Load the nursing track's content: the six topic summaries and the SNLE
 * question bank extracted from the EMS final-review collections.
 *
 * The nursing track was wired up end-to-end (config/tracks.js, track columns,
 * per-track queries) but shipped with an empty bank — this is the script that
 * fills it. It is idempotent: summaries are upserted by slug and questions are
 * de-duplicated against the DB by question_text within the nursing track, so
 * re-running it never creates a second copy.
 *
 * Steps:
 *   1. Widen the user_quiz_sessions source CHECK constraint to accept the
 *      nursing sources. /quiz-sessions derives the session source from the
 *      questions actually answered, so a nursing quiz would otherwise violate
 *      the constraint the first time a student finishes one.
 *   2. Seed the six summaries rows with track='nursing' and sync content_html
 *      from content/summaryHtml (the same content app.js syncs on boot).
 *   3. Insert the questions with track='nursing' and the source each one carries
 *      in the bank file (see NURSING_SOURCES below).
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/insertNursingContent.js            # dry run: shows the plan
 *   node scripts/insertNursingContent.js --apply    # execute
 *   node scripts/insertNursingContent.js --apply --summaries-only
 *   node scripts/insertNursingContent.js --apply --questions-only
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import summaryContent from '../content/summaryHtml/index.js';
import { NURSING, specialtyKeys } from '../config/tracks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

const APPLY = process.argv.includes('--apply');
const SUMMARIES_ONLY = process.argv.includes('--summaries-only');
const QUESTIONS_ONLY = process.argv.includes('--questions-only');
const BATCH = 200;

/**
 * The nursing bank has two sources, mirroring how the medical bank is split.
 * Every question in nursingBank.json carries one of these in its `source` field
 * (see scripts/splitNursingSources.js for how existing rows were relabelled):
 *
 *   NursingMostRepeated — the main EMS review file (Q1–1164), i.e. the غيث
 *                         questions: the confirmed, most-repeated core bank.
 *   NursingConfirmed    — the block appended in the September edition
 *                         (Q1165–1456).
 *
 * NURSING_EMS is the single label both used to share; it is still accepted by
 * the session constraint because historical quiz sessions reference it.
 */
const MOST_REPEATED = 'NursingMostRepeated';
const CONFIRMED = 'NursingConfirmed';
const NURSING_SOURCES = [MOST_REPEATED, CONFIRMED];
const LEGACY_NURSING_SOURCE = 'NursingEMS';

/**
 * Every value that may legally appear in user_quiz_sessions.source. The medical
 * ones are carried over verbatim from swapQuestionBank2026.js — historical rows
 * still reference the retired collections, so dropping any of them would make
 * the new constraint fail to validate.
 */
const ALL_SESSION_SOURCES = [
    'general', 'Midgard', 'GameBoy',
    'October25', 'November25', 'December25',
    'January25', 'FebMarApr25',
    'MidgardGameBoy', 'May26', 'June26',
    LEGACY_NURSING_SOURCE, ...NURSING_SOURCES,
];

/**
 * The six decks. `slug` matches the key in content/summaryHtml/index.js and
 * `question_type` matches the specialty key in config/tracks.js — the summaries
 * API joins the two to show each deck's question count and mastery.
 *
 * r2_prefix is required by the schema but only used by the slide-image route;
 * these decks are authored HTML, so no page images are uploaded and page_count
 * stays 0.
 */
const DECKS = [
    {
        slug: 'nursing-fundamentals',
        title: 'أساسيات التمريض',
        title_en: 'Fundamentals of Nursing',
        question_type: 'nursing fundamentals',
        description: 'الأولويات وعملية التمريض، الأخلاقيات والموافقة المستنيرة، التفويض والقيادة، مكافحة العدوى، صحة المجتمع وسلامة المريض.',
        sort_order: 1,
    },
    {
        slug: 'medical-surgical-nursing',
        title: 'التمريض الباطني والجراحي',
        title_en: 'Medical-Surgical Nursing',
        question_type: 'medical surgical nursing',
        description: 'التمريض الجراحي، القلب والتنفس والغدد والكلى والهضم والأعصاب، الحروق والصدمة، السوائل والأملاح وغازات الدم.',
        sort_order: 2,
    },
    {
        slug: 'maternal-newborn-nursing',
        title: 'تمريض الأمومة والمواليد',
        title_en: 'Maternal & Newborn Nursing',
        question_type: 'maternal and newborn nursing',
        description: 'متابعة الحمل ومضاعفاته، مراحل المخاض ومراقبة الجنين، العناية بالمولود، النفاس والرضاعة وتنظيم الأسرة.',
        sort_order: 3,
    },
    {
        slug: 'pediatric-nursing',
        title: 'تمريض الأطفال',
        title_en: 'Pediatric Nursing',
        question_type: 'pediatric nursing',
        description: 'النمو والتطور والتطعيمات، أمراض الجهاز التنفسي والقلب الخلقي والهضم والكلى، الأمراض المعدية وسلامة الطفل.',
        sort_order: 4,
    },
    {
        slug: 'mental-health-nursing',
        title: 'تمريض الصحة النفسية',
        title_en: 'Mental Health Nursing',
        question_type: 'mental health nursing',
        description: 'التواصل العلاجي والحيل الدفاعية، الفصام والاضطراب الوجداني والقلق، الخرف والإدمان، الانتحار والتقييد والعلاجات النفسية.',
        sort_order: 5,
    },
    {
        slug: 'nursing-pharmacology',
        title: 'الأدوية وحسابات الجرعات',
        title_en: 'Pharmacology & Dosage Calculation',
        question_type: 'nursing pharmacology',
        description: 'حسابات الجرعات ومعدلات التنقيط، سلامة الدواء وطرق الإعطاء، المستويات العلاجية والترياقات وأهم الأصناف الدوائية.',
        sort_order: 6,
    },
];

const VALID_TYPES = specialtyKeys(NURSING);

function loadQuestions() {
    const dir = path.join(__dirname, '..', '..', 'JSON', 'Nursing');
    if (!fs.existsSync(dir)) {
        console.error(`ERROR: question folder not found at ${dir}`);
        process.exit(1);
    }
    let out = [];
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
            if (Array.isArray(data)) out = out.concat(data);
        } catch (e) {
            console.warn(`   WARNING: could not parse ${f}: ${e.message}`);
        }
    }
    return out;
}

/** Same shape rule as the medical importer: four options, key among them. */
function normalize(q) {
    const opt = (v) => (v ?? '').toString().trim() || 'Option not recalled';
    const src = (q.source ?? '').toString().trim();
    return {
        text: (q.question_text ?? '').toString().trim(),
        opt1: opt(q.option1),
        opt2: opt(q.option2),
        opt3: opt(q.option3),
        opt4: opt(q.option4),
        type: (q.question_type ?? '').toString().trim(),
        correct: (q.correct_option ?? '').toString().trim(),
        // An untagged row would otherwise land under an invalid source and be
        // invisible to the analytics breakdown; the core bank is the safe default.
        source: NURSING_SOURCES.includes(src) ? src : MOST_REPEATED,
    };
}

async function main() {
    const client = await pool.connect();
    try {
        console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes). Pass --apply to execute ===');

        // ---- validate the questions before touching anything -----------------
        const raw = QUESTIONS_ONLY || !SUMMARIES_ONLY ? loadQuestions() : [];
        const toInsert = [];
        const skipped = {};
        for (const q of raw) {
            const n = normalize(q);
            const opts = [n.opt1, n.opt2, n.opt3, n.opt4];
            const reason =
                !VALID_TYPES.includes(n.type) ? 'bad-type'
                : n.text.length < 15 ? 'short-text'
                : !n.correct || !opts.includes(n.correct) ? 'key-not-in-options'
                : null;
            if (reason) { skipped[reason] = (skipped[reason] || 0) + 1; continue; }
            toInsert.push(n);
        }
        if (raw.length) {
            console.log(`\nQuestions loaded: ${raw.length} -> ${toInsert.length} valid` +
                (Object.keys(skipped).length ? `, skipped ${JSON.stringify(skipped)}` : ''));
            const byType = {};
            toInsert.forEach((q) => { byType[q.type] = (byType[q.type] || 0) + 1; });
            Object.entries(byType).sort((a, b) => b[1] - a[1])
                .forEach(([t, n]) => console.log(`   ${t.padEnd(30)} ${n}`));
            const bySource = {};
            toInsert.forEach((q) => { bySource[q.source] = (bySource[q.source] || 0) + 1; });
            console.log('   by source:');
            Object.entries(bySource).sort((a, b) => b[1] - a[1])
                .forEach(([s, n]) => console.log(`      ${s.padEnd(27)} ${n}`));
        }

        const before = await client.query(
            `SELECT COUNT(*)::int AS n FROM questions WHERE track = $1`, [NURSING]);
        console.log(`\nNursing questions currently in DB: ${before.rows[0].n}`);

        if (!APPLY) {
            console.log(`\nWould ensure ${DECKS.length} nursing summaries and sync their HTML.`);
            console.log(`Would insert up to ${toInsert.length} questions (existing ones are skipped).`);
            console.log('\nDry run complete. Re-run with --apply to execute.');
            return;
        }

        // ---- 1. constraint ---------------------------------------------------
        if (!SUMMARIES_ONLY) {
            console.log('\n[1/3] Updating user_quiz_sessions source constraint...');
            await client.query(`ALTER TABLE user_quiz_sessions DROP CONSTRAINT IF EXISTS check_valid_quiz_source`);
            const list = ALL_SESSION_SOURCES.map((s) => `'${s}'`).join(', ');
            await client.query(
                `ALTER TABLE user_quiz_sessions ADD CONSTRAINT check_valid_quiz_source CHECK (source IN (${list}))`);
            console.log(`   ✓ constraint now accepts ${NURSING_SOURCES.join(', ')}`);
        }

        // ---- 2. summaries ----------------------------------------------------
        if (!QUESTIONS_ONLY) {
            console.log('\n[2/3] Seeding nursing summaries...');
            for (const d of DECKS) {
                await client.query(
                    `INSERT INTO summaries
                        (slug, title, title_en, question_type, description, r2_prefix, sort_order, track, is_published)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)
                     ON CONFLICT (slug) DO UPDATE SET
                        title = EXCLUDED.title,
                        title_en = EXCLUDED.title_en,
                        question_type = EXCLUDED.question_type,
                        description = EXCLUDED.description,
                        sort_order = EXCLUDED.sort_order,
                        track = EXCLUDED.track,
                        updated_at = NOW()`,
                    [d.slug, d.title, d.title_en, d.question_type, d.description,
                     `summaries/${d.slug}/`, d.sort_order, NURSING]
                );
                const html = summaryContent[d.slug];
                if (!html) {
                    console.warn(`   ! no HTML registered for ${d.slug} — row created without content`);
                    continue;
                }
                await client.query(
                    `UPDATE summaries SET content_html = $1, updated_at = NOW() WHERE slug = $2`,
                    [html, d.slug]
                );
                console.log(`   ✓ ${d.slug.padEnd(26)} ${String(html.length).padStart(6)} bytes`);
            }
        }

        // ---- 3. questions ----------------------------------------------------
        if (!SUMMARIES_ONLY) {
            console.log('\n[3/3] Inserting nursing questions...');
            let inserted = 0, dupes = 0, errors = 0;
            for (let i = 0; i < toInsert.length; i += BATCH) {
                for (const q of toInsert.slice(i, i + BATCH)) {
                    try {
                        const exists = await client.query(
                            `SELECT 1 FROM questions WHERE question_text = $1 AND track = $2 LIMIT 1`,
                            [q.text, NURSING]);
                        if (exists.rows.length) { dupes++; continue; }
                        await client.query(
                            `INSERT INTO questions
                                (question_text, option1, option2, option3, option4,
                                 question_type, correct_option, source, track)
                             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                            [q.text, q.opt1, q.opt2, q.opt3, q.opt4, q.type, q.correct, q.source, NURSING]);
                        inserted++;
                    } catch (e) {
                        errors++;
                        if (errors <= 5) console.warn(`   insert error: ${e.message}`);
                    }
                }
                console.log(`   progress ${Math.min(i + BATCH, toInsert.length)}/${toInsert.length}`);
            }
            console.log(`\n   Inserted: ${inserted}   Already present: ${dupes}   Errors: ${errors}`);
        }

        // ---- verify ----------------------------------------------------------
        const qAfter = await client.query(
            `SELECT question_type, COUNT(*)::int AS n FROM questions
             WHERE track = $1 GROUP BY question_type ORDER BY n DESC`, [NURSING]);
        const srcAfter = await client.query(
            `SELECT source, COUNT(*)::int AS n FROM questions
             WHERE track = $1 GROUP BY source ORDER BY n DESC`, [NURSING]);
        const sAfter = await client.query(
            `SELECT slug, question_type, is_published, length(content_html) AS html_len
             FROM summaries WHERE track = $1 ORDER BY sort_order`, [NURSING]);

        console.log('\nFinal nursing questions by specialty:');
        qAfter.rows.forEach((r) => console.log(`   ${r.question_type.padEnd(30)} ${r.n}`));
        console.log('\nFinal nursing questions by source:');
        srcAfter.rows.forEach((r) => console.log(`   ${String(r.source).padEnd(30)} ${r.n}`));
        const stale = srcAfter.rows.filter((r) => !NURSING_SOURCES.includes(r.source));
        stale.forEach((r) =>
            console.warn(`   ! ${r.n} row(s) still on legacy source "${r.source}" — run scripts/splitNursingSources.js --apply`));
        console.log('\nFinal nursing summaries:');
        sAfter.rows.forEach((r) =>
            console.log(`   ${r.slug.padEnd(26)} type=${r.question_type.padEnd(30)} html=${r.html_len || 0} published=${r.is_published}`));

        // Orphan check: a deck whose question_type has no questions renders an
        // empty study list, and a specialty with no deck is unreachable content.
        const types = new Set(qAfter.rows.map((r) => r.question_type));
        sAfter.rows.filter((r) => !types.has(r.question_type))
            .forEach((r) => console.warn(`   ! ${r.slug} has no questions of type "${r.question_type}"`));

        console.log('\n✅ Nursing content load complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
