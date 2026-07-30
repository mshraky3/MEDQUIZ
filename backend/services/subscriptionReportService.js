/**
 * Subscription Report Service
 * ------------------------------------------------------------------
 * Every 2 days, emails the owner a PDF listing the new paid
 * subscriptions: subscriber name/email, gross amount, Moyasar fee, and
 * the net amount after the fee.
 *
 * Scheduling: piggybacks on the existing daily 9:00 cron
 * (GET /api/cron/daily-emails) — `maybeSendSubscriptionReport` runs on
 * every daily invocation but only actually sends when the last report
 * is ≥ 47 hours old, i.e. every second day. This avoids adding a third
 * Vercel cron entry (the Hobby plan allows only two per project).
 *
 * Fees, refunds and net are computed by services/accountingService.js —
 * the single source of truth shared with the admin accounting page, the
 * dashboard and customer invoices, so no two screens can disagree.
 * Estimated rows (Moyasar hadn't reported a fee yet) are marked * in the PDF.
 */

import PDFDocument from 'pdfkit';
import { sendMail } from './mailer.js';
import { TRACK_KEYS, trackLabelAr } from '../config/tracks.js';
import { OWNER_EMAIL } from '../config/recipients.js';
import { fetchPaidEvents, summarize, sar } from './accountingService.js';

