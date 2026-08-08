/**
 * Free-question top-up campaign
 * ------------------------------------------------------------------
 * Was the 1-hour trial reset campaign. The trial is retired, so this now
 * refills the thing that replaced it: every non-paying account gets its
 * FREE_QUESTION_ALLOWANCE back (free_questions_used reset to 0), and an email
 * saying so in its own language (accounts.preferred_lang).
 *
 * In scope: everyone EXCEPT
 *   - the owner (alshraky3@gmail.com)
 *   - admin/temp-link accounts (is_admin_created) — payment-exempt already
 *   - grandfathered accounts — already have permanent free access
 *   - accounts with subscription_status='active' and a future expiry
 *   - accounts with a paid Moyasar payment (payment_events.status='paid')
 *     even if subscription_status is stale — real customers are never touched
 *
 * The refill also clears trial_ended_email_sent_at for every target, so the
 * existing re-engagement job (lifecycleJobs.runTrialEndedJob) is free to
 * follow up again if this second allowance is also spent without converting —
 * otherwise that job would silently skip everyone, because the dedupe flag was
 * already set the first time they ran out.
 *
 * Nothing expires and nothing counts down, so unlike the old trial reset there
 * is no "pending" state to activate on login: the questions are simply there
 * the next time the person opens the app, whether that is in five minutes or
 * five weeks.
 *
 * Usage (from backend/):
 *   node scripts/grantFreeQuestionsCampaign.js --dry-run   # count + list, no changes
 *   node scripts/grantFreeQuestionsCampaign.js --preview   # email the OWNER only (ar+en), no changes
 *   node scripts/grantFreeQuestionsCampaign.js --execute   # top up + send to everyone
 */
import dotenv from 'dotenv';
import pg from 'pg';
import { sendMail } from '../services/mailer.js';
import { renderEmail } from '../routes/admin-broadcast.js';

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

const SUBJECT = {
    ar: '🎁 جدّدنا لك 40 سؤالاً مجانياً — جرّب تحديثات SQB الجديدة',
    en: "🎁 Your 40 free questions are back — try what's new on SQB",
};

function buildBody(lang) {
    const isEn = lang === 'en';
    return isEn ? `
      <p style="margin:0 0 14px">We've shipped a big round of updates to SQB, and we've put your 40 free questions back so you can try them yourself.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 16px">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8">What's new</p>
        <p style="margin:0;line-height:2">
          ✅ A rebuilt, re-checked question bank<br/>
          ✅ A redesigned quiz experience<br/>
          ✅ Clinical explanations for every question<br/>
          ✅ Updated study summaries
        </p>
      </div>
      <p style="margin:0 0 18px"><strong>Nothing counts down and nothing expires</strong> — the questions are waiting whenever you next open the app.</p>
      <p style="text-align:center;margin:0 0 6px">
        <a href="${SITE}/login" style="display:inline-block;padding:13px 34px;background:#1d4ed8;color:#fff;border-radius:9px;font-weight:700;text-decoration:none">Log in and use them →</a>
      </p>
    ` : `
      <p style="margin:0 0 14px">أجرينا تحديثات كبيرة على منصة SQB مؤخراً، وجدّدنا لك 40 سؤالاً مجانياً حتى تجرّبها بنفسك.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 16px">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8">ما الجديد؟</p>
        <p style="margin:0;line-height:2">
          ✅ بنك أسئلة مُعاد بناؤه ومراجَع بالكامل<br/>
          ✅ تصميم جديد لتجربة الاختبار<br/>
          ✅ شرح سريري لكل سؤال<br/>
          ✅ ملخصات دراسية محدّثة
        </p>
      </div>
      <p style="margin:0 0 18px"><strong>لا يوجد عدّاد ولا وقت ينتهي</strong> — الأسئلة بانتظارك متى ما فتحت المنصة.</p>
      <p style="text-align:center;margin:0 0 6px">
        <a href="${SITE}/login" style="display:inline-block;padding:13px 34px;background:#1d4ed8;color:#fff;border-radius:9px;font-weight:700;text-decoration:none">سجّل الدخول واستخدمها ←</a>
      </p>
    `;
}

function buildText(lang) {
    return lang === 'en'
        ? `We've put your 40 free SQB questions back so you can try our latest updates (rebuilt question bank, redesigned quiz, clinical explanations, updated summaries).\nNothing counts down — use them whenever: ${SITE}/login`
        : `جدّدنا لك 40 سؤالاً مجانياً في SQB لتجربة آخر التحديثات (بنك أسئلة مُعاد بناؤه، تصميم اختبار جديد، شرح سريري، ملخصات محدّثة).\nلا يوجد عدّاد — استخدمها متى شئت: ${SITE}/login`;
}

