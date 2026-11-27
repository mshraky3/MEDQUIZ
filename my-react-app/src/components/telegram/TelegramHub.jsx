import React, { useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { LocaleLink as Link, useCopy, useLang } from '../../i18n';
import { UserContext } from '../../UserContext';
import { userTrack } from '../../utils/tracks.js';
import { orderedChannels } from '../../utils/telegramChannels.js';
import { trackTelegramClick } from '../../utils/telegramClick.js';
import TelegramPlane from '../common/TelegramPlane.jsx';
import telegramHubCopy from '../../i18n/copy/telegramHub.js';
import './TelegramHub.css';

/**
 * /telegram: one link that covers every SQB channel. A signed-in student sees
 * their own track first and marked; a visitor sees three equal choices.
 * The prerendered twin is seo/telegramHub.js.
 */
const TelegramHub = () => {
    const t = useCopy(telegramHubCopy);
    const { dir } = useLang();
    const user = useContext(UserContext)?.user;
    const channels = orderedChannels(user ? userTrack(user) : null);
    const hasOwn = channels.some((c) => c.own);

    return (
        <main className="tgh-page" dir={dir}>
            <nav className="tgh-breadcrumb"><Link to="/">{t.home}</Link></nav>
            <header className="tgh-hero">
                <p className="tgh-kicker">{t.kicker}</p>
                <h1>{t.title}</h1>
                <p>{t.intro}</p>
            </header>

            <ul className="tgh-grid" aria-label={t.listLabel}>
                {channels.map((c) => (
                    <li
                        key={c.track}
                        className={`tgh-card${c.own ? ' tgh-card--own' : ''}${hasOwn && !c.own ? ' tgh-card--other' : ''}`}
                    >
                        <div className="tgh-card-top">
                            <span className="tgh-icon" aria-hidden="true"><TelegramPlane /></span>
                            {c.own && <span className="tgh-badge">{t.yourTrack}</span>}
                        </div>
                        <h2>
                            <span className="tgh-exam">{c.exam}</span>{' '}
                            <span className="tgh-field">{t.fields[c.track]}</span>
                        </h2>
                        <p className="tgh-handle"><bdi>{c.handle}</bdi></p>
                        <a
                            className="tgh-join"
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackTelegramClick(c.track, 'hub')}
                        >
                            {t.join(c.exam)}
                        </a>
                    </li>
                ))}
            </ul>

            <section className="tgh-points">
                <h2>{t.pointsTitle}</h2>
                <ul>
                    {t.points.map((point) => (
                        <li key={point}><Icon name="check-circle" size={16} /> <span>{point}</span></li>
                    ))}
                </ul>
            </section>
        </main>
    );
};

export default TelegramHub;
