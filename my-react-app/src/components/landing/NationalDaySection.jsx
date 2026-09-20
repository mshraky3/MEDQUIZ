import React from 'react';
import { useCopy, useLang, LocaleLink as Link } from '../../i18n';
import nationalDayCopy from '../../i18n/copy/nationalDay.js';
import { OfferCountdown } from '../common/NationalDayOffer.jsx';
import { offerEndDate } from '../../utils/nationalDay.js';
import { Reveal } from './useScrollReveal.jsx';
import './NationalDaySection.css';

/**
 * The National Day celebration and offer, directly under the hero.
 *
 * The idea the section is built on is the coincidence itself: the 96th National
 * Day, and a four-month plan at 96 riyals. So the one large object is the "96"
 * numeral, and the four-month card repeats it as a price. Everything else is
 * kept quiet around that.
 *
 * Every figure arrives through `plans` (see offerPlans in utils/nationalDay.js),
 * which the server derived from the same block that sets the checkout amount.
 * The group card is dropped, not faked, if the server sent no group offer.
 *
 * Campaign code — see the removal note at the top of i18n/copy/nationalDay.js.
 */
const NationalDaySection = ({ offer, plans, isAuthenticated, isSubscribed, onCta }) => {
    const t = useCopy(nationalDayCopy).section;
    const { lang } = useLang();
    const { fourMonth, annual, group3, group5 } = plans;
    const groups = [group3, group5].filter(Boolean);
    const footnote = t.footnote(offerEndDate(offer, lang));

    // A visitor with no account creates one first (and keeps their 40 free
    // questions); a signed-in student goes straight to checkout; someone who
    // already has a plan has nothing to buy here, so no individual button.
    const buyTo = isAuthenticated ? '/subscribe' : '/signup';
    const buyLabel = isAuthenticated ? t.cta.member : t.cta.guest;

    const buy = (placement) => (
        <Link to={buyTo} className="nd-cta" onClick={() => onCta(placement)}>
            {buyLabel}
        </Link>
    );

    return (
        <Reveal as="section" id="national-day" className="nd-section" aria-labelledby="nd-title">
            <div className="nd-frieze" aria-hidden="true" />
            <div className="nd-inner">
                <header className="nd-head">
                    <span className="nd-numeral" aria-hidden="true">96</span>
                    <div className="nd-head-copy">
                        <h2 id="nd-title">{t.title(fourMonth.price)}</h2>
                        <p>{t.body}</p>
                        <p className="nd-clock">
                            {offer.endsAt ? (
                                <>
                                    <OfferCountdown offer={offer} />
                                    <span className="nd-clock-date">
                                        {nationalDayCopy[lang]?.endsOn(offerEndDate(offer, lang))}
                                    </span>
                                </>
                            ) : (
                                // No end date set yet: say "limited time", and
                                // draw no countdown to a deadline nobody has fixed.
                                <span className="nd-limited">{nationalDayCopy[lang]?.limited}</span>
                            )}
                        </p>
                    </div>
                </header>

                <div className="nd-cards">
                    <article className="nd-card">
                        <h3 className="nd-card-name">{t.fourMonth.name}</h3>
                        <p className="nd-price">
                            {fourMonth.was && <s>{fourMonth.was}</s>}
                            <strong>{fourMonth.price}</strong>
                            <span>{t.currency}</span>
                        </p>
                        <p className="nd-card-note">
                            {fourMonth.saved > 0 && <span className="nd-save">{t.fourMonth.save(fourMonth.saved)}</span>}
                            {t.fourMonth.perMonth(fourMonth.perMonth)}
                        </p>
                        {!isSubscribed && buy('nd_four_month')}
                    </article>

                    <article className="nd-card">
                        <h3 className="nd-card-name">
                            {t.annual.name}
                            {/* 196 / 12 is the lowest monthly cost on the ladder, so this is a fact, not a slogan. */}
                            <span className="nd-tag">{t.annual.badge}</span>
                        </h3>
                        <p className="nd-price">
                            {annual.was && <s>{annual.was}</s>}
                            <strong>{annual.price}</strong>
                            <span>{t.currency}</span>
                        </p>
                        <p className="nd-card-note">
                            {annual.saved > 0 && <span className="nd-save">{t.annual.save(annual.saved)}</span>}
                            {t.annual.perMonth(annual.perMonth)}
                        </p>
                        {!isSubscribed && buy('nd_annual')}
                    </article>

                    {groups.length > 0 && (
                        <article className="nd-card nd-card-group">
                            <h3 className="nd-card-name">{t.group.name}</h3>
                            <p className="nd-card-note">{t.group.blurb}</p>
                            <ul className="nd-group-rows">
                                {groups.map((g) => (
                                    <li key={g.id}>
                                        <span className="nd-group-seats">
                                            {t.group.seats(g.seats)}
                                            <small>{t.group.each(g.perSeat)}</small>
                                        </span>
                                        <span className="nd-group-price">
                                            {g.was && <s>{g.was}</s>}
                                            <strong>{g.price}</strong> {t.currency}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/groups" className="nd-cta is-outline" onClick={() => onCta('nd_group')}>
                                {t.cta.group}
                            </Link>
                        </article>
                    )}
                </div>

                {/* The monthly plan, untouched, beside the offer: it is the yardstick
                    the offer is measured against. The comparison is only drawn
                    while it is true (two months of monthly cost more than four
                    months at the offer price), so it can never overstate. */}
                <div className="nd-monthly">
                    <div className="nd-monthly-plan">
                        <strong>{t.monthly.name}</strong>
                        <span className="nd-monthly-price">{t.monthly.price(plans.monthly)}</span>
                        <small>{t.monthly.note}</small>
                    </div>
                    {plans.monthly * 2 > fourMonth.price && (
                        <p className="nd-monthly-compare">{t.monthly.compare(plans.monthly * 2, fourMonth.price)}</p>
                    )}
                </div>

                <div className="nd-foot">
                    {!isAuthenticated && <p>{t.guestNote}</p>}
                    {footnote && <p>{footnote}</p>}
                </div>
            </div>
        </Reveal>
    );
};

export default NationalDaySection;
