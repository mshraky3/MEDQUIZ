/**
 * Bulk insert December 2025 questions into the database.
 * Reads from all JSON files in ../../JSON/December/
 * 
 * Usage:
 *   With DATABASE_URL:
 *     DATABASE_URL=postgres://user:pass@host:port/db node scripts/insertDecemberQuestions.js
 *   With individual vars (same as backend):
 *     DBUSER=x DBHOST=x DBNAME=x DBPASSWORD=x DBPORT=x node scripts/insertDecemberQuestions.js
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

const SOURCE_KEY = 'December25';
const BATCH_SIZE = 100;

async function main() {
    const dirPath = path.join(__dirname, '..', '..', 'JSON', 'December');

    if (!fs.existsSync(dirPath)) {
        console.error(`ERROR: December directory not found at ${dirPath}`);
        process.exit(1);
    }

    // Read all JSON files from December directory
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON files in December directory.`);

    if (files.length === 0) {
        console.error('ERROR: No JSON files found in December directory.');
        process.exit(1);
    }

    // Load and merge all questions
    let allQuestions = [];
    let fileCount = 0;

    for (const file of files) {
        try {
            const filePath = path.join(dirPath, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (Array.isArray(data)) {
                allQuestions = allQuestions.concat(data);
                fileCount++;
            }
        } catch (err) {
            console.warn(`WARNING: Failed to parse ${file}: ${err.message}`);
        }
    }

    console.log(`Loaded ${allQuestions.length} total questions from ${fileCount} files.`);

    if (allQuestions.length === 0) {
        console.error('ERROR: No valid questions found in any file.');
        process.exit(1);
    }

    const client = await pool.connect();
    const skippedQuestions = [];

    try {
        // Update the source constraint to allow December25
        console.log('Updating source constraints...');

        // Drop old constraints if they exist
        await client.query(`
            ALTER TABLE questions 
            DROP CONSTRAINT IF EXISTS check_valid_source
        `).catch(() => { });

        await client.query(`
            ALTER TABLE user_quiz_sessions 
            DROP CONSTRAINT IF EXISTS check_valid_quiz_source
        `).catch(() => { });

        // Add new constraints with December25 included
        await client.query(`
            ALTER TABLE user_quiz_sessions 
            ADD CONSTRAINT check_valid_quiz_source 
            CHECK (source IN ('general', 'Midgard', 'GameBoy', 'October25', 'December25'))
        `).catch(err => {
            console.log('Constraint already exists or error:', err.message);
        });

        // Check how many December25 questions already exist
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
                    await client.end();
                    await pool.end();
                    process.exit(0);
                }
            }
        }

        // Validate and prepare questions
        const validQuestions = [];
        const validTypes = ['pediatric', 'obstetrics and gynecology', 'medicine', 'surgery'];

        for (let i = 0; i < allQuestions.length; i++) {
            const q = allQuestions[i];

            // Validate question_type
            if (!validTypes.includes(q.question_type)) {
                skippedQuestions.push({
                    index: i,
                    reason: `Invalid question_type: ${q.question_type}`
                });
                continue;
            }

            // Validate correct_option exists in options
            const options = [q.option1, q.option2, q.option3, q.option4];
            if (!options.includes(q.correct_option)) {
                skippedQuestions.push({
                    index: i,
                    reason: `correct_option '${q.correct_option}' not found in options`
                });
                continue;
            }

            validQuestions.push(q);
        }

        console.log(`Validated: ${validQuestions.length} questions, Skipped: ${skippedQuestions.length}`);

        if (skippedQuestions.length > 0) {
            console.log('Skipped questions:', skippedQuestions);
        }

        // Insert in batches
        let insertedCount = 0;
        let errorCount = 0;

        for (let i = 0; i < validQuestions.length; i += BATCH_SIZE) {
            const batch = validQuestions.slice(i, i + BATCH_SIZE);

            for (const q of batch) {
                try {
                    await client.query(
                        `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [q.question_text, q.option1, q.option2, q.option3, q.option4, q.question_type, q.correct_option, SOURCE_KEY]
                    );
                    insertedCount++;
                } catch (err) {
                    console.warn(`Error inserting question: ${err.message}`);
                    errorCount++;
                }
            }

            console.log(`Progress: ${Math.min(i + BATCH_SIZE, validQuestions.length)} / ${validQuestions.length} inserted...`);
        }

        console.log(`\n✓ Insertion complete!`);
        console.log(`  Total inserted: ${insertedCount}`);
        console.log(`  Total errors: ${errorCount}`);
        console.log(`  Total skipped: ${skippedQuestions.length}`);

    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    } finally {
        await client.end();
        await pool.end();
    }
}

main();
