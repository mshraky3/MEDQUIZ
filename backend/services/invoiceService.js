/**
 * Customer invoice — PDF receipt emailed on every successful payment.
 *
 * Language: English. pdfkit's built-in fonts are the Latin-only standard 14,
 * and pdfkit performs no Arabic shaping or bidi reordering — Arabic text would
 * render as disconnected, reversed glyphs. A financial document has to be
 * unambiguous, so it is English throughout (matching the existing owner
 * report PDF). Making it bilingual means embedding an Arabic OpenType face
 * (e.g. Amiri/Noto Naskh) plus a reshaper + bidi pass.
 *
 * VAT: shown only when BUSINESS_VAT_NUMBER is configured. Printing a VAT line
 * without a registration number would misstate the document, so until the
 * business is registered the invoice states the amount as-is.
 *
 * All money comes from accountingService, so the invoice, the accounting page
 * and the owner's report can never disagree about a payment.
 */

import PDFDocument from 'pdfkit';
import { sendMail } from './mailer.js';
import { sar, splitVat, vatConfig } from './accountingService.js';

const BRAND = '#0e7490';
const INK = '#111827';
const MUTED = '#6b7280';
const RULE = '#e5e7eb';

const SELLER = {
    name: 'SQB — SMLE Question Bank',
    site: 'www.smle-question-bank.com',
    email: 'alshraky3@gmail.com',
};

/**
 * Stable, human-quotable invoice number derived from the payment itself:
 * SQB-YYYYMM-XXXXXX. Deterministic (no counter to keep in sync), unique
 * because the Moyasar reference is, and regenerable years later from the
 * stored payload alone.
 */
export function invoiceNumberFor(payment) {
    const d = new Date(payment.receivedAt || Date.now());
    const ym = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const short = String(payment.gatewayRef || '')
        .replace(/-/g, '').slice(0, 6).toUpperCase() || 'UNKNWN';
    return `SQB-${ym}-${short}`;
}

const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);

const methodLabel = (payment) => {
    const company = (payment.company || '').toUpperCase();
    if (payment.method === 'applepay') return `Apple Pay${company ? ` · ${company}` : ''}`;
    if (company === 'MADA') return 'mada';
    return company || 'Card';
};

/**
 * Render the invoice. Resolves to a PDF Buffer.
 * @param {object} payment - a settled event from accountingService
 */
