import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, LocaleLink as Link } from '../../i18n';
import nationalDayCopy from '../../i18n/copy/nationalDay.js';
import { OfferCountdown } from '../common/NationalDayOffer.jsx';
import { WfSticker } from '../common/WhiteFridayOffer.jsx';
import { offerEndDate } from '../../utils/nationalDay.js';
import { Reveal } from './useScrollReveal.jsx';
import './WhiteFridaySection.css';

/**
 * The White Friday offer, directly under the landing hero.
 *
 * Two price tags (four months, a year) and the monthly plan as the yardstick.
 * Every figure comes from `plans` (offerPlans in utils/nationalDay.js), which the
 * server derived from the same block that sets the checkout amount, so the page
 * can never quote a price the checkout will not charge. The headline percentage
 * is computed from those same numbers, never typed.
 *
 * Campaign code, see the removal note in common/WhiteFridayOffer.jsx.
 */
const pct = (plan) => (plan.was ? Math.round((plan.saved / plan.was) * 100) : 0);

function PriceTag({ plan, name, saveLabel, perMonth, badge, currency, cta, featured }) {
    return (
        <article className={`wf-tag${featured ? ' is-featured' : ''}`}>
            {badge && <span className="wf-tag-badge">{badge}</span>}
            <h3 className="wf-tag-name">{name}</h3>
            <p className="wf-tag-price">
                {plan.was && <s aria-label={String(plan.was)}>{plan.was}</s>}
                <strong>{plan.price}</strong>
                <span>{currency}</span>
            </p>
            <p className="wf-tag-note">
                {plan.saved > 0 && <span className="wf-save">{saveLabel}</span>}
                <span>{perMonth}</span>
            </p>
            <div className="wf-tag-cut" aria-hidden="true" />
            {cta}
        </article>
    );
}

const WhiteFridaySection = ({ offer, plans, isAuthenticated, isSubscribed, onCta }) => {
    const t = useCopy(nationalDayCopy).section;
    const { lang } = useLang();
    const { fourMonth, annual } = plans;
    const best = Math.max(pct(fourMonth), pct(annual));
    const footnote = t.footnote(offerEndDate(offer, lang));

    // A visitor with no account creates one first (and keeps the free
    // questions); a signed-in student goes straight to checkout; someone who
    // already has a plan has nothing to buy here, so no buy button.
    const buyTo = isAuthenticated ? '/subscribe' : '/signup';
    const buyLabel = isAuthenticated ? t.cta.member : t.cta.guest;
    const buy = (placement) => (isSubscribed ? null : (
        <Link to={buyTo} className="wf-cta" onClick={() => onCta(placement)}>
            {buyLabel}
            <Icon name="chevron-right" size={16} aria-hidden="true" />
        </Link>
    ));

    return (
        <Reveal as="section" id="white-friday" className="wf-section" aria-labelledby="wf-title">
            <div className="wf-inner">
                <header className="wf-head">
                    <div className="wf-head-copy">
                        <WfSticker>{nationalDayCopy[lang].strip.label}</WfSticker>
                        <h2 id="wf-title">{t.title(fourMonth.price)}</h2>
                        <p>{t.body}</p>
                        <p className="wf-clock">
                            {offer.endsAt ? (
                                <>
                                    <OfferCountdown offer={offer} />
                                    <span className="wf-clock-date">{nationalDayCopy[lang]?.endsOn(offerEndDate(offer, lang))}</span>
                                </>
                            ) : (
                                <span>{nationalDayCopy[lang]?.limited}</span>
                            )}
                        </p>
                    </div>
                    {best > 0 && (
                        <div className="wf-burst" aria-hidden="true">
                            <span className="wf-burst-lead">{t.upTo}</span>
                            <span className="wf-burst-num">{best}%</span>
                            <span className="wf-burst-tail">{t.off}</span>
                        </div>
                    )}
                </header>

                <div className="wf-tags">
                    <PriceTag
                        plan={fourMonth}
                        name={t.fourMonth.name}
                        saveLabel={t.fourMonth.save(fourMonth.saved)}
                        perMonth={t.fourMonth.perMonth(fourMonth.perMonth)}
                        currency={t.currency}
                        cta={buy('wf_four_month')}
                    />
                    <PriceTag
                        plan={annual}
                        name={t.annual.name}
                        saveLabel={t.annual.save(annual.saved)}
                        perMonth={t.annual.perMonth(annual.perMonth)}
                        badge={t.annual.badge}
                        currency={t.currency}
                        cta={buy('wf_annual')}
                        featured
                    />
                </div>

                {/* The monthly plan, untouched: the yardstick the offer is measured
                    against. The comparison only draws while it is true (two months
                    of monthly cost more than four months at the offer price). */}
                <div className="wf-yardstick">
                    <div className="wf-yardstick-plan">
                        <strong>{t.monthly.name}</strong>
                        <span className="wf-yardstick-price">{t.monthly.price(plans.monthly)}</span>
                        <small>{t.monthly.note}</small>
                    </div>
                    {plans.monthly * 2 > fourMonth.price && (
                        <p className="wf-yardstick-compare">{t.monthly.compare(plans.monthly * 2, fourMonth.price)}</p>
                    )}
                </div>

                <ul className="wf-chips">
                    {t.chips.map((chip) => (
                        <li key={chip}><Icon name="check" size={14} aria-hidden="true" />{chip}</li>
                    ))}
                </ul>

                <div className="wf-foot">
                    {!isAuthenticated && <p>{t.guestNote}</p>}
                    {footnote && <p>{footnote}</p>}
                </div>
            </div>
        </Reveal>
    );
};

export default WhiteFridaySection;
