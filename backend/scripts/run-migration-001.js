/**
 * One-shot runner for migration 001 (payment & subscription readiness).
 *
 *   node scripts/run-migration-001.js
 *
 * Idempotent: the SQL uses IF NOT EXISTS guards and only grandfathers accounts
 * that have not been grandfathered yet. Safe to re-run. Reads DB creds from
 * backend/.env (same vars the app uses).
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const sqlPath = join(__dirname, '..', 'migrations', '001_payment_subscription_prep.sql');
const sql = readFileSync(sqlPath, 'utf8');

const pool = new pg.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false },
    max: 1,
});

(async () => {
    const client = await pool.connect();
    try {
        console.log(`Applying migration: ${sqlPath}`);
        await client.query(sql);
        const counts = await client.query(
            `SELECT subscription_status, COUNT(*)::int AS n
             FROM accounts GROUP BY subscription_status ORDER BY n DESC`
        );
        console.log('✅ Migration applied. Account subscription_status breakdown:');
        console.table(counts.rows);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
})();
