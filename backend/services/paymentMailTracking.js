/**
 * Makes the "Payment received" owner mail reliable and checkable.
 * ------------------------------------------------------------------
 * Why (found 2026-11-09): payment_events id 48 (1 Nov 2026, 50 SAR) has no owner mail while the other six payments
 * between 24 Oct and 7 Nov do. The old code started the mail in the background AFTER the response was sent, together
 * with the customer's invoice mail, and swallowed any failure with one console line:
 *   - on Vercel (Fluid compute off) the instance can be frozen as soon as the response is out, so a mail that has not
 *     finished is simply never sent;
 *   - the owner mail and the invoice mail started in the same instant, and the mail provider answers
 *     "550 Too many requests, 10 per second" (16 times since 15 Aug);
 *   - nothing recorded whether the mail left, so nobody could tell afterwards.
 *
 * Now: the mails are sent one after the other inside the request (with a hard time cap), a failed send is retried,
 * the result is written into payment_events.raw_payload._sqb (no new column, no migration), and the daily digest
 * lists any paid payment without that mark.
 */

/** Payments received before this instant have no mark (the tracking did not exist), so they are never flagged. */
export const PAYMENT_MAIL_TRACKING_SINCE = new Date('2026-11-10T00:00:00Z');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs `fn`, retrying on ANY error (rate limit, 5xx, network) with growing pauses.
 * @returns {{ok:true, attempts:number}|{ok:false, attempts:number, error:string}}
 */
export async function sendWithRetry(fn, { delays = [500, 1500], wait = sleep, log = console } = {}) {
    let lastErr;
    for (let i = 0; i <= delays.length; i++) {
        try {
            await fn();
            return { ok: true, attempts: i + 1 };
        } catch (err) {
            lastErr = err;
            log.warn?.(`[payment] owner mail attempt ${i + 1} failed: ${err?.message}`);
            if (i < delays.length) await wait(delays[i]);
        }
    }
    return { ok: false, attempts: delays.length + 1, error: String(lastErr?.message || lastErr).slice(0, 200) };
}

/** Writes the outcome into payment_events.raw_payload._sqb. Never throws. */
export async function recordOwnerMail(db, eventId, result, now = new Date()) {
    if (!eventId) return;
    const mark = result.ok
        ? { owner_mail_sent_at: now.toISOString(), owner_mail_attempts: result.attempts }
        : { owner_mail_error: result.error, owner_mail_attempts: result.attempts, owner_mail_failed_at: now.toISOString() };
    try {
        await db.query(
            `UPDATE payment_events
                SET raw_payload = jsonb_set(COALESCE(raw_payload, '{}'::jsonb), '{_sqb}',
                                            COALESCE(raw_payload->'_sqb', '{}'::jsonb) || $2::jsonb, true)
              WHERE id = $1`,
            [eventId, JSON.stringify(mark)]
        );
    } catch (err) {
        console.error('[payment] could not record the owner-mail result:', err.message);
    }
}

/** Resolves with `work` or, after `ms`, with a timeout marker, leaving `work` running. Never rejects. */
export function withinTime(work, ms) {
    return Promise.race([
        Promise.resolve(work).catch(() => 'failed'),
        new Promise((resolve) => setTimeout(() => resolve('timeout'), ms).unref?.()),
    ]);
}
