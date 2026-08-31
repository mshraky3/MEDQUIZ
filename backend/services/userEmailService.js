/**
 * User Email Campaign Service
 * Welcome, Inactivity, Streak Reminder, Feedback, Trial Ended, Progress Digest,
 * Expiry Reminder, and the staged Exam-Date Reminder ladder.
 *
 * ── Language ──────────────────────────────────────────────────────────────
 * Every template renders in Arabic OR English, chosen from the student's own
 * `accounts.preferred_lang` (mirrored from the site language by
 * PUT /api/preferences/language). The whole site became bilingual on
 * 2026-08-01 while this file stayed Arabic-only, which meant a student reading
 * the product in English received Arabic mail about it. Unknown/missing
 * language falls back to Arabic, which is what every account was getting
 * before, so nothing changes underneath an existing user.
 *
 * The English is written as English, not as a translation of the Arabic —
 * same promises, same price, same structure, native phrasing in each. Never
 * translated: SQB, SMLE, SNLE, Prometric, Moyasar/mada/Visa/Mastercard.
 *
 * ── On the tone of the conversion emails ──────────────────────────────────
 * Trial-ended and expiry-reminder lean on loss aversion, because the stakes
 * are genuinely high for a licensing candidate. Every consequence they name is
 * real and verifiable: a failed attempt means re-registering, paying the exam
 * fee again, and waiting for the next sitting window. None of them invent a
 * deadline, a discount that is about to vanish, or a seat cap — fabricated
 * urgency on a paid exam product is both dishonest and, when the student finds
 * out, more expensive than the sale it wins.
 *
 * The exam reminders are the one place a deadline is real, because the student
 * typed it in themselves. They still never invent pressure: what they add is
 * the student's OWN numbers and a concrete next action.
 *
 * ── Unsubscribe ───────────────────────────────────────────────────────────
 * All of this is bulk mail (`bulk: true`), so every message carries a working
 * one-click unsubscribe whenever the caller passes `accountId`. Callers that
 * omit it (the admin preview routes) simply get no link.
 */

import { sendMail } from './mailer.js';
import { TRACKS, normalizeTrack } from '../config/tracks.js';
import { unsubUrl } from '../routes/admin-broadcast.js';

const SITE = 'https://www.smle-question-bank.com';

/** Anything → 'ar' | 'en'. Unknown values fall back to Arabic. */
export const normalizeLang = (lang) =>
    (String(lang || '').toLowerCase().startsWith('en') ? 'en' : 'ar');

/** Pick one of two strings by language — the workhorse of every template. */
const T = (lang, ar, en) => (normalizeLang(lang) === 'en' ? en : ar);

/**
 * HTML-escape a value before it goes into an email template.
 *
 * Everything else in this file interpolates copy written here; the comeback
 * email is the first to interpolate QUESTION BANK text — stems, options and
 * explanations that contain <, > and & as a matter of course (drug doses,
 * inequalities, "T&A"). Unescaped, those break the layout at best.
 */
const esc = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * "2 days" in Arabic is not "٢ أيام".
 *
 * Arabic counts in four buckets — singular, dual, the 3–10 plural, and the
 * accusative singular from 11 up — and every reminder subject line in this file
 * was using one form for everything, so a student two days out got
 * "متبقٍ 2 أيام". Mirrors the frontend's rule in i18n/copy/quiz.js so the email
 * and the countdown card word the same number the same way.
 */
export const arDays = (n) =>
    n === 1 ? 'يوم' : n === 2 ? 'يومان' : n <= 10 ? 'أيام' : 'يوماً';

/** The whole phrase, since the dual carries the count inside the word itself. */
export const arDaysCount = (n) => (n === 2 ? 'يومان' : `${n} ${arDays(n)}`);

// Per-track wording. The platform is shared, but "the exam" is not the same
// exam for a nursing student, and a welcome email that talks about the medical
// licensing exam reads as if they signed up for the wrong product.
const copyFor = (track, lang) => {
    const t = TRACKS[normalizeTrack(track)];
    const en = normalizeLang(lang) === 'en';
    return {
        exam: en ? t.examEn : t.examAr,
        trackLabel: en ? t.labelEn : t.labelAr,
        specialties: t.specialties.map((sp) => (en ? sp.labelEn : sp.labelAr)).join(' · '),
    };
};

const sendEmail = async (to, subject, html, text, opts = {}) => {
  await sendMail({
    name: 'SQB',
    to,
    subject,
    text: text || '',
    html,
    // Lifecycle mail is marketing, so an unsubscribe must apply to it.
    bulk: true,
    ...opts,
  });
};

// ─── Shared layout wrapper ─────────────────────────────────────────────────
/**
 * @param {string} bodyContent  the <tr> rows that make up the message
 * @param {{lang?:string, accountId?:number|string}} opts
 */
