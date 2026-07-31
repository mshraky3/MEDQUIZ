/**
 * Split the nursing bank's single `NursingEMS` source into the two sources the
 * material actually has, mirroring how the medical bank is split.
 *
 * The nursing questions came from one document published in two editions:
 *   - "المراجعة النهائية Final July EMS.pdf"            — 293 pages, Q1–1164
 *   - "المراجعة_النهائية_كامل_مع_تحديث_سبتمبر_EMS.pdf"  — 337 pages, Q1–1456
 * The September edition is the July one verbatim plus an appended block starting
 * at Q1165. That boundary is the only real division in the material, and it is
 * the one the two sources encode:
 *
 *   NursingMostRepeated — Q1–1164, the غيث questions (the core, most-repeated bank)
 *   NursingConfirmed    — Q1165–1456, the block added in the September edition
 *
 * The classification itself is not recomputed here: it lives in the bank file
 * (JSON/Nursing/nursingBank.json), where every question carries its `source`.
 * This script just pushes that field onto the rows already in the DB, matching
 * on question_text within track='nursing' the same way the importer de-dupes.
 *
 * It is idempotent and safe to re-run: a row already on the right source is
 * counted as unchanged.
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/splitNursingSources.js            # dry run: shows the plan
 *   node scripts/splitNursingSources.js --apply    # execute
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NURSING } from '../config/tracks.js';

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

const MOST_REPEATED = 'NursingMostRepeated';
const CONFIRMED = 'NursingConfirmed';
const NURSING_SOURCES = [MOST_REPEATED, CONFIRMED];
const LEGACY_NURSING_SOURCE = 'NursingEMS';

/**
 * Same list as insertNursingContent.js. Historical quiz sessions still carry the
 * retired medical collections and the legacy nursing label, so every one of them
 * has to stay in the CHECK or ADD CONSTRAINT fails to validate.
 */
const ALL_SESSION_SOURCES = [
    'general', 'Midgard', 'GameBoy',
    'October25', 'November25', 'December25',
    'January25', 'FebMarApr25',
    'MidgardGameBoy', 'May26', 'June26',
    LEGACY_NURSING_SOURCE, ...NURSING_SOURCES,
];

