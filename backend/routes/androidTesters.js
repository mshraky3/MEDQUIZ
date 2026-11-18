/**
 * Android tester offer routes (all answer 404 until ANDROID_TESTERS_OFFER_ENABLED=true).
 *
 *   GET  /api/android-testers/status   (session)  spots left + this account's state
 *   POST /api/android-testers/join     (session)  { email } take a spot
 *   GET  /api/admin/android-testers/export (admin key)  ?format=csv|emails|json
 *
 * The account always comes from the session (req.accountId), never from the body.
 * The 3 free months are given by the existing app sign-in call, see routes/appFreeMonth.js.
 * Logic and rules: services/androidTesters.js.
 */
import express from 'express';
import { logger } from '../utils/observability.js';
import {
    isAndroidTestersOfferEnabled, getOfferStatus, joinAndroidTesters,
    buildTesterExport, exportToCsv,
} from '../services/androidTesters.js';

const NOT_FOUND = { success: false, message: 'Not found' };
// A refusal the student can fix or must accept: 400 for a bad address, 409 for the rest.
const REFUSAL_STATUS = { invalid_email: 400 };

/** 42P01 = the migration has not been run yet. */
function notReady(err) {
    return err && err.code === '42P01';
}

function failure(res, err, what) {
    if (notReady(err)) return res.status(503).json({ success: false, message: 'Not ready' });
    logger.error(`[android-testers] ${what} failed:`, err);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
}

const router = express.Router();

router.get('/status', async (req, res) => {
    if (!isAndroidTestersOfferEnabled()) return res.status(404).json(NOT_FOUND);
    try {
        res.json({ success: true, ...(await getOfferStatus(req.db, req.accountId)) });
    } catch (err) {
        failure(res, err, 'status');
    }
});

router.post('/join', async (req, res) => {
    if (!isAndroidTestersOfferEnabled()) return res.status(404).json(NOT_FOUND);
    try {
        const result = await joinAndroidTesters(req.db, req.accountId, req.body?.email);
        if (result.joined) return res.json({ success: true, ...result });
        res.status(REFUSAL_STATUS[result.reason] || 409).json({ success: false, ...result });
    } catch (err) {
        failure(res, err, 'join');
    }
});

export const androidTestersAdminRouter = express.Router();

androidTestersAdminRouter.get('/export', async (req, res) => {
    if (!isAndroidTestersOfferEnabled()) return res.status(404).json(NOT_FOUND);
    try {
        const list = await buildTesterExport(req.db);
        const format = String(req.query.format || 'csv').toLowerCase();
        if (format === 'json') return res.json({ success: true, count: list.length, testers: list });
        res.set('Cache-Control', 'no-store');
        res.type('text/plain; charset=utf-8');
        if (format === 'emails') return res.send(list.map((r) => r.email).join('\n') + '\n');
        res.type('text/csv; charset=utf-8').send(exportToCsv(list));
    } catch (err) {
        failure(res, err, 'export');
    }
});

export default router;
