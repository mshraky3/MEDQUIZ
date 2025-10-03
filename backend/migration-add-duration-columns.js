import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log('🔍 Checking current table structure...');
        
        // Check what columns exist
        const columnsCheck = await db.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'user_quiz_sessions'
            ORDER BY ordinal_position;
        `);
        
        console.log('📋 Current columns in user_quiz_sessions:');
        columnsCheck.rows.forEach(col => {
            console.log(`  - ${col.column_name} (${col.data_type}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
        });
        
        const columnNames = columnsCheck.rows.map(col => col.column_name);
        
        // Add duration column if it doesn't exist
        if (!columnNames.includes('duration')) {
            console.log('\n➕ Adding duration column...');
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN duration INTEGER DEFAULT 0;
            `);
            console.log('✅ Duration column added successfully!');
        } else {
            console.log('\n✓ Duration column already exists');
        }
        
        // Add avg_time_per_question column if it doesn't exist
        if (!columnNames.includes('avg_time_per_question')) {
            console.log('➕ Adding avg_time_per_question column...');
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN avg_time_per_question DECIMAL(10, 2) DEFAULT 0;
            `);
            console.log('✅ avg_time_per_question column added successfully!');
        } else {
            console.log('✓ avg_time_per_question column already exists');
        }
        
        // Verify the changes
        console.log('\n🔍 Verifying final table structure...');
        const finalCheck = await db.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'user_quiz_sessions'
            ORDER BY ordinal_position;
        `);
        
        console.log('📋 Final columns in user_quiz_sessions:');
        finalCheck.rows.forEach(col => {
            console.log(`  - ${col.column_name} (${col.data_type}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
        });
        
        // Check a recent quiz to see if it has duration data
        console.log('\n🔍 Checking recent quiz sessions...');
        const recentQuiz = await db.query(`
            SELECT id, user_id, total_questions, correct_answers, duration, avg_time_per_question, start_time
            FROM user_quiz_sessions 
            ORDER BY start_time DESC 
            LIMIT 5;
        `);
        
        console.log('📊 Recent quiz sessions:');
        recentQuiz.rows.forEach(quiz => {
            console.log(`  Quiz ID ${quiz.id}: duration=${quiz.duration}s, avg_time=${quiz.avg_time_per_question}s, time=${quiz.start_time}`);
        });
        
        console.log('\n✅ Migration completed successfully!');
        console.log('🔄 Now restart your backend server for the changes to take effect.');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
    } finally {
        await db.end();
        process.exit(0);
    }
}

migrate();