async function main() {
    // Own dedupe column for this campaign's email, separate from the
    // lifecycle job's trial_ended_email_sent_at.
    await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS trial_reset_email_sent_at TIMESTAMPTZ DEFAULT NULL`);

    const { rows: targets } = await db.query(`
        SELECT a.id, a.username, a.email, a.subscription_status, a.preferred_lang,
               a.email IS NOT NULL AND a.email <> '' AND a.email_verified
                   AND COALESCE(a.isactive, TRUE) AND NOT COALESCE(a.email_opt_out, FALSE) AS emailable
        FROM accounts a
        WHERE LOWER(COALESCE(a.email, '')) <> LOWER($1)
          AND LOWER(a.username) <> LOWER($1)
          AND NOT a.is_admin_created
          AND a.grandfathered_at IS NULL
          AND NOT (a.subscription_status = 'active' AND a.subscription_expiry_date > NOW())
          AND NOT EXISTS (
                SELECT 1 FROM payment_events pe
                 WHERE pe.account_id = a.id AND pe.status = 'paid')
        ORDER BY a.id`, [OWNER_EMAIL]);

    const emailable = targets.filter(t => t.emailable);

    console.log(`Mode: ${mode}`);
    console.log(`In scope (non-paid accounts, excl. owner/admin/grandfathered/Moyasar-paid): ${targets.length}`);
    console.log(`  will get a refill: ${targets.length}`);
    console.log(`  will receive the email:     ${emailable.length}`);

    if (mode === 'dry-run') {
        console.table(targets.slice(0, 30).map(t => ({
            id: t.id, email: t.email || t.username,
            status: t.subscription_status, lang: t.preferred_lang || 'ar',
            willEmail: t.emailable,
        })));
        if (targets.length > 30) console.log(`… ${targets.length - 30} more rows.`);
        await db.end();
        return;
    }

    if (mode === 'preview') {
        for (const lang of ['ar', 'en']) {
            const bodyHtml = buildBody(lang);
            await sendMail({
                event: 'medqize.campaign.trial_reset_preview',
                name: 'SQB',
                to: OWNER_EMAIL,
                subject: `[PREVIEW ${lang.toUpperCase()}] ${SUBJECT[lang]}`,
                text: buildText(lang),
                html: renderEmail({ bodyHtml, accountId: null, username: 'Owner', lang }),
            });
        }
        console.log(`Preview sent to ${OWNER_EMAIL} (ar + en). No accounts were changed.`);
        await db.end();
        return;
    }

    // ── execute ──
    // 1) Refill the allowance for every in-scope account. Also clears
    //    trial_ended_email_sent_at so the lifecycle re-engagement job can
    //    follow up again if this second allowance is also spent without
    //    converting — otherwise it would skip everyone, because that flag was
    //    already set the first time they ran out.
    if (targets.length) {
        const ids = targets.map(t => t.id);
        await db.query(
            `UPDATE accounts
                SET free_questions_used = 0,
                    trial_ended_email_sent_at = NULL
              WHERE id = ANY($1::int[])`,
            [ids]
        );
        console.log(`Refilled the free question allowance for ${ids.length} accounts.`);
    }

    // 2) Send the announcement, one by one (Gmail/Resend-friendly pacing).
    let sent = 0; const failures = [];
    for (const t of emailable) {
        const lang = String(t.preferred_lang || '').toLowerCase().startsWith('en') ? 'en' : 'ar';
        try {
            const bodyHtml = buildBody(lang);
            await sendMail({
                event: 'medqize.campaign.trial_reset',
                bulk: true,
                name: 'SQB',
                to: t.email,
                subject: SUBJECT[lang],
                text: buildText(lang),
                html: renderEmail({ bodyHtml, accountId: t.id, username: t.username, lang }),
            });
            await db.query(`UPDATE accounts SET trial_reset_email_sent_at = NOW() WHERE id = $1`, [t.id]);
            sent++;
            await new Promise(r => setTimeout(r, 1500)); // ~40/min, well under Gmail/Resend limits
        } catch (err) {
            failures.push({ id: t.id, email: t.email, error: err.message });
        }
    }
    console.log(`Sent ${sent}/${emailable.length} refill emails.`);
    if (failures.length) console.table(failures);
    await db.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