export function buildInvoicePdf(payment) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];
        doc.on('data', (c) => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const left = doc.page.margins.left;
        const right = doc.page.width - doc.page.margins.right;
        const usable = right - left;
        const number = invoiceNumberFor(payment);
        const vat = vatConfig();
        const split = splitVat(payment.grossHalalas);

        // ── Header ──
        doc.font('Helvetica-Bold').fontSize(24).fillColor(BRAND).text('SQB', left, 50);
        doc.font('Helvetica').fontSize(9).fillColor(MUTED)
            .text(SELLER.site, left, 78)
            .text(SELLER.email, left, 90);

        doc.font('Helvetica-Bold').fontSize(20).fillColor(INK)
            .text('INVOICE', left, 50, { width: usable, align: 'right' });
        doc.font('Helvetica').fontSize(9.5).fillColor(MUTED)
            .text(`No.  ${number}`, left, 78, { width: usable, align: 'right' })
            .text(`Date  ${fmtDate(payment.receivedAt)}`, left, 91, { width: usable, align: 'right' });

        doc.moveTo(left, 116).lineTo(right, 116).lineWidth(1).strokeColor(BRAND).stroke();

        // ── Paid badge ──
        doc.roundedRect(left, 130, 74, 22, 5).fill('#059669');
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff')
            .text('PAID', left, 137, { width: 74, align: 'center' });

        // ── Parties ──
        const partyTop = 172;
        doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED).text('BILLED TO', left, partyTop);
        doc.font('Helvetica').fontSize(11).fillColor(INK)
            .text(payment.subscriber || 'Customer', left, partyTop + 15, { width: usable / 2 - 10 });

        doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED)
            .text('FROM', left + usable / 2, partyTop);
        doc.font('Helvetica').fontSize(11).fillColor(INK)
            .text(SELLER.name, left + usable / 2, partyTop + 15, { width: usable / 2 });
        if (vat.registered) {
            doc.font('Helvetica').fontSize(9).fillColor(MUTED)
                .text(`VAT No. ${vat.number}`, left + usable / 2, partyTop + 31, { width: usable / 2 });
        }

        // ── Line items ──
        const tableTop = partyTop + 74;
        doc.rect(left, tableTop, usable, 22).fill(BRAND);
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#ffffff')
            .text('DESCRIPTION', left + 10, tableTop + 7, { width: usable - 130 })
            .text('AMOUNT', left, tableTop + 7, { width: usable - 10, align: 'right' });

        const rowY = tableTop + 32;
        doc.font('Helvetica').fontSize(11).fillColor(INK)
            .text('SQB annual subscription — 12 months full access',
                left + 10, rowY, { width: usable - 140 });
        doc.font('Helvetica').fontSize(9).fillColor(MUTED)
            .text('Question bank, summaries and performance analytics',
                left + 10, rowY + 15, { width: usable - 140 });
        doc.font('Helvetica').fontSize(11).fillColor(INK)
            .text(`${sar(payment.grossHalalas)} ${payment.currency}`,
                left, rowY, { width: usable - 10, align: 'right' });

        // ── Totals ──
        let y = rowY + 46;
        doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor(RULE).stroke();
        y += 12;

        const totalLine = (label, value, opts = {}) => {
            doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(opts.bold ? 12 : 10)
                .fillColor(opts.color || (opts.bold ? INK : MUTED))
                .text(label, left + usable / 2, y, { width: usable / 4 - 6, align: 'right' })
                .text(value, left + (usable * 3) / 4, y, { width: usable / 4, align: 'right' });
            y += opts.bold ? 20 : 16;
        };

        if (vat.registered && split.vatHalalas != null) {
            // Price is VAT-inclusive: show the statutory breakdown.
            totalLine('Subtotal', `${sar(split.netHalalas)} ${payment.currency}`);
            totalLine(`VAT (${split.percent}%)`, `${sar(split.vatHalalas)} ${payment.currency}`);
        }
        if (payment.refundedHalalas > 0) {
            totalLine('Refunded', `−${sar(payment.refundedHalalas)} ${payment.currency}`, { color: '#b91c1c' });
        }
        totalLine('Total paid', `${sar(payment.grossHalalas)} ${payment.currency}`, { bold: true });

        // ── Payment details ──
        y += 14;
        doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor(RULE).stroke();
        y += 14;
        doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED).text('PAYMENT DETAILS', left, y);
        y += 15;
        doc.font('Helvetica').fontSize(9.5).fillColor(INK);
        [
            ['Method', methodLabel(payment)],
            ['Processor', 'Moyasar'],
            ['Reference', payment.gatewayRef || '—'],
            ['Paid on', new Date(payment.receivedAt).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'],
        ].forEach(([k, v]) => {
            doc.fillColor(MUTED).text(k, left, y, { width: 90, continued: false });
            doc.fillColor(INK).text(String(v), left + 95, y, { width: usable - 95 });
            y += 15;
        });

        // ── Footer ──
        // Anchored well clear of the bottom margin: three wrapped lines at
        // height-90 overflowed the text area and pdfkit spilled the invoice
        // onto a second page. A receipt must be exactly one page.
        const footY = doc.page.height - 122;
        doc.moveTo(left, footY).lineTo(right, footY).lineWidth(0.7).strokeColor(RULE).stroke();
        doc.font('Helvetica').fontSize(8.5).fillColor(MUTED)
            .text(
                vat.registered
                    ? 'This is a tax invoice issued electronically and is valid without a signature.'
                    : 'This is a computer-generated receipt and is valid without a signature.',
                left, footY + 10, { width: usable, lineBreak: false },
            )
            .text(
                `Questions about your subscription: ${SELLER.email}`,
                left, footY + 24, { width: usable, lineBreak: false },
            )
            .text(
                `Refunds follow the policy at ${SELLER.site}/refund-policy`,
                left, footY + 38, { width: usable, lineBreak: false },
            );

        doc.end();
    });
}

