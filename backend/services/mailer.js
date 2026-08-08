/**
 * Shared mail transport — single place every email in the backend goes through.
 * ------------------------------------------------------------------
 * UPDATE 2026-08-01: this now routes through the CENTRAL EMAIL GATEWAY
 * (https://email-services-nu.vercel.app) instead of talking to SMTP directly.
 *
 * The exported signatures are UNCHANGED — `sendMail` and `fromWithName` behave
 * exactly as before, so none of the 22 call sites in this backend needed
 * editing. What changed is where the message goes.
 *
 * WHY
 *   SQB and the HR system were both sending through the same Resend account,
 *   the same API key and the same verified domain, with no shared accounting.
 *   Resend free is 100 emails/day across ALL projects. The gateway rations that
 *   budget by priority so a broadcast can never starve a password-reset OTP,
 *   and routes owner-facing mail over Gmail so it costs no Resend quota at all.
 *
 * THREE MODES — set EMAIL_GATEWAY_MODE
 *   off     legacy SMTP only. Identical to the behaviour before this change.
 *   shadow  legacy SMTP still does the real sending; the gateway is called in
 *           parallel and only RECORDS what it would have done. No user-visible
 *           change. This is the safe default while the gateway is being proven.
 *   on      the gateway sends. Falls back to legacy SMTP only on infrastructure
 *           failure (network/timeout/5xx) — never on a quota decision, because
 *           that would send the mail anyway and blow the shared cap.
 *
 * Rollback is one env var. No code change.
 *
 * ENV
 *   EMAIL_GATEWAY_URL   https://email-services-nu.vercel.app
 *   EMAIL_GATEWAY_KEY   ek_live_medqize_...
 *   EMAIL_GATEWAY_MODE  off | shadow | on
 *
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS   (legacy path, keep for now)
 *   MAIL_FROM_ADDRESS / MAIL_FROM_NAME
 *
 * The legacy SMTP block below is deliberately retained. Do not delete it until
 * the gateway has run in `on` mode for 30 days — it is the escape hatch.
 */

import nodemailer from 'nodemailer';
import { createEmailClient } from './email-client.js';

// ── legacy SMTP (unchanged) ─────────────────────────────────────────────────

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
 * The original direct-to-SMTP send. Now the fallback path.
 *
 * One payload object is handed to both the gateway and this function, and the
 * two want different attachment shapes — the gateway takes base64 over JSON,
 * nodemailer takes a Buffer. So normalise here rather than carrying two copies
 * of the attachment list around: a base64 `content` is decoded back, and a
 * `url` becomes a `path` for nodemailer to fetch.
 */
function toNodemailerAttachments(attachments) {
    if (!attachments?.length) return undefined;
    return attachments.map((a) => {
        if (a.url) return { filename: a.filename, path: a.url, contentType: a.content_type };
        if (typeof a.content === 'string' && a.content_type) {
            return {
                filename: a.filename,
                content: Buffer.from(a.content, 'base64'),
                contentType: a.content_type,
            };
        }
        return a; // already in nodemailer shape
    });
}

async function legacySend({ name, to, subject, text, html, attachments }) {
    return getTransporter().sendMail({
        from: fromWithName(name),
        to,
        subject,
        text,
        html,
        attachments: toNodemailerAttachments(attachments),
    });
}

// ── gateway ─────────────────────────────────────────────────────────────────

const gateway = createEmailClient({
    baseUrl: process.env.EMAIL_GATEWAY_URL,
    apiKey: process.env.EMAIL_GATEWAY_KEY,
    mode: process.env.EMAIL_GATEWAY_MODE || 'off',
    legacy: legacySend,
    log: (msg, err) => console.warn(`[mailer] ${msg}`, err ?? ''),
});

/**
 * nodemailer takes attachment content as a Buffer or string; the gateway takes
 * base64 over JSON. Only `content` needs converting — a `path` is left alone
 * and turned into a URL the provider fetches itself.
 */
function toGatewayAttachments(attachments) {
    if (!attachments?.length) return undefined;
    return attachments.map((a) => {
        if (a.path && /^https?:\/\//.test(a.path)) {
            return { filename: a.filename, url: a.path, content_type: a.contentType };
        }
        const buf = Buffer.isBuffer(a.content) ? a.content : Buffer.from(a.content ?? '', a.encoding || 'utf8');
        return {
            filename: a.filename,
            content: buf.toString('base64'),
            content_type: a.contentType || 'application/octet-stream',
        };
    });
}

/**
 * Send an email. `name` is only the display name — the sender address always
 * comes from MAIL_FROM_ADDRESS (legacy) or the project's registered local part
 * (gateway), so DKIM/SPF alignment is never broken by a caller.
 *
 * New OPTIONAL fields, all backwards compatible:
 *   event         registered event type, e.g. 'medqize.otp.signup'. Determines
 *                 priority, audience and whether it is digested. Callers that
 *                 omit it get cautious defaults, so nothing breaks — but pass
 *                 it where you can, it is what makes the rationing work.
 *   severity      'CRITICAL' | 'HIGH' | ... for error mail; drives escalation.
 *   sourceOrigin  the browser origin behind this send (req.headers.referer).
 *                 Non-production origins are DROPPED, which is what stops a
 *                 local frontend pointed at prod from emailing real alerts.
 *   idempotencyKey  a replay with the same key never sends twice.
 */
export async function sendMail({
    name, to, subject, text, html, attachments,
    event, severity, sourceOrigin, idempotencyKey,
}) {
    // ONE payload serves both paths: the gateway reads `event`/`fromName`/
    // base64 attachments, and legacySend() normalises the attachments back to
    // nodemailer's shape if it has to take over.
    return gateway.send({
        name,
        to,
        subject,
        text,
        html,
        attachments: toGatewayAttachments(attachments),
        event: event || 'medqize.legacy',
        fromName: name,
        severity,
        sourceOrigin,
        idempotencyKey,
    });
}

/** Escape hatch for anything that must bypass the gateway. Avoid. */
export { legacySend };
