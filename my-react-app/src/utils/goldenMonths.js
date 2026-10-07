import { useEffect, useState } from 'react';
import { formatDate } from '../i18n/format.js';
import { loadPublicConfig } from './nationalDay.js';

/**
 * Golden Months (bonus-time offer), as the landing page sees it — data only.
 *
 * The server decides everything (backend/services/goldenMonths.js) and sends it
 * in /api/payment/config: `goldenMonths` for the offer and `bonusMonths` on the
 * plan. This file only reshapes that, so nothing here can drift from what the
 * checkout credits. null when the offer is off or the request failed: the page
 * is then the ordinary page.
 * Campaign code — removal note at the top of i18n/copy/goldenMonths.js.
 */

/**
 * The four-month plan as the offer shows it. The price is the ordinary price —
 * only the months and the per-month figure change.
 * @returns {null | {price:number, months:number, bonus:number, total:number,
 *                   perMonthWas:number, perMonthNow:number, monthly:number|null}}
 */
export function goldenPlan(plans) {
    const plan = (plans || []).find((p) => p.id === 'four_month' && Number(p.bonusMonths) > 0);
    if (!plan) return null;
    const price = Number(plan.priceHalalas) / 100;
    const months = Number(plan.months);
    const bonus = Number(plan.bonusMonths);
    const monthly = (plans || []).find((p) => p.id === 'monthly');
    return {
        price,
        months,
        bonus,
        total: months + bonus,
        perMonthWas: Math.round(price / months),
        perMonthNow: Math.round(price / (months + bonus)),
        monthly: monthly ? Number(monthly.priceHalalas) / 100 : null,
    };
}

/** @returns {null | {offer: object, plan: ReturnType<typeof goldenPlan>}} */
export function useGoldenMonths() {
    const [state, setState] = useState(null);

    useEffect(() => {
        let alive = true;
        loadPublicConfig()
            .then((cfg) => {
                if (!alive || !cfg?.enabled || !cfg.goldenMonths?.active) return;
                const plan = goldenPlan(cfg.plans);
                if (plan) setState({ offer: cfg.goldenMonths, plan });
            })
            .catch(() => { /* no panel — the ordinary page stands */ });
        return () => { alive = false; };
    }, []);

    return state;
}

/** The deadline as a date a person in Saudi Arabia would recognise, in Riyadh time. */
export const goldenEndDate = (offer, lang) => formatDate(offer?.endsAt, lang, {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh',
});
