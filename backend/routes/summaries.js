/**
 * Topic Summaries API.
 *
 * Mounted at /api/summaries with a `req.db = db` injector (see app.js), mirroring
 * the question-reports / email-campaigns / payment routers. Every route is gated
 * by a self-contained session guard (the shared requireSession in app.js is not
 * exported), validating username + sessionToken against accounts.session_token —
 * the same contract the frontend apiClient already satisfies.
 *
 * Slide-deck pages are streamed through this server from private R2 storage, so
 * no public URL or downloadable PDF is ever exposed to the browser.
 */
import express from 'express';
import { getObject, isR2Configured } from '../services/r2Service.js';

const router = express.Router();

// --- Session guard (mirrors app.js requireSession, but uses req.db + sets userId)
async function requireSession(req, res, next) {
    // Prefer the session token from the Authorization header (keeps it out of
    // URLs/logs); fall back to query/body for backward compatibility.
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const username = req.query.username || req.body?.username;
    const sessionToken = bearerToken || req.query.sessionToken || req.body?.sessionToken;
    if (!username || !sessionToken) {
        return res.status(401).json({ message: 'Missing session credentials' });
    }
    try {
        const r = await req.db.query(
            'SELECT id, session_token FROM accounts WHERE username = $1',
            [username]
        );
        if (!r.rows.length || r.rows[0].session_token !== sessionToken) {
            return res.status(401).json({ message: 'Session invalid or expired' });
        }
        req.userId = r.rows[0].id;
        req.username = username;
        next();
    } catch (err) {
        console.error('[Summaries] session check failed:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

router.use(requireSession);

const pad3 = (n) => String(n).padStart(3, '0');

// GET /api/summaries — published decks + this user's progress + topic question counts
router.get('/', async (req, res) => {
    try {
        const [summaries, progress, counts] = await Promise.all([
            req.db.query(
                `SELECT id, slug, title, title_en, question_type, description, page_count, sort_order,
                        (content_html IS NOT NULL) AS has_content
                 FROM summaries WHERE is_published = TRUE
                 ORDER BY sort_order ASC, id ASC`
            ),
            req.db.query(
                `SELECT summary_id, last_page, max_page_reached, completed
                 FROM summary_progress WHERE user_id = $1`,
                [req.userId]
            ),
            req.db.query(
                `SELECT question_type, COUNT(*)::int AS total FROM questions GROUP BY question_type`
            ),
        ]);

        const progressBy = {};
        progress.rows.forEach((p) => { progressBy[p.summary_id] = p; });
        const countBy = {};
        counts.rows.forEach((c) => { countBy[c.question_type] = c.total; });

        res.json({
            summaries: summaries.rows.map((s) => ({
                ...s,
                total_questions: countBy[s.question_type] || 0,
                progress: progressBy[s.id] || null,
            })),
        });
    } catch (err) {
        console.error('[Summaries] list failed:', err);
        res.status(500).json({ message: 'Failed to load summaries' });
    }
});

// GET /api/summaries/:slug — one deck + progress + topic mastery stats
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const sres = await req.db.query(
            `SELECT id, slug, title, title_en, question_type, description, page_count, content_html
             FROM summaries WHERE slug = $1 AND is_published = TRUE`,
            [slug]
        );
        if (!sres.rows.length) return res.status(404).json({ message: 'Summary not found' });
        const summary = sres.rows[0];

        const [progress, totalQ, completedQ, topicAcc] = await Promise.all([
            req.db.query(
                `SELECT last_page, max_page_reached, completed
                 FROM summary_progress WHERE user_id = $1 AND summary_id = $2`,
                [req.userId, summary.id]
            ),
            req.db.query(
                `SELECT COUNT(*)::int AS total FROM questions WHERE question_type = $1`,
                [summary.question_type]
            ),
            req.db.query(
                `SELECT COUNT(DISTINCT uqp.question_id)::int AS done
                 FROM user_question_progress uqp
                 JOIN questions q ON q.id = uqp.question_id
                 WHERE uqp.user_id = $1 AND q.question_type = $2`,
                [req.userId, summary.question_type]
            ),
            req.db.query(
                `SELECT total_answered, total_correct, accuracy
                 FROM user_topic_analysis WHERE user_id = $1 AND question_type = $2`,
                [req.userId, summary.question_type]
            ),
        ]);

        res.json({
            summary,
            progress: progress.rows[0] || null,
            stats: {
                total_questions: totalQ.rows[0].total,
                completed_questions: completedQ.rows[0].done,
                topic: topicAcc.rows[0] || null,
            },
        });
    } catch (err) {
        console.error('[Summaries] detail failed:', err);
        res.status(500).json({ message: 'Failed to load summary' });
    }
});

