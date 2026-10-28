/**
 * POST /api/app/free-month: the Android app asks for its one free month after a
 * sign-in. Mounted behind requireSession (the account comes from the session, never
 * from the body). Answers 404 while APP_FREE_MONTH_ENABLED is not "true", so the
 * route is invisible until the owner switches it on. See services/appFreeMonth.js.
 */
import express from 'express';
import { logger } from '../utils/observability.js';
import { isAppFreeMonthEnabled, redeemAppFreeMonth } from '../services/appFreeMonth.js';

const router = express.Router();

router.post('/free-month', async (req, res) => {
    if (!isAppFreeMonthEnabled()) return res.status(404).json({ success: false, message: 'Not found' });
    try {
        const result = await redeemAppFreeMonth(req.db, req.accountId, { platform: req.body?.platform });
        res.json({ success: true, ...result });
    } catch (err) {
        logger.error('[app-free-month] failed:', err);
        res.status(500).json({ success: false, message: 'Could not apply the free month' });
    }
});

export default router;
