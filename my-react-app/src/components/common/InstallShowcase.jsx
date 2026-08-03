import React, { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { useInstallPrompt } from './InstallPrompt.jsx';
import { useCopy, useLang } from '../../i18n';
import installCopy from '../../i18n/copy/install.js';
import './InstallShowcase.css';

/**
 * "Add SQB to your home screen", played rather than listed.
 *
 * The old version was two columns of numbered text. The problem with written
 * install steps is that the hard part is *recognition* — the student has to
 * match "the Share button" to an icon they have never consciously looked at,
 * and "Add to Home Screen" to a row buried in a sheet. So this shows the
 * phone: the tap lands on the right control, the sheet slides up, the row
 * highlights, and the icon appears on the home screen.
 *
 * The written steps stay underneath, in sync with the animation. They are the
 * accessible version of the same information and the one a screen reader gets.
 */

const STEP_MS = 2600;

/** The two platforms, and which control each one's step 1 points at. */
const IOS = 'ios';
const ANDROID = 'android';

const ShareGlyph = () => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 15V3" /><path d="m8 7 4-4 4 4" />
        <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    </svg>
);

const DotsGlyph = () => (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
    </svg>
);

/**
 * Advances 0 → 1 → 2 once the phone is on screen, then stops on the last step.
 * Never loops on its own: a three-second animation that restarts forever is a
 * distraction sitting halfway down a page someone is trying to read. There is
 * a replay button instead.
 */
function useStepPlayer(ref, stepCount, resetKey) {
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    // Switching platform (or hitting replay) restarts from the top.
    useEffect(() => { setStep(0); setPlaying(false); }, [resetKey]);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const reduced = typeof window !== 'undefined'
            && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduced) { setStep(stepCount - 1); return; }
        if (typeof IntersectionObserver === 'undefined') { setPlaying(true); return; }

        const io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) { setPlaying(true); io.disconnect(); }
        }, { threshold: 0.4 });
        io.observe(node);
        return () => io.disconnect();
    }, [ref, stepCount, resetKey]);

    useEffect(() => {
        if (!playing || step >= stepCount - 1) return;
        const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
        return () => clearTimeout(id);
    }, [playing, step, stepCount]);

    return [step, setStep, () => { setStep(0); setPlaying(true); }];
}

const PhoneMock = ({ platform, step, m }) => {
    const isIOS = platform === IOS;
    return (
        <div className={`ish-phone ish-phone--${platform} is-step-${step}`} aria-hidden="true">
            <span className="ish-notch" />
            <div className="ish-screen">
                {/* Android puts its chrome on top, iOS on the bottom — getting
                    this backwards is exactly the confusion the mock exists to
                    prevent. */}
                {!isIOS && (
                    <div className="ish-bar ish-bar--top">
                        <span className="ish-url">{m.addressBar}</span>
                        <span className="ish-ctrl"><DotsGlyph /></span>
                    </div>
                )}

                <div className="ish-content">
                    <span className="ish-logo">SQB</span>
                    <span className="ish-line" style={{ '--w': '80%' }} />
                    <span className="ish-line" style={{ '--w': '62%' }} />
                    <span className="ish-line" style={{ '--w': '71%' }} />
                </div>

                {isIOS && (
                    <div className="ish-bar ish-bar--bottom">
                        <span className="ish-url">{m.addressBar}</span>
                        <span className="ish-ctrl"><ShareGlyph /></span>
                    </div>
                )}

                {/* Step 1 — the tap, landing on the control that matters. */}
                <span className="ish-tap" />

                {/* Step 2 — the sheet, with the row that has to be found. */}
                <div className="ish-sheet">
                    <span className="ish-sheet-grab" />
                    <p className="ish-sheet-title">{isIOS ? m.sheetTitle : ''}</p>
                    <ul className="ish-sheet-rows">
                        <li className="ish-sheet-row"><span className="ish-sheet-ic" /><span className="ish-line" style={{ '--w': '55%' }} /></li>
                        <li className="ish-sheet-row is-target">
                            <span className="ish-sheet-ic"><Icon name="plus" size={13} /></span>
                            <span className="ish-sheet-label">{isIOS ? m.addToHome : m.installApp}</span>
                        </li>
                        <li className="ish-sheet-row"><span className="ish-sheet-ic" /><span className="ish-line" style={{ '--w': '44%' }} /></li>
                    </ul>
                    <span className="ish-sheet-confirm">{m.confirm}</span>
                </div>

                {/* Step 3 — the home screen, with the icon dropping in. */}
                <div className="ish-home">
                    <p className="ish-home-label">{m.homeLabel}</p>
                    <div className="ish-home-grid">
                        <span className="ish-app" /><span className="ish-app" /><span className="ish-app" />
                        <span className="ish-app ish-app--sqb">SQB</span>
                        <span className="ish-app" /><span className="ish-app" />
                    </div>
                    <p className="ish-home-done"><Icon name="check" size={13} /> {m.done}</p>
                </div>
            </div>
        </div>
    );
};

const InstallShowcase = () => {
    const { canInstallAndroid, isIOS, isStandalone, promptInstall } = useInstallPrompt();
    const t = useCopy(installCopy);
    const { dir } = useLang();
    const m = t.mock;

    // Default to the platform the visitor is actually on, so the common case
    // needs no interaction at all. Desktop visitors get iOS, which is the
    // version people most often need talking through.
    const [platform, setPlatform] = useState(isIOS || !canInstallAndroid ? IOS : ANDROID);
    const ref = useRef(null);
    const steps = platform === IOS ? t.iosSteps : t.androidSteps;
    const [step, setStep, replay] = useStepPlayer(ref, steps.length, platform);

    if (isStandalone) return null;

    return (
        <section className="install-section ish" aria-label={t.sectionLabel} dir={dir}>
            <div className="section-head">
                <p className="pill subtle">{t.pill}</p>
                <h2>{t.sectionTitle}</h2>
                <p>{t.sectionBody}</p>
            </div>

            <div className="ish-grid" ref={ref}>
                <div className="ish-stage">
                    <PhoneMock platform={platform} step={step} m={m} />
                </div>

                <div className="ish-side">
                    <div className="ish-tabs" role="tablist">
                        {[[IOS, t.iosTitle], [ANDROID, t.androidTitle]].map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={platform === key}
                                className={`ish-tab${platform === key ? ' is-on' : ''}`}
                                onClick={() => setPlatform(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* The written steps are not decoration: they are the
                        accessible equivalent of the animation, and clicking one
                        scrubs the phone to it. */}
                    <ol className="ish-steps">
                        {steps.map((text, i) => (
                            <li key={text} className={`ish-step${i === step ? ' is-on' : ''}${i < step ? ' is-done' : ''}`}>
                                <button
                                    type="button"
                                    className="ish-step-btn"
                                    onClick={() => setStep(i)}
                                    aria-current={i === step ? 'step' : undefined}
                                    aria-label={m.stepAria(i + 1, steps.length)}
                                >
                                    <span className="ish-step-n">{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
                                    <span className="ish-step-text">{text}</span>
                                </button>
                            </li>
                        ))}
                    </ol>

                    <div className="ish-actions">
                        <button type="button" className="ish-replay" onClick={replay}>
                            <Icon name="refresh" size={15} /> {m.replay}
                        </button>
                        {canInstallAndroid && (
                            <button className="btn primary" onClick={promptInstall}>
                                <Icon name="home" size={17} /> {t.installNow}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InstallShowcase;
