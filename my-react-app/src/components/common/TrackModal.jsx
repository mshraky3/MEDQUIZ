import React from 'react';
import Icon from './Icon.jsx';
import { TRACKS, TRACK_KEYS, pick } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import authCopy from '../../i18n/copy/auth.js';
import './TrackModal.css';

// The one irreversible choice on a new account: it decides which question
// bank, summaries and analytics the account will ever see, and only an admin
// can move an account afterwards (see the callers' own comments for why).
// Blocking and un-dismissable on purpose — shared by Signup (every entry
// path but an invite link, which already carries its own track) and Login
// (a brand-new Google identity signing in via /login must still choose,
// exactly like any other new account).
const TrackModal = ({ studyTrack, onSelect, onConfirm }) => {
    const t = useCopy(authCopy).trackModal;
    const { lang, dir } = useLang();

    return (
        <div className="track-modal" dir={dir} role="dialog" aria-modal="true" aria-labelledby="track-modal-title">
            <div className="track-modal-card">
                <div className="track-modal-head">
                    <span className="track-modal-eyebrow">{t.eyebrow}</span>
                    <h2 id="track-modal-title">{t.title}</h2>
                    <p>{t.body}</p>
                </div>

                <div className="track-modal-options">
                    {TRACK_KEYS.map((key) => {
                        const trackDef = TRACKS[key];
                        const selected = studyTrack === key;
                        return (
                            <button
                                type="button"
                                key={key}
                                className={`track-modal-option${selected ? ' is-selected' : ''}`}
                                aria-pressed={selected}
                                onClick={() => onSelect(key)}
                            >
                                <span className="track-modal-option-icon" aria-hidden="true">
                                    <Icon name={trackDef.icon} size={26} />
                                </span>
                                <span className="track-modal-option-title">{pick(trackDef.label, lang)}</span>
                                <span className="track-modal-option-exam">{pick(trackDef.exam, lang)}</span>
                                <span className="track-modal-option-desc">{pick(trackDef.blurb, lang)}</span>
                                <span className="track-modal-option-mark" aria-hidden="true">
                                    <Icon name="check" size={15} />
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="btn primary large track-modal-confirm"
                    disabled={!studyTrack}
                    onClick={onConfirm}
                >
                    {studyTrack ? t.confirm(pick(TRACKS[studyTrack].label, lang)) : t.confirmEmpty}
                </button>

                <p className="track-modal-note">
                    <Icon name="info" size={14} /> {t.note}
                </p>
            </div>
        </div>
    );
};

export default TrackModal;
