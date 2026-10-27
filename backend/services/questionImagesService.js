/**
 * Question images and rebuilt tables ("clarification" pictures).
 *
 * Two additive tables (no change to `questions`):
 *   question_images       one row per picture or rebuilt table
 *   question_image_links  which questions show which picture (many to many)
 * Only rows with status 'approved' are ever served; 'draft' is for review.
 * Files live in the existing R2 bucket under `qimg/`, streamed by
 * routes/question-images.js. A table has no file: its rows are JSON.
 */

export const QUESTION_IMAGES_DDL = [
    `CREATE TABLE IF NOT EXISTS question_images (
        id           SERIAL PRIMARY KEY,
        slug         TEXT UNIQUE NOT NULL,
        kind         VARCHAR(20) NOT NULL DEFAULT 'illustration'
                     CHECK (kind IN ('original','open_licence','illustration','table')),
        image_key    TEXT,
        table_json   JSONB,
        alt_en       TEXT,
        alt_ar       TEXT,
        note_en      TEXT,
        note_ar      TEXT,
        licence      TEXT,
        attribution  TEXT,
        source_url   TEXT,
        reviewed_by  TEXT,
        reviewed_at  TIMESTAMPTZ,
        status       VARCHAR(10) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved')),
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS question_image_links (
        question_id INTEGER NOT NULL,
        image_id    INTEGER NOT NULL REFERENCES question_images(id) ON DELETE CASCADE,
        position    INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (question_id, image_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_question_image_links_image ON question_image_links (image_id)`,
];

export async function ensureQuestionImagesTables(db) {
    for (const sql of QUESTION_IMAGES_DDL) await db.query(sql);
}

export const IMAGE_URL_PREFIX = '/api/question-images/file/';

/** Public shape of one image row. Only called for approved rows. */
export function toPublicImage(r) {
    const out = {
        kind: r.kind,
        alt_en: r.alt_en || null,
        alt_ar: r.alt_ar || null,
        note_en: r.note_en || null,
        note_ar: r.note_ar || null,
        attribution: r.attribution || null,
    };
    if (r.kind === 'table') {
        out.table = r.table_json;
    } else if (r.image_key) {
        out.url = IMAGE_URL_PREFIX + String(r.image_key).replace(/^qimg\//, '');
    }
    return out;
}

/**
 * Adds `images` to the rows that have approved links. Rows without links are
 * returned untouched (no `images` key), so their shape does not change.
 * Never throws: a failure here must not break serving questions.
 */
export async function attachQuestionImages(db, rows) {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    try {
        const ids = rows.map((r) => r.id).filter((n) => Number.isInteger(n));
        if (ids.length === 0) return rows;
        const { rows: links } = await db.query(
            `SELECT l.question_id, i.*
               FROM question_image_links l
               JOIN question_images i ON i.id = l.image_id
              WHERE l.question_id = ANY($1::int[]) AND i.status = 'approved'
              ORDER BY l.question_id, l.position, i.id`,
            [ids]
        );
        if (links.length === 0) return rows;
        const byQ = new Map();
        for (const l of links) {
            if (!byQ.has(l.question_id)) byQ.set(l.question_id, []);
            byQ.get(l.question_id).push(toPublicImage(l));
        }
        for (const r of rows) if (byQ.has(r.id)) r.images = byQ.get(r.id);
    } catch {
        /* table missing or DB hiccup: serve the questions without images */
    }
    return rows;
}

const KINDS = ['original', 'open_licence', 'illustration', 'table'];

/** Validate and normalise one import entry. Returns {error} or {value}. */
export function validateImageEntry(e) {
    if (!e || typeof e !== 'object') return { error: 'entry is not an object' };
    if (!e.slug || !/^[a-z0-9][a-z0-9_-]{0,80}$/i.test(e.slug)) return { error: 'bad slug' };
    if (!KINDS.includes(e.kind)) return { error: `bad kind for ${e.slug}` };
    if (e.kind === 'table') {
        const t = e.table;
        if (!t || !Array.isArray(t.header) || !Array.isArray(t.rows)) return { error: `table needs header and rows (${e.slug})` };
    } else if (!e.image_key || /\.\.|^\/|\\/.test(e.image_key)) {
        return { error: `image_key missing or unsafe (${e.slug})` };
    }
    const links = (e.question_ids || []).map(Number);
    if (links.some((n) => !Number.isInteger(n) || n <= 0)) return { error: `bad question id (${e.slug})` };
    return { value: { ...e, question_ids: [...new Set(links)] } };
}

/**
 * Insert or update rows and links. Without `apply` it only validates and counts.
 * A row becomes 'approved' only if the entry says so AND names reviewed_by;
 * everything else is stored as 'draft'.
 */
export async function importQuestionImages(db, entries, { apply = false } = {}) {
    const report = { images: 0, links: 0, errors: [] };
    for (const e of entries) {
        const { error, value } = validateImageEntry(e);
        if (error) { report.errors.push(error); continue; }
        report.images++;
        report.links += value.question_ids.length;
        if (!apply) continue;
        const approved = value.status === 'approved' && !!value.reviewed_by;
        const { rows: [img] } = await db.query(
            `INSERT INTO question_images (slug, kind, image_key, table_json, alt_en, alt_ar, note_en, note_ar,
                                          licence, attribution, source_url, reviewed_by, reviewed_at, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
             ON CONFLICT (slug) DO UPDATE SET kind=EXCLUDED.kind, image_key=EXCLUDED.image_key,
               table_json=EXCLUDED.table_json, alt_en=EXCLUDED.alt_en, alt_ar=EXCLUDED.alt_ar,
               note_en=EXCLUDED.note_en, note_ar=EXCLUDED.note_ar, licence=EXCLUDED.licence,
               attribution=EXCLUDED.attribution, source_url=EXCLUDED.source_url,
               reviewed_by=EXCLUDED.reviewed_by, reviewed_at=EXCLUDED.reviewed_at, status=EXCLUDED.status
             RETURNING id`,
            [value.slug, value.kind, value.image_key || null,
             value.kind === 'table' ? JSON.stringify(value.table) : null,
             value.alt_en || null, value.alt_ar || null, value.note_en || null, value.note_ar || null,
             value.licence || null, value.attribution || null, value.source_url || null,
             value.reviewed_by || null, approved ? (value.reviewed_at || new Date().toISOString()) : null,
             approved ? 'approved' : 'draft']
        );
        let pos = 0;
        for (const qid of value.question_ids) {
            await db.query(
                `INSERT INTO question_image_links (question_id, image_id, position) VALUES ($1,$2,$3)
                 ON CONFLICT (question_id, image_id) DO UPDATE SET position = EXCLUDED.position`,
                [qid, img.id, pos++]
            );
        }
    }
    return report;
}
