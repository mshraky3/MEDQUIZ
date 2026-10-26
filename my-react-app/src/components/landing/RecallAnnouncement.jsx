import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, LocaleLink as Link } from '../../i18n';
import { safeTrack } from '../../utils/analytics.js';
import recallAnnouncementCopy from '../../i18n/copy/recallAnnouncement.js';
import './RecallAnnouncement.css';

// News, not a feature of the page: hides itself after this date (Riyadh time).
// Removal steps are at the top of i18n/copy/recallAnnouncement.js.
const SHOW_UNTIL = new Date('2026-11-20T00:00:00+03:00');

/** "October 2026 recalls are here": a small card under the hero (same pattern as ThemeAnnouncement). */
const RecallAnnouncement = () => {
    const t = useCopy(recallAnnouncementCopy);
    if (Date.now() >= SHOW_UNTIL.getTime()) return null;

    return (
        <section className="ra-card" aria-label={t.sectionLabel}>
            <div className="ra-preview" role="img" aria-label={t.previewLabel}>
                <span className="ra-month">{t.monthShort}</span>
                <span className="ra-range">{t.range}</span>
            </div>

            <div className="ra-body">
                <p className="ra-kicker">
                    <span className="ra-tag">{t.tag}</span>
                    <span>{t.from}</span>
                </p>
                <h2 className="ra-title">
                    <Icon name="sparkles" size={20} />
                    <span>{t.title}</span>
                </h2>
                <p className="ra-text">{t.body}</p>
            </div>

            <div className="ra-actions">
                <Link
                    to="/quizs"
                    className="btn primary ra-btn"
                    onClick={() => safeTrack('landing_recall_announcement_click', { set: 'october_2026' })}
                >
                    <Icon name="stethoscope" size={17} />
                    <span>{t.cta}</span>
                </Link>
            </div>
        </section>
    );
};

export default RecallAnnouncement;
