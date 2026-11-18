/**
 * POST /api/app/free-month: the Android app asks for its one free month after a
 * sign-in. Mounted behind requireSession (the account comes from the session, never
 * from the body). Answers 404 while APP_FREE_MONTH_ENABLED is not "true", so the
 * route is invisible until the owner switches it on. See services/appFreeMonth.js.
 */
import express from 'express';
import { logger } from '../utils/observability.js';
import { isAppFreeMonthEnabled, redeemAppFreeMonth } from '../services/appFreeMonth.js';
import { isAndroidTestersOfferEnabled, redeemTesterOffer } from '../services/androidTesters.js';

const router = express.Router();

router.post('/free-month', async (req, res) => {
    const testers = isAndroidTestersOfferEnabled();
    const month = isAppFreeMonthEnabled();
    if (!month && !testers) return res.status(404).json({ success: false, message: 'Not found' });
    try {
        // Android tester offer first (3 months for the 15 who joined the list). Same call,
        // so the installed app needs no change. A failure here (for example the table is
        // not created yet) never blocks the plain free month.
        if (testers) {
            try {
                const offer = await redeemTesterOffer(req.db, req.accountId, { platform: req.body?.platform });
                if (offer.granted || !month) return res.json({ success: true, ...offer });
            } catch (err) {
                logger.error('[android-testers] redeem failed:', err);
                if (!month) return res.status(500).json({ success: false, message: 'Could not apply the offer' });
            }
        }
        const result = await redeemAppFreeMonth(req.db, req.accountId, { platform: req.body?.platform });
        res.json({ success: true, ...result });
    } catch (err) {
        logger.error('[app-free-month] failed:', err);
        res.status(500).json({ success: false, message: 'Could not apply the free month' });
    }
});

export default router;
