import React from 'react';
import { useCopy } from '../../i18n';
import { safeTrack } from '../../utils/analytics.js';
import telegramCardCopy from '../../i18n/copy/telegramCard.js';
import { telegramUrl, trackExamName } from '../../utils/telegramChannels.js';
import './TrackTelegramLink.css';

/** The nursing or dental channel, on that track's public pages. Draws nothing for medicine. */
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
                onClick={() => safeTrack('track_telegram_click', { track })}
            >
                {t.cta}
            </a>
        </aside>
    );
};

export default TrackTelegramLink;
