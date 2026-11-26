import React, { useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import AndroidTestersSection from './AndroidTestersSection.jsx';
import useAndroidOffer from './useAndroidOffer.js';
import { useCopy, useLang } from '../../i18n';
import androidTestersCopy from '../../i18n/copy/androidTesters.js';
import { hubCardView, hubDismissKey } from '../../utils/androidTesters.js';
import { trackFunnel } from '../../utils/analytics.js';
import { safeGetItem, safeSetItem, safeGetSessionItem, safeSetSessionItem } from '../../utils/safeStorage.js';
import './AndroidTestersSection.css';

/** The offer itself. Mounted only while the card is not closed, so a closed card costs no request. */
const HubOffer = ({ onDismiss }) => {
    const t = useCopy(androidTestersCopy);
    const { dir } = useLang();
    const offer = useAndroidOffer();
    const [open, setOpen] = useState(false);
    const view = hubCardView(offer.view);

    useEffect(() => {
        if (!view) return;
        const key = `sqb_android_seen_hub_${view}`;
        if (safeGetSessionItem(key)) return;
        safeSetSessionItem(key, '1');
        trackFunnel('android_offer_view', { state: view, placement: 'hub' });
    }, [view]);

    if (!view) return null;
    const joined = view === 'joined';

    const toggle = () => {
        if (!open) trackFunnel('android_offer_click', { button: 'hub_open', placement: 'hub' });
        setOpen(!open);
    };

    return (
        <div className="atl-hub" dir={dir}>
            <aside className="atl-hub-bar" aria-label={t.title}>
                <span className="atl-icon" aria-hidden="true"><Icon name="phone" size={20} /></span>
                <div className="atl-hub-text">
                    <strong>{joined ? t.hubJoinedTitle : t.teaserTitle}</strong>
                    {joined ? null : <span className="atl-hub-gift">{t.gift}</span>}
                    <span className="atl-hub-note">{t.saudi}</span>
                </div>
                <button type="button" className="atl-hub-open" onClick={toggle} aria-expanded={open}>
                    {open ? t.hubHide : joined ? t.hubShowJoined : t.hubShow}
                </button>
                <button type="button" className="atl-hub-close" onClick={onDismiss} aria-label={t.hubDismiss} title={t.hubDismiss}>
                    <Icon name="x" size={18} aria-hidden="true" />
                </button>
            </aside>
            {open ? <AndroidTestersSection offer={offer} placement="hub" /> : null}
        </div>
    );
};

/**
 * The Android testers card on the study home (/quizs), for signed-in accounts
 * the server says can join or have joined. Closing it is remembered on this
 * device, per account; the landing page section stays where it is.
 */
const AndroidTestersHubCard = ({ accountId }) => {
    const [dismissed, setDismissed] = useState(() => !!safeGetItem(hubDismissKey(accountId)));
    if (!accountId || dismissed) return null;
    const dismiss = () => {
        safeSetItem(hubDismissKey(accountId), '1');
        trackFunnel('android_offer_click', { button: 'hub_dismiss', placement: 'hub' });
        setDismissed(true);
    };
    return <HubOffer onDismiss={dismiss} />;
};

export default AndroidTestersHubCard;
