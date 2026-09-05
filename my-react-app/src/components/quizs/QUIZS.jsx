import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';
import './QuizsHub.css';

import AchievementBadges from '../common/AchievementBadges.jsx';
import Icon from '../common/Icon.jsx';
import QuizLauncher from './QuizLauncher.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { specialtiesOf, userTrack, examLabel, bankLabel, trackLabel, normalizeTrack } from '../../utils/tracks.js';
import { readQuizMode } from '../../utils/quizMode.js';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

// Single unified bank — see QuizLauncher.jsx.
const SOURCE = 'MidgardGameBoy';

// Blocks in a specialty's coverage meter. A continuous bar is the obvious
// choice and the wrong one here: a student who has answered 18 of 1,308
// questions is at 1.4%, which renders as an invisible sliver and reads as a
// broken widget. Ten discrete blocks always light at least one, so "barely
// started" looks deliberate — which is also the honest message.
const METER_BLOCKS = 10;

// Below this many answered questions, an accuracy figure is noise: 100% off
// eight questions is not a strength and 0% off two is not a weakness. Under
// the threshold the number is still shown (it is their real score) but stays
// grey rather than being coloured as good or bad, and it cannot nominate a
// specialty as the weakest one.
const MIN_ACCURACY_SAMPLE = 10;

// Same thresholds as Analysis.jsx's accuracyTone, so a percentage means the
// same colour wherever it appears.
const accuracyTone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

/**
 * The post-login home, built as a study dashboard rather than a menu of cards.
 *
 * The previous version was three big navigation cards, which read as empty and
 * buried the primary action (start a quiz) behind a card tap. This version puts
 * the quick-start in the header, then fills the page with the user's own data —
 * headline stats and per-specialty mastery — so the page earns its space and
 * doubles as a reason to come back. Summaries and analysis become slim links
 * rather than equal-weight cards, because they are secondary to practising.
 *
 * All three requests run through Promise.allSettled: a stats failure must never
 * stop someone starting a quiz, so the header actions render regardless.
 */
