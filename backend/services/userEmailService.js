/**
 * User Email Campaign Service
 * Sends Arabic HTML emails: Welcome, Inactivity, Streak Reminder, Feedback
 */

import { sendMail } from './mailer.js';

const sendEmail = async (to, subject, html, text) => {
  await sendMail({
    name: 'SQB',
    to,
    subject,
    text: text || '',
    html,
  });
};

// ─── Shared layout wrapper ─────────────────────────────────────────────────
const wrapLayout = (bodyContent) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1021;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1021;padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1e293b;max-width:480px;width:100%;">
        <!-- Logo Header -->
        <tr>
          <td align="center" style="padding:28px 40px 22px;background:#111827;border-bottom:1px solid #1e293b;">
            <span style="font-size:26px;font-weight:800;color:#22d3ee;letter-spacing:2px;">SQB</span>
          </td>
        </tr>
        <!-- Body -->
        ${bodyContent}
        <!-- Footer -->
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

// ─── 1. WELCOME EMAIL ──────────────────────────────────────────────────────
export const sendWelcomeEmail = async (to, username) => {
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🎉</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              أهلًا وسهلًا يا ${username}!
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              يسعدنا انضمامك إلى <strong style="color:#22d3ee;">SQB</strong> —
              المنصة المصممة خصيصًا لمساعدتك على الاستعداد لاختبار الترخيص الطبي
              بأسلوب منظّم وفعّال.
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#22d3ee;">ماذا تجد في المنصة؟</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">✅ &nbsp;أسئلة مصنّفة حسب التخصص والمستوى</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">📊 &nbsp;تحليل أدائك وتتبّع نقاط ضعفك</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">🔥 &nbsp;نظام السلاسل اليومية للحفاظ على المداومة</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;">🏆 &nbsp;اختبارات نهائية شاملة</p>
                </td>
              </tr>
            </table>
            <a href="https://www.smle-question-bank.com/"
               style="display:inline-block;background:#22d3ee;color:#0b1021;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
              ابدأ الآن 🚀
            </a>
          </td>
        </tr>
    `);
  await sendEmail(to, '🎉 أهلًا بك في SQB!', html, `أهلًا يا ${username}! يسعدنا انضمامك إلى SQB.`);
};

// ─── 2. INACTIVITY EMAIL ───────────────────────────────────────────────────
const MOTIVATIONAL_QUOTES = [
  { text: 'النجاح ليس صدفة، بل هو تعب واجتهاد مستمر', attr: '' },
];

export const sendInactivityEmail = async (to, username) => {
  const quotesHtml = MOTIVATIONAL_QUOTES.map(q => `
        <tr>
          <td style="padding:6px 0;">
            <div style="background:#0b1021;border-right:3px solid #22d3ee;border-radius:8px;padding:14px 18px;">
              <p style="margin:0 0 4px;font-size:13px;color:#f8fafc;font-style:italic;">"${q.text}"</p>
              ${q.attr ? `<p style="margin:0;font-size:11px;color:#475569;">— ${q.attr}</p>` : ''}
            </div>
          </td>
        </tr>
    `).join('');

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">📚</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              نفتقدك يا ${username}!
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              لم تزرنا منذ بضعة أيام — والاختبار لا ينتظر!
              كل يوم يمرّ بدون مراجعة هو يوم يُضعف استعدادك.
              لا بأس، يمكنك العودة الآن والبدء من حيث توقفت.
            </p>
            <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#22d3ee;text-align:right;">
              💡 مَن يُلهمنا اليوم:
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              ${quotesHtml}
            </table>
            <div style="background:#0b1021;border-radius:12px;padding:16px 20px;margin-bottom:28px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                🎯 &nbsp;لا يحتاج الأمر سوى <strong style="color:#f8fafc;">10 دقائق يوميًا</strong> للحفاظ على تقدّمك.
                عُد الآن وأكمل جلستك القادمة!
              </p>
            </div>
            <a href="https://www.smle-question-bank.com/"
               style="display:inline-block;background:#22d3ee;color:#0b1021;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
              عُد الآن 💪
            </a>
          </td>
        </tr>
    `);
  await sendEmail(to, '📚 نفتقدك! الاختبار ينتظرك', html, `نفتقدك يا ${username}! عُد إلى SQB وأكمل مراجعتك.`);
};

// ─── 3. STREAK REMINDER EMAIL ──────────────────────────────────────────────
export const sendStreakReminderEmail = async (to, username, currentStreak) => {
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🔥</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              سلسلتك في خطر يا ${username}!
            </h1>
            <p style="margin:0 0 28px;font-size:14px;color:#94a3b8;line-height:1.7;">
              لم تُكمل جلستك اليوم بعد. إذا لم تذاكر قبل منتصف الليل
              ستنكسر سلسلتك وتبدأ من الصفر!
            </p>
            <!-- Streak Counter -->
            <div style="background:#0b1021;border:2px solid #f97316;border-radius:12px;
                        padding:24px 48px;display:inline-block;margin-bottom:28px;">
              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;">سلسلتك الحالية</p>
              <p style="margin:0;font-size:52px;font-weight:800;color:#f97316;line-height:1;">
                ${currentStreak} 🔥
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">يوم متتالي</p>
            </div>
            <div style="background:#0b1021;border-radius:12px;padding:16px 20px;
                        margin-bottom:28px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                🏆 &nbsp;أنت قريب جدًا من تحقيق إنجاز رائع!
                أكمل جلستك اليوم وحافظ على سلسلتك.
              </p>
            </div>
            <a href="https://www.smle-question-bank.com/"
               style="display:inline-block;background:#f97316;color:#fff;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
              أكمل جلستي الآن 🔥
            </a>
          </td>
        </tr>
    `);
  await sendEmail(
    to,
    `🔥 لا تكسر سلسلتك! ${currentStreak} أيام متتالية`,
    html,
    `سلسلتك ${currentStreak} أيام في خطر يا ${username}! أكمل جلستك اليوم على SQB.`
  );
};

// ─── 4. FEEDBACK EMAIL ─────────────────────────────────────────────────────
export const sendFeedbackEmail = async (to, username) => {
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">💬</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              رأيك يهمّنا يا ${username}!
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              لقد مضى على تسجيلك في منصتنا فترة الآن،
              ونودّ أن نسمع رأيك لنحسّن تجربتك ونطوّر المنصة باستمرار.
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#22d3ee;">نريد أن نعرف:</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">🐛 &nbsp;هل واجهت أي خلل أو مشكلة تقنية؟</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">✨ &nbsp;هل تقترح ميزات أو تحسينات جديدة؟</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">📝 &nbsp;ما رأيك في جودة الأسئلة والمحتوى؟</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;">⭐ &nbsp;كيف تُقيّم تجربتك العامة معنا؟</p>
                </td>
              </tr>
            </table>
            <a href="https://www.smle-question-bank.com/"
               style="display:inline-block;background:#22d3ee;color:#0b1021;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
              أشاركم رأيي 💬
            </a>
          </td>
        </tr>
    `);
  await sendEmail(to, '💬 رأيك يهمّنا — SQB', html, `يا ${username}، رأيك يساعدنا على تحسين منصتنا. شاركنا اقتراحاتك!`);
};
