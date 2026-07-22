/**
 * End-of-free-era campaign
 * ------------------------------------------------------------------
 * Announcement + ad to every account created in the last 3 months:
 * the free period is over, the platform is now in production, and
 * their account is no longer active until they subscribe (99 SAR/yr).
 * Also REVOKES those accounts' grandfathered free access so the
 * paywall applies to them from their next login / API call.
 *
 * Excluded always:
 *   - the owner (alshraky3@gmail.com)  — keeps free access
 *   - admin-created accounts           — payment-exempt by design
 *   - currently ACTIVE paid subscriptions
 *   - accounts already notified (free_era_notice_sent_at)
 *
 * Usage (from backend/):
 *   node scripts/endFreeEraCampaign.js --dry-run    # count + list, no changes
 *   node scripts/endFreeEraCampaign.js --preview    # email the OWNER only, no changes
 *   node scripts/endFreeEraCampaign.js --execute    # revoke access + send to everyone
 */
import dotenv from 'dotenv';
import pg from 'pg';
import { sendMail } from '../services/mailer.js';

dotenv.config();

const OWNER_EMAIL = 'alshraky3@gmail.com';
const SITE = 'https://www.smle-question-bank.com';

const mode = process.argv.includes('--execute') ? 'execute'
    : process.argv.includes('--preview') ? 'preview'
    : 'dry-run';

const db = new pg.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false },
    max: 3,
});

const SUBJECT = '📢 انتهت الفترة المجانية — فعّل حسابك في بنك أسئلة SMLE';

