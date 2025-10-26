import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false }
});

async function addQuestionIdsColumn() {
    try {
        console.log('Adding question_ids column to final_review_sessions table...');
        
        // Add question_ids column to store the IDs of questions used in the final quiz
        await pool.query(`
            ALTER TABLE final_review_sessions 
            ADD COLUMN IF NOT EXISTS question_ids INTEGER[] DEFAULT '{}'
        `);
        
        console.log('✅ Successfully added question_ids column to final_review_sessions table');
        
    } catch (error) {
        console.error('❌ Error adding question_ids column:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the migration
addQuestionIdsColumn()
    .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