const wrapLayout = (bodyContent, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const rtl = lang === 'ar';
  const unsub = opts.accountId ? unsubUrl(opts.accountId) : '';
  const unsubRow = unsub
    ? `<p style="margin:6px 0 0;font-size:11px;color:#334155;">
         <a href="${unsub}" style="color:#475569;text-decoration:underline;">
           ${T(lang, 'إلغاء الاشتراك من رسائل المتابعة', 'Unsubscribe from these emails')}
         </a>
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1021;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1021;padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1e293b;max-width:480px;width:100%;">
        <!-- Logo Header -->
        <tr>
          <td align="center" style="padding:28px 40px 22px;background:#111827;border-bottom:1px solid #1e293b;">
            <img src="${SITE}/tab_logo.png" width="36" height="36" alt="SQB" style="vertical-align:middle;border-radius:8px;margin-${rtl ? 'left' : 'right'}:10px;">
            <span style="font-size:26px;font-weight:800;color:#22d3ee;letter-spacing:2px;vertical-align:middle;">SQB</span>
          </td>
        </tr>
        <!-- Body -->
        ${bodyContent}
        <!-- Footer -->
        <tr>
          <td align="center" style="padding:20px 40px 28px;border-top:1px solid #1e293b;">
            <p style="margin:0 0 4px;font-size:12px;color:#334155;">
              ${T(lang, '© 2026 SQB · جميع الحقوق محفوظة', '© 2026 SQB · All rights reserved')}
            </p>
            <p style="margin:0;font-size:11px;color:#1e293b;">
              ${T(lang, 'هذا البريد تلقائي، يُرجى عدم الرد عليه مباشرةً.', 'This is an automated message — please do not reply to it directly.')}
            </p>
            ${unsubRow}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

/** The one CTA button style, so every template's action looks identical. */
const button = (href, label, color = '#22d3ee', fg = '#0b1021') => `
            <a href="${href}"
               style="display:inline-block;background:${color};color:${fg};font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
              ${label}
            </a>`;

// ─── 1. WELCOME EMAIL ──────────────────────────────────────────────────────
export const sendWelcomeEmail = async (to, username, track, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🎉</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `أهلًا وسهلًا يا ${username}!`, `Welcome aboard, ${username}!`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                `يسعدنا انضمامك إلى <strong style="color:#22d3ee;">SQB</strong> —
                 المنصة المصممة خصيصًا لمساعدتك على الاستعداد لـ<strong style="color:#f8fafc;">${c.exam}</strong>
                 بأسلوب منظّم وفعّال.`,
                `We're glad you joined <strong style="color:#22d3ee;">SQB</strong> — built to get you ready for
                 <strong style="color:#f8fafc;">${c.exam}</strong> in a structured, efficient way.`)}
            </p>
            <p style="margin:-12px 0 22px;font-size:13px;color:#64748b;">
              ${T(lang, 'مسارك:', 'Your track:')} <strong style="color:#22d3ee;">${c.trackLabel}</strong>
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, 'ماذا تجد في المنصة؟', "What's waiting for you")}
                  </p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">✅ &nbsp;${T(lang, `أسئلة مصنّفة حسب التخصص: ${c.specialties}`, `Questions sorted by specialty: ${c.specialties}`)}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">📊 &nbsp;${T(lang, 'تحليل أدائك وتتبّع نقاط ضعفك', 'Performance analytics that find your weak spots')}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">🎯 &nbsp;${T(lang, 'هدف أسبوعي تختاره بنفسك، وعدّاد لموعد اختبارك', 'A weekly goal you set yourself, and a countdown to your exam date')}</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;">🏆 &nbsp;${T(lang, 'اختبارات نهائية شاملة', 'Full-length mock exams')}</p>
                </td>
              </tr>
            </table>
            ${button(`${SITE}/quizs`, T(lang, 'ابدأ الآن 🚀', 'Start now 🚀'))}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, '🎉 أهلًا بك في SQB!', '🎉 Welcome to SQB!'),
    html,
    T(lang, `أهلًا يا ${username}! يسعدنا انضمامك إلى SQB — مسار ${c.trackLabel}.`,
             `Welcome, ${username}! You're on the ${c.trackLabel} track at SQB.`),
    { event: 'medqize.lifecycle.welcome' }
  );
};

// ─── 2. INACTIVITY EMAIL ───────────────────────────────────────────────────
export const sendInactivityEmail = async (to, username, track, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">📚</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `نفتقدك يا ${username}!`, `We've missed you, ${username}`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                `لم تزرنا منذ بضعة أيام — و${c.exam} لا ينتظر!
                 كل يوم يمرّ بدون مراجعة هو يوم يُضعف استعدادك.
                 لا بأس، يمكنك العودة الآن والبدء من حيث توقفت.`,
                `It has been a few days — and ${c.exam} isn't waiting.
                 Every day without revision is a day your recall quietly slips.
                 Nothing is lost: pick up exactly where you stopped.`)}
            </p>
            <div style="background:#0b1021;border-radius:12px;padding:16px 20px;margin-bottom:28px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                ${T(lang,
                  '🎯 &nbsp;لا يحتاج الأمر سوى <strong style="color:#f8fafc;">10 دقائق يوميًا</strong> للحفاظ على تقدّمك. عُد الآن وأكمل جلستك القادمة!',
                  '🎯 &nbsp;<strong style="color:#f8fafc;">Ten minutes a day</strong> is enough to hold your ground. One short session is all this takes.')}
              </p>
            </div>
            ${button(`${SITE}/quizs`, T(lang, 'عُد الآن 💪', 'Start a session 💪'))}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, '📚 نفتقدك! الاختبار ينتظرك', '📚 A short session today?'),
    html,
    T(lang, `نفتقدك يا ${username}! عُد إلى SQB وأكمل مراجعتك.`,
             `We've missed you, ${username}. Come back to SQB and pick up your revision.`),
    { event: 'medqize.lifecycle.inactivity' }
  );
};

