import { useEffect, useState } from 'react';
import Globals from '../global.js';
import { formatDate } from '../i18n/format.js';

/**
 * The National Day offer, as the front end sees it — data only, no drawing.
 *
 * Nothing here decides a price. The server does (NATIONAL_DAY_OFFER in
 * backend/services/paymentService.js) and hands every price, "was" price and
 * deadline down through /api/payment/config — the same response the checkout
 * charges from. This file only reshapes that response, so what a visitor is
 * quoted cannot drift from what Moyasar is asked to charge.
 *
 * When the offer is off, or the request fails, or the server sends nothing this
 * file recognises, everything here yields null and the page shows its ordinary
 * prices. A missing banner is a fine failure; a wrong price is not.
 *
 * Campaign code — see the removal note at the top of i18n/copy/nationalDay.js.
 */

/** Halalas → riyals, without ever printing "96.00" for a whole-riyal price. */
export const sar = (halalas) => {
    const n = Number(halalas) / 100;
    return Number.isInteger(n) ? n : Number(n.toFixed(2));
};

const shapePlan = (plan) => {
    if (!plan || !plan.offerId) return null;
    const price = Number(plan.priceHalalas);
    const was = Number(plan.compareAtHalalas) > price ? Number(plan.compareAtHalalas) : null;
    const solo = Number(plan.compareToHalalas) > 0 ? Number(plan.compareToHalalas) : null;
    return {
        id: plan.id,
        seats: Number(plan.seats) || 1,
        months: Number(plan.months) || 1,
        price: sar(price),
        // Only a real, advertised cut carries a "was" — the server withholds it
        // when the saving is too small to call a discount.
        was: was ? sar(was) : null,
        saved: was ? sar(was - price) : 0,
        perMonth: Math.round(price / (Number(plan.months) || 1) / 100),
        perSeat: Math.round(price / (Number(plan.seats) || 1) / 100),
        // How much cheaper each seat is than the same term bought alone.
        seatSavingPct: solo ? Math.round((1 - price / (Number(plan.seats) || 1) / solo) * 100) : 0,
    };
};

/**
 * The offered plans from a /config `plans` array, or null when the two
 * individual plans the copy is written around are not both on offer. The group
 * plans are optional — a section without them is still a true section.
 */
export function offerPlans(plans) {
    const byId = Object.fromEntries((plans || []).map((p) => [p.id, p]));
    const fourMonth = shapePlan(byId.four_month);
    const annual = shapePlan(byId.annual);
    if (!fourMonth || !annual) return null;
    return {
        fourMonth,
        annual,
        group3: shapePlan(byId.group_3),
        group5: shapePlan(byId.group_5),
        monthly: byId.monthly ? sar(byId.monthly.priceHalalas) : 50,
    };
}

/**
 * The live offer for the landing page, which — unlike /subscribe and /groups —
 * has no config request of its own.
 *
 * Plain fetch, not axios: the landing route is the anonymous, eager entry point
 * and must not pull axios into its bundle (see the same note on /public/stats
 * in Landing.jsx). `no-store` because a cached "offer" would advertise a price
 * the server may have stopped honouring.
 *
 * @returns {null | {offer: object, plans: ReturnType<typeof offerPlans>}}
 */
export function useNationalDayOffer() {
    const [state, setState] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${Globals.URL}/api/payment/config?kind=all`, {
            signal: controller.signal,
            cache: 'no-store',
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((cfg) => {
                if (!cfg?.enabled || !cfg.offer?.active) return;
                const plans = offerPlans(cfg.plans);
                if (plans) setState({ offer: cfg.offer, plans });
            })
            .catch(() => { /* no banner — the ordinary prices stand */ });
        return () => controller.abort();
    }, []);

    return state;
}

/** The deadline as a date a person in Saudi Arabia would recognise, in Riyadh time. */
export const offerEndDate = (offer, lang) => formatDate(offer?.endsAt, lang, {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh',
});
