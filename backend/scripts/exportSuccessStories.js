/**
 * Export approved success stories to a committed JSON file.
 *
 * Same arrangement as exportPublicQuestions.js, and for the same reason: the
 * public site is prerendered, so anything a crawler should see has to exist at
 * build time. It also means publishing a testimonial is a deliberate act with a
 * diff attached — an admin approving a story does not put it on the internet;
 * running this and committing the result does.
 *
 * Only rows that are BOTH approved and carry recorded consent are exported.
 * Both conditions, every time, no flag to skip them.
 *
 *   node scripts/exportSuccessStories.js            # dry run, prints what it would write
 *   node scripts/exportSuccessStories.js --apply    # writes the JSON file
 *
 * Writing an empty list is a valid outcome and clears the page: if every story
 * is withdrawn, the next build simply stops emitting /success-stories rather
 * than leaving a page quoting people who have asked to be removed.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(scriptDir, '../../my-react-app/src/seo/data/successStories.json');

const apply = process.argv.includes('--apply');

function buildPool() {
    return new Pool({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT || 5432,
        ssl: { rejectUnauthorized: false },
    });
}

async function main() {
    const db = buildPool();
    try {
        const { rows } = await db.query(`
            SELECT id, display_name, track, specialty, exam_result, quote, lang, created_at
              FROM success_stories
             WHERE status = 'approved'
               AND consent_publish = TRUE
             ORDER BY created_at DESC
        `);

        const payload = {
            generatedAt: new Date().toISOString(),
            count: rows.length,
            stories: rows.map((r) => ({
                id: r.id,
                name: r.display_name,
                track: r.track,
                specialty: r.specialty || null,
                examResult: r.exam_result || null,
                quote: r.quote,
                lang: r.lang || 'ar',
                // Date only. The exact minute someone submitted a testimonial
                // is nobody's business and does not belong on a public page.
                date: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : null,
            })),
        };

        console.log(`Approved stories with consent on record: ${rows.length}`);
        for (const s of payload.stories) {
            console.log(`  - ${s.name} (${s.track})${s.examResult ? ` — ${s.examResult}` : ''}`);
        }

        if (!apply) {
            console.log('\nDry run. Re-run with --apply to write:');
            console.log(`  ${OUT_PATH}`);
            return;
        }

        fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
        fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        console.log(`\nWrote ${OUT_PATH}`);
        console.log('Commit it, then rebuild — the page is emitted only when this file has entries.');
    } finally {
        await db.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
