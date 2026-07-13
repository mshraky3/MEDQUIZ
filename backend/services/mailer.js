/**
 * Shared mail transport — single place every email in the backend goes through.
 * ------------------------------------------------------------------
 * Configured entirely by env vars so switching provider is a redeploy,
 * not a code change:
 *
 *   SMTP_HOST          e.g. smtp.resend.com   (default: smtp.gmail.com)
 *   SMTP_PORT          e.g. 465               (default: 587)
 *   SMTP_USER          e.g. resend            (default: legacy Gmail account)
 *   SMTP_PASS          provider API key / app password
 *   MAIL_FROM_ADDRESS  e.g. noreply@smle-question-bank.com
 *   MAIL_FROM_NAME     default display name (default: MEDQIZE)
 *
 * While the env vars are unset everything falls back to the legacy Gmail
 * sender, so deploys are safe in any order. Once a domain-verified provider
 * is configured (SPF + DKIM on smle-question-bank.com), mail is sent from
 * the domain and lands in the inbox instead of spam.
 *
 * The transporter is created lazily on first send (not at import time)
 * because app.js calls dotenv.config() AFTER imports are evaluated — a
 * module-load-time read would miss .env values in local dev.
 */

import nodemailer from 'nodemailer';

let _transporter = null;
function getTransporter() {
    if (!_transporter) {
        const port = Number(process.env.SMTP_PORT || 587);
        _transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER || 'alshrakynodeapp@gmail.com',
                pass: process.env.SMTP_PASS || 'ssjpnctdsyqxylxd',
            },
        });
    }
    return _transporter;
}

/** From header with a per-email display name over the single configured address. */
export function fromWithName(name) {
    const address = process.env.MAIL_FROM_ADDRESS || 'alshrakynodeapp@gmail.com';
    const display = name || process.env.MAIL_FROM_NAME || 'MEDQIZE';
    return `"${display}" <${address}>`;
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