const QUIZS = () => {
    const { user, setUser, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const t = useCopy(quizCopy).hub;
    const { lang, dir } = useLang();
    // Resolve id from context first so a hard refresh (no router state) still works.
    const id = user?.id || location.state?.id || location.state?.user?.id;

    // The custom-quiz launcher is a URL state (?view=custom), not local
    // component state — both screens live at /quizs, so a Navbar "back" click
    // (which navigates to /quizs) only actually changes anything, and can
    // hand control back to the hub, if the launcher's URL differs from it.
    const view = new URLSearchParams(location.search).get('view') === 'custom' ? 'launcher' : 'hub';
    const openLauncher = () => navigate({ pathname: '/quizs', search: '?view=custom' });
    const [stats, setStats] = useState(null);
    const [topics, setTopics] = useState([]);
    const [state, setState] = useState('loading'); // loading | ready | error
    // Null until the content check lands. Drives the empty state shown while a
    // track's bank is still being loaded — the nursing bank starts out empty,
    // and a hub full of live-looking buttons that all lead to "0 questions"
    // would be worse than saying so plainly.
    const [content, setContent] = useState(null);

    // Display order of the mastery rows: this student's own specialties.
    const myTrack = userTrack(user);
    const SPECIALTIES = React.useMemo(() => specialtiesOf(myTrack), [myTrack]);

    const protectedGet = async (url) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        return apiClient.get(url);
    };

    // Tracks whether this instance is still mounted, so a slow response that
    // lands after navigating away cannot setState on an unmounted component.
    // MUST be set back to true on mount: React StrictMode runs effects
    // mount → cleanup → mount on the same instance, so without this the flag
    // stays false after the double-invoke and every load() bails out early,
    // leaving the page stuck on its loading skeletons forever.
    const aliveRef = React.useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => { aliveRef.current = false; };
    }, []);

    // Read via a ref inside load(), not the `user` closure variable directly —
    // load() itself calls setUser() below when the server's track disagrees
    // with the stored one. With `user` in load's own dependency array, that
    // setUser call produced a new `user` reference, which gave load() a new
    // identity, which re-ran the effect below, which called load() again. It
    // happened to stop after one extra pass because normalizeTrack(t) === t
    // for every value the server actually sends today, but that's incidental —
    // a track value where that's not true would loop forever. Reading through
    // a ref means updating `user` never changes load()'s own identity.
    const userRef = React.useRef(user);
    useEffect(() => { userRef.current = user; }, [user]);

    const load = React.useCallback(async () => {
        const currentUser = userRef.current;
        if (!id || !currentUser || !sessionToken) { setState('error'); return; }
        setState('loading');
        const [analysisRes, topicRes, contentRes] = await Promise.allSettled([
            protectedGet(`/user-analysis/${id}`),
            protectedGet(`/topic-analysis/user/${id}`),
            protectedGet('/api/track-content-status')
        ]);
        if (!aliveRef.current) return;
        if (contentRes.status === 'fulfilled') {
            setContent(contentRes.value.data);
            // The server is the authority on which track this account is on.
            // An admin can move an account at any time, and the stored session
            // object would otherwise keep labelling the UI with the old track
            // while the server serves content from the new one. Reconcile here,
            // on the first authenticated request of the session.
            const serverTrack = contentRes.value.data.track;
            const latestUser = userRef.current;
            if (serverTrack && latestUser && normalizeTrack(latestUser.track) !== serverTrack) {
                setUser({ ...latestUser, track: serverTrack }, sessionToken);
            }
        }
        if (analysisRes.status === 'fulfilled') {
            const d = analysisRes.value.data;
            setStats({
                total_quizzes: d.total_quizzes || 0,
                total_questions_answered: d.total_questions_answered || 0,
                avg_accuracy: d.avg_accuracy || 0
            });
        }
        if (topicRes.status === 'fulfilled' && Array.isArray(topicRes.value.data)) setTopics(topicRes.value.data);
        setState(analysisRes.status === 'fulfilled' ? 'ready' : 'error');
    }, [id, sessionToken, setUser]);

    useEffect(() => { load(); }, [load]);

    const startQuiz = (types) => {
        try { track('hub_start_quiz', { types, source: SOURCE }); } catch (e) { /* analytics is best-effort */ }
        // The hub's quick start skips the launcher, so it reads the saved
        // study/exam preference directly — without this it would silently
        // start every quick quiz in exam mode.
        navigate('/quiz/10', { state: { id, types, source: SOURCE, timer: null, mode: readQuizMode() } });
    };

    if (view === 'launcher') {
        return (
            <div className="quiz-selection">
                <QuizLauncher id={id} contentStatus={content} />
            </div>
        );
    }

    // Usernames are often full email addresses. Take the local part first,
    // otherwise the greeting reads "أهلاً alshraky3@gmail" and swamps the header.
    const firstName = user?.username
        ? String(user.username).split('@')[0].split(/[ _.]/).filter(Boolean)[0] || ''
        : '';
    const hasHistory = !!stats && stats.total_quizzes > 0;
    const loading = state === 'loading';

    // Every specialty in the track has a row, so the section never looks
    // half-built. `available` marks the ones that actually have questions
    // loaded — a specialty with none is shown, but not offered.
    const rows = SPECIALTIES.map(({ key, icon }) => {
        const hit = topics.find((t) => t.question_type === key);
        const answered = hit ? parseInt(hit.total_answered, 10) || 0 : 0;
        const accuracy = hit ? Math.round(parseFloat(hit.accuracy) || 0) : 0;
        // Pool size for this specialty. This is the number the old ring left
        // out, which is how "100%" could sit on top of eight answered
        // questions and read as "topic finished".
        const total = content?.questionsByType?.[key] || 0;
        const available = !content || total > 0;
        const coverage = total > 0 ? (answered / total) * 100 : 0;
        const blocks = answered > 0
            ? Math.max(1, Math.min(METER_BLOCKS, Math.round((coverage / 100) * METER_BLOCKS)))
            : 0;
        return {
            key, icon, label: getTypeLabel(key, lang),
            answered, accuracy, available, total, blocks,
            solidSample: answered >= MIN_ACCURACY_SAMPLE,
        };
    });
    // Content checks are advisory: until the request lands (or if it fails) we
    // assume content exists rather than flashing an empty state at everyone.
    const bankEmpty = content ? !content.hasQuestions : false;
    const summariesEmpty = content ? !content.hasSummaries : false;

    // The whole bank in one line: what is answered, and what is still waiting.
    // Summed from the same rows the list below renders, so the header and the
    // rows can never disagree.
    const bankTotal = rows.reduce((n, r) => n + r.total, 0);
    const bankAnswered = rows.reduce((n, r) => n + r.answered, 0);
    const bankRemaining = Math.max(0, bankTotal - bankAnswered);

    // Where to send them next. Accuracy only gets to nominate a weakest
    // specialty once at least two of them carry a real sample — otherwise the
    // "weakest" is whichever one they happened to get wrong twice. With no
    // qualifying sample the least-covered specialty is suggested instead,
    // which is always true and always actionable.
    const rated = rows.filter((r) => r.solidSample);
    const weakestKey = rated.length >= 2
        ? rated.reduce((a, b) => (a.accuracy <= b.accuracy ? a : b)).key
        : null;
    const startable = rows.filter((r) => r.available && r.total > 0);
    const leastCoveredKey = !weakestKey && startable.length > 0
        ? startable.reduce((a, b) => (a.answered / a.total <= b.answered / b.total ? a : b)).key
        : null;
    const suggestKey = weakestKey || leastCoveredKey;

    const fmt = (n) => formatNumber(n, lang);
    // The journey chevrons point "forward", which is leftwards in Arabic and
    // rightwards in English.
    const arrow = dir === 'rtl' ? 'chevron-left' : 'chevron-right';

    /**
     * The three destinations, framed as one loop: understand → practise →
     * measure → back again. They stay equal-weight and always visible; the
     * "journey" is the ordering and the suggested entry point, not a wizard
     * that hides steps behind each other.
     */
    const steps = [
        {
            key: 'summaries', tone: 'sum', icon: 'book-open', kicker: t.stepSummariesKicker,
            title: t.stepSummariesTitle,
            desc: t.stepSummariesDesc,
            stat: summariesEmpty
                ? t.inPreparation
                : SPECIALTIES.map((sp) => getTypeLabel(sp.key, lang)).join(' · '),
            cta: t.stepSummariesCta,
            onClick: () => navigate('/summaries')
        },
        {
            key: 'quiz', tone: 'quiz', icon: 'clipboard', kicker: t.stepQuizKicker,
            title: t.stepQuizTitle,
            desc: t.stepQuizDesc(bankLabel(myTrack, lang)),
            stat: bankEmpty
                ? t.inPreparation
                : (hasHistory ? t.stepQuizStat(fmt(stats.total_quizzes)) : t.stepQuizNotStarted),
            cta: t.stepQuizCta,
            onClick: openLauncher
        },
        {
            key: 'analysis', tone: 'ana', icon: 'bar-chart', kicker: t.stepAnalysisKicker,
            title: t.stepAnalysisTitle,
            desc: t.stepAnalysisDesc,
            stat: hasHistory ? t.stepAnalysisStat(Math.round(stats.avg_accuracy)) : t.stepAnalysisEmpty,
            cta: t.stepAnalysisCta,
            onClick: () => navigate('/analysis', { state: { id } })
        }
    ];

    // Where to point someone next: a new user starts by reading; once there is
    // history, a weak specialty is the highest-value place to practise;
    // otherwise send them to review the numbers.
    const nextStep = bankEmpty && summariesEmpty
        ? null
        : (!hasHistory ? (summariesEmpty ? 'quiz' : 'summaries') : (weakestKey ? 'quiz' : 'analysis'));

    // These sit in the header now rather than in a bordered strip of their own
    // inside the performance panel. They are the answer to "where am I", which
    // belongs next to the greeting — and one bordered box fewer on a page whose
    // main complaint was boxes inside boxes.
    const tiles = [
        { k: 'q', value: hasHistory ? fmt(stats.total_questions_answered) : '—', label: t.kpiQuestions },
        { k: 'quiz', value: hasHistory ? fmt(stats.total_quizzes) : '—', label: t.kpiQuizzes },
        { k: 'acc', value: hasHistory ? `${Math.round(stats.avg_accuracy)}%` : '—', label: t.kpiAccuracy },
        // The one number that reframes an almost-empty page: not "you have done
        // very little" but "this much is still yours to use".
        { k: 'left', value: bankTotal > 0 ? fmt(bankRemaining) : '—', label: t.kpiRemaining },
    ];

    return (
        <div className="quiz-selection hubx" dir={dir}>
            <header className="hubx-top">
                <div className="hubx-top-row">
                    <div className="hubx-greet">
                        <h1>{firstName
                            ? <>{t.greetingNamePrefix}<bdi>{firstName}</bdi>{t.greetingNameSuffix}</>
                            : t.greeting}</h1>
                        <p>{t.subtitle}</p>
                    </div>
                    <div className="hubx-actions">
                        <button
                            type="button"
                            className="hubx-btn hubx-btn--primary"
                            onClick={() => startQuiz('mix')}
                            disabled={bankEmpty}
                        >
                            <Icon name="rocket" size={19} />
                            <span>{t.quickStart}</span>
                            <small>{bankEmpty ? t.unavailable : t.quickStartHint}</small>
                        </button>
                        <button
                            type="button"
                            className="hubx-btn hubx-btn--ghost"
                            onClick={openLauncher}
                            disabled={bankEmpty}
                        >
                            <Icon name="settings" size={17} />
                            <span>{t.customize}</span>
                        </button>
                    </div>
                </div>

                <div className="hubx-stats" aria-label={t.kpiSummary}>
                    {tiles.map((tile) => (
                        <div className={`hubx-stat${loading ? ' is-loading' : ''}`} key={tile.k}>
                            <b><bdi>{loading ? '' : tile.value}</bdi></b>
                            <span>{tile.label}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* A track whose bank hasn't been loaded yet says so, once, at the
                top — rather than letting the student discover it by starting a
                quiz that returns nothing. */}
            {(bankEmpty || summariesEmpty) && (
                <section className="hubx-notice" role="status">
                    <span className="hubx-notice-icon" aria-hidden="true"><Icon name="hourglass" size={20} /></span>
                    <div className="hubx-notice-body">
                        <strong>
                            {bankEmpty && summariesEmpty
                                ? t.noticeBoth(trackLabel(myTrack, lang))
                                : bankEmpty
                                    ? t.noticeBank(trackLabel(myTrack, lang))
                                    : t.noticeSummaries(trackLabel(myTrack, lang))}
                        </strong>
                        <span>
                            {t.noticeBody(examLabel(myTrack, lang))}
                            {!bankEmpty && t.noticeQuestionsReady}
                            {!summariesEmpty && t.noticeSummariesReady}
                            {bankEmpty && summariesEmpty && t.noticeWillEmail}
                        </span>
                    </div>
                </section>
            )}

            <nav className="hubx-journey" aria-labelledby="hubx-journey-h">
                <div className="hubx-sec-head">
                    <h2 id="hubx-journey-h">{t.journeyTitle}</h2>
                    <span className="hubx-sec-note">{t.journeyNote}</span>
                </div>
                <ol className="hubx-steps">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <li className={`hubx-step hubx-step--${s.tone}${s.key === nextStep ? ' is-next' : ''}`}>
                                <button type="button" className="hubx-step-btn" onClick={s.onClick}>
                                    <span className="hubx-step-top">
                                        <span className="hubx-step-n">{i + 1}</span>
                                        <span className="hubx-step-kicker">{s.kicker}</span>
                                        {s.key === nextStep && <span className="hubx-step-flag">{t.startHere}</span>}
                                    </span>
                                    <span className="hubx-step-icon"><Icon name={s.icon} size={24} /></span>
                                    <strong className="hubx-step-title">{s.title}</strong>
                                    <span className="hubx-step-desc">{s.desc}</span>
                                    <span className="hubx-step-stat">{s.stat}</span>
                                    <span className="hubx-step-cta">{s.cta} <Icon name={arrow} size={15} /></span>
                                </button>
                            </li>
                            {i < steps.length - 1 && (
                                <li className="hubx-step-arrow" aria-hidden="true"><Icon name={arrow} size={20} /></li>
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </nav>

            {/* The exam-date/streak/goal cards that used to live here moved to
                /account — they're personal study-plan settings, not part of
                what this page is for, and duplicated navigation weight right
                above the panel that actually matters. */}

            {/* The specialty list. Was four cards, each with a ring showing
                ACCURACY — which every reader took for completion, so a student
                who had answered 8 of 765 obstetrics questions correctly saw a
                full "100%" circle and reasonably concluded they were done with
                obstetrics. It is a ledger now: how much of each specialty's
                pool is used up, how they score on what they have answered, and
                one button to practise it. */}
            <section className="hubx-mastery" aria-labelledby="hubx-mastery-h">
                <div className="hubx-sec-head">
                    <h2 id="hubx-mastery-h">{t.performanceTitle}</h2>
                    {bankTotal > 0 && (
                        <span className="hubx-sec-note">{t.bankNote(fmt(bankAnswered), fmt(bankTotal))}</span>
                    )}
                </div>

                {state === 'error' ? (
                    <div className="hubx-inline-error">
                        <p>{t.loadError}</p>
                        <button type="button" className="hubx-retry" onClick={load}>
                            <Icon name="refresh" size={15} /> {t.retry}
                        </button>
                    </div>
                ) : (
                    <ul className="hubx-specs">
                        {rows.map((r) => {
                            const isNext = r.key === suggestKey;
                            const started = r.answered > 0;
                            return (
                                <li className={`hubx-spec${isNext ? ' is-next' : ''}${started ? '' : ' is-empty'}`} key={r.key}>
                                    <span className="hubx-spec-name">
                                        <span className="hubx-spec-icon" aria-hidden="true"><Icon name={r.icon} size={17} /></span>
                                        <span className="hubx-spec-label">{r.label}</span>
                                        {isNext && (
                                            <span className="hubx-tag">
                                                {r.key === weakestKey ? t.weakest : t.startHere}
                                            </span>
                                        )}
                                    </span>

                                    <span className="hubx-spec-meter">
                                        <span
                                            className="hubx-segs"
                                            role="img"
                                            aria-label={started ? t.specCoverageAria(r.label, fmt(r.answered), fmt(r.total)) : t.specAriaEmpty(r.label)}
                                        >
                                            {Array.from({ length: METER_BLOCKS }, (_, i) => (
                                                <span key={i} className={`hubx-seg${i < r.blocks ? ' is-on' : ''}`} />
                                            ))}
                                        </span>
                                        <span className="hubx-spec-sub">
                                            {loading
                                                ? <span className="hubx-skel" />
                                                : r.total > 0
                                                    ? t.specCoverage(fmt(r.answered), fmt(r.total))
                                                    : t.specNotStarted}
                                        </span>
                                    </span>

                                    {/* Accuracy keeps its real value but only earns a
                                        colour once the sample can carry one. */}
                                    <span className="hubx-spec-acc">
                                        <b className={started && r.solidSample ? `tone-${accuracyTone(r.accuracy)}` : 'is-thin'}>
                                            {loading ? '' : started ? <bdi>{r.accuracy}%</bdi> : '—'}
                                        </b>
                                        <span>{started ? t.specAccuracyOf(fmt(r.answered)) : t.specNotStarted}</span>
                                    </span>

                                    <button
                                        type="button"
                                        className="hubx-practise"
                                        onClick={() => startQuiz(r.key)}
                                        disabled={!r.available}
                                    >
                                        {!r.available ? t.soon : started ? t.practise : t.start}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!loading && state !== 'error' && !hasHistory && (
                    <p className="hubx-empty">{t.noHistory}</p>
                )}
            </section>

            {/* Its own strip rather than a fourth cell in the stats row, where a
                promo sat among three figures and read as one of them. */}
            <a
                className="hubx-tg"
                href="https://t.me/sqb_exam"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { try { track('hub_telegram_cta'); } catch (e) { /* analytics is best-effort */ } }}
            >
                <span className="hubx-tg-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                </span>
                <span className="hubx-tg-text">
                    <strong>{t.telegramCtaTitle}</strong>
                    <span>{t.telegramCtaSubtitle}</span>
                </span>
                <span className="hubx-tg-go">{t.telegramCtaButton}</span>
            </a>

            {id && <AchievementBadges userId={id} />}
        </div>
    );
};

export default QUIZS;
