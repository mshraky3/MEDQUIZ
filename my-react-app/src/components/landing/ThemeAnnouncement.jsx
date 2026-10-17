import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy } from '../../i18n';
import { useTheme } from '../../theme/useTheme.js';
import { safeTrack } from '../../utils/analytics.js';
import themeAnnouncementCopy from '../../i18n/copy/themeAnnouncement.js';
import './ThemeAnnouncement.css';

// The announcement is news, not a feature of the page: it hides itself after
// this date (Riyadh time) even if nobody removes it. Removal steps are at the
// top of i18n/copy/themeAnnouncement.js.
const SHOW_UNTIL = new Date('2027-01-01T00:00:00+03:00');

/**
 * "Dark mode is here" — a small card under the hero. Its button switches the
 * theme right there, so the visitor sees the whole page change rather than
 * reading about it; pressed again, it switches back.
 */
const ThemeAnnouncement = () => {
    const t = useCopy(themeAnnouncementCopy);
    const { theme, setPref } = useTheme();
    if (Date.now() >= SHOW_UNTIL.getTime()) return null;

    const isDark = theme === 'dark';
    const toggle = () => {
        const next = isDark ? 'light' : 'dark';
        setPref(next);
        safeTrack('landing_theme_announcement_click', { to: next });
    };

    return (
        <section className="ta-card" aria-label={t.sectionLabel}>
            {/* A light page and a dark page, side by side. Drawn, not
                screenshotted, and deliberately the same in both themes. */}
            <div className="ta-preview" role="img" aria-label={t.previewLabel}>
                <span className="ta-mock ta-mock-light"><i /><i /><b /></span>
                <span className="ta-mock ta-mock-dark"><i /><i /><b /></span>
            </div>

            <div className="ta-body">
                <p className="ta-kicker">
                    <span className="ta-tag">{t.tag}</span>
                    <span>{t.from}</span>
                </p>
                <h2 className="ta-title">
                    <Icon name="moon" size={20} />
                    <span>{t.title}</span>
                </h2>
                <p className="ta-text">{t.body}</p>
                <p className="ta-hint">{t.hint}</p>
            </div>

            <div className="ta-actions">
                <button
                    type="button"
                    className={`btn ${isDark ? 'ghost' : 'primary'} ta-btn`}
                    onClick={toggle}
                    aria-pressed={isDark}
                >
                    <Icon name={isDark ? 'sun' : 'moon'} size={17} />
                    <span>{isDark ? t.backToLight : t.tryDark}</span>
                </button>
            </div>
        </section>
    );
};

export default ThemeAnnouncement;
