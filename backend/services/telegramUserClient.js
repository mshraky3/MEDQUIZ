/**
 * MTProto "userbot" client — used ONLY for deleting old channel messages.
 *
 * Why this exists: the Bot API's deleteMessage refuses to delete anything
 * older than ~48 hours, even for a bot that is a full channel admin with
 * can_delete_messages (confirmed directly against @sqb_exam — see the
 * comment on deleteMessage in telegramClient.js). Channel posts here live
 * 7-10 days before cleanup is due, so the bot token can never actually
 * delete them by the time runMessageCleanupJob gets to them. A real
 * Telegram user account has no such age limit when deleting messages in a
 * channel it administers, so this authenticates as that account over MTProto
 * (not the bot token) and does the delete there instead.
 *
 * One-time setup: run `node scripts/telegramUserLogin.js` (see that file for
 * the full walkthrough), then set TELEGRAM_API_ID / TELEGRAM_API_HASH /
 * TELEGRAM_USER_SESSION here and in Vercel. Until those are set,
 * runMessageCleanupJob falls back to the bot-API path in telegramClient.js
 * instead of throwing — that path just won't succeed for messages this old.
 */
import { TelegramClient } from 'teleproto';
import { StringSession } from 'teleproto/sessions/index.js';

export function isUserbotConfigured() {
    return Boolean(process.env.TELEGRAM_API_ID && process.env.TELEGRAM_API_HASH && process.env.TELEGRAM_USER_SESSION);
}

/**
 * Delete a batch of messages in one chat, as the logged-in user account.
 * Connects and disconnects per call — there's no long-lived process here to
 * keep an MTProto socket open in (this runs inside a Vercel serverless
 * function once a day, not a persistent worker).
 */
export async function deleteMessagesAsUser(chatUsername, messageIds) {
    if (!isUserbotConfigured()) {
        throw new Error(
            'Telegram userbot is not configured (TELEGRAM_API_ID/TELEGRAM_API_HASH/TELEGRAM_USER_SESSION missing) — run scripts/telegramUserLogin.js once.'
        );
    }
    const client = new TelegramClient(
        new StringSession(process.env.TELEGRAM_USER_SESSION),
        Number(process.env.TELEGRAM_API_ID),
        process.env.TELEGRAM_API_HASH,
        { connectionRetries: 2 } // keep this low — a serverless function has a hard timeout, unlike the 5-retry default meant for long-lived processes
    );
    await client.connect();
    try {
        if (!(await client.isUserAuthorized())) {
            throw new Error('Telegram userbot session is no longer valid — re-run scripts/telegramUserLogin.js and update TELEGRAM_USER_SESSION.');
        }
        await client.deleteMessages(chatUsername, messageIds, { revoke: true });
    } finally {
        await client.disconnect().catch(() => {}); // best-effort — a disconnect failure shouldn't mask a real error from the try block above
    }
}
