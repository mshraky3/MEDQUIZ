// GET /api/question-images/file/:name - stream a question picture from R2 (qimg/ prefix).
// Public on purpose (the files are illustrations, referenced by <img>, which cannot send
// an Authorization header). File names carry a version/hash, so they cache for a year.
import express from 'express';
import { getObject, isR2Configured } from '../services/r2Service.js';
import { logger } from '../utils/observability.js';

const router = express.Router();
const TYPES = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' };

router.get('/file/:name', async (req, res) => {
    const m = /^([a-zA-Z0-9_-]+)\.(webp|png|jpg|jpeg|svg)$/.exec(req.params.name);
    if (!m) return res.status(400).json({ message: 'Invalid image name' });
    if (!isR2Configured()) return res.status(503).json({ message: 'Content storage not configured' });
    try {
        const obj = await getObject(`qimg/${req.params.name}`);
        res.setHeader('Content-Type', TYPES[m[2]]);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (m[2] === 'svg') res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
        const body = obj.Body;
        if (body && typeof body.pipe === 'function') body.pipe(res);
        else res.end(Buffer.from(await body.transformToByteArray()));
    } catch (err) {
        if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) return res.status(404).json({ message: 'Not found' });
        logger.error('[QuestionImages] fetch failed:', err);
        res.status(500).json({ message: 'Failed to load image' });
    }
});

export default router;
