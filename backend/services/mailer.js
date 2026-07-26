/**
 * Shared mail transport — single place every email in the backend goes through.
 * ------------------------------------------------------------------
 * Configured entirely by env vars so switching provider is a redeploy,
 * not a code change:
 *
 *   SMTP_HOST          e.g. smtp.resend.com
 *   SMTP_PORT          e.g. 465               (default: 587)
 *   SMTP_USER          e.g. resend
 *   SMTP_PASS          provider API key / app password
 *   MAIL_FROM_ADDRESS  e.g. noreply@smle-question-bank.com
 *   MAIL_FROM_NAME     default display name (default: SQB)
 *
 * All required — no hardcoded fallback credentials (a real password used
 * to live here as a "safe default"; that's a secret sitting in source
 * control the moment this repo is pushed anywhere, so it throws instead).
 *
 * The transporter is created lazily on first send (not at import time)
 * because app.js calls dotenv.config() AFTER imports are evaluated — a
 * module-load-time read would miss .env values in local dev.
 */

import nodemailer from 'nodemailer';

let _transporter = null;
function getTransporter() {
    if (!_transporter) {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('Mailer is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS.');
        }
        const port = Number(process.env.SMTP_PORT || 587);
        _transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return _transporter;
}

/** From header with a per-email display name over the single configured address. */
export function fromWithName(name) {
    if (!process.env.MAIL_FROM_ADDRESS) {
        throw new Error('Mailer is not configured — set MAIL_FROM_ADDRESS.');
    }
    const display = name || process.env.MAIL_FROM_NAME || 'SQB';
    return `"${display}" <${process.env.MAIL_FROM_ADDRESS}>`;
}

/**
 * Send an email. `name` is only the display name — the sender address always
 * comes from MAIL_FROM_ADDRESS so DKIM/SPF alignment is never broken.
 */
export async function sendMail({ name, to, subject, text, html, attachments }) {
    return getTransporter().sendMail({
        from: fromWithName(name),
        to,
        subject,
        text,
        html,
        attachments,
    });
}
