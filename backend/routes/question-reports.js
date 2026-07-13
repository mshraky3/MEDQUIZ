import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendMail } from '../services/mailer.js';

const router = express.Router();

const ADMIN_EMAIL = 'alshraky3@gmail.com';

const sendEmail = async (to, subject, html) => {
    await sendMail({
        name: 'MEDQIZE',
        to,
        subject,
        html,
    });
};

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

        // Fetch question text for the notification email
        const qRes = await req.db.query(
            `SELECT question_text FROM questions WHERE id = $1`,
            [question_id]
        );
        const questionText = qRes.rows[0]?.question_text || `Question ID: ${question_id}`;

        // Notify admin
        try {
            await sendEmail(
                ADMIN_EMAIL,
                `🚩 New Question Report #${reportId}`,
                `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b1021;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1021;padding:32px 0;">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
        <tr>
          <td style="padding:24px 32px 20px;background:#111827;border-bottom:1px solid #1e293b;">
            <span style="font-size:22px;font-weight:800;color:#22d3ee;">MEDQIZE</span>
            <span style="font-size:13px;color:#64748b;margin-left:12px;">Admin Alert</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 12px;">
            <p style="margin:0 0 6px;font-size:18px;color:#f8fafc;font-weight:700;">🚩 New Question Report</p>
            <p style="margin:0 0 20px;font-size:13px;color:#64748b;">Report #${reportId} — submitted by ${user_email}</p>
            <div style="background:#0b1021;border:1px solid #1e293b;border-radius:8px;padding:16px;margin-bottom:16px;">
              <p style="margin:0 0 6px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Question</p>
              <p style="margin:0;color:#e2e8f0;font-size:14px;">${questionText}</p>
            </div>
            ${reason ? `<div style="background:#0b1021;border:1px solid #1e293b;border-radius:8px;padding:16px;margin-bottom:16px;">
              <p style="margin:0 0 6px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">User's Reason</p>
              <p style="margin:0;color:#e2e8f0;font-size:14px;">${reason}</p>
            </div>` : '<p style="color:#475569;font-size:13px;font-style:italic;">No reason provided.</p>'}
            <a href="https://medquiz-web.vercel.app/question-reports" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#22d3ee;color:#0b1021;border-radius:6px;font-weight:700;text-decoration:none;font-size:13px;">Review in Admin Panel →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid #1e293b;">
            <p style="margin:0;font-size:11px;color:#334155;">MEDQIZE · Question Reports System</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
            );
        } catch (emailErr) {
            console.error('[QuestionReports] Admin notification email failed:', emailErr);
            // Don't fail the request if email fails
        }

        return res.status(201).json({ success: true, message: 'Report submitted' });
    } catch (err) {
        console.error('[QuestionReports] Failed to insert report:', err);
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
        console.error('[QuestionReports] Failed to fetch reports:', err);
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
                    <div style="display:flex;gap:12px;margin:16px 0;">
                        <div style="flex:1;background:#fee2e2;border-radius:6px;padding:12px;">
                            <p style="color:#dc2626;font-size:12px;margin:0 0 4px 0;">Old Answer</p>
                            <p style="margin:0;font-weight:600;">${report.current_correct}</p>
                        </div>
                        <div style="flex:1;background:#dcfce7;border-radius:6px;padding:12px;">
                            <p style="color:#16a34a;font-size:12px;margin:0 0 4px 0;">New Correct Answer</p>
                            <p style="margin:0;font-weight:600;">${new_correct_option}</p>
                        </div>
                    </div>
                    ${admin_note ? `<p style="color:#64748b;font-size:13px;">Admin note: ${admin_note}</p>` : ''}
                    <p style="margin-top:20px;">Thank you for helping us improve the platform. Your contribution keeps the question bank accurate for everyone.</p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— The SQB Team</p>
                </div>
                `
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
                    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— The MEDQIZE Team</p>
                </div>
                `
            );
        }

        return res.json({ success: true, message: `Report resolved as ${action}` });
    } catch (err) {
        console.error('[QuestionReports] Failed to resolve report:', err);
        return res.status(500).json({ success: false, message: 'Failed to resolve report' });
    }
});

export default router;
