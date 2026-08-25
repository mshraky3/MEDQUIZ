/**
 * In-app notification feed.
 *
 * Read-only from the client's side apart from marking things read — rows are
 * only ever created server-side by notificationService.notify(), from real
 * events. See that file for why there is no broadcast path here.
 */
import express from 'express';
import { logger } from '../utils/observability.js';

const router = express.Router();

const MAX_LIMIT = 30;

/** GET /api/notifications — recent notifications + unread count. */
router.get('/', async (req, res) => {
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || 15));
    try {
        const [list, unread] = await Promise.all([
            req.db.query(`
                SELECT id, type, title, body, cta_url, read_at, created_at
                  FROM user_notifications
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT $2
            `, [req.accountId, limit]),
            req.db.query(
                `SELECT COUNT(*)::int AS n FROM user_notifications
                  WHERE user_id = $1 AND read_at IS NULL`, [req.accountId]),
        ]);
        res.json({
            success: true,
            unreadCount: unread.rows[0]?.n || 0,
            notifications: list.rows.map((r) => ({
                id: r.id,
                type: r.type,
                title: r.title,
                body: r.body,
                ctaUrl: r.cta_url,
                read: !!r.read_at,
                createdAt: r.created_at,
            })),
        });
    } catch (err) {
        // A missing table (first deploy, before schema bootstrap lands) must not
        // break the navbar the feed hangs off.
        if (err.code === '42P01') return res.json({ success: true, unreadCount: 0, notifications: [] });
        logger.error('[notifications] fetch failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load notifications' });
    }
});

/** POST /api/notifications/read — mark one (by id) or all as read. */
router.post('/read', async (req, res) => {
    const id = req.body?.id;
    try {
        if (id) {
            // Scoped by user_id as well as id: without it, any authenticated
            // user could mark another account's notifications read.
            await req.db.query(
                `UPDATE user_notifications SET read_at = NOW()
                  WHERE id = $1 AND user_id = $2 AND read_at IS NULL`,
                [id, req.accountId]
            );
        } else {
            await req.db.query(
                `UPDATE user_notifications SET read_at = NOW()
                  WHERE user_id = $1 AND read_at IS NULL`,
                [req.accountId]
            );
        }
        res.json({ success: true });
    } catch (err) {
        logger.error('[notifications] mark-read failed:', err);
        res.status(500).json({ success: false, message: 'Failed to update notifications' });
    }
});

export default router;
