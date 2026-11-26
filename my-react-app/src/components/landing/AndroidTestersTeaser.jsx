import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy } from '../../i18n';
import androidTestersCopy from '../../i18n/copy/androidTesters.js';
import { ANDROID_ANCHOR } from '../../utils/androidReturn.js';
import { trackFunnel } from '../../utils/analytics.js';
import './AndroidTestersSection.css';

/**
 * One line under the hero's buttons that jumps to the full section further down.
 * The price offer between them is more than a phone screen tall, so without this
 * the offer is easy to miss. Only while there is something to join.
 */
const AndroidTestersTeaser = ({ view }) => {
    const t = useCopy(androidTestersCopy);
    if (view !== 'guest' && view !== 'join') return null;
    const jump = (event) => {
        event.preventDefault();
        trackFunnel('android_offer_click', { button: 'hero_teaser' });
        document.getElementById(ANDROID_ANCHOR)?.scrollIntoView({ block: 'start' });
    };
    return (
        <a className="atl-teaser" href={`#${ANDROID_ANCHOR}`} onClick={jump}>
            <span className="atl-icon" aria-hidden="true"><Icon name="phone" size={18} /></span>
            <span className="atl-teaser-text">
                <strong>{t.teaserTitle}</strong>
                <span>{t.gift}</span>
            </span>
            <Icon name="chevron-down" size={18} aria-hidden="true" />
        </a>
    );
};

export default AndroidTestersTeaser;
