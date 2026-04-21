/**
 * Bulk insert October 2025 questions into the database.
 * 
 * Usage:
 *   With DATABASE_URL:
 *     DATABASE_URL=postgres://user:pass@host:port/db node scripts/insertOctober25Questions.js
 *   With individual vars (same as backend):
 *     DBUSER=x DBHOST=x DBNAME=x DBPASSWORD=x DBPORT=x node scripts/insertOctober25Questions.js
 * 
 * Reads from ../../Q/unified_questions_october25.json
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let poolConfig;
if (process.env.DATABASE_URL) {
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
} else if (process.env.DBUSER && process.env.DBHOST && process.env.DBNAME && process.env.DBPASSWORD) {
    poolConfig = {
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT || 5432,
        ssl: { rejectUnauthorized: false }
    };
} else {
    console.error('ERROR: Set DATABASE_URL or DBUSER/DBHOST/DBNAME/DBPASSWORD/DBPORT env vars.');
    process.exit(1);
}

const pool = new Pool(poolConfig);

const SOURCE_KEY = 'October25';
const BATCH_SIZE = 100;

async function main() {
    const filePath = path.join(__dirname, '..', '..', 'Q', 'unified_questions_october25.json');

    if (!fs.existsSync(filePath)) {
        console.error(`ERROR: Questions file not found at ${filePath}`);
        process.exit(1);
    }

    const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Loaded ${questions.length} questions from file.`);

    const client = await pool.connect();
    const skippedQuestions = []; // Array to store skipped questions

    try {
        // Update the source constraint to allow the new source
        console.log('Updating source constraints...');

        // Drop old constraint if it exists and add updated one
        await client.query(`
            ALTER TABLE questions 
            DROP CONSTRAINT IF EXISTS check_valid_source
        `);

        await client.query(`
            ALTER TABLE user_quiz_sessions 
            DROP CONSTRAINT IF EXISTS check_valid_quiz_source
        `);

        await client.query(`
            ALTER TABLE user_quiz_sessions 
            ADD CONSTRAINT check_valid_quiz_source 
            CHECK (source IN ('general', 'Midgard', 'GameBoy', 'October25'))
        `).catch(() => {
            console.log('Quiz session constraint already updated or does not exist.');
        });

        // Check how many October25 questions already exist
        const existingResult = await client.query(
            `SELECT COUNT(*) FROM questions WHERE source = $1`,
            [SOURCE_KEY]
        );
        const existingCount = parseInt(existingResult.rows[0].count);

        if (existingCount > 0) {
            console.log(`WARNING: ${existingCount} questions with source '${SOURCE_KEY}' already exist.`);
            if (!process.argv.includes('--force')) {
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                const answer = await new Promise(resolve => {
                    rl.question('Continue inserting? (y/n): ', resolve);
                });
                rl.close();
                if (answer.toLowerCase() !== 'y') {
                    console.log('Aborted.');
                    return;
                }
            } else {
                console.log('--force flag set, continuing...');
            }
        }

        // Insert questions in batches
        let inserted = 0;
        let skipped = 0;

        for (let i = 0; i < questions.length; i += BATCH_SIZE) {
            const batch = questions.slice(i, i + BATCH_SIZE);

            await client.query('BEGIN');

            for (const q of batch) {
                try {
                    // Check for duplicate by question_text
                    const dupCheck = await client.query(
                        `SELECT id FROM questions WHERE question_text = $1 LIMIT 1`,
                        [q.question_text]
                    );

                    if (dupCheck.rows.length > 0) {
                        skipped++;
                        skippedQuestions.push({
                            ...q,
                            reason: 'duplicate_question_text',
                            timestamp: new Date().toISOString()
                        });
                        continue;
                    }

                    await client.query(
                        `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            q.question_text,
                            q.option1,
                            q.option2,
                            q.option3,
                            q.option4,
                            q.question_type,
                            q.correct_option,
                            SOURCE_KEY
                        ]
                    );
                    inserted++;
                } catch (err) {
                    console.error(`Error inserting question: ${err.message}`);
                    skipped++;
                    skippedQuestions.push({
                        ...q,
                        reason: 'insert_error',
                        error: err.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            await client.query('COMMIT');
            console.log(`Progress: ${Math.min(i + BATCH_SIZE, questions.length)}/${questions.length} processed (${inserted} inserted, ${skipped} skipped)`);
        }

        // Get final count
        const totalResult = await client.query(`SELECT COUNT(*) FROM questions`);
        const totalQuestions = parseInt(totalResult.rows[0].count);

        console.log('\n--- Summary ---');
        console.log(`Inserted: ${inserted}`);
        console.log(`Skipped (duplicates/errors): ${skipped}`);
        console.log(`Total questions in DB: ${totalQuestions}`);

        // Write skipped questions to JSON file
        if (skippedQuestions.length > 0) {
            const outputPath = path.join(__dirname, '..', '..', 'Q', 'skipped_questions_october25.json');
            fs.writeFileSync(outputPath, JSON.stringify(skippedQuestions, null, 2));
            console.log(`\nSkipped questions saved to: ${outputPath} (${skippedQuestions.length} questions)`);
        }

    } catch (err) {
        await client.query('ROLLBACK').catch(() => { });
        console.error('ERROR:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
