/**
 * Export (backup) all questions with source IN ('Midgard', 'GameBoy', 'general')
 * to local JSON files before they are removed from the website.
 *
 * Also prints tables referencing questions(id) so deletion can handle them.
 *
 * Usage: node scripts/exportOldSources.js
 * Reads DB config from backend/.env (same vars as app.js).
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

const SOURCES = ['Midgard', 'GameBoy', 'general'];
const OUT_DIR = path.join(__dirname, '..', '..', 'backups', 'old-question-bank-20260715');

async function main() {
    const client = await pool.connect();
    try {
        fs.mkdirSync(OUT_DIR, { recursive: true });

        // Overview of all sources in the DB
        const counts = await client.query(
            `SELECT source, COUNT(*) AS n FROM questions GROUP BY source ORDER BY n DESC`
        );
        console.log('Current questions by source:');
        counts.rows.forEach(r => console.log(`   ${r.source}: ${r.n}`));

        // Tables with FKs referencing questions(id)
        const fks = await client.query(`
            SELECT tc.table_name, kcu.column_name, rc.delete_rule
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.referential_constraints rc
              ON tc.constraint_name = rc.constraint_name
            JOIN information_schema.constraint_column_usage ccu
              ON rc.unique_constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'questions'
        `);
        console.log('\nTables referencing questions(id):');
        fks.rows.forEach(r => console.log(`   ${r.table_name}.${r.column_name} (ON DELETE ${r.delete_rule})`));

        // Export each old source in full
        let total = 0;
        for (const source of SOURCES) {
            const res = await client.query(
                `SELECT * FROM questions WHERE source = $1 ORDER BY id`,
                [source]
            );
            const file = path.join(OUT_DIR, `questions_${source}.json`);
            fs.writeFileSync(file, JSON.stringify(res.rows, null, 2), 'utf8');
            console.log(`\nExported ${res.rows.length} '${source}' questions -> ${file}`);
            total += res.rows.length;
        }
        console.log(`\nBackup complete: ${total} questions in ${OUT_DIR}`);
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(err => { console.error('ERROR:', err); process.exit(1); });
