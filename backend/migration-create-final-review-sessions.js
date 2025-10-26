import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const migrateCreateFinalReviewSessions = async () => {
    const pool = new Pool({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Creating final_review_sessions table...');
        
        // Create final_review_sessions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS final_review_sessions (
                id SERIAL PRIMARY KEY,
                session_id UUID DEFAULT gen_random_uuid(),
                user_id INTEGER NOT NULL,
                question_type VARCHAR(100) NOT NULL,
                source VARCHAR(100) NOT NULL,
                total_questions INTEGER NOT NULL,
                correct_answers INTEGER NOT NULL,
                score DECIMAL(5,2) NOT NULL,
                time_taken INTEGER NOT NULL,
                time_limit INTEGER NOT NULL,
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_time TIMESTAMP,
                session_metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE
            )
        `);

        // Create indexes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_review_sessions_user_id 
            ON final_review_sessions(user_id)
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_review_sessions_start_time 
            ON final_review_sessions(start_time)
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_review_sessions_question_type 
            ON final_review_sessions(question_type)
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_final_review_sessions_source 
            ON final_review_sessions(source)
        `);

        console.log('✅ final_review_sessions table created successfully');
        
    } catch (error) {
        console.error('❌ Error creating final_review_sessions table:', error);
        throw error;
    } finally {
        await pool.end();
    }
};

export default migrateCreateFinalReviewSessions;
