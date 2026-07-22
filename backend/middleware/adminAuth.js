/**
 * adminAuth middleware — shared-key gate for admin-only endpoints.
 * ------------------------------------------------------------------
 * The admin panel (and only the admin panel) sends an `x-admin-key`
 * header; it must match the ADMIN_KEY environment variable.
 *
 * Behavior when ADMIN_KEY is not configured:
 *   - production  → 503 (admin surface stays LOCKED until the key is set)
 *   - development → pass-through, so local work needs no extra setup
 *
 * Constant-time comparison avoids leaking the key via timing.
 */
import crypto from 'crypto';

/** True when the request carries a valid admin key. */
export function isAdminRequest(req) {
    const configured = process.env.ADMIN_KEY;
    const provided = req.headers['x-admin-key'];
    if (!configured || !provided) return false;
    const a = Buffer.from(String(configured), 'utf8');
    const b = Buffer.from(String(provided), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

export function adminAuth(req, res, next) {
    if (!process.env.ADMIN_KEY) {
        if (process.env.NODE_ENV !== 'production') return next(); // local dev
        return res.status(503).json({
            success: false,
            message: 'Admin access is not configured on this server (ADMIN_KEY missing).',
        });
    }
    if (isAdminRequest(req)) return next();
    return res.status(401).json({ success: false, message: 'Admin authentication required.' });
}
