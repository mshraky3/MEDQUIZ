import React from 'react';
import { useCopy, useLang, LocaleLink as Link } from '../../i18n';
import goldenMonthsCopy from '../../i18n/copy/goldenMonths.js';
import { OfferCountdown } from '../common/NationalDayOffer.jsx';
import { goldenEndDate } from '../../utils/goldenMonths.js';
import { Reveal } from './useScrollReveal.jsx';
import './GoldenMonthsSection.css';

/**
 * The Golden Months panel, directly under the hero.
 *
 * One idea: four months become five. The headline says it, the row of five
 * month tiles shows it (the fifth is gold and labelled a gift), and the price
 * card says it in numbers — "4" struck through, "5" beside it, the per-month
 * cost recalculated. The price itself does not change and is never struck: only
 * the time grows, so there is no fake "was" price anywhere on this panel.
 *
 * Every figure arrives through `plan` (see goldenPlan in utils/goldenMonths.js),
 * which the server derived from the same module that credits the extra month.
 * The monthly comparison is drawn only while it is true.
 *
 * Campaign code — see the removal note at the top of i18n/copy/goldenMonths.js.
 */
const GoldenMonthsSection = ({ offer, plan, isAuthenticated, isSubscribed, onCta }) => {
    const copy = useCopy(goldenMonthsCopy);
    const t = copy.section;
    const { lang } = useLang();

    // A visitor with no account creates one first (and keeps the free questions);
    // a signed-in student goes straight to checkout; someone whose plan is
    // already running has nothing to buy here, so no button.
    const buyTo = isAuthenticated ? '/subscribe' : '/signup';
    const buyLabel = isAuthenticated ? t.cta.member : t.cta.guest;
    const monthlyTotal = plan.monthly ? plan.monthly * plan.total : 0;
    const tiles = Array.from({ length: plan.total }, (_, i) => i + 1);

    return (
        <Reveal as="section" id="golden-months" className="gm-section" aria-labelledby="gm-title">
            <div className="gm-inner">
                <div className="gm-copy">
                    <p className="gm-eyebrow">{t.eyebrow}</p>
                    <h2 id="gm-title">{t.title(plan.months, plan.total)}</h2>
                    <p className="gm-body">{t.body}</p>
                    <p className="gm-clock">
                        <OfferCountdown offer={offer} />
                        <span className="gm-clock-date">{goldenMonthsCopy[lang]?.banner.endsOn(goldenEndDate(offer, lang))}</span>
                    </p>
                    {!isSubscribed && (
                        <Link to={buyTo} className="gm-cta" onClick={() => onCta('gm_section')}>
                            {buyLabel}
                        </Link>
                    )}
                    {!isAuthenticated && !isSubscribed && <p className="gm-note">{t.guestNote}</p>}
                </div>

                <div className="gm-card">
                    <ol className="gm-tiles" aria-hidden="true">
                        {tiles.map((n) => (
                            <li key={n} className={`gm-tile${n > plan.months ? ' is-gift' : ''}`}>
                                <strong>{n}</strong>
                                <span>{n > plan.months ? t.gift : t.monthLabel(n)}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="gm-duration">
                        <s>{plan.months}</s>
                        <strong>{plan.total}</strong>
                        <span>{copy.card.monthWord(plan.total)}</span>
                    </div>

                    <p className="gm-price">
                        <strong>{plan.price}</strong>
                        <span>{t.currency}</span>
                    </p>

                    <p className="gm-permonth">
                        <span className="gm-permonth-label">{t.perMonthLabel}</span>
                        <span className="gm-permonth-values">
                            <s>{plan.perMonthWas}</s>
                            <strong>{t.perMonthNow(plan.perMonthNow)}</strong>
                        </span>
                    </p>

                    {monthlyTotal > plan.price && (
                        <p className="gm-compare">{t.compare(monthlyTotal, plan.total)}</p>
                    )}
                </div>

                <p className="gm-foot">{t.footnote(goldenEndDate(offer, lang))}</p>
            </div>
        </Reveal>
    );
};

export default GoldenMonthsSection;
