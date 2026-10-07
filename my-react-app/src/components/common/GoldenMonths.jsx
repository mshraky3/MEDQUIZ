import React from 'react';
import Icon from './Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import goldenMonthsCopy from '../../i18n/copy/goldenMonths.js';
import { goldenEndDate } from '../../utils/goldenMonths.js';
import { OfferCountdown } from './NationalDayOffer.jsx';
import './NationalDayOffer.css';

/**
 * The Golden Months surfaces: the strip across the top of the landing page and
 * the banner on /subscribe. They reuse the National Day chassis (the nd- classes
 * in NationalDayOffer.css: same green and sand, same opaque panels), so there is
 * no second stylesheet to keep in step. Campaign code — see the removal note at
 * the top of i18n/copy/goldenMonths.js.
 */

/** The gold "+1" tab. Decorative. */
const BonusChip = () => <span className="nd-chip" aria-hidden="true">+1</span>;

/** Slim bar across the top of the landing page; one link, to checkout. */
export function GoldenStrip({ offer }) {
    const t = useCopy(goldenMonthsCopy).strip;
    // Scrolls to the panel rather than navigating, so a visitor never loses their place.
    const scrollToOffer = (event) => {
        const target = document.getElementById('golden-months');
        if (!target) return;
        event.preventDefault();
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    };
    return (
        <a className="nd-strip" href="#golden-months" onClick={scrollToOffer}>
            <BonusChip />
            <span className="nd-strip-text">
                <strong>{t.label}</strong>
                <span className="nd-strip-deal nd-strip-deal-short">{t.dealShort}</span>
                <span className="nd-strip-deal nd-strip-deal-full">{t.deal}</span>
            </span>
            <OfferCountdown offer={offer} className="nd-strip-clock" />
            <span className="nd-strip-cta">
                <span className="nd-strip-cta-text">{t.cta}</span>
                <Icon name="chevron-down" size={16} aria-hidden="true" />
            </span>
        </a>
    );
}

/** Compact version for the top of /subscribe. */
export function GoldenBanner({ offer }) {
    const t = useCopy(goldenMonthsCopy).banner;
    const { lang } = useLang();
    if (!offer) return null;
    return (
        <div className="nd-banner" role="note">
            <BonusChip />
            <div className="nd-banner-body">
                <strong>{t.title}</strong>
                <OfferCountdown offer={offer} />
                <span className="nd-banner-date">{t.endsOn(goldenEndDate(offer, lang))}</span>
            </div>
        </div>
    );
}
