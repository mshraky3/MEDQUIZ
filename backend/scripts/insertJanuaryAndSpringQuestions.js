/**
 * Bulk insert January 2026 and February-April 2026 questions into the database.
 * Reads from JSON files in ../../JSON/January26/ and ../../JSON/Feb&Mar&April26/
 * Maps source values: "January/26" -> "January25", "Feb&Mar&April/26" -> "FebMarApr25"
 * 
 * Usage:
 *   With DATABASE_URL:
 *     DATABASE_URL=postgres://user:pass@host:port/db node scripts/insertJanuaryAndSpringQuestions.js
 *   With individual vars (same as backend):
 *     DBUSER=x DBHOST=x DBNAME=x DBPASSWORD=x DBPORT=x node scripts/insertJanuaryAndSpringQuestions.js
 *
 * Options:
 *   --force : Skip confirmation prompts if duplicates exist
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
const BATCH_SIZE = 100;

// Source mapping configuration
const SOURCES = [
    {
        folderName: 'January26',
        folderPath: path.join(__dirname, '..', '..', 'JSON', 'January26'),
        sourceKey: 'January25',
        sourceValue: 'January/26'
    },
    {
        folderName: 'Feb&Mar&April26',
        folderPath: path.join(__dirname, '..', '..', 'JSON', 'Feb&Mar&April26'),
        sourceKey: 'FebMarApr25',
        sourceValue: 'Feb&Mar&April/26'
    }
];

async function main() {
    const client = await pool.connect();
    const allQuestionsToInsert = [];
    let totalFilesLoaded = 0;

    try {
        // Load questions from both folders
        for (const source of SOURCES) {
            console.log(`\n📂 Loading ${source.folderName}...`);

            if (!fs.existsSync(source.folderPath)) {
                console.error(`ERROR: Directory not found at ${source.folderPath}`);
                process.exit(1);
            }

            const files = fs.readdirSync(source.folderPath).filter(f => f.endsWith('.json'));
            console.log(`   Found ${files.length} JSON files`);

            if (files.length === 0) {
                console.error(`ERROR: No JSON files found in ${source.folderName}.`);
                process.exit(1);
            }

            let sourceQuestions = [];
            let sourceFileCount = 0;

            for (const file of files) {
                try {
                    const filePath = path.join(source.folderPath, file);
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    if (Array.isArray(data)) {
                        sourceQuestions = sourceQuestions.concat(data);
                        sourceFileCount++;
                    }
                } catch (err) {
                    console.warn(`   WARNING: Failed to parse ${file}: ${err.message}`);
                }
            }

            console.log(`   Loaded ${sourceQuestions.length} questions from ${sourceFileCount} files`);

            // Add source mapping for each question
            for (const q of sourceQuestions) {
                allQuestionsToInsert.push({
                    ...q,
                    mappedSource: source.sourceKey
                });
            }

            totalFilesLoaded += sourceFileCount;
        }

        console.log(`\n✅ Total loaded: ${allQuestionsToInsert.length} questions from ${totalFilesLoaded} files`);

        if (allQuestionsToInsert.length === 0) {
            console.error('ERROR: No valid questions found in any file.');
            process.exit(1);
        }

        // Update the source constraints to allow new collections
        console.log('\n🔧 Updating database constraints...');

        // Drop old constraints if they exist
        await client.query(`
            ALTER TABLE user_quiz_sessions 
            DROP CONSTRAINT IF EXISTS check_valid_quiz_source
        `).catch(() => { });

        // Add new constraints with all collections
        await client.query(`
            ALTER TABLE user_quiz_sessions 
            ADD CONSTRAINT check_valid_quiz_source 
            CHECK (source IN ('general', 'Midgard', 'GameBoy', 'October25', 'December25', 'November25', 'January25', 'FebMarApr25'))
        `).catch(err => {
            console.log('   Constraint update info:', err.message);
        });

        console.log('   ✓ Constraints updated');

        // Check for duplicates per source
        console.log('\n🔍 Checking for existing questions...');
        const existingCounts = {};
        let totalExisting = 0;

        for (const source of SOURCES) {
            const result = await client.query(
                `SELECT COUNT(*) FROM questions WHERE source = $1`,
                [source.sourceKey]
            );
            const count = parseInt(result.rows[0].count);
            existingCounts[source.sourceKey] = count;
            totalExisting += count;
            console.log(`   ${source.sourceKey}: ${count} existing questions`);
        }

        if (totalExisting > 0) {
            console.log(`\n⚠️  WARNING: ${totalExisting} questions already exist with these sources.`);
            if (!process.argv.includes('--force')) {
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                const answer = await new Promise(resolve => {
                    rl.question('Continue inserting anyway? (y/n): ', resolve);
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
        console.log('\n📋 Validating questions...');
        const validQuestions = [];
        const skippedQuestions = [];
        const validTypes = ['pediatric', 'obstetrics and gynecology', 'medicine', 'surgery'];
        const seenQuestions = new Set(); // Track duplicates

        for (let i = 0; i < allQuestionsToInsert.length; i++) {
            const q = allQuestionsToInsert[i];

            // Normalize potentially missing option fields to satisfy DB NOT NULL constraints.
            q.option1 = (q.option1 ?? '').toString().trim() || 'Option not recalled';
            q.option2 = (q.option2 ?? '').toString().trim() || 'Option not recalled';
            q.option3 = (q.option3 ?? '').toString().trim() || 'Option not recalled';
            q.option4 = (q.option4 ?? '').toString().trim() || 'Option not recalled';

            // Normalize text fields used in validation/insert.
            q.question_text = (q.question_text ?? '').toString().trim();
            q.correct_option = (q.correct_option ?? '').toString().trim();

            // Validate question_type
            if (!validTypes.includes(q.question_type)) {
                skippedQuestions.push({
                    index: i,
                    reason: `Invalid question_type: ${q.question_type}`,
                    source: q.mappedSource
                });
                continue;
            }

            // Validate correct_option exists in options
            const options = [q.option1, q.option2, q.option3, q.option4];
            if (!options.includes(q.correct_option)) {
                skippedQuestions.push({
                    index: i,
                    reason: `correct_option '${q.correct_option}' not found in options`,
                    source: q.mappedSource
                });
                continue;
            }

            // Check for duplicates (same question_text + source)
            const questionKey = `${q.question_text}::${q.mappedSource}`;
            if (seenQuestions.has(questionKey)) {
                skippedQuestions.push({
                    index: i,
                    reason: 'Duplicate in loaded files',
                    source: q.mappedSource
                });
                continue;
            }

            seenQuestions.add(questionKey);
            validQuestions.push(q);
        }

        console.log(`   ✓ Validated: ${validQuestions.length} questions`);
        console.log(`   ⏭️  Skipped (validation): ${skippedQuestions.length}`);

        if (skippedQuestions.length > 0 && skippedQuestions.length <= 10) {
            console.log('   Skipped details:', skippedQuestions);
        }

        // Insert in batches with duplicate detection from DB
        console.log('\n💾 Inserting questions...');
        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const sourceStats = { 'January25': 0, 'FebMarApr25': 0 };

        for (let i = 0; i < validQuestions.length; i += BATCH_SIZE) {
            const batch = validQuestions.slice(i, i + BATCH_SIZE);

            for (const q of batch) {
                try {
                    // Check if question already exists in DB (duplicate detection)
                    const existsResult = await client.query(
                        `SELECT id FROM questions WHERE question_text = $1 AND source = $2 LIMIT 1`,
                        [q.question_text, q.mappedSource]
                    );

                    if (existsResult.rows.length > 0) {
                        skippedCount++;
                        continue;
                    }

                    // Insert the question
                    await client.query(
                        `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [q.question_text, q.option1, q.option2, q.option3, q.option4, q.question_type, q.correct_option, q.mappedSource]
                    );

                    insertedCount++;
                    sourceStats[q.mappedSource]++;

                } catch (err) {
                    console.warn(`   ⚠️  Error inserting question: ${err.message}`);
                    errorCount++;
                }
            }

            const progress = Math.min(i + BATCH_SIZE, validQuestions.length);
            console.log(`   Progress: ${progress} / ${validQuestions.length} processed...`);
        }

        console.log(`\n✅ Insertion Complete!`);
        console.log(`   Inserted (January25): ${sourceStats['January25']}`);
        console.log(`   Inserted (FebMarApr25): ${sourceStats['FebMarApr25']}`);
        console.log(`   Total inserted: ${insertedCount}`);
        console.log(`   Skipped (duplicates in DB): ${skippedCount}`);
        console.log(`   Skipped (validation): ${skippedQuestions.length}`);
        console.log(`   Errors: ${errorCount}`);

    } catch (err) {
        console.error('ERROR:', err.message);
        console.error(err.stack);
        process.exit(1);
    } finally {
        await client.end();
        await pool.end();
    }
}

main();
