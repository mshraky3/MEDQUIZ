/**
 * National Day offer copy — the 96th Saudi National Day, 23 September 2026.
 *
 * Every number on screen (the prices, the struck-through "was" prices, the
 * savings, the deadline) is passed IN from /api/payment/config, never typed
 * here. The offer's prices live in one place —
 * backend/services/paymentService.js, NATIONAL_DAY_OFFER — and the amount the
 * checkout charges comes from that same place, so a figure written into this
 * file could only ever be a second, drifting copy of it. What lives here is
 * wording.
 *
 * Latin digits throughout, as everywhere else on the site (see i18n/format.js).
 *
 * TO REMOVE AFTER THE CAMPAIGN: this file, components/common/NationalDayOffer.*,
 * components/landing/NationalDaySection.*, and the `nd` wiring in Landing.jsx,
 * Subscribe.jsx and GroupsPage.jsx (grep "NationalDay"). Nothing else depends on
 * them, and the offer itself ends on the server, once an end date is set, without
 * any of this changing. Prices, revert steps and the original ladder:
 * docs/NATIONAL_DAY_OFFER_2026-09.md.
 */

/** Arabic count + noun for "ends in …": يوم / يومين / 3–10 أيام / 11+ يوماً. */
const arCount = (n, one, two, few, many) => {
    if (n === 1) return one;
    if (n === 2) return two;
    return `${n} ${n <= 10 ? few : many}`;
};

