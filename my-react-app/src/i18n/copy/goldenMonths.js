/**
 * Golden Months (الأشهر الذهبية) copy — the bonus-time offer of Oct–Nov 2026.
 *
 * Wording only. Whether the offer is on, its deadline, and how many bonus months
 * a plan carries all come from /api/payment/config (`goldenMonths`, and
 * `bonusMonths` on the plan) — the server's backend/services/goldenMonths.js is
 * the one source, and the price is never changed by this offer. Latin digits, as
 * everywhere on the site.
 *
 * TO REMOVE AFTER THE CAMPAIGN: this file, components/common/GoldenMonths.jsx,
 * utils/goldenMonths.js and the `gm` wiring in Landing.jsx and Subscribe.jsx
 * (grep "oldenMonths"). The offer itself ends on the server by date.
 * Record: docs/GOLDEN_MONTHS_OFFER_2026-10.md.
 */
const arMonths = (n) => (n === 1 ? 'شهر' : n === 2 ? 'شهران' : `${n} ${n <= 10 ? 'أشهر' : 'شهراً'}`);

const goldenMonthsCopy = {
    ar: {
        strip: {
            label: 'الأشهر الذهبية',
            deal: 'اشترك 4 أشهر واحصل على شهر خامس مجاناً',
            dealShort: 'شهر مجاني مع باقة 4 أشهر',
            cta: 'اشترك الآن',
        },
        banner: {
            title: 'الأشهر الذهبية: شهر خامس مجاناً مع باقة 4 أشهر',
            endsOn: (date) => `العرض ينتهي ${date}`,
        },
        planBadge: 'شهر مجاني',
        // "/ 5 أشهر" next to the unchanged price.
        period: (total) => `/ ${arMonths(total)}`,
        note: (total, base) => `تحصل على ${arMonths(total)} بسعر ${arMonths(base)} — الإضافة تلقائية عند الدفع.`,
    },
    en: {
        strip: {
            label: 'Golden Months',
            deal: 'Buy 4 months, get a 5th month free',
            dealShort: 'A free month with the 4-month plan',
            cta: 'Subscribe now',
        },
        banner: {
            title: 'Golden Months: a 5th month free with the 4-month plan',
            endsOn: (date) => `Offer ends ${date}`,
        },
        planBadge: '+1 month free',
        period: (total) => `/ ${total} months`,
        note: (total, base) => `You get ${total} months for the price of ${base} — added automatically when you pay.`,
    },
};

export default goldenMonthsCopy;