function buildHtml(name) {
    const display = name ? String(name).split('@')[0] : 'عزيزي الطالب';
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="margin:0;padding:0;background:#0b1021;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1021;padding:32px 0;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:14px;overflow:hidden;border:1px solid #1e293b;">
        <tr>
          <td style="padding:26px 32px;border-bottom:1px solid #1e293b;" align="right">
            <span style="font-size:22px;font-weight:800;color:#22d3ee;">SQB — بنك أسئلة SMLE</span>
          </td>
        </tr>
        <tr>
          <td style="padding:30px 32px 8px;" align="right" dir="rtl">
            <p style="margin:0 0 8px;font-size:20px;color:#f8fafc;font-weight:800;">مرحباً ${display} 👋</p>
            <p style="margin:0 0 18px;font-size:15px;color:#cbd5e1;line-height:1.9;">
              انتهت الفترة التجريبية المجانية، والمنصّة الآن تعمل <strong style="color:#22d3ee;">رسمياً بنسختها الكاملة</strong>.
              حسابك المجاني <strong style="color:#f87171;">لم يعد نشطاً</strong> — لكن لا تقلق:
              بياناتك وتقدّمك وإحصائياتك كلها محفوظة وبانتظارك.
            </p>
            <div style="background:#0b1021;border:1px solid #1e293b;border-radius:10px;padding:18px 20px;margin-bottom:18px;">
              <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;font-weight:700;">ماذا تحصل عليه بالاشتراك؟</p>
              <p style="margin:0;font-size:14px;color:#e2e8f0;line-height:2.1;">
                ✅ أكثر من <strong>11,000 سؤال</strong> بنمط اختبار SMLE الحقيقي<br/>
                ✅ شرح سريري لكل سؤال + تحليل ذكي لإجاباتك<br/>
                ✅ ملخصات مركّزة لجميع المواضيع عالية التكرار<br/>
                ✅ اختبارات محاكية للاختبار النهائي وتحليلات أداء فورية<br/>
                ✅ متابعة نقاط ضعفك وإعادة التدرب عليها تلقائياً
              </p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#164e63,#0e7490);border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:13px;color:#a5f3fc;">اشتراك سنوي كامل — دفعة واحدة، بدون تجديد تلقائي</p>
                  <p style="margin:0;font-size:30px;font-weight:800;color:#ffffff;">99 ريال <span style="font-size:14px;font-weight:400;color:#a5f3fc;">/ سنة</span></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:18px 32px 26px;">
            <a href="${SITE}/login" style="display:inline-block;padding:14px 44px;background:#22d3ee;color:#0b1021;border-radius:10px;font-weight:800;text-decoration:none;font-size:16px;">
              سجّل دخولك وفعّل اشتراكك الآن ←
            </a>
            <p style="margin:14px 0 0;font-size:12px;color:#64748b;">
              الدفع آمن عبر بوابة <strong>ميسر</strong> المرخّصة (مدى / Visa / Mastercard) — لا نخزّن بيانات بطاقتك.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 22px;border-top:1px solid #1e293b;" align="right" dir="rtl">
            <p style="margin:0;font-size:11px;color:#475569;line-height:1.8;">
              وصلتك هذه الرسالة لأن لديك حساباً في ${SITE.replace('https://', '')}.<br/>
              للاستفسار: <a href="${SITE}/contact" style="color:#22d3ee;text-decoration:none;">تواصل معنا</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const TEXT = `انتهت الفترة المجانية — منصة بنك أسئلة SMLE تعمل الآن رسمياً.
حسابك المجاني لم يعد نشطاً، لكن بياناتك وتقدمك محفوظة.
فعّل اشتراكك السنوي (99 ريال / سنة) لاستعادة الوصول الكامل:
${SITE}/login`;

async function main() {
    // Dedupe safety column
    await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS free_era_notice_sent_at TIMESTAMPTZ DEFAULT NULL`);

    const { rows: targets } = await db.query(`
        SELECT id, username, email, subscription_status,
               grandfathered_at IS NOT NULL AS grandfathered,
               email IS NOT NULL AND email_verified AS emailable,
               free_era_notice_sent_at
        FROM accounts
        WHERE created_at >= NOW() - INTERVAL '3 months'
          AND LOWER(COALESCE(email, '')) <> LOWER($1)
          AND LOWER(username) <> LOWER($1)
          AND NOT is_admin_created
          AND NOT (subscription_status = 'active' AND subscription_expiry_date > NOW())
        ORDER BY id`, [OWNER_EMAIL]);

    const emailable = targets.filter(t => t.emailable && !t.free_era_notice_sent_at);
    const toRevoke = targets.filter(t => t.grandfathered);

    console.log(`Mode: ${mode}`);
    console.log(`In scope (last 3 months, excl. owner/admin/paid): ${targets.length}`);
    console.log(`  will lose grandfathered access: ${toRevoke.length}`);
    console.log(`  will receive the email:         ${emailable.length}`);

    if (mode === 'dry-run') {
        console.table(targets.map(t => ({
            id: t.id, email: t.email || t.username,
            status: t.subscription_status, grandfathered: t.grandfathered,
            willEmail: t.emailable && !t.free_era_notice_sent_at,
        })));
        await db.end();
        return;
    }

    if (mode === 'preview') {
        await sendMail({
            name: 'SQB — بنك أسئلة SMLE',
            to: OWNER_EMAIL,
            subject: `[PREVIEW] ${SUBJECT}`,
            text: TEXT,
            html: buildHtml(OWNER_EMAIL),
        });
        console.log(`Preview sent to ${OWNER_EMAIL}. No accounts were changed.`);
        await db.end();
        return;
    }

    // ── execute ──
    // 1) Revoke grandfathered access for the in-scope accounts.
    if (toRevoke.length) {
        const ids = toRevoke.map(t => t.id);
        await db.query(
            `UPDATE accounts
                SET grandfathered_at = NULL,
                    subscription_status = 'free'
              WHERE id = ANY($1::int[])`, [ids]);
        console.log(`Revoked grandfathered access for ${ids.length} accounts.`);
    }

    // 2) Send the announcement, one by one (Gmail-friendly pacing).
    let sent = 0; const failures = [];
    for (const t of emailable) {
        try {
            await sendMail({
                name: 'SQB — بنك أسئلة SMLE',
                to: t.email,
                subject: SUBJECT,
                text: TEXT,
                html: buildHtml(t.email),
            });
            await db.query(`UPDATE accounts SET free_era_notice_sent_at = NOW() WHERE id = $1`, [t.id]);
            sent++;
            await new Promise(r => setTimeout(r, 1500)); // ~40/min, well under Gmail limits
        } catch (err) {
            failures.push({ id: t.id, email: t.email, error: err.message });
        }
    }
    console.log(`Sent ${sent}/${emailable.length} announcement emails.`);
    if (failures.length) console.table(failures);
    await db.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
