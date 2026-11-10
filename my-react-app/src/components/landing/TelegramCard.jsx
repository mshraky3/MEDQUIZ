import React from 'react';
import { useCopy } from '../../i18n';
import { safeTrack } from '../../utils/analytics.js';
import telegramCardCopy from '../../i18n/copy/telegramCard.js';
import './TelegramCard.css';

/** Slim invitation to the SQB Telegram channel, under the hero cards on the home page. */
const TelegramCard = () => {
    const t = useCopy(telegramCardCopy);
    return (
        <section className="tgc-card" aria-label={t.label}>
            <span className="tgc-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg></span>
            <div className="tgc-text">
                <h2 className="tgc-title">{t.title}</h2>
                <p className="tgc-body">{t.body}</p>
            </div>
            <a
                className="btn primary tgc-btn"
                href="https://t.me/sqb_exam"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => safeTrack('landing_telegram_card_click')}
            >
                {t.cta}
            </a>
        </section>
    );
};

export default TelegramCard;