// ─── 3. STREAK REMINDER EMAIL ──────────────────────────────────────────────
export const sendStreakReminderEmail = async (to, username, currentStreak, track, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🔥</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `سلسلتك في خطر يا ${username}!`, `Your streak is on the line, ${username}`)}
            </h1>
            <p style="margin:0 0 28px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                'لم تُكمل جلستك اليوم بعد. إذا لم تذاكر قبل منتصف الليل ستنكسر سلسلتك وتبدأ من الصفر!',
                "You haven't studied today yet. If nothing lands before midnight, the run resets to zero.")}
            </p>
            <!-- Streak Counter -->
            <div style="background:#0b1021;border:2px solid #f97316;border-radius:12px;
                        padding:24px 48px;display:inline-block;margin-bottom:28px;">
              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;">${T(lang, 'سلسلتك الحالية', 'Current streak')}</p>
              <p style="margin:0;font-size:52px;font-weight:800;color:#f97316;line-height:1;">
                ${currentStreak} 🔥
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">
                ${T(lang, 'يوم متتالي', currentStreak === 1 ? 'day in a row' : 'days in a row')}
              </p>
            </div>
            <div style="background:#0b1021;border-radius:12px;padding:16px 20px;
                        margin-bottom:28px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                ${T(lang,
                  '🏆 &nbsp;أنت قريب جدًا من تحقيق إنجاز رائع! أكمل جلستك اليوم وحافظ على سلسلتك.',
                  '🏆 &nbsp;One session keeps it alive — even five questions counts as a study day.')}
              </p>
            </div>
            ${button(`${SITE}/quizs`, T(lang, 'أكمل جلستي الآن 🔥', 'Keep the streak 🔥'), '#f97316', '#fff')}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `🔥 لا تكسر سلسلتك! ${currentStreak} أيام متتالية`,
             `🔥 Don't break your ${currentStreak}-day streak`),
    html,
    T(lang, `سلسلتك ${currentStreak} أيام في خطر يا ${username}! أكمل جلستك اليوم على SQB.`,
             `Your ${currentStreak}-day streak is at risk, ${username}. One session on SQB keeps it.`),
    { event: 'medqize.lifecycle.streak' }
  );
};

// ─── 4. FEEDBACK EMAIL ─────────────────────────────────────────────────────
export const sendFeedbackEmail = async (to, username, track, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">💬</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `رأيك يهمّنا يا ${username}!`, `What do you think so far, ${username}?`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                'لقد مضى على تسجيلك في منصتنا فترة الآن، ونودّ أن نسمع رأيك لنحسّن تجربتك ونطوّر المنصة باستمرار.',
                "You've been with us a little while now, and your take is what actually shapes what we build next.")}
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, 'نريد أن نعرف:', 'The things we most want to hear:')}
                  </p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">🐛 &nbsp;${T(lang, 'هل واجهت أي خلل أو مشكلة تقنية؟', 'Did anything break or behave oddly?')}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">✨ &nbsp;${T(lang, 'هل تقترح ميزات أو تحسينات جديدة؟', 'Any feature or improvement you want?')}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">📝 &nbsp;${T(lang, 'ما رأيك في جودة الأسئلة والمحتوى؟', 'How are the questions and explanations holding up?')}</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;">⭐ &nbsp;${T(lang, 'كيف تُقيّم تجربتك العامة معنا؟', 'How would you rate the experience overall?')}</p>
                </td>
              </tr>
            </table>
            ${button(`${SITE}/suggestions`, T(lang, 'أشاركم رأيي 💬', 'Share my feedback 💬'))}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `💬 رأيك يهمّنا — SQB ${c.trackLabel}`, `💬 Two minutes of feedback? — SQB ${c.trackLabel}`),
    html,
    T(lang, `يا ${username}، رأيك يساعدنا على تحسين منصتنا. شاركنا اقتراحاتك!`,
             `${username}, your feedback shapes what we build next: ${SITE}/suggestions`),
    { event: 'medqize.lifecycle.feedback' }
  );
};

// ─── 5. FREE ALLOWANCE USED UP ─────────────────────────────────────────────
/**
 * The single highest-leverage email in the product: sent the day a student
 * finishes their free questions, the moment they know exactly what the bank is
 * like and have nothing else to spend.
 *
 * It leads with what the student actually DID — their own questions answered
 * and accuracy — because that is the most persuasive thing available and it is
 * entirely theirs. Stats are passed in already computed; if somehow nothing was
 * recorded the numbers block is dropped rather than printing zeros at someone.
 *
 * Tone note: the free tier does NOT lock the account. This email must never
 * imply otherwise — the student can still log in, read their analytics and read
 * the free lesson of every specialty. What ran out is the quiz allowance.
 *
 * @param {{questionsAnswered:number, accuracy:number, quizzesCompleted:number}} stats
 */