const REPORT_RECIPIENT = OWNER_EMAIL;
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
        // #, Date, Subscriber, Track, Gross, Fee, Net
        const colW = [26, 88, 156, 55, 62, 58, 70];
        const colX = colW.reduce((acc, w, i) => { acc.push(i === 0 ? left : acc[i - 1] + colW[i - 1]); return acc; }, []);
        // Money columns are right-aligned; everything before them is left.
        const FIRST_MONEY_COL = 4;

        // ── Header ──
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#0e7490')
            .text('SQB', { align: 'left' });
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
            const labels = ['#', 'Date', 'Subscriber', 'Track', 'Gross', 'Fee', 'Net'];
            labels.forEach((label, i) => {
                const alignRight = i >= FIRST_MONEY_COL;
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
                    String(r.subscriber).slice(0, 36),
                    r.track,
                    sar(r.grossHalalas),
                    feeText,
                    sar(r.netHalalas),
                ];
                cells.forEach((cell, i) => {
                    const alignRight = i >= FIRST_MONEY_COL;
                    doc.text(cell, colX[i] + 3, y, { width: colW[i] - 6, align: alignRight ? 'right' : 'left', lineBreak: false });
                });
                doc.y = y + 15;
            });

            // ── Totals ──
            const y = doc.y + 2;
            doc.moveTo(left, y).lineTo(left + usable, y).lineWidth(0.8).strokeColor('#0e7490').stroke();
            doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827');
            doc.text(`TOTAL (${rows.length} subscription${rows.length === 1 ? '' : 's'})`, colX[0] + 3, y + 5, { width: colW[0] + colW[1] + colW[2] + colW[3] - 6, lineBreak: false });
            doc.text(sar(totals.gross), colX[4] + 3, y + 5, { width: colW[4] - 6, align: 'right', lineBreak: false });
            doc.text(sar(totals.fee), colX[5] + 3, y + 5, { width: colW[5] - 6, align: 'right', lineBreak: false });
            doc.text(sar(totals.net), colX[6] + 3, y + 5, { width: colW[6] - 6, align: 'right', lineBreak: false });
            doc.y = y + 24;

            // ── Per-track subtotals ──
            // The two tracks share one checkout, so this is the only place the
            // revenue split between medical and nursing students is visible.
            const perTrack = TRACK_KEYS
                .map((t) => ({
                    track: t,
                    count: rows.filter((r) => r.track === t).length,
                    gross: rows.filter((r) => r.track === t).reduce((n, r) => n + r.grossHalalas, 0),
                    net: rows.filter((r) => r.track === t).reduce((n, r) => n + r.netHalalas, 0),
                }))
                .filter((t) => t.count > 0);
            if (perTrack.length > 1) {
                doc.font('Helvetica-Bold').fontSize(9).fillColor('#0e7490')
                    .text('By track', left, doc.y, { width: usable });
                doc.font('Helvetica').fontSize(8.5).fillColor('#111827');
                perTrack.forEach((t) => {
                    doc.text(
                        `${t.track} — ${t.count} subscription${t.count === 1 ? '' : 's'} · gross ${sar(t.gross)} SAR · net ${sar(t.net)} SAR`,
                        left, doc.y + 2, { width: usable }
                    );
                });
                doc.moveDown(0.5);
            }
        }

        doc.moveDown(1);
        doc.font('Helvetica').fontSize(8).fillColor('#6b7280')
            .text('* Fee estimated from the card scheme (mada / credit) + VAT because Moyasar did not report an exact fee for this payment. Exact figures are always available in the Moyasar dashboard.', left, doc.y, { width: usable })
            .text('Automated report — sent every 2 days by the SQB backend. Covers all study tracks.', left, doc.y + 4, { width: usable });

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

    // One shared query + settlement path for every money report.
    const settled = await fetchPaidEvents(db, { from: periodStart, to: periodEnd });
    const rows = settled.map((e) => ({
        ...e,
        subscriber: e.subscriber || `Account #${e.metadataAccountId ?? '?'} (deleted)`,
        track: e.track || 'medical',
    }));
    const s = summarize(settled);
    const totals = {
        gross: s.grossHalalas,
        fee: s.feeHalalas,
        refunded: s.refundedHalalas,
        net: s.netHalalas,
    };

    // Split by track for the email body — both tracks are sold through the
    // same checkout, so without this the inbox can't tell them apart.
    const byTrack = TRACK_KEYS.map((t) => {
        const trackRows = rows.filter((r) => r.track === t);
        return {
            track: t,
            label: trackLabelAr(t),
            count: trackRows.length,
            gross: trackRows.reduce((n, r) => n + r.grossHalalas, 0),
            net: trackRows.reduce((n, r) => n + r.netHalalas, 0),
        };
    });

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
              <tr><td style="padding:6px 0;color:#374151">Fees (Moyasar)</td><td style="text-align:left;font-weight:bold">−${sar(totals.fee)} SAR</td></tr>
              ${totals.refunded > 0 ? `<tr><td style="padding:6px 0;color:#b91c1c">Refunded</td><td style="text-align:left;font-weight:bold;color:#b91c1c">−${sar(totals.refunded)} SAR</td></tr>` : ''}
              <tr><td style="padding:6px 0;color:#374151">Net received</td><td style="text-align:left;font-weight:bold;color:#059669">${sar(totals.net)} SAR</td></tr>
            </table>
            <h3 style="margin:18px 0 6px;font-size:13px;color:#0e7490">By track</h3>
            <table style="width:100%;font-size:13px;border-collapse:collapse">
              ${byTrack.map((t) => `
                <tr>
                  <td style="padding:5px 0;color:#374151">${t.label} <span style="color:#9ca3af">(${t.track})</span></td>
                  <td style="text-align:left;font-weight:bold">${t.count} · ${sar(t.net)} SAR net</td>
                </tr>`).join('')}
            </table>
            <p style="font-size:12px;color:#6b7280;margin-top:14px">Full details (names + per-payment amounts) in the attached PDF.</p>
          </div>
        </div>`;

    await sendMail({
        name: 'SQB Reports',
        to: REPORT_RECIPIENT,
        subject: `📈 Subscriptions Report — ${rows.length} new (${sar(totals.net)} SAR net) — ${dateTag}`,
        text: `New subscriptions: ${rows.length}\nGross: ${sar(totals.gross)} SAR\nFees: -${sar(totals.fee)} SAR\nRefunded: -${sar(totals.refunded)} SAR\nNet received: ${sar(totals.net)} SAR\nPeriod: ${fmtDate(periodStart)} -> ${fmtDate(periodEnd)}`,
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
