/**
 * Scheduled Telegram jobs, called from routes/telegram.js's cron endpoints
 * (and the admin test routes for manual firing). Mirrors the shape of
 * services/lifecycleJobs.js: one function per job, each idempotent so an
 * overlapping or repeated call can never double-send.
 */

import { sendQuizPoll, sendMessage, sendPhoto, deleteMessage, siteButton, SITE_URL } from './telegramClient.js';
import { weeklyDigestMessage } from './telegramMessages.js';
import { renderTopicCard } from './telegramImageService.js';
import {
    pickChannelQuestion, recordSentQuestion, channelPostsToday,
    findDueForWeeklyDigest, computeWeakTopics, stampWeeklyDigestSent, markBlocked,
    pickChannelSummary, recordSentSummary, recordSentMessage, findMessagesDueForDeletion, removeSentMessageLog,
} from './telegramContentService.js';

const CHANNEL = () => process.env.TELEGRAM_CHANNEL || '@sqb_exam';
const DAILY_CHANNEL_CAP = 3;
const CHANNEL_QUESTION_TTL_DAYS = 10;
const CHANNEL_SUMMARY_TTL_DAYS = 7;

/** One channel question, up to 3/day (call this endpoint 3x/day on a schedule — the cap makes it safe to over-call). */
export async function runDailyChannelPostJob(db) {
    const postedToday = await channelPostsToday(db);
    if (postedToday >= DAILY_CHANNEL_CAP) {
        return { sent: false, reason: `daily cap reached (${postedToday}/${DAILY_CHANNEL_CAP})` };
    }
    const q = await pickChannelQuestion(db);
    if (!q) return { sent: false, reason: 'no questions in the bank' };

    const message = await sendQuizPoll(CHANNEL(), {
        question: q.question_text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation || undefined,
        isAnonymous: true, // required for channel polls
        replyMarkup: siteButton('Practice more on SQB', 'channel_daily'),
    });
    await recordSentQuestion(db, { questionId: q.id, context: 'channel' });
    await recordSentMessage(db, { chatId: CHANNEL(), messageId: message.message_id, deleteAfterDays: CHANNEL_QUESTION_TTL_DAYS });
    return { sent: true, questionId: q.id, postedToday: postedToday + 1 };
}

/** Weekly (dedupe-stamped, actually checked daily) weak-topics DM for eligible bot users. */
export async function runWeeklyWeakTopicsJob(db) {
    const chatIds = await findDueForWeeklyDigest(db);
    let sent = 0;
    const errors = [];
    for (const chatId of chatIds) {
        try {
            const { topics } = await computeWeakTopics(db, chatId);
            if (!topics) continue; // fell below the threshold again somehow — skip, don't stamp
            const { text, opts } = weeklyDigestMessage(topics);
            await sendMessage(chatId, text, opts);
            await stampWeeklyDigestSent(db, chatId);
            sent++;
        } catch (err) {
            // 403 = the user blocked the bot; stop bothering them but don't
            // treat it as a real error.
            if (err.message?.includes('403')) {
                await markBlocked(db, chatId).catch(() => {});
            } else {
                errors.push({ chatId, error: err.message });
            }
        }
    }
    return { sent, candidates: chatIds.length, errors };
}

/** One topic-summary card posted to the channel — meant to be called once a week. */
export async function runWeeklyChannelSummaryJob(db) {
    const summary = await pickChannelSummary(db);
    if (!summary) return { sent: false, reason: 'no published summaries for this track' };

    const titleEn = summary.title_en || summary.title;
    const card = await renderTopicCard(titleEn);
    const description = summary.description ? `\n\n${summary.description}` : '';
    const link = `${SITE_URL}/summaries/${summary.slug}?utm_source=telegram&utm_medium=channel_weekly`;
    const caption = `📚 <b>${titleEn}</b>${description}\n\n${link}`;

    const message = await sendPhoto(CHANNEL(), card, {
        caption,
        replyMarkup: siteButton('Study this topic on SQB', 'channel_weekly_summary'),
    });
    await recordSentSummary(db, summary.id);
    await recordSentMessage(db, { chatId: CHANNEL(), messageId: message.message_id, deleteAfterDays: CHANNEL_SUMMARY_TTL_DAYS });
    return { sent: true, summaryId: summary.id, slug: summary.slug };
}

/**
 * Free-text announcement/ad, posted straight to the channel on admin demand —
 * not on any schedule, unlike the jobs above. This is the "also share it on
 * Telegram" button for whatever the admin is announcing on the site/by email.
 * No TTL by default: an announcement is meant to stay up, unlike the daily
 * question or weekly summary card, which are deliberately ephemeral.
 */
export async function postChannelAnnouncement(db, { text, buttonText, buttonUrl, deleteAfterDays } = {}) {
    const body = String(text || '').trim();
    if (!body) throw new Error('text is required');
    const replyMarkup = buttonUrl ? { inline_keyboard: [[{ text: buttonText || 'Open SQB', url: buttonUrl }]] } : siteButton();
    const message = await sendMessage(CHANNEL(), body, { reply_markup: replyMarkup });
    if (deleteAfterDays) {
        await recordSentMessage(db, { chatId: CHANNEL(), messageId: message.message_id, deleteAfterDays });
    }
    return { sent: true, messageId: message.message_id };
}

/** Deletes channel messages past their scheduled delete_after. DM messages are never logged here (see telegramContentService). */
export async function runMessageCleanupJob(db) {
    const due = await findMessagesDueForDeletion(db);
    let deleted = 0;
    const errors = [];
    for (const row of due) {
        try {
            await deleteMessage(row.chat_id, row.message_id);
            deleted++;
            await removeSentMessageLog(db, row.id);
        } catch (err) {
            // "message to delete not found" means it's already gone (e.g.
            // manually deleted) — nothing left to retry, so drop the row. Any
            // other error (rate limit, brief loss of admin rights, network
            // blip) is likely transient: keep the row logged so tomorrow's
            // run retries it, instead of silently abandoning a message that
            // is still sitting in the channel.
            if (/message to delete not found/i.test(err.message || '')) {
                await removeSentMessageLog(db, row.id);
            } else {
                errors.push({ id: row.id, error: err.message });
            }
        }
    }
    return { deleted, candidates: due.length, errors };
}