export const sendTrialEndedEmail = async (to, username, track, stats = {}, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const answered = Number(stats.questionsAnswered) || 0;
  const accuracy = Math.round(Number(stats.accuracy) || 0);
  const didSomething = answered > 0;

  const statsBlock = didSomething ? `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, 'ما أنجزته بأسئلتك المجانية', 'What you did with your free questions')}
                  </p>
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td align="center" style="padding:0 8px;">
                        <p style="margin:0;font-size:30px;font-weight:800;color:#f8fafc;line-height:1.2;">${answered}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'سؤالاً', 'questions')}</p>
                      </td>
                      <td align="center" style="padding:0 8px;border-right:1px solid #1e293b;border-left:1px solid #1e293b;">
                        <p style="margin:0;font-size:30px;font-weight:800;color:#f8fafc;line-height:1.2;">${accuracy}%</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'دقة إجاباتك', 'accuracy')}</p>
                      </td>
                      <td align="center" style="padding:0 8px;">
                        <p style="margin:0;font-size:30px;font-weight:800;color:#f8fafc;line-height:1.2;">${Number(stats.quizzesCompleted) || 0}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'اختباراً', 'quizzes')}</p>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:14px 0 0;font-size:12.5px;color:#64748b;line-height:1.7;">
                    ${T(lang,
                      'هذا من ٤٠ سؤالاً فقط. البنك كامل بانتظارك — وتقدّمك محفوظ كما هو.',
                      'And that was from 40 questions. The full bank is waiting, and your progress stays exactly where it is.')}
                  </p>
                </td>
              </tr>
            </table>` : `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:18px 22px;border:1px solid #1e293b;">
                  <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.8;">
                    ${T(lang,
                      'أسئلتك المجانية انتهت. حسابك مفتوح كما هو، وأول درس من كل تخصص يبقى متاحاً لك مجاناً في أي وقت.',
                      'Your free questions are used up. Your account stays open exactly as it is, and the first lesson of every specialty remains free to read any time.')}
                  </p>
                </td>
              </tr>
            </table>`;

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🎯</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `أنهيت أسئلتك الأربعين يا ${username}`, `That's your 40 free questions, ${username}`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                'حسابك يبقى مفتوحاً وتقدّمك محفوظ — الاشتراك هو ما يفتح بقية البنك والملخصات كاملة.',
                'Your account stays open and your progress is saved — a subscription is what opens the rest of the bank and the full summaries.')}
            </p>
            ${statsBlock}
            <!-- Honest loss framing: every item here is a real consequence. -->
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#1a1214;border-radius:12px;padding:18px 22px;border:1px solid #4c1d1d;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#f87171;">
                    ${T(lang, 'قبل أن تؤجّل القرار', 'Before you put the decision off')}
                  </p>
                  <p style="margin:0 0 7px;font-size:12.5px;color:#cbd5e1;line-height:1.8;">
                    🔁 &nbsp;${T(lang, `المحاولة الإضافية في ${c.exam} تعني دفع رسوم الاختبار من جديد.`,
                                        `Another attempt at ${c.exam} means paying the exam fee again.`)}
                  </p>
                  <p style="margin:0 0 7px;font-size:12.5px;color:#cbd5e1;line-height:1.8;">
                    📅 &nbsp;${T(lang, 'مواعيد الاختبار محدودة — قد تنتظر أشهراً حتى الدورة القادمة.',
                                        'Sitting windows are limited — a miss can mean months until the next one.')}
                  </p>
                  <p style="margin:0;font-size:12.5px;color:#cbd5e1;line-height:1.8;">
                    💼 &nbsp;${T(lang, 'كل شهر تأخير في الترخيص هو شهر دخل مؤجَّل.',
                                        'Every month your licence is delayed is a month of income postponed.')}
                  </p>
                </td>
              </tr>
            </table>
            <div style="background:#0b1021;border-radius:12px;padding:18px 22px;margin-bottom:26px;border:1px solid #1e293b;">
              <p style="margin:0 0 4px;font-size:12.5px;color:#94a3b8;">
                ${T(lang, '50 ريالاً شهرياً · 129 لأربعة أشهر · 300 للسنة',
                          'SAR 50 a month · 129 for four months · 300 for a year')}
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
                ${T(lang, 'دفعة واحدة، بدون تجديد تلقائي. وهناك اشتراكات جماعية إن كنتم مجموعة تذاكر معاً.',
                          'One payment, no automatic renewal. Group plans are available if you are studying together.')}
              </p>
            </div>
            ${button(`${SITE}/subscribe`, T(lang, 'أكمل من حيث توقفت ←', 'Pick up where I left off →'))}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `أنهيت أسئلتك المجانية — تقدّمك محفوظ يا ${username}`,
             `You've used your 40 free questions — your progress is saved, ${username}`),
    html,
    T(lang, `أنهيت أسئلتك الأربعين المجانية في SQB. حسابك مفتوح وتقدّمك محفوظ. اشترك الآن: ${SITE}/subscribe`,
             `You've used your 40 free questions on SQB. Your account stays open and your progress is saved. Subscribe now: ${SITE}/subscribe`),
    { event: 'medqize.lifecycle.trial_ended' }
  );
};

// ─── 5b. ONE-SESSION COMEBACK ──────────────────────────────────────────────
/**
 * Day-1/Day-3 nudge for a student stuck at exactly one quiz session. See
 * lifecycleJobs.runComebackJob for the query and stage ladder — this just
 * renders what it found: their own wrong-answer count from that one session,
 * pointing at the wrong-questions page rather than inventing new content.
 *
 * @param {{questionsAnswered:number, correct:number, wrongCount:number}} stats
 */
/**
 * Explanations are authored with `**bold**` stage headings and `- ` bullets.
 * An email client renders neither, so a student would read the markers as
 * characters. First sentence, markers gone — enough to remind, not enough to
 * replace the page it is inviting them back to.
 */
