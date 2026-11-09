import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendMail } from '../services/mailer.js';
import { trackLabelAr, normalizeTrack, specialtyLabel } from '../config/tracks.js';
import { OWNER_EMAIL } from '../config/recipients.js';
import { renderOwnerMail, ADMIN_LINKS } from '../services/ownerMail.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

const ADMIN_EMAIL = OWNER_EMAIL;

const sendEmail = async (to, subject, html, opts = {}) => {
    await sendMail({
        name: 'SQB',
        to,
        subject,
        html,
        ...opts,
    });
};

/** Owner alert for a new question report (shared owner layout; the student's text is escaped). */
export function buildQuestionReportMail({ reportId, userEmail, qTrack, qTypeLabel, questionText, reason }) {
    const mail = renderOwnerMail({
        status: 'attention',
        title: 'Question report',
        headline: `A student reported a question (report #${reportId}).`,
        sections: [
            { rows: [
                ['Report', `#${reportId}`, { bold: true }],
                ['From', userEmail],
                ['Track', `${trackLabelAr(qTrack)} (${qTrack})`],
                ['Specialty', qTypeLabel],
            ] },
            { title: 'The question', quote: questionText },
            { title: "The student's reason", quote: reason || 'No reason was given.' },
        ],
        todo: 'Open the report, read the question, and either fix the question or dismiss the report. The student is not told anything until you act.',
        action: { label: 'Review in Admin Panel', url: ADMIN_LINKS.reports },
    });
    return { subject: `🚩 New Question Report #${reportId} — ${qTrack}`, ...mail };
}

