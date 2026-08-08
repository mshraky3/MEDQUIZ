/**
 * Trial routes — RETIRED (2026-08-08)
 * ------------------------------------------------------------------
 * The 1-hour engaged-time free trial no longer exists. It was replaced by a
 * lifetime allowance of FREE_QUESTION_ALLOWANCE answered questions plus the
 * first lesson of every specialty, because the trial's defining behaviour —
 * locking a student out of their own account when the hour ran out — also
 * locked them out of the analytics, the free lessons and the re-engagement
 * surface we then tried to email them about.
 *
 * There is nothing left to heartbeat: nothing is measured in seconds any more.
 * See paymentService.checkQuizAccess and middleware/subscriptionGuard.js.
 *
 * This router survives only so that a browser tab left open across the deploy
 * gets a clean, cheap answer instead of a 404 in the console and a retry loop.
 * It writes nothing. Delete it once the old bundle can no longer be in anyone's
 * tab (a week is plenty).
 */
import express from 'express';
import { FREE_QUESTION_ALLOWANCE } from '../services/paymentService.js';

const router = express.Router();

const RETIRED = {
    success: false,
    retired: true,
    message: 'The timed free trial has been replaced by a free question allowance.',
    allowance: FREE_QUESTION_ALLOWANCE,
};

router.post('/heartbeat', (req, res) => res.status(410).json(RETIRED));
router.get('/status', (req, res) => res.status(410).json(RETIRED));

export default router;