function explanationSnippet(text = '', maxChars = 190) {
    const flat = String(text)
        .replace(/\*\*/g, '')
        .replace(/^[\s-]*[-*•]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (!flat) return '';
    const stop = flat.search(/[.!?](\s|$)/);
    const firstSentence = stop > 40 ? flat.slice(0, stop + 1) : flat;
    return firstSentence.length > maxChars
        ? `${firstSentence.slice(0, maxChars).trimEnd()}…`
        : firstSentence;
}

/** Trim a question stem to something that reads in an inbox. */
function stemSnippet(text = '', maxChars = 200) {
    const flat = String(text).replace(/\s+/g, ' ').trim();
    return flat.length > maxChars ? `${flat.slice(0, maxChars).trimEnd()}…` : flat;
}

export const sendOneSessionComebackEmail = async (to, username, track, stats = {}, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const answered = Number(stats.questionsAnswered) || 0;
  const correct = Number(stats.correct) || 0;
  const wrongCount = Math.max(0, Number(stats.wrongCount) || 0);
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const missed = Array.isArray(stats.wrongQuestions) ? stats.wrongQuestions : [];

  // The questions themselves. Study content stays in English in both languages
  // — the exam is written in English and the bank is not translated — so these
  // blocks are LTR regardless of the surrounding chrome.
  const missedCards = missed.map((q) => {
    const snippet = explanationSnippet(q.explanation);
    return `
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:16px 18px;border:1px solid #1e293b;" dir="ltr" align="left">
                  <p style="margin:0 0 10px;font-size:13px;color:#e2e8f0;line-height:1.65;">
                    ${esc(stemSnippet(q.question_text))}
                  </p>
                  <p style="margin:0 0 4px;font-size:12px;color:#fca5a5;">
                    ${T(lang, 'إجابتك', 'You answered')}: ${esc(q.selected_option || '—')}
                  </p>
                  <p style="margin:0 0 ${snippet ? '10' : '0'}px;font-size:12px;color:#6ee7b7;">
                    ${T(lang, 'الصحيحة', 'Correct')}: ${esc(q.correct_option || '—')}
                  </p>
                  ${snippet ? `<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">${esc(snippet)}</p>` : ''}
                </td>
              </tr>
              <tr><td style="height:10px;line-height:10px;">&nbsp;</td></tr>`;
  }).join('');

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🎯</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `أحسنت في أول اختبار يا ${username}!`, `Nice work on your first quiz, ${username}!`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                `أجبت عن ${answered} سؤالاً بدقة ${accuracy}% — وهذه مجرد بداية. بنك ${c.exam} أكبر بكثير مما رأيته حتى الآن.`,
                // No "The" in front: examEn already reads "the Saudi Medical
                // Licensing Exam (SMLE)", so this sentence has been going out
                // as "The the Saudi Medical Licensing Exam". A dash instead of
                // a full stop keeps it mid-sentence, where the lower-case
                // article the label already carries is the correct one.
                `You answered ${answered} questions at ${accuracy}% — and that's just a first look, because ${c.exam} bank goes a lot further than what you've seen so far.`)}
            </p>
            ${missedCards ? `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td align="${lang === 'ar' ? 'right' : 'left'}" style="padding-bottom:12px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang,
                      wrongCount > missed.length
                        ? `${missed.length} من ${wrongCount} سؤالاً أخطأت فيها`
                        : 'الأسئلة التي أخطأت فيها',
                      wrongCount > missed.length
                        ? `${missed.length} of the ${wrongCount} you missed`
                        : 'Here is what you missed')}
                  </p>
                </td>
              </tr>
${missedCards}
            </table>` : wrongCount > 0 ? `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, 'أسئلتك التي أخطأت فيها في انتظارك', 'The ones you missed are waiting for a rematch')}
                  </p>
                  <p style="margin:0;font-size:13px;color:#cbd5e1;line-height:1.8;">
                    ${T(lang,
                      `أخطأت في <strong style="color:#f8fafc;">${wrongCount} من ${answered}</strong> — راجعها الآن، وستجد أسئلة مشابهة لها تنتظرك في نفس التخصص.`,
                      `You missed <strong style="color:#f8fafc;">${wrongCount} of ${answered}</strong> — review them now, and you'll find more like them waiting in the same specialty.`)}
                  </p>
                </td>
              </tr>
            </table>
            ${button(`${SITE}/wrong-questions`, T(lang, 'راجع أخطائي ←', 'Review my mistakes →'))}
            <p style="margin:16px 0 0;">
              <a href="${SITE}/quizs" style="font-size:13px;color:#64748b;text-decoration:underline;">
                ${T(lang, 'أو ابدأ اختباراً جديداً', 'Or start a fresh quiz')}
              </a>
            </p>` : `
            ${button(`${SITE}/quizs`, T(lang, 'ابدأ اختبارك التالي ←', 'Start your next quiz →'))}`}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `🎯 راجع أخطاءك من أول اختبار — SQB`, `🎯 Review your first-quiz mistakes — SQB`),
    html,
    T(lang, `أجبت عن ${answered} سؤالاً بدقة ${accuracy}%. راجع ما أخطأت فيه: ${SITE}/wrong-questions`,
             `You answered ${answered} questions at ${accuracy}% accuracy. Review what you missed: ${SITE}/wrong-questions`),
    { event: 'medqize.lifecycle.comeback' }
  );
};

// ─── 6. WEEKLY PROGRESS DIGEST ─────────────────────────────────────────────
/**
 * "You are getting better, and here is the proof." Sent weekly to active
 * students. Pairs with the in-app goal card: when a goal is set, its progress
 * leads the email, because a goal the student chose themselves is a stronger
 * reason to come back than any number we pick for them.
 *
 * @param {{questionsThisWeek:number, accuracyThisWeek:number, accuracyLastWeek:number|null,
 *          streak:number, goal:{label:string,current:number,target:number}|null,
 *          examDaysRemaining:number|null}} data
 */
export const sendProgressDigestEmail = async (to, username, track, data = {}, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const questions = Number(data.questionsThisWeek) || 0;
  const accNow = Math.round(Number(data.accuracyThisWeek) || 0);
  const accPrev = data.accuracyLastWeek == null ? null : Math.round(Number(data.accuracyLastWeek));
  const streak = Number(data.streak) || 0;
  const goal = data.goal || null;
  const examDays = data.examDaysRemaining;

  const delta = accPrev == null ? null : accNow - accPrev;
  const trendBlock = delta == null ? '' : `
                  <p style="margin:10px 0 0;font-size:13px;color:${delta >= 0 ? '#34d399' : '#fbbf24'};font-weight:700;">
                    ${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}%
                    ${delta >= 0
                      ? T(lang, 'تحسّن عن الأسبوع الماضي', 'better than last week')
                      : T(lang, 'مقارنة بالأسبوع الماضي', 'compared with last week')}
                  </p>`;

  // Their own exam date, when they set one — the single most relevant line in
  // the whole email, so it sits above everything else.
  const examBlock = (examDays != null && examDays >= 0) ? `
            <p style="margin:-12px 0 20px;font-size:13px;color:#22d3ee;font-weight:700;">
              ${T(lang,
                examDays === 0 ? 'اختبارك اليوم — بالتوفيق!' : `متبقٍ ${examDays} ${examDays === 1 ? 'يوم' : 'يوماً'} على اختبارك`,
                examDays === 0 ? 'Your exam is today — good luck!' : `${examDays} day${examDays === 1 ? '' : 's'} until your exam`)}
            </p>` : '';

  const goalPct = goal && goal.target > 0
    ? Math.min(100, Math.round((goal.current / goal.target) * 100))
    : 0;
  const goalBlock = goal ? `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, `هدفك: ${goal.label}`, `Your goal: ${goal.label}`)}
                  </p>
                  <p style="margin:0 0 12px;font-size:13px;color:#94a3b8;">
                    <strong style="color:#f8fafc;">${goal.current}</strong> ${T(lang, 'من', 'of')} ${goal.target}
                    ${goalPct >= 100 ? T(lang, ' — أنجزته! 🎉', ' — done! 🎉') : ''}
                  </p>
                  <!-- Progress bar as a table so Outlook renders it. -->
                  <table cellpadding="0" cellspacing="0" style="width:100%;background:#1e293b;border-radius:999px;">
                    <tr>
                      <td style="width:${goalPct}%;background:${goalPct >= 100 ? '#34d399' : '#22d3ee'};border-radius:999px;height:10px;font-size:0;line-height:0;">&nbsp;</td>
                      <td style="font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>` : '';

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">📈</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `أسبوعك في أرقام يا ${username}`, `Your week in numbers, ${username}`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang, 'هذا ما أنجزته خلال الأيام السبعة الماضية.', "Here's what the last seven days added up to.")}
            </p>
            ${examBlock}
            ${goalBlock}
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:22px 24px;border:1px solid #1e293b;">
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td align="center" style="padding:0 6px;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.2;">${questions}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'سؤالاً', 'questions')}</p>
                      </td>
                      <td align="center" style="padding:0 6px;border-right:1px solid #1e293b;border-left:1px solid #1e293b;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.2;">${accNow}%</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'دقة', 'accuracy')}</p>
                      </td>
                      <td align="center" style="padding:0 6px;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f97316;line-height:1.2;">${streak}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'يوم متتالي', streak === 1 ? 'day streak' : 'day streak')}</p>
                      </td>
                    </tr>
                  </table>
                  ${trendBlock}
                </td>
              </tr>
            </table>
            ${button(`${SITE}/quizs`, T(lang, 'واصل تقدّمك 📈', 'Keep it going 📈'))}
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `📈 أسبوعك في SQB — ${questions} سؤالاً ودقة ${accNow}%`,
             `📈 Your week on SQB — ${questions} questions at ${accNow}%`),
    html,
    T(lang, `أسبوعك في SQB: ${questions} سؤالاً، دقة ${accNow}%، سلسلة ${streak} يوم.`,
             `Your week on SQB: ${questions} questions, ${accNow}% accuracy, a ${streak}-day streak.`),
    { event: 'medqize.lifecycle.progress_digest' }
  );
};

