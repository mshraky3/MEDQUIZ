import React from 'react';
import Icon from './Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import nationalDayCopy from '../../i18n/copy/nationalDay.js';
import { OfferCountdown } from './NationalDayOffer.jsx';
import { offerEndDate } from '../../utils/nationalDay.js';
import './WhiteFridayOffer.css';

/**
 * White Friday surfaces: the strip across the top of the landing page and the
 * banner on /subscribe and /groups. Same data as every offer surface (the server
 * sends prices and the deadline through /api/payment/config, see
 * utils/nationalDay.js); this file is only the drawing.
 *
 * The look is a retail tag: ink, paper white and one yellow sticker. It shares
 * nothing with the green National Day palette on purpose.
 *
 * Campaign code. To remove after the campaign: this file and its css,
 * landing/WhiteFridaySection.*, and the `nd` wiring in Landing.jsx,
 * Subscribe.jsx and GroupsPage.jsx (grep "WhiteFriday").
 */

/** The yellow sticker that marks every White Friday surface. Decorative text, the label is read from the neighbouring heading. */
export const WfSticker = ({ children }) => (
    <span className="wf-sticker" aria-hidden="true">{children}</span>
);

export function WhiteFridayStrip({ offer, plans }) {
    const t = useCopy(nationalDayCopy).strip;

    const scrollToOffer = (event) => {
        const target = document.getElementById('white-friday');
        if (!target) return;
        event.preventDefault();
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    };

    return (
        <a className="wf-strip" href="#white-friday" onClick={scrollToOffer}>
            <WfSticker>{t.label}</WfSticker>
            <span className="wf-strip-text">
                <span className="wf-strip-deal wf-strip-deal-short">{t.deal(plans.fourMonth.price)}</span>
                <span className="wf-strip-deal wf-strip-deal-full">{t.dealFull(plans.fourMonth.price, plans.annual.price)}</span>
            </span>
            <OfferCountdown offer={offer} className="wf-strip-clock" />
            <span className="wf-strip-cta">
                <span className="wf-strip-cta-text">{t.cta}</span>
                <Icon name="chevron-down" size={16} aria-hidden="true" />
            </span>
        </a>
    );
}

export function WhiteFridayBanner({ offer }) {
    const t = useCopy(nationalDayCopy).banner;
    const { lang } = useLang();
    if (!offer) return null;
    const copy = nationalDayCopy[lang];
    return (
        <div className="wf-banner" role="note">
            <WfSticker>{nationalDayCopy[lang].strip.label}</WfSticker>
            <div className="wf-banner-body">
                <strong>{t.title}</strong>
                {offer.endsAt ? (
                    <>
                        <OfferCountdown offer={offer} />
                        <span className="wf-banner-date">{copy?.endsOn(offerEndDate(offer, lang))}</span>
                    </>
                ) : (
                    <span className="wf-banner-date">{copy?.limited}</span>
                )}
            </div>
        </div>
    );
}
