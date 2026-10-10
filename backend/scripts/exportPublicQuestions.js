/**
 * Export a fixed sample of the question bank as the PUBLIC, indexable set.
 *
 * Why this exists: the whole question bank (the live count is on the admin
 * Overview and in /api/public/stats) sits behind the login, so Google has never been given a single one of them.
 * Search Console shows five indexed pages for the whole site. This script picks
 * a bounded sample and writes it to a JSON file the web build turns into static
 * pages at /questions/<specialty>/<slug>.
 *
 * It writes a FILE rather than having the build query Postgres, on purpose:
 *   - the Vercel build stays database-free and cannot fail on a cold DB,
 *   - the published set is a reviewable diff, not whatever the bank happened to
 *     contain the moment a deploy ran,
 *   - and re-running it is deterministic (see the ORDER BY below), so an
 *     unchanged bank produces an unchanged file and no accidental churn of
 *     live URLs — which would waste the crawl budget this is meant to earn.
 *
 * The slug is computed HERE and stored in the JSON. Nothing downstream
 * recomputes it, so a published URL can never drift from a change to the
 * slug rules.
 *
 * Usage:
 *   node scripts/exportPublicQuestions.js                        # dry run
 *   node scripts/exportPublicQuestions.js --apply                # write the file
 *   node scripts/exportPublicQuestions.js --per-specialty 30 --apply
 *
 * Refreshing only the numbers (the usual case after new collections are added):
 *   node scripts/exportPublicQuestions.js --totals-only          # dry run
 *   node scripts/exportPublicQuestions.js --totals-only --apply  # rewrite bankTotal + collections only
 * This keeps the published `questions` (and so every indexed URL) exactly as
 * they are; a plain re-run re-samples the whole bank and can move them.
 *
 * The production database lives on Supabase. backend/.env still holds the frozen
 * Koyeb copy, which is stale: set DBHOST/DBPORT/DBNAME/DBUSER/DBPASSWORD in the
 * shell for the one command (dotenv never overrides variables already set).
 * --apply refuses to write unless the host is Supabase (--allow-any-host to skip).
 */
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { TRACKS } from '../config/tracks.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(scriptDir, '..', '.env') });

const args = process.argv.slice(2);
const arg = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const APPLY = args.includes('--apply');
const TOTALS_ONLY = args.includes('--totals-only');
const PER_SPECIALTY = Math.max(1, Number(arg('per-specialty', 24)));
// Every question in the bank has an explanation, but a 120-character one makes
// a thin page — exactly the kind Google already refused to index here. 500 is
// comfortably above the median and still leaves 4,640 candidates.
const MIN_EXPLANATION = Math.max(120, Number(arg('min-explanation', 500)));

const OUT_PATH = path.resolve(
    scriptDir, '..', '..', 'my-react-app', 'src', 'seo', 'data', 'publicQuestions.json'
);

const db = new Pool({
    user: process.env.DBUSER, host: process.env.DBHOST, database: process.env.DBNAME,
    password: process.env.DBPASSWORD, port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 25000,
});

/** Words that carry no search value in a URL. */
const STOPWORDS = new Set([
    'a', 'an', 'the', 'of', 'with', 'and', 'or', 'for', 'to', 'in', 'on', 'at', 'by',
    'is', 'was', 'were', 'are', 'be', 'been', 'his', 'her', 'their', 'its', 'he', 'she',
    'they', 'who', 'which', 'that', 'this', 'these', 'those', 'has', 'have', 'had',
    'from', 'as', 'but', 'not', 'no', 'presented', 'presents', 'following',
]);

function slugify(stem, id) {
    const words = String(stem)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w && !STOPWORDS.has(w))
        .slice(0, 8);
    const base = words.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    // The id suffix is what guarantees uniqueness and stability: two questions
    // can open with the same eight words, and editing a stem must not silently
    // move a URL that Google has already indexed.
    return `${base || 'question'}-q${id}`;
}

/**
 * A short, human-readable headline for the page <title>, the <h1> and the
 * specialty index. The first sentence of a clinical vignette is the scenario,
 * which is both what a reader recognises and what they type into Google.
 */
function headline(stem) {
    const firstSentence = String(stem).split(/(?<=[.?!])\s+/)[0] || String(stem);
    const cleaned = firstSentence.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= 110) return cleaned;
    const cut = cleaned.slice(0, 110);
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}

const SPECIALTIES = Object.values(TRACKS).flatMap((track) =>
    track.specialties.map((s) => ({
        track: track.key, key: s.key, labelEn: s.labelEn, labelAr: s.labelAr,
    }))
);

/**
 * How big each collection is in the bank as a whole, and the bank itself.
 *
 * A question can belong to several collections (`questions.sources`, kept by a
 * trigger; `source` is only its primary one), so collection sizes are counted by
 * membership and will add up to MORE than the bank. The bank total is therefore
 * its own query (every row, the same figure /api/public/stats reports).
 */
async function loadTotals() {
    const { rows: collectionRows } = await db.query(
        `SELECT q.track, s AS source, count(*)::int AS total
           FROM questions q, unnest(COALESCE(q.sources, ARRAY[q.source])) AS s
          WHERE s IS NOT NULL
          GROUP BY 1, 2
          ORDER BY 1, 3 DESC`
    );
    const { rows: [bank] } = await db.query('SELECT count(*)::int AS n FROM questions');
    return { collectionRows, bankTotal: bank.n };
}

