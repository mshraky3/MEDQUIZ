import React, { useState } from 'react';
import TelegramPlane from '../common/TelegramPlane.jsx';
import { useCopy } from '../../i18n';
import telegramCardCopy from '../../i18n/copy/telegramCard.js';
import { telegramUrl, trackExamName } from '../../utils/telegramChannels.js';
import { trackTelegramClick } from '../../utils/telegramClick.js';
import { isTelegramNudgeDone, markTelegramNudgeDone, telegramNudgeTrack } from '../../utils/telegramNudge.js';
import './ResultTelegramNudge.css';

/**
 * A small, closable invitation to the student's own channel, under the actions
 * of a finished quiz. In the page flow, so it never covers anything. `blocked`
 * means the screen is already asking for something else: the card then stays
 * away for the rest of this result.
 */
const ResultTelegramNudge = ({ user, blocked = false }) => {
    const t = useCopy(telegramCardCopy);
    // Read once per result screen: a click records "done" but leaves the card in
    // place, so the link is not removed while the browser is following it.
    const [done] = useState(isTelegramNudgeDone);
    const [closed, setClosed] = useState(false);
    const [wasBlocked, setWasBlocked] = useState(blocked);
    if (blocked && !wasBlocked) setWasBlocked(true);

    const track = telegramNudgeTrack({ user, done });
    if (!track || closed || blocked || wasBlocked) return null;

    return (
        <aside className="tgn-card">
            <span className="tgn-icon" aria-hidden="true"><TelegramPlane /></span>
            <div className="tgn-text">
                <strong className="tgn-title">{t.nudgeTitle(trackExamName(track))}</strong>
                <span className="tgn-body">{t.nudgeBody}</span>
                <a
                    className="tgn-join"
                    href={telegramUrl(track)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        markTelegramNudgeDone();
                        trackTelegramClick(track, 'result_nudge');
                    }}
                >
                    {t.cta}
                </a>
            </div>
            <button
                type="button"
                className="tgn-close"
                aria-label={t.nudgeClose}
                title={t.nudgeClose}
                onClick={() => {
                    markTelegramNudgeDone();
                    setClosed(true);
                }}
            >
                <span aria-hidden="true">×</span>
            </button>
        </aside>
    );
};

export default ResultTelegramNudge;
