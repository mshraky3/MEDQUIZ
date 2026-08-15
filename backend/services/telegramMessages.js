/**
 * English copy for the bot. Kept separate from routes/telegram.js so the
 * command-dispatch logic isn't buried in template strings.
 */

import { siteButton, SITE_URL } from './telegramClient.js';

export const CHANNEL_HANDLE = process.env.TELEGRAM_CHANNEL || '@sqb_exam';

export function welcomeMessage(firstName) {
    const name = firstName ? `, ${firstName}` : '';
    return {
        text:
            `👋 Welcome to SQB${name}!\n\n` +
            `This bot helps you prep for the Saudi Medical Licensing Exam (SMLE):\n\n` +
            `📌 <b>${CHANNEL_HANDLE}</b> — a new practice question posted every day, free to everyone\n` +
            `📝 /quiz — get a practice question right here, right now\n` +
            `📊 /weakspots — see which topics you're weakest in (after a few /quiz answers)\n` +
            `🌐 /website — the full question bank, explanations and progress tracking\n\n` +
            `Questions or feedback? Join the discussion group linked to the channel — real students, real answers.`,
        opts: { reply_markup: siteButton('Open SQB', 'bot_start') },
    };
}

export function helpMessage() {
    return {
        text:
            `I can do a few things:\n\n` +
            `/quiz — a practice question\n` +
            `/weakspots — your weak topics so far\n` +
            `/website — the full SQB question bank\n\n` +
            `For open discussion, use the group linked to ${CHANNEL_HANDLE} — this bot itself doesn't answer free-form medical questions.`,
    };
}

export function noWeakspotsYetMessage(totalAnswered) {
    const remaining = 5 - totalAnswered;
    return {
        text:
            `You've answered ${totalAnswered} question${totalAnswered === 1 ? '' : 's'} so far — ` +
            `answer ${remaining} more with /quiz and I'll show you where to focus.`,
    };
}

export function weakspotsMessage(topics) {
    const lines = topics.map((t, i) => `${i + 1}. <b>${t.labelEn}</b> — ${t.accuracy}% correct (${t.total} answered)`);
    return {
        text:
            `📊 Your weakest topics right now:\n\n${lines.join('\n')}\n\n` +
            `Sign up on the site for full progress tracking, unlimited questions and topic summaries.`,
        opts: { reply_markup: siteButton('Track my progress on SQB', 'bot_weakspots') },
    };
}

export function weeklyDigestMessage(topics) {
    const lines = topics.map((t, i) => `${i + 1}. <b>${t.labelEn}</b> — ${t.accuracy}% correct`);
    return {
        text:
            `📅 Your weekly weak-spots check-in:\n\n${lines.join('\n')}\n\n` +
            `Keep going with /quiz, or move to the full site for structured summaries on each topic.`,
        opts: { reply_markup: siteButton('Study weak topics on SQB', 'bot_weekly') },
    };
}

export function websiteMessage() {
    return {
        text: `The full SQB question bank, explanations and progress tracking:\n${SITE_URL}`,
        opts: { reply_markup: siteButton('Open SQB', 'bot_website') },
    };
}

export function noQuestionsAvailableMessage() {
    return { text: `No questions available right now — try again in a bit.` };
}