// ─── 7. SUBSCRIPTION EXPIRING ──────────────────────────────────────────────
/**
 * The subscription does not auto-renew by design, which means every expiry is
 * a manual re-sell that happens only if the student is reminded. Sent ahead of
 * the expiry date while access is still live, so renewing is continuing rather
 * than recovering.
 */
export const sendExpiryReminderEmail = async (to, username, track, daysRemaining, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const days = Math.max(0, Number(daysRemaining) || 0);
  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">🔔</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `اشتراكك ينتهي بعد ${arDaysCount(days)}`,
                        `Your subscription ends in ${days} day${days === 1 ? '' : 's'}`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                'اشتراكك في SQB لا يُجدَّد تلقائياً — وهذا باختيارنا، حتى لا نخصم من بطاقتك دون علمك. لكنه يعني أن التجديد يحتاج خطوة منك.',
                "Your SQB subscription doesn't auto-renew — deliberately, so nothing is ever taken from your card without you knowing. The trade-off is that renewing needs one step from you.")}
            </p>
            <div style="background:#0b1021;border-radius:12px;padding:18px 22px;margin-bottom:24px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.8;">
                ${T(lang,
                  'بعد انتهاء الاشتراك يتوقّف وصولك إلى بنك الأسئلة والملخصات، لكن <strong style="color:#f8fafc;">تقدّمك وإحصاءاتك تبقى محفوظة</strong> — تعود إليها متى جدّدت.',
                  'When it lapses, the question bank and summaries lock — but <strong style="color:#f8fafc;">your progress and statistics stay exactly where they are</strong>, waiting for you.')}
              </p>
            </div>
            <div style="background:#0b1021;border-radius:12px;padding:18px 22px;margin-bottom:26px;border:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.8;">
                ${T(lang, 'اختر مدة التجديد التي تناسبك — شهرياً أو 4 أشهر أو سنوياً.',
                          'Pick whichever renewal term suits you — monthly, 4-month, or annual.')}
              </p>
            </div>
            ${button(`${SITE}/subscribe`, T(lang, 'جدّد اشتراكي الآن', 'Renew my access'))}
            <p style="margin:16px 0 0;font-size:12px;color:#475569;">
              ${T(lang, `${c.exam} — نحن معك حتى تجتازه.`, `${c.exam} — we're with you until you pass it.`)}
            </p>
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `🔔 اشتراكك في SQB ينتهي بعد ${arDaysCount(days)}`,
             `🔔 Your SQB access ends in ${days} day${days === 1 ? '' : 's'}`),
    html,
    T(lang, `اشتراكك في SQB ينتهي بعد ${days} يوم ولا يُجدَّد تلقائياً. للتجديد: ${SITE}/subscribe`,
             `Your SQB subscription ends in ${days} days and does not auto-renew. Renew: ${SITE}/subscribe`),
    { event: 'medqize.lifecycle.expiry_reminder' }
  );
};

// ─── 8. EXAM-DATE REMINDER ─────────────────────────────────────────────────
/**
 * The one deadline in this product that is genuinely real, because the student
 * typed it in themselves (accounts.exam_date, set from the hub).
 *
 * Sent as a ladder — 30, 14, 7, 3 and 1 days out — and the message CHANGES at
 * each rung, because "you have a month" and "you sit tomorrow" call for
 * opposite advice. At 30 days the job is coverage; at 14, weak specialties; at
 * 7, timed simulation; at 3, review your own wrong answers; at 1, stop
 * studying and sleep. A reminder that says the same thing five times is a
 * reminder people filter.
 *
 * Personal numbers are optional. When they are present the email points at the
 * student's weakest specialty by name, which is the whole reason a question
 * bank should be the one sending this rather than a calendar app.
 *
 * @param {number} daysRemaining  the rung: 30 | 14 | 7 | 3 | 1 (0 = exam day)
 * @param {{questionsAnswered:number, accuracy:number|null, weakestLabel:string|null,
 *          weakestAccuracy:number|null, wrongCount:number}} stats
 */
