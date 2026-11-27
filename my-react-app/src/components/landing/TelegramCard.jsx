import React, { useContext } from 'react';
import { LocaleLink as Link, useCopy } from '../../i18n';
import { UserContext } from '../../UserContext';
import { userTrack } from '../../utils/tracks.js';
import { TELEGRAM_HUB_PATH, orderedChannels, telegramUrl, trackExamName } from '../../utils/telegramChannels.js';
import { trackTelegramClick } from '../../utils/telegramClick.js';
import TelegramPlane from '../common/TelegramPlane.jsx';
import telegramCardCopy from '../../i18n/copy/telegramCard.js';
import './TelegramCard.css';

/**
 * Telegram invitation under the hero cards on the home page. A visitor picks one
 * of the three channels; a signed-in student gets their own track's channel and
 * a small link to the page that lists them all.
 */
const TelegramCard = () => {
    const t = useCopy(telegramCardCopy);
    const user = useContext(UserContext)?.user;
    const track = user ? userTrack(user) : null;
    return (
        <section className={`tgc-card${track ? '' : ' tgc-card--choose'}`} aria-label={t.label}>
            <span className="tgc-icon" aria-hidden="true"><TelegramPlane /></span>
            <div className="tgc-text">
                <h2 className="tgc-title">{track ? t.trackTitle(trackExamName(track)) : t.chooseTitle}</h2>
                <p className="tgc-body">{track ? t.body : t.chooseBody}</p>
            </div>
            {track ? (
                <div className="tgc-actions">
                    <a
                        className="btn primary tgc-btn"
                        href={telegramUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackTelegramClick(track, 'landing')}
                    >
                        {t.cta}
                    </a>
                    <Link className="tgc-hub-link" to={TELEGRAM_HUB_PATH}>{t.hubLink}</Link>
                </div>
            ) : (
                <ul className="tgc-choices">
                    {orderedChannels().map((c) => (
                        <li key={c.track}>
                            <a
                                className="tgc-choice"
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackTelegramClick(c.track, 'landing')}
                            >
                                <span className="tgc-choice-field">{t.chooseLabels[c.track]}</span>{' '}
                                <span className="tgc-choice-exam">{c.exam}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default TelegramCard;
