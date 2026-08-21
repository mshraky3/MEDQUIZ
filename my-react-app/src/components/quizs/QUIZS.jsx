import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';
import './QuizsHub.css';

import AchievementBadges from '../common/AchievementBadges.jsx';
import Icon from '../common/Icon.jsx';
import GoalCard from './GoalCard.jsx';
import ExamDateCard from './ExamDateCard.jsx';
import StreakCard from './StreakCard.jsx';
import QuizLauncher from './QuizLauncher.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { specialtiesOf, userTrack, examLabel, bankLabel, trackLabel, normalizeTrack } from '../../utils/tracks.js';
import { readQuizMode } from '../../utils/quizMode.js';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

// Single unified bank — see QuizLauncher.jsx.
const SOURCE = 'MidgardGameBoy';

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
    // The whole /user-streaks payload, not just the count: StreakCard renders
    // the last seven days from `active_days`, which a bare number cannot give.
    const [streak, setStreak] = useState(null);
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
        const [analysisRes, streakRes, topicRes, contentRes] = await Promise.allSettled([
            protectedGet(`/user-analysis/${id}`),
            protectedGet(`/user-streaks/${id}`),
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
        if (streakRes.status === 'fulfilled') setStreak(streakRes.value.data || null);
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
        const available = !content || (content.questionsByType?.[key] || 0) > 0;
        return { key, icon, label: getTypeLabel(key, lang), answered, accuracy, available };
    });
    // Content checks are advisory: until the request lands (or if it fails) we
    // assume content exists rather than flashing an empty state at everyone.
    const bankEmpty = content ? !content.hasQuestions : false;
    const summariesEmpty = content ? !content.hasSummaries : false;
    const attempted = rows.filter((r) => r.answered > 0);
    const weakestKey = attempted.length >= 2
        ? attempted.reduce((a, b) => (a.accuracy <= b.accuracy ? a : b)).key
        : null;

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

    // The streak used to be a fourth tile here. It moved to its own card above
    // (StreakCard) because a streak is the one number on this page that needs
    // a "is today done?" answer next to it — repeating it as a bare tile would
    // just be the same figure twice.
    const tiles = [
        { k: 'acc', icon: 'target', value: hasHistory ? `${Math.round(stats.avg_accuracy)}%` : '—', label: t.kpiAccuracy },
        { k: 'quiz', icon: 'clipboard', value: hasHistory ? fmt(stats.total_quizzes) : '—', label: t.kpiQuizzes },
        { k: 'q', icon: 'check-circle', value: hasHistory ? fmt(stats.total_questions_answered) : '—', label: t.kpiQuestions }
    ];

    return (
        <div className="quiz-selection hubx" dir={dir}>
            <header className="hubx-top">
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

            {/* The three commitment cards — how long you have, whether today
                has been used, and what you promised yourself this week.

                They sit directly under the study loop rather than above it: the
                loop is what the page is FOR, and three status cards ahead of it
                pushed the actual instruction below the fold. They are also one
                row of three rather than a 2-up row plus a full-width goal card,
                which is what made this stretch of the page so tall. Hidden
                while the bank is empty — nothing to make progress against.

                GoalCard's `sources` comes from the content-status response
                rather than a constant, so the collection picker only ever
                offers collections this track actually has loaded — and stays
                hidden entirely for medical, whose bank is unified by design. */}
            {!bankEmpty && user?.username && sessionToken && (
                <div className="hub-cards-row">
                    <ExamDateCard
                        username={user.username}
                        sessionToken={sessionToken}
                        questionsRemaining={content?.totalQuestions || 0}
                    />
                    <StreakCard streak={streak} onStartToday={() => startQuiz('mix')} />
                    <GoalCard
                        username={user.username}
                        sessionToken={sessionToken}
                        specialties={SPECIALTIES}
                        sources={content?.selectableSources || []}
                    />
                </div>
            )}

            {/* One performance panel: headline numbers on top, per-specialty
                rings below. These used to be two separate boxes that both
                showed the same story in different shapes. */}
            <section className="hubx-mastery" aria-labelledby="hubx-mastery-h">
                <div className="hubx-sec-head">
                    <h2 id="hubx-mastery-h">{t.performanceTitle}</h2>
                    {weakestKey && <span className="hubx-sec-note">{t.performanceNote}</span>}
                </div>

                <div className="hubx-kpis" aria-label={t.kpiSummary}>
                    {tiles.map((tile) => (
                        <div className={`hubx-kpi${loading ? ' is-loading' : ''}`} key={tile.k}>
                            <span className="hubx-kpi-icon"><Icon name={tile.icon} size={15} /></span>
                            <span className="hubx-kpi-value"><bdi>{loading ? '' : tile.value}</bdi></span>
                            <span className="hubx-kpi-label">{tile.label}</span>
                        </div>
                    ))}
                    <a
                        className="hubx-kpi hubx-kpi--telegram"
                        href="https://t.me/sqb_exam"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { try { track('hub_telegram_cta'); } catch (e) { /* analytics is best-effort */ } }}
                    >
                        <span className="hubx-kpi-icon hubx-kpi-icon--badge" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                        </span>
                        <span className="hubx-kpi-value hubx-kpi-value--sm">{t.telegramCtaTitle}</span>
                        <span className="hubx-kpi-label">{t.telegramCtaSubtitle}</span>
                    </a>
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
                            const isWeak = r.key === weakestKey;
                            const started = r.answered > 0;
                            const C = 163.36; // 2πr for r=26
                            return (
                                <li className={`hubx-spec${isWeak ? ' is-weak' : ''}${started ? '' : ' is-empty'}`} key={r.key}>
                                    <span className="hubx-spec-ring" role="img"
                                        aria-label={started ? t.specAria(r.label, r.accuracy, r.answered) : t.specAriaEmpty(r.label)}>
                                        <svg viewBox="0 0 64 64" aria-hidden="true">
                                            <circle className="hubx-ring-bg" cx="32" cy="32" r="26" />
                                            <circle className="hubx-ring-fg" cx="32" cy="32" r="26"
                                                style={{ strokeDasharray: C, strokeDashoffset: loading || !started ? C : C * (1 - r.accuracy / 100) }} />
                                        </svg>
                                        <span className="hubx-spec-pct">
                                            {loading ? '' : started ? <bdi>{r.accuracy}%</bdi> : <Icon name={r.icon} size={20} />}
                                        </span>
                                    </span>
                                    <span className="hubx-spec-name">
                                        <Icon name={r.icon} size={15} /> {r.label}
                                    </span>
                                    <span className="hubx-spec-sub">
                                        {loading ? <span className="hubx-skel" /> : started ? <><bdi>{fmt(r.answered)}</bdi> {t.specQuestions}</> : t.specNotStarted}
                                    </span>
                                    {isWeak && <span className="hubx-tag">{t.weakest}</span>}
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

            {id && <AchievementBadges userId={id} />}
        </div>
    );
};

export default QUIZS;