// GET /api/summaries/:slug/questions — study list of all questions for the topic
router.get('/:slug/questions', async (req, res) => {
    const { slug } = req.params;
    try {
        const sres = await req.db.query(
            `SELECT question_type FROM summaries WHERE slug = $1 AND is_published = TRUE`,
            [slug]
        );
        if (!sres.rows.length) return res.status(404).json({ message: 'Summary not found' });
        const qtype = sres.rows[0].question_type;

        const qres = await req.db.query(
            `SELECT id, question_text, option1, option2, option3, option4, correct_option, source
             FROM questions WHERE question_type = $1 ORDER BY id ASC`,
            [qtype]
        );
        res.json({ question_type: qtype, total: qres.rows.length, questions: qres.rows });
    } catch (err) {
        console.error('[Summaries] questions failed:', err);
        res.status(500).json({ message: 'Failed to load questions' });
    }
});

// GET /api/summaries/:slug/page/:n — stream a private page image from R2
router.get('/:slug/page/:n', async (req, res) => {
    const { slug, n } = req.params;
    const pageNum = parseInt(n, 10);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
    }
    try {
        const sres = await req.db.query(
            `SELECT r2_prefix, page_count FROM summaries WHERE slug = $1 AND is_published = TRUE`,
            [slug]
        );
        if (!sres.rows.length) return res.status(404).json({ message: 'Summary not found' });
        const { r2_prefix, page_count } = sres.rows[0];
        if (page_count && pageNum > page_count) {
            return res.status(404).json({ message: 'Page out of range' });
        }
        if (!isR2Configured()) {
            return res.status(503).json({ message: 'Content storage not configured' });
        }

        const key = `${r2_prefix}page-${pad3(pageNum)}.webp`;
        const obj = await getObject(key);

        res.setHeader('Content-Type', obj.ContentType || 'image/webp');
        // Private, do not let intermediaries cache the gated content.
        res.setHeader('Cache-Control', 'private, no-store');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const body = obj.Body;
        if (body && typeof body.pipe === 'function') {
            body.on('error', (streamErr) => {
                console.error('[Summaries] page stream error:', streamErr);
                if (!res.headersSent) res.status(500).end();
                else res.end();
            });
            body.pipe(res);
        } else {
            // Fallback for non-Node stream shapes.
            const bytes = await obj.Body.transformToByteArray();
            res.end(Buffer.from(bytes));
        }
    } catch (err) {
        if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
            return res.status(404).json({ message: 'Page not found' });
        }
        console.error('[Summaries] page fetch failed:', err);
        res.status(500).json({ message: 'Failed to load page' });
    }
});

// POST /api/summaries/:slug/progress — upsert reading progress
router.post('/:slug/progress', async (req, res) => {
    const { slug } = req.params;
    const lastPage = parseInt(req.body?.last_page, 10);
    const completedFlag = Boolean(req.body?.completed);
    if (!Number.isInteger(lastPage) || lastPage < 1) {
        return res.status(400).json({ message: 'Invalid last_page' });
    }
    try {
        const sres = await req.db.query(
            `SELECT id, page_count FROM summaries WHERE slug = $1`,
            [slug]
        );
        if (!sres.rows.length) return res.status(404).json({ message: 'Summary not found' });
        const { id: summaryId, page_count: pageCount } = sres.rows[0];
        const isCompleted = completedFlag || (pageCount > 0 && lastPage >= pageCount);

        const result = await req.db.query(
            `INSERT INTO summary_progress
                (user_id, summary_id, last_page, max_page_reached, completed, first_viewed_at, last_viewed_at)
             VALUES ($1, $2, $3, $3, $4, NOW(), NOW())
             ON CONFLICT (user_id, summary_id) DO UPDATE SET
                last_page = EXCLUDED.last_page,
                max_page_reached = GREATEST(summary_progress.max_page_reached, EXCLUDED.last_page),
                completed = summary_progress.completed OR EXCLUDED.completed,
                last_viewed_at = NOW()
             RETURNING last_page, max_page_reached, completed`,
            [req.userId, summaryId, lastPage, isCompleted]
        );
        res.json({ progress: result.rows[0] });
    } catch (err) {
        console.error('[Summaries] progress upsert failed:', err);
        res.status(500).json({ message: 'Failed to save progress' });
    }
});

export default router;
