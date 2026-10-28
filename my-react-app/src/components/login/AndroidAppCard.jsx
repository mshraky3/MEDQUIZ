import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy } from '../../i18n';
import androidAppCopy from '../../i18n/copy/androidApp.js';
import { androidAppConfig, isAndroidCardVisible } from '../../utils/androidApp.js';
import './AndroidAppCard.css';

// Settings come from the build env: see utils/androidApp.js. Hidden until both links exist.
const env = import.meta.env || {};

export default function AndroidAppCard({ config } = {}) {
    const copy = useCopy(androidAppCopy);
    const resolved = config || androidAppConfig(env);
    if (!isAndroidCardVisible(resolved)) return null;
    const { testerUrl, downloadUrl, freeMonth } = resolved;

    return (
        <aside className="android-card" aria-label={copy.title}>
            <div className="android-card-head">
                <span className="android-card-icon" aria-hidden="true">
                    <Icon name="phone" size={20} />
                </span>
                <div>
                    <span className="android-card-pill">{copy.pill}</span>
                    <h2 className="android-card-title">{copy.title}</h2>
                </div>
            </div>
            <p className="android-card-body">{copy.body}</p>
            {freeMonth ? <p className="android-card-gift">{copy.freeMonth}</p> : null}
            <div className="android-card-actions">
                <a className="btn primary" href={testerUrl} target="_blank" rel="noopener noreferrer">{copy.join}</a>
                <a className="btn android-card-secondary" href={downloadUrl} target="_blank" rel="noopener noreferrer">{copy.download}</a>
            </div>
            <p className="android-card-note">{copy.note}</p>
        </aside>
    );
}
