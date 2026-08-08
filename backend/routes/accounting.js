/**
 * Accounting API — admin only.
 *
 * Mounted at /api/accounting with `req.db` injected (same pattern as the other
 * routers). Every figure comes from services/accountingService.js, so this
 * page, the dashboard, the 2-day PDF report and customer invoices are always
 * computing the same thing from the same rows.
 */
import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
    fetchPaidEvents, summarize, sar, vatConfig, splitVat, reconcileWithGateway,
} from '../services/accountingService.js';
import { riyadhMonthKey } from '../services/adminMetricsService.js';
import { TRACK_KEYS, trackLabelEn } from '../config/tracks.js';
import { buildInvoicePdf, invoiceNumberFor } from '../services/invoiceService.js';

const router = express.Router();
router.use(adminAuth);

/**
 * GET /api/accounting/summary?from=&to=
 * Everything the accounting page renders: per-payment rows, totals, monthly
 * breakdown, per-track and per-scheme splits.
 */
router.get('/summary', async (req, res) => {
    try {
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;
        const rows = await fetchPaidEvents(req.db, {
            from: from && !isNaN(from) ? from : null,
            to: to && !isNaN(to) ? to : null,
        });
        const totals = summarize(rows);

        // ── Monthly ledger ──
        const monthMap = new Map();
        rows.forEach((r) => {
            const key = riyadhMonthKey(r.receivedAt);
            if (!monthMap.has(key)) {
                monthMap.set(key, { month: key, count: 0, gross: 0, fee: 0, refunded: 0, net: 0 });
            }
            const m = monthMap.get(key);
            m.count += 1;
            m.gross += r.grossHalalas;
            m.fee += r.feeHalalas;
            m.refunded += r.refundedHalalas;
            m.net += r.netHalalas;
        });
        const months = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));

        // ── By card scheme (what each payment method actually costs) ──
        const schemeMap = new Map();
        rows.forEach((r) => {
            const key = `${r.company || 'unknown'}${r.method === 'applepay' ? ' (Apple Pay)' : ''}`;
            if (!schemeMap.has(key)) schemeMap.set(key, { scheme: key, count: 0, gross: 0, fee: 0, net: 0 });
            const g = schemeMap.get(key);
            g.count += 1; g.gross += r.grossHalalas; g.fee += r.feeHalalas; g.net += r.netHalalas;
        });
        const schemes = [...schemeMap.values()].sort((a, b) => b.count - a.count);

        // ── By study track ──
        const byTrack = TRACK_KEYS.map((t) => {
            const tr = rows.filter((r) => (r.track || 'medical') === t);
            return {
                track: t,
                label: trackLabelEn(t),
                count: tr.length,
                gross: tr.reduce((n, r) => n + r.grossHalalas, 0),
                fee: tr.reduce((n, r) => n + r.feeHalalas, 0),
                net: tr.reduce((n, r) => n + r.netHalalas, 0),
            };
        });

        // ── By plan ── which of the 5 plans (or "unknown", for pre-plan-model
        // rows) generated this revenue. `seats` sums the accounts each plan's
        // payments activated, not the payment count — a group_5 payment is 1
        // row but 5 seats.
        const planMap = new Map();
        rows.forEach((r) => {
            const key = r.planId || 'unknown';
            if (!planMap.has(key)) {
                planMap.set(key, { plan: key, count: 0, seats: 0, gross: 0, fee: 0, net: 0 });
            }
            const p = planMap.get(key);
            p.count += 1; p.seats += r.seats || 1;
            p.gross += r.grossHalalas; p.fee += r.feeHalalas; p.net += r.netHalalas;
        });
        const byPlan = [...planMap.values()].sort((a, b) => b.gross - a.gross);

        const vat = vatConfig();
        res.json({
            success: true,
            currency: 'SAR',
            vat: {
                ...vat,
                // Only meaningful once registered; null otherwise so the UI
                // renders no VAT line rather than an invented one.
                onGross: splitVat(totals.grossHalalas),
            },
            totals,
            months,
            schemes,
            byTrack,
            byPlan,
            payments: rows.map((r) => ({
                ...r,
                invoiceNumber: invoiceNumberFor(r),
                subscriberLabel: r.subscriber
                    || `#${r.metadataAccountId ?? '?'} (حساب محذوف)`,
            })),
            notes: {
                estimatedCount: totals.estimatedCount,
                estimatedMeaning:
                    'Moyasar did not report a settled fee for these payments; '
                    + 'the fee shown is computed from the scheme rate + fixed fee + VAT.',
            },
        });
    } catch (err) {
        console.error('[accounting/summary] failed:', err);
        res.status(500).json({ success: false, message: 'Failed to build accounting summary' });
    }
});

/**
 * POST /api/accounting/reconcile
 *
 * Ask Moyasar about every payment we haven't verified yet: confirms which are
 * real (and refreshes their fee/refund figures) and marks test-environment
 * payments so they stop counting as revenue.
 *
 * ?all=1 re-checks everything, not just unverified rows.
 */
router.post('/reconcile', async (req, res) => {
    try {
        const result = await reconcileWithGateway(req.db, {
            onlyUnverified: req.query.all !== '1',
        });
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[accounting/reconcile] failed:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/accounting/export.csv?from=&to=
 * The ledger as CSV, for a spreadsheet or an accountant.
 */
router.get('/export.csv', async (req, res) => {
    try {
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;
        const rows = await fetchPaidEvents(req.db, {
            from: from && !isNaN(from) ? from : null,
            to: to && !isNaN(to) ? to : null,
        });

        const esc = (v) => {
            const s = v == null ? '' : String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const header = [
            'invoice_number', 'date_utc', 'subscriber', 'track', 'scheme', 'method',
            'gross_sar', 'fee_sar', 'fee_estimated', 'refunded_sar', 'net_sar',
            'currency', 'moyasar_ref',
        ];
        const lines = [header.join(',')];
        rows.forEach((r) => {
            lines.push([
                invoiceNumberFor(r),
                new Date(r.receivedAt).toISOString(),
                r.subscriber || `#${r.metadataAccountId ?? '?'} (deleted)`,
                r.track || 'medical',
                r.company || '',
                r.method || '',
                sar(r.grossHalalas),
                sar(r.feeHalalas),
                r.estimated ? 'yes' : 'no',
                sar(r.refundedHalalas),
                sar(r.netHalalas),
                r.currency,
                r.gatewayRef,
            ].map(esc).join(','));
        });

        const tag = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="sqb-accounting-${tag}.csv"`);
        // BOM so Excel opens the Arabic subscriber names correctly.
        res.send('﻿' + lines.join('\n'));
    } catch (err) {
        console.error('[accounting/export] failed:', err);
        res.status(500).json({ success: false, message: 'Failed to export' });
    }
});

/**
 * GET /api/accounting/invoice/:gatewayRef.pdf
 * Re-download any customer's invoice — the same document that was emailed to
 * them at payment time, regenerated from the stored payload.
 */
router.get('/invoice/:gatewayRef.pdf', async (req, res) => {
    try {
        const { gatewayRef } = req.params;
        const rows = await fetchPaidEvents(req.db);
        const payment = rows.find((r) => r.gatewayRef === gatewayRef);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        const pdf = await buildInvoicePdf(payment);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition',
            `inline; filename="${invoiceNumberFor(payment)}.pdf"`);
        res.end(pdf);
    } catch (err) {
        console.error('[accounting/invoice] failed:', err);
        res.status(500).json({ success: false, message: 'Failed to build invoice' });
    }
});

export default router;
