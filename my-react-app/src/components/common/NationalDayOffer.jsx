import React, { useEffect, useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import nationalDayCopy from '../../i18n/copy/nationalDay.js';
import { offerEndDate } from '../../utils/nationalDay.js';
import './NationalDayOffer.css';

/**
 * The surfaces that draw the National Day offer: the countdown, the strip across
 * the top of the landing page, and the banner on /subscribe and /groups. The
 * data side — fetching /config and reshaping it — is utils/nationalDay.js.
 *
 * Campaign code — see the removal note at the top of i18n/copy/nationalDay.js.
 */

/**
 * Milliseconds left, measured against the SERVER's clock. The server sends
 * its own "now" with the offer; a visitor's device can be minutes out, and a
 * countdown that disagrees with the deadline it counts toward would be worse
 * than none. Re-evaluated every 30s — the smallest unit shown is a minute.
 */
function useRemainingMs(offer) {
    const skew = useMemo(
        () => (Number(offer?.now) || Date.now()) - Date.now(),
        [offer?.now],
    );
    const [, refresh] = useState(0);

    useEffect(() => {
        if (!offer) return undefined;
        const id = setInterval(() => refresh((n) => n + 1), 30000);
        return () => clearInterval(id);
    }, [offer]);

    return offer ? Date.parse(offer.endsAt) - (Date.now() + skew) : 0;
}


/** "Ends in 5 days and 4 hours". Renders nothing once the deadline has passed. */
export function OfferCountdown({ offer, className = '' }) {
    const t = useCopy(nationalDayCopy);
    const remaining = useRemainingMs(offer);
    if (!offer || !(remaining > 0)) return null;
    return (
        <span className={`nd-countdown${className ? ` ${className}` : ''}`}>
            <Icon name="clock" size={14} aria-hidden="true" />
            <time dateTime={offer.endsAt}>{t.countdown(remaining)}</time>
        </span>
    );
}

/** The gold "96" tab that marks every National Day surface. Decorative. */
export const OfferChip = () => <span className="nd-chip" aria-hidden="true">96</span>;

/**
 * The slim bar across the top of the landing page. One link: it scrolls to the
 * offer section rather than navigating, so a visitor never loses their place.
 */
export function NationalDayStrip({ offer, plans }) {
    const t = useCopy(nationalDayCopy).strip;

    const scrollToOffer = (event) => {
        const target = document.getElementById('national-day');
        if (!target) return;
        event.preventDefault();
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    };

    return (
        <a className="nd-strip" href="#national-day" onClick={scrollToOffer}>
            <OfferChip />
            <span className="nd-strip-text">
                <strong>{t.label}</strong>
                <span className="nd-strip-deal nd-strip-deal-short">{t.deal(plans.fourMonth.price)}</span>
                <span className="nd-strip-deal nd-strip-deal-full">{t.dealFull(plans.fourMonth.price, plans.annual.price)}</span>
            </span>
            <OfferCountdown offer={offer} className="nd-strip-clock" />
            <span className="nd-strip-cta">
                <span className="nd-strip-cta-text">{t.cta}</span>
                <Icon name="chevron-down" size={16} aria-hidden="true" />
            </span>
        </a>
    );
}

/** The compact version of the same message, for the top of /subscribe and /groups. */
export function NationalDayBanner({ offer }) {
    const t = useCopy(nationalDayCopy).banner;
    const { lang } = useLang();
    if (!offer) return null;
    const copy = nationalDayCopy[lang];
    return (
        <div className="nd-banner" role="note">
            <OfferChip />
            <div className="nd-banner-body">
                <strong>{t.title}</strong>
                {offer.endsAt ? (
                    <>
                        <OfferCountdown offer={offer} />
                        <span className="nd-banner-date">{copy?.endsOn(offerEndDate(offer, lang))}</span>
                    </>
                ) : (
                    // No end date has been set yet — say so honestly rather than
                    // count down to nothing.
                    <span className="nd-banner-date">{copy?.limited}</span>
                )}
            </div>
        </div>
    );
}
