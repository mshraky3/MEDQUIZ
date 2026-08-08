/**
 * Export every row in `questions` to small JSON batch files (20-25 questions
 * each) so explanations can be filled in by hand, then re-imported later.
 *
 * Each question object includes all DB fields plus an empty "explanation"
 * field to be filled in.
 *
 * Usage (from backend/):
 *   node scripts/exportQuestionsForExplanations.js
 *
 * Output: ../exports/questions-explanations/batch-0001.json, batch-0002.json, ...
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;
const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT || 5432,
    ssl: { rejectUnauthorized: false }
});

const BATCH_SIZE = 20;
const OUT_DIR = path.join(__dirname, '..', '..', 'exports', 'questions-explanations');

async function main() {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, question_text, option1, option2, option3, option4,
                    question_type, correct_option, source, track
             FROM questions
             ORDER BY id`
        );
        const rows = res.rows;
        console.log(`Fetched ${rows.length} questions.`);

        fs.mkdirSync(OUT_DIR, { recursive: true });

        const totalBatches = Math.ceil(rows.length / BATCH_SIZE);
        for (let i = 0; i < totalBatches; i++) {
            const slice = rows.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            const batch = slice.map(r => ({
                id: r.id,
                question_text: r.question_text,
                option1: r.option1,
                option2: r.option2,
                option3: r.option3,
                option4: r.option4,
                correct_option: r.correct_option,
                question_type: r.question_type,
                source: r.source,
                track: r.track,
                explanation: ''
            }));
            const fileName = `batch-${String(i + 1).padStart(4, '0')}.json`;
            fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(batch, null, 2), 'utf8');
        }

        console.log(`Wrote ${totalBatches} batch files (${BATCH_SIZE} questions each) to ${OUT_DIR}`);
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
