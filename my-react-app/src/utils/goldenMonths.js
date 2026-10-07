import { useEffect, useState } from 'react';
import { formatDate } from '../i18n/format.js';
import { loadPublicConfig } from './nationalDay.js';

/**
 * Golden Months (bonus-time offer), as the landing page sees it — data only.
 *
 * The server decides everything (backend/services/goldenMonths.js) and sends it
 * in /api/payment/config as `goldenMonths`; this hook only reads it. null when
 * the offer is off or the request failed: the page is then the ordinary page.
 * Campaign code — removal note at the top of i18n/copy/goldenMonths.js.
 */
export function useGoldenMonths() {
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        let alive = true;
        loadPublicConfig()
            .then((cfg) => {
                const gm = cfg?.enabled && cfg.goldenMonths?.active ? cfg.goldenMonths : null;
                if (alive && gm) setOffer(gm);
            })
            .catch(() => { /* no strip — the ordinary page stands */ });
        return () => { alive = false; };
    }, []);

    return offer;
}

/** The deadline as a date a person in Saudi Arabia would recognise, in Riyadh time. */
export const goldenEndDate = (offer, lang) => formatDate(offer?.endsAt, lang, {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh',
});
