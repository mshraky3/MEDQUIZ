/**
 * Telegram bot + channel: webhook, cron endpoints, and admin test/setup
 * routes. Mounted at '/' in app.js (like email-campaigns.js) since every
 * route here declares its own full path.
 */

import express from 'express';
import crypto from 'crypto';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendQuizPoll, sendMessage, siteButton, setWebhook, getWebhookInfo } from '../services/telegramClient.js';
import {
    welcomeMessage, helpMessage, websiteMessage, noWeakspotsYetMessage,
    weakspotsMessage, noQuestionsAvailableMessage,
} from '../services/telegramMessages.js';
import {
    upsertTelegramUser, pickDmQuizQuestion, recordSentQuestion, recordQuizPollSent,
    recordQuizAnswer, computeWeakTopics,
} from '../services/telegramContentService.js';
import {
    runDailyChannelPostJob, runWeeklyWeakTopicsJob, runWeeklyChannelSummaryJob, runMessageCleanupJob,
} from '../services/telegramJobs.js';

const router = express.Router();

// Same "Bearer $CRON_SECRET" pattern as routes/email-campaigns.js — deliberately
// duplicated rather than shared, since that middleware isn't exported there.
const cronAuth = (req, res, next) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV !== 'production') return next();
        return res.status(503).json({ success: false, message: 'Cron auth is not configured on this server (CRON_SECRET missing).' });
    }
    const authHeader = req.headers.authorization || '';
    if (authHeader === `Bearer ${secret}`) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized' });
};

/** Telegram sends this header on every webhook call once setWebhook was registered with a secret_token. */
function verifyTelegramSecret(req, res, next) {
    const configured = process.env.TELEGRAM_WEBHOOK_SECRET;
    const provided = req.headers['x-telegram-bot-api-secret-token'];
    if (!configured) return next(); // not configured yet (local dev) — accept
    if (!provided) return res.sendStatus(401);
    const a = Buffer.from(String(configured), 'utf8');
    const b = Buffer.from(String(provided), 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.sendStatus(401);
    return next();
}

// ════════════════════════════════════════════════════════════
//  WEBHOOK
// ════════════════════════════════════════════════════════════

async function handleQuizCommand(db, chatId) {
    const q = await pickDmQuizQuestion(db, chatId);
    if (!q) return sendMessage(chatId, noQuestionsAvailableMessage().text);
    const poll = await sendQuizPoll(chatId, {
        question: q.question_text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation || undefined,
        isAnonymous: false, // private chat — needed so poll_answer tells us who answered
        replyMarkup: siteButton('Full bank on SQB', 'bot_quiz'),
    });
    await recordQuizPollSent(db, { chatId, questionId: q.id, pollId: poll.poll.id });
    await recordSentQuestion(db, { questionId: q.id, context: 'dm', chatId });
}

async function handleWeakspotsCommand(db, chatId) {
    const { totalAnswered, topics } = await computeWeakTopics(db, chatId);
    if (!topics) {
        const { text } = noWeakspotsYetMessage(totalAnswered);
        return sendMessage(chatId, text);
    }
    const { text, opts } = weakspotsMessage(topics);
    return sendMessage(chatId, text, opts);
}

async function handleMessage(db, message) {
    if (message.chat?.type !== 'private') return; // don't talk in the discussion group
    const chatId = message.chat.id;
    const text = (message.text || '').trim();

    await upsertTelegramUser(db, {
        chatId,
        username: message.from?.username,
        firstName: message.from?.first_name,
    });

    if (!text.startsWith('/')) {
        const { text: help } = helpMessage();
        return sendMessage(chatId, help);
    }

    const command = text.split(/\s/)[0].split('@')[0].toLowerCase();
    switch (command) {
        case '/start': {
            const { text: welcome, opts } = welcomeMessage(message.from?.first_name);
            return sendMessage(chatId, welcome, opts);
        }
        case '/quiz':
            return handleQuizCommand(db, chatId);
        case '/weakspots':
            return handleWeakspotsCommand(db, chatId);
        case '/website': {
            const { text: site, opts } = websiteMessage();
            return sendMessage(chatId, site, opts);
        }
        default: {
            const { text: help } = helpMessage();
            return sendMessage(chatId, help);
        }
    }
}

async function handlePollAnswer(db, pollAnswer) {
    // Anonymous (channel) polls never trigger poll_answer, so this is always
    // one of our own private /quiz polls.
    await recordQuizAnswer(db, { pollId: pollAnswer.poll_id, optionIds: pollAnswer.option_ids });
}

router.post('/api/telegram/webhook', verifyTelegramSecret, async (req, res) => {
    // Always 200 — Telegram retries aggressively on non-2xx, and a bug on our
    // side shouldn't turn into a retry storm against api.telegram.org.
    res.sendStatus(200);
    const update = req.body || {};
    try {
        if (update.message) await handleMessage(req.db, update.message);
        else if (update.poll_answer) await handlePollAnswer(req.db, update.poll_answer);
    } catch (err) {
        console.error('telegram webhook error:', err);
    }
});

// ════════════════════════════════════════════════════════════
//  CRON — called by the external scheduler (cron-job.org) with
//  Authorization: Bearer $CRON_SECRET, same as email-campaigns.js
// ════════════════════════════════════════════════════════════

router.get('/api/cron/telegram-daily', cronAuth, async (req, res) => {
    try {
        const result = await runDailyChannelPostJob(req.db);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('cron/telegram-daily error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/cron/telegram-weekly', cronAuth, async (req, res) => {
    try {
        const result = await runWeeklyWeakTopicsJob(req.db);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('cron/telegram-weekly error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Separate from the DM digest above — this posts ONE topic-summary card to
// the channel itself. Call it once a week (any external-scheduler time).
router.get('/api/cron/telegram-channel-summary', cronAuth, async (req, res) => {
    try {
        const result = await runWeeklyChannelSummaryJob(req.db);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('cron/telegram-channel-summary error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Deletes channel messages past their scheduled TTL (10d for daily questions,
// 7d for the weekly summary card). Call once a day.
router.get('/api/cron/telegram-cleanup', cronAuth, async (req, res) => {
    try {
        const result = await runMessageCleanupJob(req.db);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('cron/telegram-cleanup error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ════════════════════════════════════════════════════════════
//  ADMIN TEST / SETUP — manual triggers + one-time webhook registration
// ════════════════════════════════════════════════════════════

router.get('/api/telegram-test/set-webhook', adminAuth, async (req, res) => {
    try {
        const base = process.env.PUBLIC_API_URL || 'https://medquiz.vercel.app';
        const result = await setWebhook(`${base}/api/telegram/webhook`, process.env.TELEGRAM_WEBHOOK_SECRET);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/telegram-test/webhook-info', adminAuth, async (req, res) => {
    try {
        res.json({ success: true, result: await getWebhookInfo() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/telegram-test/daily-post', adminAuth, async (req, res) => {
    try {
        res.json({ success: true, ...(await runDailyChannelPostJob(req.db)) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/telegram-test/weekly', adminAuth, async (req, res) => {
    try {
        res.json({ success: true, ...(await runWeeklyWeakTopicsJob(req.db)) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/telegram-test/channel-summary', adminAuth, async (req, res) => {
    try {
        res.json({ success: true, ...(await runWeeklyChannelSummaryJob(req.db)) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/telegram-test/cleanup', adminAuth, async (req, res) => {
    try {
        res.json({ success: true, ...(await runMessageCleanupJob(req.db)) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
