import React from 'react';
import { LocaleLink as Link, useCopy } from '../../i18n';
import telegramCardCopy from '../../i18n/copy/telegramCard.js';
import { TELEGRAM_HUB_PATH, telegramUrl, trackExamName } from '../../utils/telegramChannels.js';
import { trackTelegramClick } from '../../utils/telegramClick.js';
import './TrackTelegramLink.css';

/** A track's channel, on that track's public pages. Draws nothing without a track. */
const TrackTelegramLink = ({ track }) => {
    const t = useCopy(telegramCardCopy);
    const exam = trackExamName(track);
    if (!exam) return null;
    return (
        <aside className="trk-tg">
            <p>{t.trackTitle(exam)}</p>
            <a
                className="trk-tg-btn"
                href={telegramUrl(track)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackTelegramClick(track, 'public_page')}
            >
                {t.cta}
            </a>
        </aside>
    );
};

/** The same box on a public page about no single exam: it leads to /telegram. */
export const TelegramHubBox = () => {
    const t = useCopy(telegramCardCopy);
    return (
        <aside className="trk-tg">
            <p>{t.hubBoxTitle}</p>
            <Link className="trk-tg-btn" to={TELEGRAM_HUB_PATH}>{t.hubBoxCta}</Link>
        </aside>
    );
};

export default TrackTelegramLink;
