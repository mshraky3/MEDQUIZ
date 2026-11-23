/**
 * Scheduled Telegram jobs, called from routes/telegram.js's cron endpoints
 * (and the admin test routes for manual firing). Mirrors the shape of
 * services/lifecycleJobs.js: one function per job, each idempotent so an
 * overlapping or repeated call can never double-send.
 */

import { sendQuizPoll, sendMessage, sendPhoto, deleteMessage, siteButton, SITE_URL } from './telegramClient.js';
import { deleteMessagesAsUser, isUserbotConfigured } from './telegramUserClient.js';
import { weeklyDigestMessage } from './telegramMessages.js';
import { renderTopicCard } from './telegramImageService.js';
import {
    pickChannelQuestion, recordSentQuestion, channelPostsToday, channelPostsTodayFor, channelPostsTodayForTracks, pickExplainedQuestion, CHANNEL_TRACKS,
    findDueForWeeklyDigest, computeWeakTopics, stampWeeklyDigestSent, markBlocked,
    pickChannelSummary, recordSentSummary, recordSentMessage, findMessagesDueForDeletion, removeSentMessageLog,
} from './telegramContentService.js';

import { channelFor, hasSeparateChannels, mainChannel, tracksOn } from './telegramChannels.js';

const CHANNEL = () => mainChannel();
const DAILY_CHANNEL_CAP = 3;
// Everything the bot posts to the channel is cleared after 14 days, so the
// channel never becomes a free copy of the question bank (owner, 2026-11-22).
const CHANNEL_QUESTION_TTL_DAYS = 14;
const CHANNEL_SUMMARY_TTL_DAYS = 14;
const CHANNEL_EXPLAINED_TTL_DAYS = 14;

/** One poll for `track` into `channel`, and its bookkeeping (14-day clearing included). */
async function postPoll(db, track, channel, featured) {
    const q = await pickChannelQuestion(db, { featuredSource: track === 'medical' && featured ? featured : null, track });
    if (!q) return { sent: false, track, reason: `no questions in the bank for ${track}` };
    const message = await sendQuizPoll(channel, {
        question: q.question_text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation || undefined,
        isAnonymous: true, // required for channel polls
        replyMarkup: siteButton('Practice more on SQB', `channel_daily_${track}`),
    });
    await recordSentQuestion(db, { questionId: q.id, context: 'channel' });
    await recordSentMessage(db, { chatId: channel, messageId: message.message_id, deleteAfterDays: CHANNEL_QUESTION_TTL_DAYS });
    return { sent: true, questionId: q.id, track, channel };
}

/**
 * Channel polls, up to 3/day (the cron calls this 3x/day; the cap makes it safe to over-call).
 * One channel for everything (default): one poll per call, the track rotating SMLE, SNLE, SDLE.
 * Separate track channels (TELEGRAM_CHANNEL_SNLE / _SDLE set): every call gives each channel
 * its own poll, each with its own 3/day cap.
 */
export async function runDailyChannelPostJob(db) {
    // While a collection is being promoted, two of the day's three polls come from
    // it. Set TELEGRAM_FEATURED_SOURCE to an empty string to turn this off.
    const featured = process.env.TELEGRAM_FEATURED_SOURCE ?? 'MedicalOctoberRecall';

    if (hasSeparateChannels()) {
        const results = [];
        for (const track of CHANNEL_TRACKS) {
            const channel = channelFor(track);
            const done = await channelPostsTodayForTracks(db, 'channel', tracksOn(channel));
            if (done >= DAILY_CHANNEL_CAP) { results.push({ sent: false, track, reason: `daily cap reached (${done}/${DAILY_CHANNEL_CAP})` }); continue; }
            try { results.push(await postPoll(db, track, channel, track === 'medical' && done < 2 ? featured : null)); }
            catch (err) { results.push({ sent: false, track, error: err.message }); }
        }
        return { sent: results.some((r) => r.sent), results };
    }

    const postedToday = await channelPostsToday(db);
    if (postedToday >= DAILY_CHANNEL_CAP) {
        return { sent: false, reason: `daily cap reached (${postedToday}/${DAILY_CHANNEL_CAP})` };
    }
    const track = CHANNEL_TRACKS[postedToday % CHANNEL_TRACKS.length];
    const out = await postPoll(db, track, CHANNEL(), postedToday < 2 ? featured : null);
    return { ...out, postedToday: postedToday + 1 };
}

