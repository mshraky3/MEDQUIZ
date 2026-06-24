/**
 * One-time/idempotent: create the summaries tables and sync the authored HTML
 * content into the DB (same effect as app.js ensureSummariesTables, but runnable
 * standalone without booting the server / touching port 3000). Safe to re-run.
 *
 * Usage (from backend/): node scripts/initSummaries.js
 */
import dotenv from 'dotenv';
import pg from 'pg';
import summaryContent from '../content/summaryHtml/index.js';

dotenv.config();
const { Pool } = pg;

function buildPool() {
    if (process.env.DATABASE_URL) {
        return new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    }
    return new Pool({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT || 5432,
        ssl: { rejectUnauthorized: false },
    });
}

async function main() {
    const db = buildPool();
    await db.query(`
        CREATE TABLE IF NOT EXISTS summaries (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(80) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            title_en VARCHAR(255),
            question_type VARCHAR(80) NOT NULL,
            description TEXT,
            page_count INTEGER DEFAULT 0,
            r2_prefix VARCHAR(255) NOT NULL,
            is_published BOOLEAN DEFAULT TRUE,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    await db.query(`
        CREATE TABLE IF NOT EXISTS summary_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            summary_id INTEGER NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
            last_page INTEGER DEFAULT 1,
            max_page_reached INTEGER DEFAULT 1,
            completed BOOLEAN DEFAULT FALSE,
            first_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, summary_id)
        )`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_summary_progress_user ON summary_progress(user_id)`);
    await db.query(`ALTER TABLE summaries ADD COLUMN IF NOT EXISTS content_html TEXT`);

    await db.query(`
        INSERT INTO summaries (slug, title, title_en, question_type, description, r2_prefix, sort_order)
        VALUES
            ('surgery', 'ملخص الجراحة', 'Surgery Summary', 'surgery',
             'ملخص شامل لأهم مواضيع الجراحة عالية العائد في اختبار SMLE.', 'summaries/surgery/', 1),
            ('pediatrics', 'ملخص طب الأطفال', 'Pediatrics Summary', 'pediatric',
             'ملخص شامل لأهم مواضيع طب الأطفال عالية العائد في اختبار SMLE.', 'summaries/pediatrics/', 2),
            ('medicine', 'ملخص الباطنة', 'Medicine Summary', 'medicine',
             'ملخص شامل لأهم مواضيع الباطنة عالية العائد في اختبار SMLE.', 'summaries/medicine/', 3),
            ('obgyn', 'ملخص النساء والولادة', 'OB/GYN Summary', 'obstetrics and gynecology',
             'ملخص شامل لأهم مواضيع النساء والولادة عالية العائد في اختبار SMLE.', 'summaries/obgyn/', 4)
        ON CONFLICT (slug) DO NOTHING`);

    for (const [slug, html] of Object.entries(summaryContent)) {
        await db.query(`UPDATE summaries SET content_html = $1, updated_at = NOW() WHERE slug = $2`, [html, slug]);
    }

    const check = await db.query(
        `SELECT slug, question_type, page_count, length(content_html) AS html_len, is_published
         FROM summaries ORDER BY sort_order`
    );
    console.log('summaries rows:');
    check.rows.forEach((r) =>
        console.log(`  ${r.slug.padEnd(12)} type=${r.question_type.padEnd(10)} html=${r.html_len || 0} bytes published=${r.is_published}`)
    );
    await db.end();
    console.log('✅ initSummaries done.');
}

main().catch((e) => { console.error('❌ initSummaries failed:', e); process.exit(1); });