export const sendExamReminderEmail = async (to, username, track, daysRemaining, stats = {}, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const c = copyFor(track, lang);
  const days = Math.max(0, Number(daysRemaining) || 0);
  const answered = Number(stats.questionsAnswered) || 0;
  const accuracy = stats.accuracy == null ? null : Math.round(Number(stats.accuracy));
  const wrongCount = Number(stats.wrongCount) || 0;

  // The rung. Each one gets its own headline, advice and call to action; the
  // thresholds match EXAM_REMINDER_STAGES in services/lifecycleJobs.js.
  const stage = (() => {
    if (days <= 1) return {
      emoji: '🌙',
      titleAr: days === 0 ? 'اختبارك اليوم — بالتوفيق!' : 'اختبارك غداً',
      titleEn: days === 0 ? 'Your exam is today — good luck' : 'Your exam is tomorrow',
      leadAr: 'اليوم ليس يوم مذاكرة. راجع أخطاءك السابقة مراجعة سريعة، جهّز أوراقك وموقع الاختبار، ونم مبكراً — النوم يرفع درجتك أكثر من أي ساعة إضافية الليلة.',
      leadEn: "Today isn't a study day. Skim your own wrong answers once, get your ID and the test-centre route sorted, and sleep early — sleep will do more for your score tonight than another hour of questions.",
      ctaAr: 'مراجعة أخطائي سريعاً', ctaEn: 'Skim my wrong answers', ctaUrl: `${SITE}/wrong-questions`,
      tone: '#f97316',
    };
    if (days <= 3) return {
      emoji: '🎯',
      titleAr: `متبقٍ ${arDaysCount(days)} على اختبارك`,
      titleEn: `${days} days until your exam`,
      leadAr: 'هذه الأيام للمراجعة لا للتعلّم الجديد. ارجع إلى أسئلتك الخاطئة — كل سؤال أخطأت فيه ثم أتقنته هو درجة كنت ستخسرها.',
      leadEn: "These days are for review, not new material. Go back through your own wrong answers — every one you turn around is a mark you were about to lose.",
      ctaAr: 'ابدأ مراجعة أخطائي', ctaEn: 'Review my wrong answers', ctaUrl: `${SITE}/wrong-questions`,
      tone: '#f97316',
    };
    if (days <= 7) return {
      emoji: '⏱️',
      titleAr: 'أسبوع واحد على اختبارك',
      titleEn: 'One week until your exam',
      leadAr: 'الأسبوع الأخير هو أسبوع المحاكاة. اضبط المؤقّت وادخل جلسة كاملة بنفس ظروف الاختبار — إدارة الوقت هي ما يُسقط المستعدين.',
      leadEn: 'The final week is simulation week. Set the timer and sit a full session under exam conditions — pacing is what catches out people who actually knew the material.',
      ctaAr: 'ابدأ اختباراً بتوقيت حقيقي', ctaEn: 'Start a timed mock', ctaUrl: `${SITE}/quizs?view=custom`,
      tone: '#22d3ee',
    };
    if (days <= 14) return {
      emoji: '📊',
      titleAr: 'أسبوعان على اختبارك',
      titleEn: 'Two weeks until your exam',
      leadAr: 'الآن وقت التخصص الأضعف، لا الأقوى. تحليلاتك تعرف بالضبط أين تخسر الدرجات — ابدأ من هناك.',
      leadEn: "Now is the time for your weakest specialty, not your strongest. Your analytics already know exactly where the marks are leaking — start there.",
      ctaAr: 'افتح تحليلاتي', ctaEn: 'Open my analytics', ctaUrl: `${SITE}/analysis`,
      tone: '#22d3ee',
    };
    return {
      emoji: '📅',
      titleAr: `متبقٍ ${arDaysCount(days)} على اختبارك`,
      titleEn: `${days} days until your exam`,
      leadAr: 'شهر يكفي تماماً إذا كان منظّماً. اضبط هدفاً أسبوعياً الآن والتزم به — التقدّم الثابت يهزم المذاكرة المكثّفة في آخر أسبوع.',
      leadEn: "A month is plenty if it's structured. Set a weekly target now and hold it — steady progress beats a panicked final week every time.",
      ctaAr: 'اضبط هدفي الأسبوعي', ctaEn: 'Set my weekly target', ctaUrl: `${SITE}/quizs`,
      tone: '#22d3ee',
    };
  })();

  // Their own numbers. Dropped entirely for a student with no history — a row
  // of zeros next to "14 days to go" is discouraging, not motivating.
  const statsBlock = answered > 0 ? `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#22d3ee;">
                    ${T(lang, 'أين أنت الآن', 'Where you stand')}
                  </p>
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td align="center" style="padding:0 8px;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.2;">${answered}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'سؤالاً حللته', 'questions done')}</p>
                      </td>
                      ${accuracy == null ? '' : `
                      <td align="center" style="padding:0 8px;border-right:1px solid #1e293b;border-left:1px solid #1e293b;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.2;">${accuracy}%</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'دقتك', 'accuracy')}</p>
                      </td>`}
                      <td align="center" style="padding:0 8px;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#f97316;line-height:1.2;">${wrongCount}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'خطأ للمراجعة', 'to review')}</p>
                      </td>
                    </tr>
                  </table>
                  ${stats.weakestLabel ? `
                  <p style="margin:14px 0 0;font-size:12.5px;color:#cbd5e1;line-height:1.7;">
                    ${T(lang,
                      `أضعف تخصص لديك حالياً: <strong style="color:#f8fafc;">${stats.weakestLabel}</strong>${stats.weakestAccuracy != null ? ` (${Math.round(stats.weakestAccuracy)}%)` : ''} — ابدأ منه.`,
                      `Your weakest specialty right now: <strong style="color:#f8fafc;">${stats.weakestLabel}</strong>${stats.weakestAccuracy != null ? ` (${Math.round(stats.weakestAccuracy)}%)` : ''} — start there.`)}
                  </p>` : ''}
                </td>
              </tr>
            </table>` : '';

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">${stage.emoji}</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, stage.titleAr, stage.titleEn)}
            </h1>
            <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
              ${T(lang, `${c.exam} · ${username}`, `${c.exam} · ${username}`)}
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang, stage.leadAr, stage.leadEn)}
            </p>
            ${statsBlock}
            ${button(stage.ctaUrl, T(lang, stage.ctaAr, stage.ctaEn), stage.tone, stage.tone === '#f97316' ? '#fff' : '#0b1021')}
            <p style="margin:18px 0 0;font-size:11.5px;color:#475569;line-height:1.7;">
              ${T(lang,
                'تصلك هذه التذكيرات لأنك سجّلت موعد اختبارك في SQB — يمكنك تعديله أو إزالته من صفحتك الرئيسية.',
                'You get these because you set your exam date on SQB — change or remove it any time from your home page.')}
            </p>
          </td>
        </tr>
    `, { lang, accountId: opts.accountId });

  await sendEmail(
    to,
    T(lang, `${stage.emoji} ${stage.titleAr}`, `${stage.emoji} ${stage.titleEn}`),
    html,
    T(lang, `${stage.titleAr}. ${stage.leadAr}`, `${stage.titleEn}. ${stage.leadEn}`),
    { event: 'medqize.lifecycle.exam_reminder' }
  );
};

// ─── 10. GROUP SEAT CLAIMED ────────────────────────────────────────────────
/**
 * Tells a group buyer that one of their invite links has been used.
 *
 * PRIVACY: seat number, seat count and the group's end date — nothing else.
 * The person who claimed the seat is not identified, by design; see the rule at
 * the top of routes/groups.js. Do not add "claimed by X" to this template.
 *
 * Transactional, not marketing: `bulk:false` so it is never suppressed by an
 * unsubscribe and carries no unsubscribe footer (no accountId passed to
 * wrapLayout). Someone who paid for five seats must be told when one is used.
 *
 * @param {{seatIndex:number, seats:number, expiresAt:Date|string}} info
 */
export const sendGroupSeatClaimedEmail = async (to, username, info = {}, opts = {}) => {
  const lang = normalizeLang(opts.lang);
  const seatIndex = Number(info.seatIndex) || 0;
  const seats = Number(info.seats) || 0;
  const used = seatIndex;             // seat N used means N of `seats` are taken
  const left = Math.max(0, seats - used);
  const endsOn = info.expiresAt
    ? new Date(info.expiresAt).toISOString().slice(0, 10)
    : null;

  const html = wrapLayout(`
        <tr>
          <td align="center" style="padding:36px 40px 32px;">
            <div style="font-size:48px;margin-bottom:16px;">👥</div>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;">
              ${T(lang, `تم استخدام أحد روابطك يا ${username}`, `One of your invite links was used, ${username}`)}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.7;">
              ${T(lang,
                `المقعد رقم ${seatIndex} من ${seats} أصبح مفعّلاً الآن.`,
                `Seat ${seatIndex} of ${seats} is now active.`)}
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:#0b1021;border-radius:12px;padding:20px 24px;border:1px solid #1e293b;">
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td align="center" style="padding:0 8px;">
                        <p style="margin:0;font-size:30px;font-weight:800;color:#f8fafc;line-height:1.2;">${used}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'مقعداً مستخدماً', 'seats used')}</p>
                      </td>
                      <td align="center" style="padding:0 8px;border-right:1px solid #1e293b;border-left:1px solid #1e293b;">
                        <p style="margin:0;font-size:30px;font-weight:800;color:#22d3ee;line-height:1.2;">${left}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">${T(lang, 'رابطاً متبقياً', 'links left')}</p>
                      </td>
                    </tr>
                  </table>
                  ${endsOn ? `
                  <p style="margin:14px 0 0;font-size:12.5px;color:#64748b;line-height:1.7;">
                    ${T(lang,
                      `اشتراك المجموعة كامله ينتهي في ${endsOn} — كل المقاعد تنتهي في نفس اليوم.`,
                      `The whole group ends on ${endsOn} — every seat shares the same end date.`)}
                  </p>` : ''}
                </td>
              </tr>
            </table>
            ${button(`${SITE}/groups`, T(lang, 'عرض مقاعد مجموعتي ←', 'View my group seats →'))}
            <p style="margin:18px 0 0;font-size:11.5px;color:#475569;line-height:1.7;">
              ${T(lang,
                'لأسباب تتعلّق بالخصوصية، لا نعرض عليك بريد من استخدم الرابط — فقط أي المقاعد استُخدم ومتى.',
                'For privacy we never show you who used a link — only which seat was used, and when.')}
            </p>
          </td>
        </tr>
    `, { lang });

  await sendEmail(
    to,
    T(lang, `تم استخدام المقعد ${seatIndex} من ${seats} في مجموعتك`,
             `Seat ${seatIndex} of ${seats} in your group was used`),
    html,
    T(lang, `المقعد ${seatIndex} من ${seats} أصبح مفعّلاً. تابع مقاعدك: ${SITE}/groups`,
             `Seat ${seatIndex} of ${seats} is now active. See your seats: ${SITE}/groups`),
    { event: 'medqize.group.seat_claimed', bulk: false }
  );
};
