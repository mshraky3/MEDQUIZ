/**
 * Subscription Report Service
 * ------------------------------------------------------------------
 * Every 2 days, emails alshraky3@gmail.com a PDF listing the new paid
 * subscriptions: subscriber name/email, gross amount, Moyasar fee, and
 * the net amount after the fee.
 *
 * Scheduling: piggybacks on the existing daily 9:00 cron
 * (GET /api/cron/daily-emails) — `maybeSendSubscriptionReport` runs on
 * every daily invocation but only actually sends when the last report
 * is ≥ 47 hours old, i.e. every second day. This avoids adding a third
 * Vercel cron entry (the Hobby plan allows only two per project).
 *
 * Fees: when Moyasar's payment object includes a real `fee` (halalas)
 * it is used as-is. Otherwise the fee is ESTIMATED from the card
 * scheme — mada vs visa/mastercard — plus VAT, all env-overridable:
 *   MOYASAR_MADA_FEE_PERCENT  (default 1.00)
 *   MOYASAR_CARD_FEE_PERCENT  (default 2.75)
 *   MOYASAR_FEE_VAT_PERCENT   (default 15)
 * Estimated rows are marked with * in the PDF.
 */

import PDFDocument from 'pdfkit';
import { sendMail } from './mailer.js';

const REPORT_RECIPIENT = 'alshraky3@gmail.com';
const REPORT_INTERVAL_HOURS = 47; // "every 2 days" with 1h tolerance for cron jitter
const DEFAULT_WINDOW_HOURS = 48;  // first run / fallback window

let _logTableReady = null;
function ensureReportLog(db) {
    if (_logTableReady) return _logTableReady;
    _logTableReady = db.query(`
        CREATE TABLE IF NOT EXISTS subscription_report_log (
            id                   BIGSERIAL PRIMARY KEY,
            period_start         TIMESTAMPTZ NOT NULL,
            period_end           TIMESTAMPTZ NOT NULL,
            new_subscriptions    INT    NOT NULL DEFAULT 0,
            total_gross_halalas  BIGINT NOT NULL DEFAULT 0,
            total_fee_halalas    BIGINT NOT NULL DEFAULT 0,
            total_net_halalas    BIGINT NOT NULL DEFAULT 0,
            sent_to              TEXT   NOT NULL,
            sent_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `).catch((err) => {
        _logTableReady = null; // retry on next invocation
        throw err;
    });
    return _logTableReady;
}

/** Gateway fee in halalas: real when Moyasar provides it, estimated otherwise. */
export function computeFee(rawPayment, amountHalalas) {
    const actual = Number(rawPayment?.fee);
    if (Number.isFinite(actual) && actual > 0) {
        return { feeHalalas: Math.round(actual), estimated: false };
    }
    const company = String(rawPayment?.source?.company || '').toLowerCase();
    const madaPct = Number(process.env.MOYASAR_MADA_FEE_PERCENT || 1.0);
    const cardPct = Number(process.env.MOYASAR_CARD_FEE_PERCENT || 2.75);
    const vatPct = Number(process.env.MOYASAR_FEE_VAT_PERCENT || 15);
    const pct = company === 'mada' ? madaPct : cardPct;
    const feeHalalas = Math.round(amountHalalas * (pct / 100) * (1 + vatPct / 100));
    return { feeHalalas, estimated: true };
}

const sar = (halalas) => (halalas / 100).toFixed(2);