const escapeHtml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TRACK_LABEL = { medical: 'SMLE', nursing: 'SNLE', dental: 'SDLE' };

/**
 * One "explained question" a day: the question and options, with the answer and
 * the FULL explanation behind a spoiler (a poll's own explanation is cut at 200
 * characters). The track rotates by day (SMLE, SNLE, SDLE), so every exam gets
 * the same effort. At most one per day: the cron calls this three times a day.
 */
export async function runDailyExplainedPostJob(db, { now = new Date() } = {}) {
    if (hasSeparateChannels()) {
        // Every track has (or shares) a channel: each gets its own explained question daily.
        const results = [];
        for (const track of CHANNEL_TRACKS) {
            const channel = channelFor(track);
            if (await channelPostsTodayForTracks(db, 'channel_explained', [track]) >= 1) {
                results.push({ sent: false, track, reason: 'already posted today' });
                continue;
            }
            try { results.push(await postExplained(db, track, channel)); }
            catch (err) { results.push({ sent: false, track, error: err.message }); }
        }
        return { sent: results.some((r) => r.sent), results };
    }
    if (await channelPostsTodayFor(db, 'channel_explained') >= 1) {
        return { sent: false, reason: 'already posted today' };
    }
    const dayNumber = Math.floor(now.getTime() / 86400000);
    return postExplained(db, CHANNEL_TRACKS[dayNumber % CHANNEL_TRACKS.length], CHANNEL());
}

async function postExplained(db, track, channel) {
    const q = await pickExplainedQuestion(db, track);
    if (!q) return { sent: false, track, reason: `no explained question for ${track}` };

    const letters = ['A', 'B', 'C', 'D'];
    const options = q.options.map((o, i) => `${letters[i]}. ${escapeHtml(o)}`).join('\n');
    const answer = `${letters[q.correctOptionIndex]}. ${escapeHtml(q.options[q.correctOptionIndex])}`;
    const head = q.isHard ? '🔥 One of the hardest questions this week' : '📘 Explained question';
    const body = [
        `<b>${head} · ${TRACK_LABEL[track]}</b>`,
        '',
        escapeHtml(q.question_text),
        '',
        options,
        '',
        '👇 Answer and explanation (tap to reveal)',
        `<tg-spoiler><b>${answer}</b>\n\n${escapeHtml(q.explanation)}</tg-spoiler>`,
    ].join('\n').slice(0, 4000);
    const message = await sendMessage(channel, body, { reply_markup: siteButton('Practice more on SQB', `channel_explained_${track}`) });
    await recordSentQuestion(db, { questionId: q.id, context: 'channel_explained' });
    await recordSentMessage(db, { chatId: channel, messageId: message.message_id, deleteAfterDays: CHANNEL_EXPLAINED_TTL_DAYS });
    return { sent: true, questionId: q.id, track, channel, hard: q.isHard };
}

/** Weekly (dedupe-stamped, actually checked daily) weak-topics DM for eligible bot users. */
export async function runWeeklyWeakTopicsJob(db, { outOfTime = () => false } = {}) {
    const chatIds = await findDueForWeeklyDigest(db);
    let sent = 0;
    const errors = [];
    for (const chatId of chatIds) {
        if (outOfTime()) break; // see utils/cronBudget.js
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

/**
 * Deletes channel messages past their scheduled delete_after. DM messages are
 * never logged here (see telegramContentService).
 *
 * Goes through the userbot (telegramUserClient) when it's configured — the
 * Bot API's deleteMessage refuses anything older than ~48h even for an admin
 * bot, and every channel post here has a 7-10 day TTL, so the bot-token path
 * below is really only a fallback for before the one-time userbot login is
 * done (see scripts/telegramUserLogin.js).
 */
export async function runMessageCleanupJob(db) {
    const due = await findMessagesDueForDeletion(db);
    let deleted = 0;
    const errors = [];

    if (isUserbotConfigured()) {
        const byChat = new Map();
        for (const row of due) {
            if (!byChat.has(row.chat_id)) byChat.set(row.chat_id, []);
            byChat.get(row.chat_id).push(row);
        }
        for (const [chatId, rows] of byChat) {
            try {
                await deleteMessagesAsUser(chatId, rows.map((r) => Number(r.message_id)));
                for (const row of rows) {
                    await removeSentMessageLog(db, row.id);
                    deleted++;
                }
            } catch (err) {
                for (const row of rows) errors.push({ id: row.id, error: err.message });
            }
        }
        return { deleted, candidates: due.length, errors };
    }

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
