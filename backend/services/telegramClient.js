/**
 * Thin wrapper over the Telegram Bot API (https://core.telegram.org/bots/api).
 * No bot framework — this is a webhook-driven serverless deploy (Vercel), so
 * there is no long-lived process for a library like grammy/telegraf to hold
 * a polling loop in. axios is already a dependency; that's all this needs.
 *
 * Mirrors services/mailer.js's shape: one place every Telegram call goes
 * through, so nothing else in the backend talks to api.telegram.org directly.
 */

import axios from 'axios';
import FormData from 'form-data';

const API_BASE = 'https://api.telegram.org';
export const SITE_URL = 'https://www.smle-question-bank.com';

function token() {
    const t = process.env.TELEGRAM_BOT_TOKEN;
    if (!t) throw new Error('TELEGRAM_BOT_TOKEN is not set');
    return t;
}

async function call(method, payload) {
    const url = `${API_BASE}/bot${token()}/${method}`;
    const { data } = await axios.post(url, payload, { timeout: 10000 });
    if (!data.ok) {
        throw new Error(`Telegram API ${method} failed: ${data.description || 'unknown error'}`);
    }
    return data.result;
}

/** Inline "visit the site" button attached to most bot/channel messages — the actual funnel. */
export function siteButton(text = 'Try more on SQB', utm = 'bot') {
    return {
        inline_keyboard: [[{ text, url: `${SITE_URL}/?utm_source=telegram&utm_medium=${utm}` }]],
    };
}

export function sendMessage(chatId, text, opts = {}) {
    return call('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...opts,
    });
}

/**
 * Native Telegram "quiz" poll — Telegram itself highlights the correct answer
 * and shows `explanation` after the voter answers, so no follow-up message is
 * needed for that part.
 *
 * `isAnonymous: false` only works in a private chat (DM) or a group — polls
 * posted to a channel MUST be anonymous, so voter identity (and therefore
 * per-user correctness) can only ever be tracked for DM quizzes.
 */
export function sendQuizPoll(chatId, { question, options, correctOptionIndex, explanation, isAnonymous = true, replyMarkup }) {
    return call('sendPoll', {
        chat_id: chatId,
        question: question.slice(0, 300),
        options: options.map((o) => String(o).slice(0, 100)),
        type: 'quiz',
        correct_option_id: correctOptionIndex,
        explanation: explanation ? explanation.slice(0, 200) : undefined,
        is_anonymous: isAnonymous,
        reply_markup: replyMarkup,
    });
}

/** Photo upload (Buffer) with a caption — used for the weekly channel topic-summary card. */
export async function sendPhoto(chatId, photoBuffer, { caption, replyMarkup, filename = 'card.png' } = {}) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', photoBuffer, { filename, contentType: 'image/png' });
    if (caption) form.append('caption', caption.slice(0, 1024));
    form.append('parse_mode', 'HTML');
    if (replyMarkup) form.append('reply_markup', JSON.stringify(replyMarkup));

    const url = `${API_BASE}/bot${token()}/sendPhoto`;
    const { data } = await axios.post(url, form, { headers: form.getHeaders(), timeout: 20000 });
    if (!data.ok) throw new Error(`Telegram API sendPhoto failed: ${data.description || 'unknown error'}`);
    return data.result;
}

/**
 * Delete a message the bot sent. Channel posts: works at any age (the bot is
 * an admin there). Private-chat messages: Telegram hard-caps this at 48
 * hours regardless of admin status — there is no way around that via the
 * Bot API, so callers should not rely on this succeeding for old DMs.
 */
export function deleteMessage(chatId, messageId) {
    return call('deleteMessage', { chat_id: chatId, message_id: messageId });
}

export function setWebhook(url, secretToken) {
    return call('setWebhook', {
        url,
        secret_token: secretToken,
        allowed_updates: ['message', 'poll_answer'],
    });
}

export function deleteWebhook() {
    return call('deleteWebhook', {});
}

export function getWebhookInfo() {
    return call('getWebhookInfo', {});
}

export function getMe() {
    return call('getMe', {});
}