/** Rewrite only bankTotal + collections, leaving the published questions untouched. */
async function refreshTotalsOnly() {
    if (!fs.existsSync(OUT_PATH)) throw new Error(`Nothing to refresh: ${OUT_PATH} does not exist`);
    const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const { collectionRows, bankTotal } = await loadTotals();

    const publishedPerSource = existing.questions.reduce((acc, q) => {
        acc[q.source] = (acc[q.source] || 0) + 1;
        return acc;
    }, {});
    const collections = collectionRows.map((row) => ({
        source: row.source,
        track: row.track,
        total: row.total,
        published: publishedPerSource[row.source] || 0,
    }));
    const payload = {
        ...existing,
        generatedAt: new Date().toISOString().slice(0, 10),
        bankTotal,
        collections,
    };

    console.log(`bankTotal: ${existing.bankTotal} -> ${bankTotal}`);
    console.log(`collections: ${existing.collections.length} -> ${collections.length}`);
    for (const c of collections) console.log(`  ${c.track}/${c.source}: ${c.total} (${c.published} published)`);
    console.log(`published questions kept as they were: ${existing.questions.length}`);

    if (!APPLY) {
        console.log(`\nDRY RUN — nothing written. Re-run with --apply to write:\n  ${OUT_PATH}`);
        return;
    }
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`\nWrote ${OUT_PATH}`);
}

async function main() {
    console.log(`Database host: ${process.env.DBHOST || '(not set)'}`);
    const onSupabase = /\.supabase\.(com|co)$/.test(process.env.DBHOST || '');
    if (APPLY && !onSupabase && !args.includes('--allow-any-host')) {
        throw new Error(
            'Refusing to write: DBHOST is not a Supabase host. backend/.env holds the frozen, stale Koyeb copy; '
            + 'set the production DB* variables in the shell for this command (or pass --allow-any-host).'
        );
    }
    if (TOTALS_ONLY) return refreshTotalsOnly();

    const picked = [];
    const report = [];

    for (const specialty of SPECIALTIES) {
        const { rows } = await db.query(
            `SELECT id, question_text, option1, option2, option3, option4,
                    correct_option, question_type, track, source, explanation
               FROM (
                 SELECT DISTINCT ON (question_text) *
                   FROM questions
                  WHERE track = $1
                    AND question_type = $2
                    AND length(explanation) >= $3
                    AND option1 IS NOT NULL AND option2 IS NOT NULL
                    AND option3 IS NOT NULL AND option4 IS NOT NULL
                    AND correct_option IS NOT NULL
                  ORDER BY question_text, id
               ) deduped
              -- Deterministic but spread across the whole bank. Plain ORDER BY id
              -- would hand back 24 consecutive rows from one import batch, which
              -- is one exam sitting and one narrow slice of topics.
              ORDER BY md5(id::text)
              LIMIT $4`,
            [specialty.track, specialty.key, MIN_EXPLANATION, PER_SPECIALTY]
        );

        for (const row of rows) {
            const options = [row.option1, row.option2, row.option3, row.option4];
            const correctIndex = options.findIndex(
                (o) => String(o).trim() === String(row.correct_option).trim()
            );
            // A question whose stored answer does not match any of its four
            // options would publish a page that teaches the wrong thing. Skip
            // it and say so, rather than guessing which option was meant.
            if (correctIndex === -1) {
                report.push(`  ! skipped q${row.id}: correct_option matches none of the four options`);
                continue;
            }

            picked.push({
                id: row.id,
                slug: slugify(row.question_text, row.id),
                track: row.track,
                specialty: row.question_type,
                specialtyLabelEn: specialty.labelEn,
                specialtyLabelAr: specialty.labelAr,
                headline: headline(row.question_text),
                stem: row.question_text.trim(),
                options: options.map((o) => String(o).trim()),
                correctIndex,
                explanation: row.explanation.trim(),
                source: row.source || null,
            });
        }

        report.push(`  ${specialty.track}/${specialty.key}: ${rows.length} selected`);
    }

    const slugs = new Set();
    for (const q of picked) {
        if (slugs.has(q.slug)) throw new Error(`Duplicate slug generated: ${q.slug}`);
        slugs.add(q.slug);
    }

    // How big each collection is in the bank as a whole, not just in the
    // published sample. The /past-papers pages state these totals, and this is
    // the only place they can come from without giving the web build a
    // database connection.
    const { collectionRows, bankTotal } = await loadTotals();
    const publishedPerSource = picked.reduce((acc, q) => {
        acc[q.source] = (acc[q.source] || 0) + 1;
        return acc;
    }, {});
    const collections = collectionRows.map((row) => ({
        source: row.source,
        track: row.track,
        total: row.total,
        published: publishedPerSource[row.source] || 0,
    }));

    const payload = {
        generatedAt: new Date().toISOString().slice(0, 10),
        perSpecialty: PER_SPECIALTY,
        minExplanation: MIN_EXPLANATION,
        count: picked.length,
        bankTotal,
        collections,
        questions: picked,
    };

    console.log(report.join('\n'));
    console.log(`\n${picked.length} questions selected across ${SPECIALTIES.length} specialties.`);
    console.log(`Payload: ${(JSON.stringify(payload).length / 1024).toFixed(0)} KB`);

    if (!APPLY) {
        console.log(`\nDRY RUN — nothing written. Re-run with --apply to write:\n  ${OUT_PATH}`);
        return;
    }

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`\nWrote ${OUT_PATH}`);
}

main()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => db.end());
