// Database migration script to convert all existing usernames and passwords to lowercase
// Run this once to update all existing accounts in the database

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

async function migrateToLowercase() {
    try {
        console.log('🔄 Starting migration to convert usernames and passwords to lowercase...');
        
        // Get all accounts
        const result = await db.query('SELECT id, username, password FROM accounts');
        const accounts = result.rows;
        
        console.log(`📊 Found ${accounts.length} accounts to migrate`);
        
        let updatedCount = 0;
        let skippedCount = 0;
        
        for (const account of accounts) {
            const originalUsername = account.username;
            const originalPassword = account.password;
            
            const lowercaseUsername = originalUsername.toLowerCase();
            const lowercasePassword = originalPassword.toLowerCase();
            
            // Check if conversion is needed
            if (originalUsername === lowercaseUsername && originalPassword === lowercasePassword) {
                skippedCount++;
                continue;
            }
            
            try {
                // Check if lowercase username already exists (conflict)
                const existingCheck = await db.query(
                    'SELECT id FROM accounts WHERE username = $1 AND id != $2',
                    [lowercaseUsername, account.id]
                );
                
                if (existingCheck.rows.length > 0) {
                    console.log(`⚠️  Skipping account ID ${account.id}: lowercase username "${lowercaseUsername}" already exists`);
                    skippedCount++;
                    continue;
                }
                
                // Update the account
                await db.query(
                    'UPDATE accounts SET username = $1, password = $2 WHERE id = $3',
                    [lowercaseUsername, lowercasePassword, account.id]
                );
                
                console.log(`✅ Updated account ID ${account.id}: "${originalUsername}" → "${lowercaseUsername}"`);
                updatedCount++;
                
            } catch (error) {
                console.error(`❌ Error updating account ID ${account.id}:`, error.message);
            }
        }
        
        console.log('\n📈 Migration Summary:');
        console.log(`✅ Successfully updated: ${updatedCount} accounts`);
        console.log(`⏭️  Skipped (no changes needed or conflicts): ${skippedCount} accounts`);
        console.log(`📊 Total processed: ${accounts.length} accounts`);
        
        if (updatedCount > 0) {
            console.log('\n🎉 Migration completed successfully!');
            console.log('💡 All usernames and passwords are now in lowercase.');
        } else {
            console.log('\n✨ No accounts needed updating - all were already lowercase!');
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await db.end();
    }
}

// Run the migration
migrateToLowercase();