function loadBank() {
    const file = path.join(__dirname, '..', '..', 'JSON', 'Nursing', 'nursingBank.json');
    if (!fs.existsSync(file)) {
        console.error(`ERROR: bank file not found at ${file}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function main() {
    const client = await pool.connect();
    try {
        console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes). Pass --apply to execute ===');

        // ---- build the text -> source map from the bank ----------------------
        const bank = loadBank();
        const wanted = new Map();
        let untagged = 0;
        for (const q of bank) {
            const text = (q.question_text ?? '').toString().trim();
            const src = (q.source ?? '').toString().trim();
            if (!text) continue;
            if (!NURSING_SOURCES.includes(src)) { untagged++; continue; }
            wanted.set(text, src);
        }
        console.log(`\nBank: ${bank.length} questions, ${wanted.size} tagged` +
            (untagged ? `, ${untagged} untagged (skipped)` : ''));
        const bankCounts = {};
        wanted.forEach((s) => { bankCounts[s] = (bankCounts[s] || 0) + 1; });
        Object.entries(bankCounts).sort((a, b) => b[1] - a[1])
            .forEach(([s, n]) => console.log(`   ${s.padEnd(24)} ${n}`));

        // ---- compare against what is in the DB -------------------------------
        const rows = (await client.query(
            `SELECT id, question_text, source FROM questions WHERE track = $1`, [NURSING])).rows;
        console.log(`\nNursing rows in DB: ${rows.length}`);

        const before = {};
        rows.forEach((r) => { before[r.source] = (before[r.source] || 0) + 1; });
        console.log('Current sources:');
        Object.entries(before).sort((a, b) => b[1] - a[1])
            .forEach(([s, n]) => console.log(`   ${String(s).padEnd(24)} ${n}`));

        const updates = [];   // rows whose source has to change
        let alreadyRight = 0;
        const unknown = [];   // DB rows with no matching bank entry
        for (const r of rows) {
            const target = wanted.get((r.question_text ?? '').trim());
            if (!target) { unknown.push(r); continue; }
            if (r.source === target) { alreadyRight++; continue; }
            updates.push({ id: r.id, source: target });
        }

        const planned = {};
        updates.forEach((u) => { planned[u.source] = (planned[u.source] || 0) + 1; });
        console.log(`\nTo update: ${updates.length}   already correct: ${alreadyRight}   ` +
            `no bank match: ${unknown.length}`);
        Object.entries(planned).sort((a, b) => b[1] - a[1])
            .forEach(([s, n]) => console.log(`   -> ${s.padEnd(21)} ${n}`));

        // A row we cannot classify keeps whatever source it has. If that is the
        // legacy label it stays visible in analytics under the old name, which is
        // wrong but harmless — worth surfacing rather than guessing a source.
        if (unknown.length) {
            console.warn(`\n! ${unknown.length} nursing row(s) are not in the bank file and keep their current source:`);
            unknown.slice(0, 10).forEach((r) =>
                console.warn(`   [${r.source}] ${r.question_text.slice(0, 90)}`));
            if (unknown.length > 10) console.warn(`   ... and ${unknown.length - 10} more`);
        }

        if (!APPLY) {
            console.log('\nWould widen the user_quiz_sessions source constraint to accept ' +
                NURSING_SOURCES.join(', '));
            console.log('\nDry run complete. Re-run with --apply to execute.');
            return;
        }

        // ---- 1. constraint first ---------------------------------------------
        // Questions and sessions are separate tables, but /quiz-sessions copies a
        // question's source onto the session row, so the constraint has to accept
        // the new labels before any relabelled question can be answered.
        console.log('\n[1/2] Widening user_quiz_sessions source constraint...');
        await client.query(`ALTER TABLE user_quiz_sessions DROP CONSTRAINT IF EXISTS check_valid_quiz_source`);
        const list = ALL_SESSION_SOURCES.map((s) => `'${s}'`).join(', ');
        await client.query(
            `ALTER TABLE user_quiz_sessions ADD CONSTRAINT check_valid_quiz_source CHECK (source IN (${list}))`);
        console.log(`   ✓ constraint accepts ${ALL_SESSION_SOURCES.length} sources`);

        // ---- 2. relabel the questions ----------------------------------------
        console.log(`\n[2/2] Relabelling ${updates.length} question(s)...`);
        if (updates.length) {
            // One statement per target source: the id lists are small enough to
            // pass whole and this keeps the write to a single transaction.
            await client.query('BEGIN');
            try {
                for (const src of NURSING_SOURCES) {
                    const ids = updates.filter((u) => u.source === src).map((u) => u.id);
                    if (!ids.length) continue;
                    const res = await client.query(
                        `UPDATE questions SET source = $1 WHERE id = ANY($2::int[]) AND track = $3`,
                        [src, ids, NURSING]);
                    console.log(`   ✓ ${src.padEnd(24)} ${res.rowCount}`);
                }
                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            }
        }

        // ---- verify ----------------------------------------------------------
        const after = await client.query(
            `SELECT source, COUNT(*)::int AS n FROM questions
             WHERE track = $1 GROUP BY source ORDER BY n DESC`, [NURSING]);
        console.log('\nFinal nursing questions by source:');
        after.rows.forEach((r) => console.log(`   ${String(r.source).padEnd(24)} ${r.n}`));

        const sessions = await client.query(
            `SELECT source, COUNT(*)::int AS n FROM user_quiz_sessions
             WHERE source = $1 GROUP BY source`, [LEGACY_NURSING_SOURCE]);
        if (sessions.rows.length) {
            // Deliberately left alone: a past session's source records which bank
            // it was taken against at the time, and NursingEMS is still labelled
            // in the frontend so it renders with a name rather than a raw key.
            console.log(`\nNote: ${sessions.rows[0].n} historical quiz session(s) remain on ` +
                `${LEGACY_NURSING_SOURCE} — left as-is on purpose.`);
        }

        console.log('\n✅ Nursing source split complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