const nationalDayCopy = {
    ar: {
        // The slim bar across the top of the landing page.
        strip: {
            label: 'اليوم الوطني الـ96',
            deal: (fourMonth) => `أربعة أشهر بـ${fourMonth} ريالاً`,
            dealFull: (fourMonth, annual) => `أربعة أشهر بـ${fourMonth} ريالاً وسنة بـ${annual} ريالاً`,
            cta: 'اطّلع على العرض',
        },

        // "Ends in 5 days and 4 hours". Days while there are days, then hours,
        // then minutes — the unit a person needs to decide how long they have.
        countdown: (ms) => {
            const day = 86400000; const hour = 3600000; const minute = 60000;
            const d = Math.floor(ms / day);
            const h = Math.floor((ms % day) / hour);
            const m = Math.floor((ms % hour) / minute);
            const D = arCount(d, 'يوم', 'يومين', 'أيام', 'يوماً');
            const H = arCount(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة');
            const M = arCount(Math.max(m, 1), 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة');
            let parts;
            if (d >= 1) parts = h > 0 ? `${D} و${H}` : D;
            else if (h >= 1) parts = m > 0 ? `${H} و${M}` : H;
            else parts = M;
            return `ينتهي العرض خلال ${parts}`;
        },
        endsOn: (date) => `حتى ${date}`,
        // Shown in place of the countdown while the offer has no end date.
        limited: 'عرض لفترة محدودة',

        // The compact banner on /subscribe and /groups.
        banner: {
            title: 'عرض اليوم الوطني الـ96',
        },
        saveNote: (saved, pct) => `عرض اليوم الوطني — توفّر ${saved} ريالاً (${pct}%)`,

        section: {
            sectionLabel: 'عرض اليوم الوطني',
            title: (fourMonth) => `اليوم الوطني الـ96: أربعة أشهر بـ${fourMonth} ريالاً`,
            body: 'نحتفل بالوطن مع كل طالب يستعد لاختبار الترخيص، بأسعار خاصة لفترة محدودة. كل الخطط دفعة واحدة وبدون تجديد تلقائي.',
            currency: 'ريال',
            fourMonth: {
                name: 'أربعة أشهر',
                save: (n) => `وفّر ${n} ريالاً`,
                perMonth: (n) => `${n} ريالاً في الشهر`,
            },
            annual: {
                name: 'سنة كاملة',
                badge: 'الأقل تكلفة في الشهر',
                save: (n) => `وفّر ${n} ريالاً`,
                perMonth: (n) => `${n} ريالاً في الشهر`,
            },
            group: {
                name: 'اشتراك جماعي',
                blurb: 'لك ولأصدقائك، لمدة 4 أشهر',
                seats: (n) => `${n} حسابات`,
                each: (n) => `${n} ريالاً للحساب`,
            },
            cta: {
                guest: 'سجّل واستفد من العرض',
                member: 'اشترك بسعر العرض',
                group: 'اعرض الاشتراكات الجماعية',
            },
            // The monthly plan, shown beside the offer as the yardstick rather
            // than discounted: at 50 SAR it is the price the offer is measured
            // against, and two months of it (100) cost more than four months at
            // the offer price (96). `compare` is only drawn when that is true.
            monthly: {
                name: 'الاشتراك الشهري',
                price: (n) => `${n} ريالاً / شهر`,
                note: 'لا يشمله العرض وسعره كما هو',
                // A round hundred takes the singular genitive (مئة ريال), everything else the accusative.
                compare: (two, four) => `أربعة أشهر بـ${four} ريالاً أقل من سعر شهرين (${two} ${two % 100 === 0 ? 'ريال' : 'ريالاً'})`,
            },
            guestNote: 'لا تدفع الآن: ابدأ بـ40 سؤالاً مجاناً، واشترك بسعر العرض قبل أن ينتهي.',
            // `endDate` is '' while the offer has no end date — then there is no footnote.
            footnote: (endDate) => (endDate ? `العرض ساري حتى ${endDate}.` : ''),
        },

        // Replacements for the static pricing copy while the offer is on, so
        // the price card and the comparison table never contradict the offer.
        pricing: {
            line: (fourMonth, wasFourMonth, annual, wasAnnual) =>
                `أربعة أشهر بـ ${fourMonth} ريالاً بدلاً من ${wasFourMonth} · سنة بـ ${annual} ريالاً بدلاً من ${wasAnnual} — عرض اليوم الوطني`,
            compareCost: (annual) => `من 50 ريالاً شهرياً — وسنة كاملة بـ${annual} ريالاً`,
            groupBadge: (pct) => `وفّر حتى ${pct}% للحساب`,
            tier: (seats, months, price, each) => ({
                label: `${seats} حسابات · ${months} أشهر`,
                price: `${price} ريال`,
                each: `${each} ريالاً للحساب`,
            }),
        },
    },

    en: {
        strip: {
            label: 'Saudi National Day 96',
            deal: (fourMonth) => `Four months for SAR ${fourMonth}`,
            dealFull: (fourMonth, annual) => `Four months for SAR ${fourMonth}, a year for SAR ${annual}`,
            cta: 'See the offer',
        },

        countdown: (ms) => {
            const day = 86400000; const hour = 3600000; const minute = 60000;
            const d = Math.floor(ms / day);
            const h = Math.floor((ms % day) / hour);
            const m = Math.max(Math.floor((ms % hour) / minute), 1);
            const unit = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
            let parts;
            if (d >= 1) parts = h > 0 ? `${unit(d, 'day')} ${unit(h, 'hour')}` : unit(d, 'day');
            else if (h >= 1) parts = Math.floor((ms % hour) / minute) > 0 ? `${unit(h, 'hour')} ${unit(m, 'minute')}` : unit(h, 'hour');
            else parts = unit(m, 'minute');
            return `Offer ends in ${parts}`;
        },
        endsOn: (date) => `Until ${date}`,
        limited: 'Limited-time offer',

        banner: {
            title: 'National Day 96 offer',
        },
        saveNote: (saved, pct) => `National Day offer — you save SAR ${saved} (${pct}%)`,

        section: {
            sectionLabel: 'National Day offer',
            title: (fourMonth) => `National Day 96: four months for SAR ${fourMonth}`,
            body: 'We are celebrating with every student preparing for a licensing exam, with special prices for a limited time. Every plan is a single payment with no auto-renewal.',
            currency: 'SAR',
            fourMonth: {
                name: 'Four months',
                save: (n) => `Save SAR ${n}`,
                perMonth: (n) => `SAR ${n} a month`,
            },
            annual: {
                name: 'A full year',
                badge: 'Lowest cost per month',
                save: (n) => `Save SAR ${n}`,
                perMonth: (n) => `SAR ${n} a month`,
            },
            group: {
                name: 'Group plan',
                blurb: 'For you and your friends, four months',
                seats: (n) => `${n} accounts`,
                each: (n) => `SAR ${n} per account`,
            },
            cta: {
                guest: 'Sign up to get the offer',
                member: 'Subscribe at the offer price',
                group: 'See the group plans',
            },
            monthly: {
                name: 'Monthly plan',
                price: (n) => `SAR ${n} / month`,
                note: 'Not part of the offer, price unchanged',
                compare: (two, four) => `Four months for SAR ${four} costs less than two months (SAR ${two})`,
            },
            guestNote: 'Nothing to pay now: start with 40 free questions, then subscribe at the offer price before it ends.',
            footnote: (endDate) => (endDate ? `The offer runs until ${endDate}.` : ''),
        },

        pricing: {
            line: (fourMonth, wasFourMonth, annual, wasAnnual) =>
                `Four months for SAR ${fourMonth}, down from ${wasFourMonth} · a year for SAR ${annual}, down from ${wasAnnual} — National Day offer`,
            compareCost: (annual) => `From SAR 50 a month — a whole year for SAR ${annual}`,
            groupBadge: (pct) => `Save up to ${pct}% per seat`,
            tier: (seats, months, price, each) => ({
                label: `${seats} accounts · ${months} months`,
                price: `SAR ${price}`,
                each: `SAR ${each} per account`,
            }),
        },
    },
};

export default nationalDayCopy;