function fmtDate(d) {
    return new Date(d).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

/** Render the report rows into a PDF, resolved as a Buffer. */
function buildReportPdf(rows, totals, periodStart, periodEnd) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
        const chunks = [];
        doc.on('data', (c) => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const left = doc.page.margins.left;
        const usable = doc.page.width - left - doc.page.margins.right; // 515
        // #, Date, Subscriber, Gross, Fee, Net
        const colW = [28, 92, 205, 65, 60, 65];
        const colX = colW.reduce((acc, w, i) => { acc.push(i === 0 ? left : acc[i - 1] + colW[i - 1]); return acc; }, []);
        const money = { width: null, align: 'right' };

        // ── Header ──
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#0e7490')
            .text('SMLE Question Bank', { align: 'left' });
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827')
            .text('New Subscriptions Report', { align: 'left' });
        doc.moveDown(0.3);
        doc.font('Helvetica').fontSize(9.5).fillColor('#374151')
            .text(`Period:  ${fmtDate(periodStart)}  →  ${fmtDate(periodEnd)}`)
            .text(`Generated: ${fmtDate(new Date())}`)
            .text(`Plan: annual subscription — amounts in SAR`);
        doc.moveDown(0.8);

        const drawHeaderRow = () => {
            const y = doc.y;
            doc.rect(left, y - 3, usable, 18).fill('#0e7490');
            doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff');
            const labels = ['#', 'Date', 'Subscriber', 'Gross', 'Fee', 'Net'];
            labels.forEach((label, i) => {
                const alignRight = i >= 3;
                doc.text(label, colX[i] + 3, y, { width: colW[i] - 6, align: alignRight ? 'right' : 'left' });
            });
            doc.y = y + 17;
        };

        if (rows.length === 0) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#374151')
                .text('No new subscriptions in this period.', { align: 'left' });
        } else {
            drawHeaderRow();
            rows.forEach((r, idx) => {
                if (doc.y > doc.page.height - 90) { // page break, repeat header
                    doc.addPage();
                    drawHeaderRow();
                }
                const y = doc.y;
                if (idx % 2 === 1) {
                    doc.rect(left, y - 3, usable, 16).fill('#f1f5f9');
                }
                doc.font('Helvetica').fontSize(8.5).fillColor('#111827');
                const feeText = sar(r.feeHalalas) + (r.estimated ? ' *' : '');
                const cells = [
                    String(idx + 1),
                    fmtDate(r.receivedAt).slice(0, 16),
                    String(r.subscriber).slice(0, 48),
                    sar(r.grossHalalas),
                    feeText,
                    sar(r.netHalalas),
                ];
                cells.forEach((cell, i) => {
                    const alignRight = i >= 3;
                    doc.text(cell, colX[i] + 3, y, { width: colW[i] - 6, align: alignRight ? 'right' : 'left', lineBreak: false });
                });
                doc.y = y + 15;
            });

            // ── Totals ──
            const y = doc.y + 2;
            doc.moveTo(left, y).lineTo(left + usable, y).lineWidth(0.8).strokeColor('#0e7490').stroke();
            doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827');
            doc.text(`TOTAL (${rows.length} subscription${rows.length === 1 ? '' : 's'})`, colX[0] + 3, y + 5, { width: colW[0] + colW[1] + colW[2] - 6, lineBreak: false });
            doc.text(sar(totals.gross), colX[3] + 3, y + 5, { width: colW[3] - 6, align: 'right', lineBreak: false });
            doc.text(sar(totals.fee), colX[4] + 3, y + 5, { width: colW[4] - 6, align: 'right', lineBreak: false });
            doc.text(sar(totals.net), colX[5] + 3, y + 5, { width: colW[5] - 6, align: 'right', lineBreak: false });
            doc.y = y + 24;
        }

        doc.moveDown(1);
        doc.font('Helvetica').fontSize(8).fillColor('#6b7280')
            .text('* Fee estimated from the card scheme (mada / credit) + VAT because Moyasar did not report an exact fee for this payment. Exact figures are always available in the Moyasar dashboard.', left, doc.y, { width: usable })
            .text('Automated report — sent every 2 days by the SMLE Question Bank backend.', left, doc.y + 4, { width: usable });

        doc.end();
    });
}

/**
 * Build and email the report for [periodStart, periodEnd].
 * @param {import('pg').Pool} db
 * @param {{periodStart?: Date, periodEnd?: Date, record?: boolean}} opts
 */
