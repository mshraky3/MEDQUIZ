import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function createFinalQuizAttempts() {
    try {
        console.log('Creating final_quiz_attempts table...');
        
        // Create the final_quiz_attempts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS final_quiz_attempts (
                id SERIAL PRIMARY KEY,
                session_id INTEGER NOT NULL REFERENCES final_review_sessions(id) ON DELETE CASCADE,
                question_id INTEGER NOT NULL,
                user_answer VARCHAR(255) NOT NULL,
                correct_answer VARCHAR(255) NOT NULL,
                is_correct BOOLEAN NOT NULL,
                time_taken INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Add indexes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_quiz_attempts_session_id 
            ON final_quiz_attempts(session_id)
        `);
        
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_quiz_attempts_question_id 
            ON final_quiz_attempts(question_id)
        `);
        
        console.log('✅ Successfully created final_quiz_attempts table with indexes');
        
    } catch (error) {
        console.error('❌ Error creating final_quiz_attempts table:', error);
    } finally {
        await pool.end();
    }
}

createFinalQuizAttempts();

export default createFinalQuizAttempts;