/** Arabic-facing email that carries the (English) PDF invoice. */
function invoiceEmailHtml(payment, number) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1021;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1021;padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1e293b;max-width:480px;width:100%;">
        <tr>
          <td align="center" style="padding:28px 40px 22px;background:#111827;border-bottom:1px solid #1e293b;">
            <img src="https://www.smle-question-bank.com/tab_logo.png" width="36" height="36" alt="SQB" style="vertical-align:middle;border-radius:8px;margin-right:10px;">
            <span style="font-size:26px;font-weight:800;color:#22d3ee;letter-spacing:2px;vertical-align:middle;">SQB</span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:44px;margin-bottom:14px;">🧾</div>
            <h1 style="margin:0 0 8px;font-size:21px;font-weight:800;color:#f8fafc;">تم استلام دفعتك بنجاح</h1>
            <p style="margin:0 0 22px;font-size:14px;color:#94a3b8;line-height:1.8;">
              شكراً لاشتراكك في <strong style="color:#22d3ee;">SQB</strong>.
              اشتراكك مفعّل الآن لمدة سنة كاملة، وتجد فاتورتك مرفقة بهذا البريد بصيغة PDF.
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr><td style="background:#0b1021;border-radius:12px;padding:18px 22px;border:1px solid #1e293b;text-align:right;">
                <p style="margin:0 0 9px;font-size:13px;color:#94a3b8;">رقم الفاتورة: <strong style="color:#f8fafc;font-family:monospace;">${number}</strong></p>
                <p style="margin:0 0 9px;font-size:13px;color:#94a3b8;">المبلغ المدفوع: <strong style="color:#f8fafc;">${sar(payment.grossHalalas)} ${payment.currency}</strong></p>
                <p style="margin:0;font-size:13px;color:#94a3b8;">وسيلة الدفع: <strong style="color:#f8fafc;">${methodLabel(payment)}</strong></p>
              </td></tr>
            </table>
            <a href="https://www.smle-question-bank.com/quizs"
               style="display:inline-block;background:#22d3ee;color:#0b1021;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;">
              ابدأ المذاكرة الآن 🚀
            </a>
            <p style="margin:20px 0 0;font-size:12px;color:#475569;line-height:1.7;">
              الفاتورة المرفقة باللغة الإنجليزية. لأي استفسار عن الاشتراك راسلنا على ${SELLER.email}
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 40px 28px;border-top:1px solid #1e293b;">
            <p style="margin:0 0 4px;font-size:12px;color:#334155;">© 2026 SQB · جميع الحقوق محفوظة</p>
            <p style="margin:0;font-size:11px;color:#1e293b;">هذا البريد تلقائي، يُرجى عدم الرد عليه مباشرةً.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Email the invoice to the customer. Best-effort by design: a mail failure
 * must never roll back a successful payment, so this never throws.
 *
 * @param {object} payment - settled event from accountingService
 * @returns {Promise<{sent:boolean, number:string, reason?:string}>}
 */
export async function sendInvoiceEmail(payment) {
    const number = invoiceNumberFor(payment);
    try {
        if (!payment.subscriber) {
            return { sent: false, number, reason: 'no_email_on_account' };
        }
        const pdf = await buildInvoicePdf(payment);
        await sendMail({
            // Carries a PDF. The gateway takes attachments as base64 and
            // mailer.js converts the Buffer below on the way out.
            event: 'medqize.invoice',
            idempotencyKey: `invoice:${number}`,
            name: 'SQB',
            to: payment.subscriber,
            subject: `🧾 فاتورة اشتراكك في SQB — ${number}`,
            text: `تم استلام دفعتك بنجاح.\nرقم الفاتورة: ${number}\n`
                + `المبلغ: ${sar(payment.grossHalalas)} ${payment.currency}\n`
                + `اشتراكك مفعّل لمدة سنة. الفاتورة مرفقة بصيغة PDF.`,
            html: invoiceEmailHtml(payment, number),
            attachments: [
                { filename: `${number}.pdf`, content: pdf, contentType: 'application/pdf' },
            ],
        });
        return { sent: true, number };
    } catch (err) {
        console.error('[invoice] failed to send invoice email:', err.message);
        return { sent: false, number, reason: err.message };
    }
}