// POST /api/question-reports — user submits a report
router.post('/', async (req, res) => {
    const { question_id, user_id, user_email, reason } = req.body;

    if (!question_id || !user_id || !user_email) {
        return res.status(400).json({ success: false, message: 'question_id, user_id, and user_email are required' });
    }

    try {
        const insertRes = await req.db.query(
            `INSERT INTO question_reports (question_id, user_id, user_email, reason)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [question_id, user_id, user_email, reason || null]
        );
        const reportId = insertRes.rows[0].id;

        // Fetch question text + which bank it belongs to, so the alert says
        // whose content is being reported without a lookup in the panel.
        const qRes = await req.db.query(
            `SELECT question_text, question_type, track FROM questions WHERE id = $1`,
            [question_id]
        );
        const questionText = qRes.rows[0]?.question_text || `Question ID: ${question_id}`;
        const qTrack = normalizeTrack(qRes.rows[0]?.track);
        const qTypeLabel = qRes.rows[0]?.question_type
            ? specialtyLabel(qRes.rows[0].question_type)
            : '—';

        // Notify admin
        try {
            const mail = buildQuestionReportMail({ reportId, userEmail: user_email, qTrack, qTypeLabel, questionText, reason });
            await sendEmail(ADMIN_EMAIL, mail.subject, mail.html, { text: mail.text, event: 'medqize.owner.question_report_filed' });
        } catch (emailErr) {
            logger.error('[QuestionReports] Admin notification email failed:', emailErr);
            // Don't fail the request if email fails
        }

        return res.status(201).json({ success: true, message: 'Report submitted' });
    } catch (err) {
        logger.error('[QuestionReports] Failed to insert report:', err);
        return res.status(500).json({ success: false, message: 'Failed to submit report' });
    }
});

// GET /admin/question-reports — admin fetches all reports
router.get('/', adminAuth, async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT
                qr.id,
                qr.question_id,
                qr.user_id,
                qr.user_email,
                qr.reason,
                qr.status,
                qr.admin_note,
                qr.old_correct_option,
                qr.new_correct_option,
                qr.created_at,
                qr.resolved_at,
                q.question_text,
                q.option1,
                q.option2,
                q.option3,
                q.option4,
                q.correct_option,
                q.question_type
            FROM question_reports qr
            JOIN questions q ON q.id = qr.question_id
            ORDER BY
                CASE WHEN qr.status = 'pending' THEN 0 ELSE 1 END,
                qr.created_at DESC
        `);
        return res.json({ success: true, reports: result.rows });
    } catch (err) {
        logger.error('[QuestionReports] Failed to fetch reports:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
});

// PUT /admin/question-reports/:id/resolve — admin resolves a report
router.put('/:id/resolve', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { action, new_correct_option, admin_note } = req.body;

    if (!action || !['correct', 'corrected'].includes(action)) {
        return res.status(400).json({ success: false, message: 'action must be "correct" or "corrected"' });
    }
    if (action === 'corrected' && !new_correct_option) {
        return res.status(400).json({ success: false, message: 'new_correct_option is required when action is "corrected"' });
    }

    try {
        // Fetch the report + current question data
        const reportRes = await req.db.query(
            `SELECT qr.*, q.question_text, q.correct_option AS current_correct
             FROM question_reports qr
             JOIN questions q ON q.id = qr.question_id
             WHERE qr.id = $1`,
            [id]
        );

        if (reportRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        const report = reportRes.rows[0];

        if (action === 'corrected') {
            // Update the question's correct answer
            await req.db.query(
                `UPDATE questions SET correct_option = $1 WHERE id = $2`,
                [new_correct_option, report.question_id]
            );

            // Update the report record
            await req.db.query(
                `UPDATE question_reports
                 SET status = 'reviewed_corrected',
                     old_correct_option = $1,
                     new_correct_option = $2,
                     admin_note = $3,
                     resolved_at = NOW()
                 WHERE id = $4`,
                [report.current_correct, new_correct_option, admin_note || null, id]
            );

            // Send email to user
            await sendEmail(
                report.user_email,
                'Question Review — Correction Applied ✅',
                `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
                    <h2 style="color:#22d3ee;">SQB — Question Review Update</h2>
                    <p>Thank you for your report. We reviewed the question and found that a correction was needed.</p>
                    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin:16px 0;">
                        <p style="color:#64748b;font-size:13px;margin:0 0 8px 0;">Question</p>
                        <p style="margin:0;font-weight:600;">${report.question_text}</p>
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                        <tr>
                            <td width="50%" style="background:#fee2e2;border-radius:6px;padding:12px;">
                                <p style="color:#dc2626;font-size:12px;margin:0 0 4px 0;">Old Answer</p>
                                <p style="margin:0;font-weight:600;">${report.current_correct}</p>
                            </td>
                            <td width="8"></td>
                            <td width="50%" style="background:#dcfce7;border-radius:6px;padding:12px;">
                                <p style="color:#16a34a;font-size:12px;margin:0 0 4px 0;">New Correct Answer</p>
                                <p style="margin:0;font-weight:600;">${new_correct_option}</p>
                            </td>
                        </tr>
                    </table>
                    ${admin_note ? `<p style="color:#64748b;font-size:13px;">Admin note: ${admin_note}</p>` : ''}
                    <p style="margin-top:20px;">Thank you for helping us improve the platform. Your contribution keeps the question bank accurate for everyone.</p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— The SQB Team</p>
                </div>
                `,
                { event: 'medqize.question_report.corrected' }
            );
        } else {
            // Question is correct — just update report status
            await req.db.query(
                `UPDATE question_reports
                 SET status = 'reviewed_correct',
                     admin_note = $1,
                     resolved_at = NOW()
                 WHERE id = $2`,
                [admin_note || null, id]
            );

            // Send confirmation email to user
            await sendEmail(
                report.user_email,
                'Question Review — Confirmed Correct ✔️',
                `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
                    <h2 style="color:#22d3ee;">SQB — Question Review Update</h2>
                    <p>Thank you for your report. We carefully reviewed the following question:</p>
                    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin:16px 0;">
                        <p style="color:#64748b;font-size:13px;margin:0 0 8px 0;">Question</p>
                        <p style="margin:0;font-weight:600;">${report.question_text}</p>
                    </div>
                    <div style="background:#dcfce7;border-radius:6px;padding:12px;margin:16px 0;">
                        <p style="color:#16a34a;font-size:12px;margin:0 0 4px 0;">Correct Answer</p>
                        <p style="margin:0;font-weight:600;">${report.current_correct}</p>
                    </div>
                    <p>After review, the question and its answer are confirmed to be correct. We appreciate you taking the time to help maintain quality.</p>
                    ${admin_note ? `<p style="color:#64748b;font-size:13px;">Admin note: ${admin_note}</p>` : ''}
                    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— The SQB Team</p>
                </div>
                `,
                { event: 'medqize.question_report.confirmed' }
            );
        }

        return res.json({ success: true, message: `Report resolved as ${action}` });
    } catch (err) {
        logger.error('[QuestionReports] Failed to resolve report:', err);
        return res.status(500).json({ success: false, message: 'Failed to resolve report' });
    }
});

export default router;
