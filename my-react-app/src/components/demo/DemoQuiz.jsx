import React, { useMemo, useState } from 'react';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import ExplanationText from '../common/ExplanationText.jsx';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang, LocaleLink as Link } from '../../i18n';
import demoCopy from '../../i18n/copy/demo.js';
import usePublicQuestions from '../questions/usePublicQuestions.js';
import { demoSeo } from '../../seo/demo.js';
import { safeTrack, trackFunnel } from '../../utils/analytics.js';
import './Demo.css';

const DEMO_LENGTH = 20;
const TRACKS = ['medical', 'nursing'];

/**
 * Twenty real questions, playable with no account.
 *
 * 120 people picked a study track this month and 42 asked for a verification
 * code: 78 walked at the form. They had not decided against the product — they
 * had not been allowed to see it. /questions publishes 240 questions but only
 * to someone willing to read; this is the same content made playable, which is
 * what "try it" actually means for a question bank.
 *
 * Entirely client-side, and deliberately so. The questions come from the same
 * publicQuestions.json the /questions pages use — already exported, already
 * reviewed, already shipped as its own lazy chunk — so the demo needs no
 * endpoint, no session, no rate limit, and no way to leak anything that is not
 * already public. Nothing here can touch an account, because there isn't one.
 */
const DemoQuiz = () => {
    const t = useCopy(demoCopy);
    const { lang, dir } = useLang();
    const { index, loading, error } = usePublicQuestions();

    const [track, setTrack] = useState(null);
    const [seed, setSeed] = useState(0);        // bumped to reshuffle on retry
    const [current, setCurrent] = useState(0);
    const [picked, setPicked] = useState(null); // index of the chosen option
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // A different twenty each time, drawn across every specialty in the track
    // so the sample reads as a bank rather than one topic. Recomputed only when
    // the track or the retry seed changes — never on answering, or the question
    // under the student's cursor would swap mid-click.
    const questions = useMemo(() => {
        if (!index || !track) return [];
        const pool = (index.questions || []).filter((q) => q.track === track);
        const shuffled = [...pool];
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, DEMO_LENGTH);
        // seed is the retry trigger and has no other use, hence the exception.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, track, seed]);

    const seo = useMemo(() => demoSeo(lang), [lang]);

    const beginTrack = (key) => {
        setTrack(key);
        setCurrent(0);
        setPicked(null);
        setScore(0);
        setFinished(false);
        trackFunnel('demo_start', { track: key });
    };

    const choose = (optionIndex) => {
        if (picked != null) return;             // the first answer is final
        setPicked(optionIndex);
        if (optionIndex === questions[current].correctIndex) setScore((n) => n + 1);
    };

    const advance = () => {
        if (current + 1 >= questions.length) {
            setFinished(true);
            trackFunnel('demo_complete', { track, score, total: questions.length });
            return;
        }
        setCurrent((n) => n + 1);
        setPicked(null);
    };

    const retry = () => {
        setSeed((n) => n + 1);
        setCurrent(0);
        setPicked(null);
        setScore(0);
        setFinished(false);
    };

    // ── Track chooser ─────────────────────────────────────────────────────
    if (!track) {
        return (
            <main className="demo" dir={dir}>
                <SEO {...seo} />
                <header className="demo-hero">
                    <p className="demo-kicker">{t.kicker}</p>
                    <h1>{t.title}</h1>
                    <p>{t.intro}</p>
                </header>
                <section className="demo-tracks" aria-label={t.trackQuestion}>
                    <h2>{t.trackQuestion}</h2>
                    <div className="demo-track-grid">
                        {TRACKS.map((key) => (
                            <button
                                type="button"
                                key={key}
                                className="demo-track"
                                onClick={() => beginTrack(key)}
                            >
                                <span className="demo-track-label">{t.tracks[key].label}</span>
                                <span className="demo-track-exam">{t.tracks[key].exam}</span>
                                <span className="demo-track-go">{t.start}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    if (loading) return <div className="demo-loading"><Spinner /><p>{t.loading}</p></div>;
    if (error || !questions.length) {
        return <main className="demo" dir={dir}><p className="demo-error">{t.error}</p></main>;
    }

    // ── Result ────────────────────────────────────────────────────────────
    if (finished) {
        const pct = score / questions.length;
        const verdict = pct >= 0.7 ? t.result.strong : pct >= 0.4 ? t.result.mixed : t.result.weak;
        return (
            <main className="demo" dir={dir}>
                <SEO {...seo} />
                <section className="demo-result">
                    <p className="demo-kicker">{t.result.kicker}</p>
                    <h1>{t.result.title(score, questions.length)}</h1>
                    <p className="demo-verdict">{verdict}</p>

                    <div className="demo-cta-card">
                        <h2>{t.result.ctaTitle}</h2>
                        <p>{t.result.ctaBody}</p>
                        <Link
                            className="demo-cta"
                            to="/signup"
                            onClick={() => safeTrack('signup_click', { from: 'demo_result', track })}
                        >
                            {t.result.cta}
                        </Link>
                    </div>

                    <div className="demo-result-links">
                        <button type="button" className="demo-link" onClick={retry}>{t.result.retry}</button>
                        <Link className="demo-link" to="/questions">{t.result.browse}</Link>
                    </div>
                </section>
            </main>
        );
    }

    // ── A question ────────────────────────────────────────────────────────
    const q = questions[current];
    const answered = picked != null;
    const gotItRight = picked === q.correctIndex;

    return (
        <main className="demo demo-playing" dir={dir}>
            <SEO {...seo} />
            <div className="demo-bar">
                <span className="demo-progress">{t.progress(current + 1, questions.length)}</span>
                <span className="demo-specialty">
                    {lang === 'en' ? q.specialtyLabelEn : (q.specialtyLabelAr || q.specialtyLabelEn)}
                </span>
            </div>
            <div className="demo-rail" aria-hidden="true">
                <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            {/* The question, its options and its explanation are exam English in
                both languages — the exam is written in English, and the site has
                never translated study content. Only the chrome follows `lang`. */}
            <p className="demo-stem" dir="ltr">{q.stem}</p>

            <ul className="demo-options">
                {q.options.map((option, i) => {
                    const isCorrect = i === q.correctIndex;
                    const state = !answered ? '' : isCorrect ? ' is-correct' : (i === picked ? ' is-wrong' : '');
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`demo-option${state}`}
                                onClick={() => choose(i)}
                                disabled={answered}
                                dir="ltr"
                            >
                                <span className="demo-option-mark">{String.fromCharCode(65 + i)}</span>
                                <span className="demo-option-text">{option}</span>
                                {answered && isCorrect && <Icon name="check-circle" size={18} />}
                                {answered && !isCorrect && i === picked && <Icon name="x-circle" size={18} />}
                            </button>
                        </li>
                    );
                })}
            </ul>

            {answered && (
                <section className={`demo-feedback${gotItRight ? ' is-correct' : ''}`}>
                    <p className="demo-verdict-line">
                        <Icon name={gotItRight ? 'check-circle' : 'x-circle'} size={17} />
                        {gotItRight ? t.correct : t.incorrect}
                    </p>
                    {!gotItRight && (
                        <p className="demo-answer" dir="ltr">
                            <strong>{t.correctAnswerIs}:</strong> {q.options[q.correctIndex]}
                        </p>
                    )}
                    <h3>{t.explanationTitle}</h3>
                    <ExplanationText className="demo-explanation" text={q.explanation} />
                    <button type="button" className="demo-cta" onClick={advance}>
                        {current + 1 >= questions.length ? t.finish : t.next}
                    </button>
                </section>
            )}

            <p className="demo-foot">
                <Link to="/questions">{t.result.browse}</Link>
            </p>
        </main>
    );
};

export default DemoQuiz;
