/**
 * One-time interactive login for the Telegram "userbot" used to delete old
 * channel messages (see services/telegramUserClient.js for why this needs a
 * real user account instead of the bot token — short version: the Bot API
 * can't delete anything older than ~48 hours, even for an admin bot, and
 * channel posts here live 7-10 days before cleanup).
 *
 * Run from backend/: node scripts/telegramUserLogin.js
 *
 * Before running:
 *   1. Get api_id and api_hash for YOUR Telegram account at
 *      https://my.telegram.org -> "API development tools".
 *   2. Set TELEGRAM_API_ID and TELEGRAM_API_HASH in backend/.env.
 *   3. Have on hand the Telegram account that ADMINISTERS @sqb_exam with
 *      delete-messages rights (most likely your own account).
 *
 * This asks for your phone number, the login code Telegram sends you, and
 * your 2FA password if you have one set. It then prints a session string —
 * paste that into TELEGRAM_USER_SESSION in backend/.env AND in the Vercel
 * project's environment variables (Production). Keep it secret: it's
 * equivalent to being logged into your Telegram account from a new device —
 * anyone with it can read/send/delete as you.
 */
import dotenv from 'dotenv';
import { createInterface } from 'node:readline/promises';
import { TelegramClient } from 'teleproto';
import { StringSession } from 'teleproto/sessions/index.js';

dotenv.config();

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

if (!apiId || !apiHash) {
    console.error('Set TELEGRAM_API_ID and TELEGRAM_API_HASH in backend/.env first — get them from https://my.telegram.org.');
    process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const client = new TelegramClient(new StringSession(''), apiId, apiHash, { connectionRetries: 5 });

await client.start({
    phoneNumber: () => rl.question('Phone number (with country code, e.g. +9665XXXXXXXX): '),
    password: () => rl.question('2FA password (leave blank if you have not set one): '),
    phoneCode: () => rl.question('Code Telegram just sent you: '),
    onError: (err) => console.error(err),
});

const me = await client.getMe();
console.log(`\nLogged in as ${me.firstName || ''}${me.username ? ` (@${me.username})` : ''}.`);
console.log('\nSession string — save this as TELEGRAM_USER_SESSION in backend/.env AND in Vercel (Production env vars):\n');
console.log(client.session.save());
console.log('\nDone. This script does not need to run again unless the session gets revoked.');

rl.close();
await client.disconnect();
process.exit(0);
