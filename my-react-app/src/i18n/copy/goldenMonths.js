/**
 * Golden Months (الأشهر الذهبية) copy — the bonus-time offer of Oct–Nov 2026.
 *
 * Wording only. Whether the offer is on, its deadline, and how many bonus months
 * a plan carries all come from /api/payment/config (`goldenMonths`, and
 * `bonusMonths` on the plan) — the server's backend/services/goldenMonths.js is
 * the one source, and the price is never changed by this offer. Every number
 * here is passed in. Latin digits, as everywhere on the site.
 *
 * TO REMOVE AFTER THE CAMPAIGN: this file, components/common/GoldenMonths.jsx,
 * components/landing/GoldenMonthsSection.*, utils/goldenMonths.js and the `gm`
 * wiring in Landing.jsx and Subscribe.jsx (grep "oldenMonths"). The offer itself
 * ends on the server by date. Record: docs/GOLDEN_MONTHS_OFFER_2026-10.md.
 */
const arMonths = (n) => (n === 1 ? 'شهر' : n === 2 ? 'شهران' : `${n} ${n <= 10 ? 'أشهر' : 'شهراً'}`);

const goldenMonthsCopy = {
    ar: {
        strip: {
            label: 'الأشهر الذهبية',
            deal: 'اشترك 4 أشهر واحصل على شهر خامس مجاناً',
            dealShort: 'شهر مجاني مع باقة 4 أشهر',
            cta: 'اطّلع على العرض',
        },
        banner: {
            title: 'الأشهر الذهبية: شهر خامس مجاناً مع باقة 4 أشهر',
            endsOn: (date) => `العرض ينتهي ${date}`,
        },
        // The plan card on /subscribe: the old term struck out, the new one beside it.
        card: {
            monthWord: (n) => (n <= 10 ? 'أشهر' : 'شهراً'),
            perMonth: (n) => `${n} ريال/شهر`,
        },
        period: (total) => `/ ${arMonths(total)}`,
        note: (total, base) => `تحصل على ${arMonths(total)} بسعر ${arMonths(base)} — الإضافة تلقائية عند الدفع.`,

        // The panel on the landing page.
        section: {
            eyebrow: 'الأشهر الذهبية · SMLE و SNLE',
            title: (base, total) => `اشترك ${arMonths(base)}… وادرس ${arMonths(total)}`,
            body: 'موسم الاختبارات في أوجه. ادفع مرة واحدة لباقة الأربعة أشهر بسعرها المعتاد، وأضفنا لك شهراً خامساً هدية. السعر لم يتغير، والمدة زادت.',
            monthLabel: (n) => `الشهر ${n}`,
            gift: 'هدية',
            currency: 'ريال',
            perMonthNow: (n) => `${n} ريال/شهر`,
            perMonthLabel: 'تكلفة الشهر الواحد',
            compare: (monthlyTotal, months) => `${months} أشهر بالباقة الشهرية تكلّف ${monthlyTotal} ريالاً.`,
            cta: { guest: 'ابدأ مجاناً ثم اشترك', member: 'اشترك الآن' },
            guestNote: 'تبدأ بحساب مجاني ولا تحتاج بطاقة. الشهر الإضافي يُضاف تلقائياً عند الدفع.',
            footnote: (date) => `العرض ساري حتى ${date}، بتوقيت الرياض. دفعة واحدة، بلا تجديد تلقائي.`,
        },
    },
    en: {
        strip: {
            label: 'Golden Months',
            deal: 'Buy 4 months, get a 5th month free',
            dealShort: 'A free month with the 4-month plan',
            cta: 'See the offer',
        },
        banner: {
            title: 'Golden Months: a 5th month free with the 4-month plan',
            endsOn: (date) => `Offer ends ${date}`,
        },
        card: {
            monthWord: () => 'months',
            perMonth: (n) => `SAR ${n}/mo`,
        },
        period: (total) => `/ ${total} months`,
        note: (total, base) => `You get ${total} months for the price of ${base} — added automatically when you pay.`,

        section: {
            eyebrow: 'Golden Months · SMLE & SNLE',
            title: (base, total) => `Pay for ${base} months… study for ${total}`,
            body: 'Exam season is here. Pay once for the four-month plan at its usual price and we add a fifth month as a gift. The price did not change, the time did.',
            monthLabel: (n) => `Month ${n}`,
            gift: 'Gift',
            currency: 'SAR',
            perMonthNow: (n) => `SAR ${n}/mo`,
            perMonthLabel: 'Cost per month',
            compare: (monthlyTotal, months) => `${months} months on the monthly plan cost SAR ${monthlyTotal}.`,
            cta: { guest: 'Start free, then subscribe', member: 'Subscribe now' },
            guestNote: 'You start with a free account and need no card. The extra month is added automatically when you pay.',
            footnote: (date) => `Offer valid until ${date}, Riyadh time. One payment, no automatic renewal.`,
        },
    },
};

export default goldenMonthsCopy;