export async function sendSubscriptionReport(db, opts = {}) {
    await ensureReportLog(db);
    const periodEnd = opts.periodEnd || new Date();
    const periodStart = opts.periodStart || new Date(periodEnd.getTime() - DEFAULT_WINDOW_HOURS * 3600 * 1000);
    const record = opts.record !== false;

    const { rows: events } = await db.query(
        `SELECT pe.id, pe.account_id, pe.gateway_ref, pe.amount_halalas, pe.currency,
                pe.received_at, pe.raw_payload,
                a.username, a.email
           FROM payment_events pe
           LEFT JOIN accounts a ON a.id = pe.account_id
          WHERE pe.status = 'paid'
            AND pe.event_type = 'payment_paid'
            AND pe.received_at >  $1
            AND pe.received_at <= $2
          ORDER BY pe.received_at ASC`,
        [periodStart, periodEnd]
    );

    const rows = events.map((e) => {
        const gross = Number(e.amount_halalas) || 0;
        const { feeHalalas, estimated } = computeFee(e.raw_payload, gross);
        return {
            receivedAt: e.received_at,
            subscriber: e.email || e.username || `Account #${e.account_id ?? '?'}`,
            grossHalalas: gross,
            feeHalalas,
            netHalalas: gross - feeHalalas,
            estimated,
        };
    });
    const totals = rows.reduce(
        (t, r) => ({ gross: t.gross + r.grossHalalas, fee: t.fee + r.feeHalalas, net: t.net + r.netHalalas }),
        { gross: 0, fee: 0, net: 0 }
    );

    const pdf = await buildReportPdf(rows, totals, periodStart, periodEnd);
    const dateTag = new Date().toISOString().slice(0, 10);

    const summaryHtml = `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#0e7490,#155e75);color:#fff;padding:18px 22px;border-radius:10px 10px 0 0">
            <h2 style="margin:0;font-size:18px">📈 New Subscriptions Report</h2>
            <p style="margin:6px 0 0;font-size:12px;opacity:.85">${fmtDate(periodStart)} → ${fmtDate(periodEnd)}</p>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:18px 22px;border-radius:0 0 10px 10px">
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#374151">New subscriptions</td><td style="text-align:left;font-weight:bold">${rows.length}</td></tr>
              <tr><td style="padding:6px 0;color:#374151">Gross total</td><td style="text-align:left;font-weight:bold">${sar(totals.gross)} SAR</td></tr>
              <tr><td style="padding:6px 0;color:#374151">Fees (Moyasar)</td><td style="text-align:left;font-weight:bold">${sar(totals.fee)} SAR</td></tr>
              <tr><td style="padding:6px 0;color:#374151">Net after fees</td><td style="text-align:left;font-weight:bold;color:#059669">${sar(totals.net)} SAR</td></tr>
            </table>
            <p style="font-size:12px;color:#6b7280;margin-top:14px">Full details (names + per-payment amounts) in the attached PDF.</p>
          </div>
        </div>`;

    await sendMail({
        name: 'SQB Reports',
        to: REPORT_RECIPIENT,
        subject: `📈 Subscriptions Report — ${rows.length} new (${sar(totals.net)} SAR net) — ${dateTag}`,
        text: `New subscriptions: ${rows.length}\nGross: ${sar(totals.gross)} SAR\nFees: ${sar(totals.fee)} SAR\nNet: ${sar(totals.net)} SAR\nPeriod: ${fmtDate(periodStart)} -> ${fmtDate(periodEnd)}`,
        html: summaryHtml,
        attachments: [
            { filename: `subscriptions-report-${dateTag}.pdf`, content: pdf, contentType: 'application/pdf' },
        ],
    });

    if (record) {
        await db.query(
            `INSERT INTO subscription_report_log
                (period_start, period_end, new_subscriptions, total_gross_halalas, total_fee_halalas, total_net_halalas, sent_to)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [periodStart, periodEnd, rows.length, totals.gross, totals.fee, totals.net, REPORT_RECIPIENT]
        );
    }

    return {
        sent: true,
        recipient: REPORT_RECIPIENT,
        newSubscriptions: rows.length,
        grossSar: sar(totals.gross),
        feeSar: sar(totals.fee),
        netSar: sar(totals.net),
        periodStart,
        periodEnd,
    };
}

/**
 * Called from the daily cron: sends the report only when the previous one
 * is ≥ 47h old (i.e. every second day). The new period starts exactly where
 * the last one ended so no subscription is ever skipped or double-counted,
 * even across month boundaries or missed cron runs.
 */
export async function maybeSendSubscriptionReport(db) {
    await ensureReportLog(db);
    const { rows } = await db.query(
        `SELECT period_end, sent_at FROM subscription_report_log ORDER BY sent_at DESC LIMIT 1`
    );
    const last = rows[0];
    if (last) {
        const hoursSince = (Date.now() - new Date(last.sent_at).getTime()) / 3600000;
        if (hoursSince < REPORT_INTERVAL_HOURS) {
            return { sent: false, reason: 'not_due', hoursSinceLast: Math.round(hoursSince) };
        }
    }
    return sendSubscriptionReport(db, {
        periodStart: last ? new Date(last.period_end) : undefined,
        periodEnd: new Date(),
    });
}
