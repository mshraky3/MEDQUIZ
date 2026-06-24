/**
 * One-time: render the topic-summary PDFs in ../../summarys/ to per-page WebP
 * images, upload them privately to R2, store the source PDF (never served), and
 * update the `summaries` table (page_count, r2_prefix). NEVER deployed/run on
 * serverless — run locally after the R2 keys are in backend/.env.
 *
 * Why images (not the raw PDF): the requirement is "no one can download". We
 * never expose a PDF or public URL; pages are streamed per-request through the
 * authenticated API and rendered in a watermarked in-app viewer.
 *
 * Usage (from backend/):
 *   node scripts/uploadSummaries.js                # render + upload to R2 + update DB
 *   node scripts/uploadSummaries.js --scale 2.5    # higher-res pages (default 2.0)
 *   node scripts/uploadSummaries.js --local        # render to summarys/_rendered/ only (no R2/DB)
 *
 * Deps (dev-only, install once): npm i -D pdfjs-dist @napi-rs/canvas sharp
 */
import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SUMMARYS_DIR = path.join(__dirname, '..', '..', 'summarys');

const args = process.argv.slice(2);
const LOCAL_ONLY = args.includes('--local');
const scaleArg = args.indexOf('--scale');
const SCALE = scaleArg !== -1 ? parseFloat(args[scaleArg + 1]) : 2.0;

// slug → source file + metadata (slugs/types match the seed in app.js)
const DECKS = [
    { slug: 'surgery', file: 'Surgical_Summary.pdf', question_type: 'surgery', title: 'ملخص الجراحة', title_en: 'Surgery Summary' },
    { slug: 'pediatrics', file: 'Pediatrics SMLE Summary.pdf', question_type: 'pediatric', title: 'ملخص طب الأطفال', title_en: 'Pediatrics Summary' },
];

const pad3 = (n) => String(n).padStart(3, '0');

function buildPool() {
    if (process.env.DATABASE_URL) {
        return new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    }
    if (process.env.DBUSER && process.env.DBHOST && process.env.DBNAME && process.env.DBPASSWORD) {
        return new Pool({
            user: process.env.DBUSER,
            host: process.env.DBHOST,
            database: process.env.DBNAME,
            password: process.env.DBPASSWORD,
            port: process.env.DBPORT || 5432,
            ssl: { rejectUnauthorized: false },
        });
    }
    return null;
}

/** Render every page of a PDF to an array of WebP buffers. */
async function renderPdfToWebp(pdfPath, scale) {
    const { createCanvas } = await import('@napi-rs/canvas');
    const sharp = (await import('sharp')).default;
    // Legacy build runs without a DOM / web worker (ideal for Node).
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjs.getDocument({ data, useSystemFonts: true, isEvalSupported: false }).promise;

    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;
        const png = canvas.toBuffer('image/png');
        const webp = await sharp(png).webp({ quality: 82 }).toBuffer();
        pages.push(webp);
        process.stdout.write(`\r   rendering page ${i}/${pdf.numPages}`);
    }
    process.stdout.write('\n');
    return pages;
}

async function main() {
    let r2 = null;
    if (!LOCAL_ONLY) {
        r2 = await import('../services/r2Service.js');
        if (!r2.isR2Configured()) {
            console.error('ERROR: R2 not configured. Set R2_ENDPOINT/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY in backend/.env,');
            console.error('       or pass --local to render to summarys/_rendered/ without uploading.');
            process.exit(1);
        }
    }

    const pool = LOCAL_ONLY ? null : buildPool();
    if (!LOCAL_ONLY && !pool) {
        console.error('ERROR: No DB credentials (DBUSER/DBHOST/DBNAME/DBPASSWORD or DATABASE_URL).');
        process.exit(1);
    }

    for (const deck of DECKS) {
        const pdfPath = path.join(SUMMARYS_DIR, deck.file);
        if (!fs.existsSync(pdfPath)) {
            console.warn(`SKIP ${deck.slug}: file not found — ${pdfPath}`);
            continue;
        }
        console.log(`\n▶ ${deck.slug} — rendering ${deck.file} @ scale ${SCALE}`);
        const pages = await renderPdfToWebp(pdfPath, SCALE);
        const prefix = `summaries/${deck.slug}/`;

        if (LOCAL_ONLY) {
            const outDir = path.join(SUMMARYS_DIR, '_rendered', deck.slug);
            fs.mkdirSync(outDir, { recursive: true });
            pages.forEach((buf, idx) => fs.writeFileSync(path.join(outDir, `page-${pad3(idx + 1)}.webp`), buf));
            console.log(`   ✓ wrote ${pages.length} pages → ${outDir}`);
            continue;
        }

        // Upload page images + the source PDF (private master, never served).
        for (let i = 0; i < pages.length; i++) {
            await r2.putObject(`${prefix}page-${pad3(i + 1)}.webp`, pages[i], 'image/webp');
            process.stdout.write(`\r   uploading page ${i + 1}/${pages.length}`);
        }
        process.stdout.write('\n');
        await r2.putObject(`${prefix}source.pdf`, fs.readFileSync(pdfPath), 'application/pdf');

        // Upsert the summaries row with the real page count.
        await pool.query(
            `INSERT INTO summaries (slug, title, title_en, question_type, r2_prefix, page_count, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (slug) DO UPDATE SET
                page_count = EXCLUDED.page_count,
                r2_prefix = EXCLUDED.r2_prefix,
                updated_at = NOW()`,
            [deck.slug, deck.title, deck.title_en, deck.question_type, prefix, pages.length]
        );
        console.log(`   ✓ uploaded ${pages.length} pages to R2 (${prefix}) and updated DB`);
    }

    if (pool) await pool.end();
    console.log('\n✅ Done.');
}

main().catch((err) => {
    console.error('\n❌ uploadSummaries failed:', err);
    process.exit(1);
});
