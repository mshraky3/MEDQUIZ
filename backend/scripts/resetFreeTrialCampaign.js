/**
 * Free-trial reset campaign
 * ------------------------------------------------------------------
 * Grants every non-paying account a fresh 1-hour free trial (the same
 * mechanic new signups get) and emails them to say so, in their own
 * language (accounts.preferred_lang).
 *
 * In scope: everyone EXCEPT
 *   - the owner (alshraky3@gmail.com)
 *   - admin/temp-link accounts (is_admin_created) — payment-exempt already
 *   - grandfathered accounts — already have permanent free access
 *   - accounts with subscription_status='active' and a future expiry
 *   - accounts with a paid Moyasar payment (payment_events.status='paid')
 *     even if subscription_status is stale — real customers are never touched
 *
 * The reset also clears trial_ended_email_sent_at for every target, so the
 * existing re-engagement job (lifecycleJobs.runTrialEndedJob) is free to
 * follow up again if this second trial also lapses unconverted — otherwise
 * that job would silently skip everyone because the dedupe flag from their
 * FIRST trial was already set.
 *
 * The trial does NOT start counting down here. Each account is set to
 * subscription_status='trial_pending' with no expiry date — the hour only
 * starts at that account's own next /login (see the activation block in
 * app.js), exactly like a coupon that isn't punched until it's used. That
 * way it doesn't matter whether someone opens the email 5 minutes or 5 days
 * from now: they always get a full, real hour once they log in.
 *
 * Usage (from backend/):
 *   node scripts/resetFreeTrialCampaign.js --dry-run    # count + list, no changes
 *   node scripts/resetFreeTrialCampaign.js --preview    # email the OWNER only (ar+en), no changes
 *   node scripts/resetFreeTrialCampaign.js --execute    # reset trials + send to everyone
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
    ar: '🎁 أعدنا تفعيل تجربتك المجانية لمدة ساعة — جرّب تحديثات SQB الجديدة',
    en: "🎁 Your free 1-hour trial is back — try what's new on SQB",
};

function buildBody(lang) {
    const isEn = lang === 'en';
    return isEn ? `
      <p style="margin:0 0 14px">We've shipped a big round of updates to SQB, and we've reactivated your free 1-hour trial so you can try them yourself.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 16px">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8">What's new</p>
        <p style="margin:0;line-height:2">
          ✅ A rebuilt, re-checked question bank<br/>
          ✅ A redesigned quiz experience<br/>
          ✅ Clinical explanations for every question<br/>
          ✅ Updated study summaries
        </p>
      </div>
      <p style="margin:0 0 18px"><strong>Your free hour starts the moment you log in</strong> — so take it whenever suits you.</p>
      <p style="text-align:center;margin:0 0 6px">
        <a href="${SITE}/login" style="display:inline-block;padding:13px 34px;background:#1d4ed8;color:#fff;border-radius:9px;font-weight:700;text-decoration:none">Log in and start your hour →</a>
      </p>
    ` : `
      <p style="margin:0 0 14px">أجرينا تحديثات كبيرة على منصة SQB مؤخراً، وأعدنا تفعيل تجربتك المجانية لمدة ساعة كاملة حتى تجربها بنفسك.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 16px">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8">ما الجديد؟</p>
        <p style="margin:0;line-height:2">
          ✅ بنك أسئلة مُعاد بناؤه ومراجَع بالكامل<br/>
          ✅ تصميم جديد لتجربة الاختبار<br/>
          ✅ شرح سريري لكل سؤال<br/>
          ✅ ملخصات دراسية محدّثة
        </p>
      </div>
      <p style="margin:0 0 18px"><strong>ساعتك المجانية تبدأ فور تسجيل الدخول</strong> — استخدمها في الوقت الذي يناسبك.</p>
      <p style="text-align:center;margin:0 0 6px">
        <a href="${SITE}/login" style="display:inline-block;padding:13px 34px;background:#1d4ed8;color:#fff;border-radius:9px;font-weight:700;text-decoration:none">سجّل الدخول وابدأ ساعتك ←</a>
      </p>
    `;
}

function buildText(lang) {
    return lang === 'en'
        ? `We've reactivated your free 1-hour SQB trial so you can try our latest updates (rebuilt question bank, redesigned quiz, clinical explanations, updated summaries).\nYour hour starts the moment you log in: ${SITE}/login`
        : `أعدنا تفعيل تجربتك المجانية لمدة ساعة في SQB لتجربة آخر التحديثات (بنك أسئلة مُعاد بناؤه، تصميم اختبار جديد، شرح سريري، ملخصات محدّثة).\nساعتك تبدأ فور تسجيل الدخول: ${SITE}/login`;
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
    console.log(`  will get their trial reset: ${targets.length}`);
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
    // 1) Grant a PENDING trial for every in-scope account — no expiry yet.
    //    The hour is activated by app.js's /login handler the next time each
    //    person actually signs in, not here. This also clears
    //    trial_ended_email_sent_at so the lifecycle re-engagement job can
    //    follow up again if this second trial also lapses unconverted —
    //    otherwise it would skip everyone because that flag was already set
    //    from their FIRST trial. The old trial_grants row (if any) is left
    //    alone; /login's activation upserts it with the real expiry once the
    //    hour actually starts.
    if (targets.length) {
        const ids = targets.map(t => t.id);
        await db.query(
            `UPDATE accounts
                SET subscription_status = 'trial_pending',
                    subscription_expiry_date = NULL,
                    trial_ended_email_sent_at = NULL
              WHERE id = ANY($1::int[])`,
            [ids]
        );
        console.log(`Granted a pending trial to ${ids.length} accounts (starts on next login).`);
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
    console.log(`Sent ${sent}/${emailable.length} trial-reset emails.`);
    if (failures.length) console.table(failures);
    await db.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
