/**
 * GET /api/cron/integrity-check
 *
 * Called once a day from .github/workflows/cron.yml (the "eod" group, 00:05 Riyadh), like the daily signups report.
 * Mails the owner only when something is wrong. `?dryrun=1` returns the findings as JSON and never mails.
 * Read only: no UPDATE, no INSERT, nothing is repaired here.
 */
import express from 'express';
import { sendMail } from '../services/mailer.js';
import { OWNER_EMAIL } from '../config/recipients.js';
import { logger } from '../utils/observability.js';
import { runIntegrityChecks, renderIntegrityMail } from '../services/integrityChecks.js';

const router = express.Router();

// Same rule as the cron routes in email-campaigns.js: Bearer CRON_SECRET, and a missing secret is only tolerated outside production.
const cronAuth = (req, res, next) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV !== 'production') return next();
        return res.status(503).json({ success: false, message: 'Cron auth is not configured on this server (CRON_SECRET missing).' });
    }
    if ((req.headers.authorization || '') === `Bearer ${secret}`) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized' });
};

router.get('/api/cron/integrity-check', cronAuth, async (req, res) => {
    try {
        const found = await runIntegrityChecks(req.db);
        if (req.query.dryrun) return res.json({ success: true, issues: found });
        if (found.length === 0) return res.json({ success: true, issues: 0, mailed: false });
        const mail = renderIntegrityMail(found);
        await sendMail({
            event: 'medqize.owner.integrity_check',
            name: 'SQB Reports',
            to: OWNER_EMAIL,
            subject: mail.subject,
            text: mail.text,
        });
        res.json({ success: true, issues: found.length, mailed: true });
    } catch (err) {
        logger.error('cron/integrity-check error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
