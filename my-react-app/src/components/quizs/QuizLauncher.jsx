import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';
import './QuizLauncher.css';

import CongratulationsPopup from '../common/CongratulationsPopup.jsx';
import Icon from '../common/Icon.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { getSourceLabel } from '../../utils/sourceLabels';
import { specialtyKeys, userTrack, trackLabel, examLabel } from '../../utils/tracks.js';
import { readQuizMode, writeQuizMode, STUDY, EXAM } from '../../utils/quizMode.js';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

// Sentinel meaning "the whole of my track's bank". The backend resolves it to
// all three medical sources, and to no source filter at all for nursing — so
// it is always the right thing to send when no collection is picked.
const WHOLE_BANK = 'MidgardGameBoy';

const COUNT_PRESETS = [10, 25, 50];

// The collection promoted at the top of the source list while it is the freshest.
const FEATURED_SOURCE = 'MedicalSeptemberRecall';
const MAX_QUESTIONS = 500;

/**
 * "Choose your quiz".
 *
 * This used to spread one decision across five surfaces: a mode panel, a
 * source panel, a quick-start button, a row of size buttons, and then three
 * stacked full-screen modals — specialties, then count, then timer — before
 * anything started. Changing an earlier answer meant backing out of the stack,
 * and no screen ever stated the quiz you were about to begin.
 *
 * It is one form now: every choice is a row of chips, all visible and
 * changeable at once, and the footer says what pressing start will do. The
 * mock exam keeps its own modal, because it is a different activity with its
 * own question-count lookup rather than another setting on this one.
 */
// contentStatus: the /api/track-content-status response, when the caller
// already has it. QUIZS.jsx fetches this on every hub load and then rendered
// this launcher underneath, which fetched the exact same endpoint again a
// moment later — passing it down skips that second request. Still optional:
// /quizs?view=custom is a real bookmarkable URL, so a launcher reached
// directly (no parent fetch to hand off) falls back to fetching for itself.
const QuizLauncher = ({ id, contentStatus }) => {
    const { user, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const copy = useCopy(quizCopy);
    const t = copy.launcher;
    const { lang, dir } = useLang();
    const timerOptions = t.timerOptions;
    const fmt = (n) => formatNumber(n, lang);

    // The specialties offered are the ones belonging to this student's track.
    // The server enforces the same restriction, so this only decides what the
    // launcher *shows*.
    const myTrack = userTrack(user);
    const availableTypes = React.useMemo(() => specialtyKeys(myTrack), [myTrack]);

    // Whether this track's bank has anything in it. The hub disables the entry
    // points when it doesn't, but /quizs?view=custom is a real URL someone can
    // land on directly (bookmark, back button), so the launcher checks for
    // itself rather than offering a quiz that would come back empty.
    // null = not known yet; treated as "has content" so nothing flashes.
    const [bankEmpty, setBankEmpty] = useState(() => contentStatus ? !contentStatus.hasQuestions : false);

    // The collections this track can be narrowed to, straight from the server
    // ([{key, total, priority, completedPct}], already filtered to ones that
    // actually have questions). The picker only appears when there is genuinely
    // a choice to make.
    const [sources, setSources] = useState(() =>
        Array.isArray(contentStatus?.selectableSources) ? contentStatus.selectableSources : []
    );
    // How much of each specialty this user has already answered, as a 0-100
    // percentage straight from the server ({type: pct}).
    const [progressByType, setProgressByType] = useState(() => contentStatus?.progressByType || {});
    // null = the whole bank (every collection mixed).
    const [selectedSource, setSelectedSource] = useState(null);
    const activeSource = selectedSource || WHOLE_BANK;
    const totalSourceQuestions = React.useMemo(
        () => sources.reduce((sum, s) => sum + (s.total || 0), 0),
        [sources]
    );

    // Study vs exam. Shared with the hub's quick start through utils/quizMode.js
    // so both entry points start the quiz the same way.
    const [quizMode, setQuizMode] = useState(readQuizMode);
    const chooseMode = (mode) => {
        setQuizMode(mode);
        writeQuizMode(mode);
    };

    // Empty selectedTypes means "mix every specialty" — the same thing the old
    // flow's "mix all" button did, now expressed as the default state of an
    // "all specialties" chip rather than a second button.
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [numQuestions, setNumQuestions] = useState(COUNT_PRESETS[0]);
    const [customCount, setCustomCount] = useState(false);
    const [selectedTimer, setSelectedTimer] = useState(null);
    const [customTimerMinutes, setCustomTimerMinutes] = useState(15);

    const [showFinalQuizType, setShowFinalQuizType] = useState(false);
    const [showFinalQuizTime, setShowFinalQuizTime] = useState(false);
    const [selectedFinalType, setSelectedFinalType] = useState('');
    const [finalQuizQuestionsCount, setFinalQuizQuestionsCount] = useState(0);
    const [finalQuizTimeLimit, setFinalQuizTimeLimit] = useState(30);
    const [loadingFinalCount, setLoadingFinalCount] = useState(false);

    const [showCongratulations, setShowCongratulations] = useState(false);
    const [congratulationsData, setCongratulationsData] = useState(null);

    useEffect(() => {
        // The parent (QUIZS.jsx) already fetched this and handed it down —
        // fetching it again here would be the exact same request twice on
        // every /quizs?view=custom visit reached through the hub.
        if (contentStatus) return undefined;
        let alive = true;
        if (!user || !sessionToken) return undefined;
        apiClient.get('/api/track-content-status')
            .then((res) => {
                if (!alive || !res) return;
                setBankEmpty(!res.data.hasQuestions);
                setSources(Array.isArray(res.data.selectableSources) ? res.data.selectableSources : []);
                setProgressByType(res.data.progressByType || {});
            })
            .catch(() => { /* advisory only — never block the launcher on this */ });
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username, sessionToken, contentStatus]);

    // ---- Completion / achievement / congratulations (preserved) ----
    const checkCompletion = async (type, source) => {
        if (!user || !sessionToken) return false;
        try {
            const response = await apiClient.get(`/api/check-completion/${id}`, { params: { type, source } });
            const { isCompleted, total, completed } = response.data;
            if (isCompleted && total > 0) {
                await awardAchievement(type, source);
                setCongratulationsData({ type, source, total, completed });
                setShowCongratulations(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking completion:', error);
            return false;
        }
    };

    const checkCompletionForSource = async (source) => {
        for (const type of availableTypes) {
            const isCompleted = await checkCompletion(type, source);
            if (isCompleted) break; // only one popup at a time
        }
    };

    // Was triggered by picking a question count, which only existed because the
    // count was a button that opened the next modal. With the count now a field
    // with a default, nobody has to click it — so the check runs when the
    // screen (or the chosen source) is ready instead. Same request count.
    useEffect(() => {
        if (!id || !user || !sessionToken || bankEmpty) return;
        checkCompletionForSource(activeSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user?.username, sessionToken, activeSource, bankEmpty]);

    const awardAchievement = async (type, source) => {
        if (!user || !sessionToken) return;
        try {
            const achievementKey = `${type}_${source}`;
            const achievementName = t.achievementName(getTypeLabel(type, lang), getSourceLabel(source, lang));
            const achievementDescription = t.achievementDesc(getTypeLabel(type, lang), getSourceLabel(source, lang));
            await apiClient.post('/api/award-achievement', {
                userId: id,
                achievementType: 'cardinality_completion',
                achievementKey,
                achievementName,
                achievementDescription
            });
        } catch (error) {
            console.error('Error awarding achievement:', error);
        }
    };

    const handleRestart = async () => {
        if (!congratulationsData) return;
        if (!user || !sessionToken) return;
        try {
            await apiClient.post('/api/reset-progress', {
                userId: id,
                type: congratulationsData.type,
                source: congratulationsData.source
            });
            setShowCongratulations(false);
            setCongratulationsData(null);
            window.location.reload();
        } catch (error) {
            // Subscriber-only (see POST /api/reset-progress). A lapsed account
            // can still reach this popup, so send it to the paywall instead of
            // swallowing the failure and looking broken.
            if (error?.response?.status === 402) {
                navigate('/subscribe?reason=reset_requires_subscription');
                return;
            }
            console.error('Error resetting progress:', error);
        }
    };

    const handleCloseCongratulations = () => {
        setShowCongratulations(false);
        setCongratulationsData(null);
    };

    // ---- The one thing this screen builds ----
    const toggleType = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type]
        );
    };

    const resolvedCount = Math.min(MAX_QUESTIONS, Math.max(1, Number(numQuestions) || COUNT_PRESETS[0]));
    const timerMinutes = selectedTimer === 'custom'
        ? Math.min(180, Math.max(1, Number(customTimerMinutes) || 15))
        : selectedTimer;

    // The sentence the old flow never said out loud. Built from the same values
    // that are about to be handed to the quiz, so it cannot drift from them.
    const summaryParts = [
        t.questionsCount(fmt(resolvedCount)),
        quizMode === STUDY ? t.modeStudy : t.modeExam,
        selectedTypes.length > 0
            ? selectedTypes.map((type) => getTypeLabel(type, lang)).join('، ')
            : t.typesAll,
        timerMinutes ? `${fmt(timerMinutes)} ${t.minutes}` : t.noTimer,
    ];
    if (sources.length > 1) {
        summaryParts.splice(2, 0, selectedSource ? getSourceLabel(selectedSource, lang) : t.sourceAll);
    }

    // The freshest collection (when this bank has it) is shown large on top; every
    // other collection is a compact row in the server's recommended study order.
    const featuredSource = sources.find((s) => s.key === FEATURED_SOURCE) || null;
    const restSources = sources.filter((s) => s !== featuredSource);
    const pctOf = (s) => Math.min(100, Math.max(0, s.completedPct || 0));

    // The same values as summaryParts, labelled, for the summary card.
    const summaryRows = [
        { label: t.modeLegend, value: quizMode === STUDY ? t.modeStudy : t.modeExam },
        ...(sources.length > 1
            ? [{ label: t.sourceLegend, value: selectedSource ? getSourceLabel(selectedSource, lang) : t.sourceAll }]
            : []),
        {
            label: t.typesLegend,
            value: selectedTypes.length > 0
                ? selectedTypes.map((type) => getTypeLabel(type, lang)).join('، ')
                : t.typesAll,
        },
        { label: t.countLegend, value: fmt(resolvedCount) },
        { label: t.timerLegend, value: timerMinutes ? `${fmt(timerMinutes)} ${t.minutes}` : t.noTimer },
    ];

    const handleStart = () => {
        const typesStr = selectedTypes.length > 0 ? selectedTypes.join(',') : 'mix';
        try {
            track('quiz_launch', {
                questions: resolvedCount,
                source: activeSource,
                types: typesStr,
                mode: quizMode,
                timed: timerMinutes ? 'yes' : 'no',
            });
        } catch (error) {
            console.debug('Analytics track skipped:', error);
        }
        navigate(`/quiz/${resolvedCount}`, {
            state: { id, types: typesStr, source: activeSource, timer: timerMinutes, mode: quizMode }
        });
    };

    // ---- Final quiz flow: type → time (kept as its own modal) ----
    const handleFinalTypeSelect = async (type) => {
        setSelectedFinalType(type);
        setShowFinalQuizType(false);
        setFinalQuizQuestionsCount(0);

        if (!user || !sessionToken) {
            setShowFinalQuizTime(true);
            return;
        }

        setLoadingFinalCount(true);
        setShowFinalQuizTime(true);
        try {
            const response = await apiClient.get('/final-quiz/questions-count', {
                params: { questionType: type, source: activeSource },
            });
            setFinalQuizQuestionsCount(response.data.totalQuestions || 0);
        } catch (error) {
            console.error('Error fetching questions count:', error);
            setFinalQuizQuestionsCount(0);
        } finally {
            setLoadingFinalCount(false);
        }
    };

    const startFinalQuiz = (timeLimit) => {
        // Guard against an empty pool so we never navigate to /quiz/0.
        if (!finalQuizQuestionsCount || finalQuizQuestionsCount < 1) return;
        setShowFinalQuizTime(false);
        navigate(`/quiz/${finalQuizQuestionsCount}`, {
            // A final quiz is a mock exam: never revealed mid-quiz, whatever the
            // launcher's mode preference is set to.
            state: { id, types: selectedFinalType, source: activeSource, timer: timeLimit, isFinalQuiz: true, mode: EXAM }
        });
    };

    const handleFinalTimeSelect = (timeLimit) => {
        setFinalQuizTimeLimit(timeLimit);
        startFinalQuiz(timeLimit);
    };

    const handleFinalTimeConfirm = () => {
        const timeLimit = Math.min(300, Math.max(30, finalQuizTimeLimit || 30));
        setFinalQuizTimeLimit(timeLimit);
        startFinalQuiz(timeLimit);
    };

    const anyModalOpen = showFinalQuizType || showFinalQuizTime || showCongratulations;

    if (bankEmpty) {
        return (
            <div className="ql-page" dir={dir}>
                <div className="ql">
                    <div className="ql-blank">
                        <h1>{t.emptyTitle(trackLabel(myTrack, lang))}</h1>
                        <p>{t.emptyBody(examLabel(myTrack, lang))}</p>
                        <button type="button" className="ql-start" onClick={() => navigate('/quizs')}>
                            {t.emptyBack}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ql-page" dir={dir}>
            <div className={`ql${anyModalOpen ? ' is-dimmed' : ''}`}>
                <header className="ql-head">
                    <h1>{t.title}</h1>
                    <p>{t.subtitleShort}</p>
                </header>

                <div className="ql-layout">
                    <div className="ql-main">
                        {/* Collections, when the track has more than one. The freshest
                            one (when the bank has it) is shown large on top; the rest
                            are compact rows in the recommended study order. */}
                        {sources.length > 1 && (
                            <section className="ql-card" role="group" aria-label={t.sourceGroupLabel}>
                                <h2 className="ql-card-title">
                                    <Icon name="book-open" size={15} /> {t.sourceLegend}
                                </h2>

                                {featuredSource && (
                                    <button
                                        type="button"
                                        className={`ql-feature${selectedSource === featuredSource.key ? ' is-active' : ''}`}
                                        aria-pressed={selectedSource === featuredSource.key}
                                        onClick={() => setSelectedSource(featuredSource.key)}
                                    >
                                        <span className="ql-feature-head">
                                            <span className="ql-feature-name"><bdi>{getSourceLabel(featuredSource.key, lang)}</bdi></span>
                                            <span className="ql-chip-new">{t.newTag}</span>
                                        </span>
                                        <span className="ql-feature-desc">{t.featuredDesc}</span>
                                        <span className="ql-feature-meta">
                                            <span><bdi>{fmt(featuredSource.total)}</bdi> {t.questionsUnit}</span>
                                            <span aria-label={t.sourceDoneLabel(pctOf(featuredSource))}>{t.sourceDone(pctOf(featuredSource))}</span>
                                        </span>
                                        <span className="ql-meter" aria-hidden="true"><span style={{ width: `${pctOf(featuredSource)}%` }} /></span>
                                    </button>
                                )}

                                <div className="ql-sources">
                                    <button
                                        type="button"
                                        className={`ql-src${selectedSource === null ? ' is-active' : ''}`}
                                        aria-pressed={selectedSource === null}
                                        onClick={() => setSelectedSource(null)}
                                    >
                                        <span className="ql-src-radio" aria-hidden="true" />
                                        <span className="ql-src-body">
                                            <span className="ql-src-name">{t.sourceAll}</span>
                                            <span className="ql-src-meta"><bdi>{fmt(totalSourceQuestions)}</bdi> {t.questionsUnit}</span>
                                        </span>
                                    </button>
                                    {restSources.map((s) => (
                                        <button
                                            type="button"
                                            key={s.key}
                                            className={`ql-src${selectedSource === s.key ? ' is-active' : ''}`}
                                            aria-pressed={selectedSource === s.key}
                                            onClick={() => setSelectedSource(s.key)}
                                        >
                                            <span className="ql-src-radio" aria-hidden="true" />
                                            <span className="ql-src-body">
                                                <span className="ql-src-name"><bdi>{getSourceLabel(s.key, lang)}</bdi></span>
                                                <span className="ql-src-meta">
                                                    <bdi>{fmt(s.total)}</bdi> {t.questionsUnit}
                                                    {s.priority ? <> · <span aria-label={t.sourcePriorityLabel(s.priority)}>{t.sourcePriorityBadge(s.priority)}</span></> : null}
                                                </span>
                                            </span>
                                            {/* How much of THIS collection is already used up —
                                                the concrete answer to "will questions repeat". */}
                                            <span className="ql-src-done" aria-label={t.sourceDoneLabel(pctOf(s))}>{t.sourceDone(pctOf(s))}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="ql-hint">{t.sourceRepeatHint}</p>
                            </section>
                        )}

                        {/* Specialties. "All" is the default rather than a second
                            button called "mix all". */}
                        <section className="ql-card" role="group" aria-label={t.typesLegend}>
                            <h2 className="ql-card-title">
                                <Icon name="clipboard" size={15} /> {t.typesLegend}
                            </h2>
                            <div className="ql-pills">
                                <button
                                    type="button"
                                    className={`ql-pill${selectedTypes.length === 0 ? ' is-active' : ''}`}
                                    aria-pressed={selectedTypes.length === 0}
                                    onClick={() => setSelectedTypes([])}
                                >
                                    <span className="ql-pill-name">{t.typesAll}</span>
                                </button>
                                {availableTypes.map((type) => {
                                    const checked = selectedTypes.includes(type);
                                    return (
                                        <label key={type} className={`ql-pill${checked ? ' is-active' : ''}`}>
                                            <input
                                                type="checkbox"
                                                className="ql-chip-input"
                                                checked={checked}
                                                onChange={() => toggleType(type)}
                                            />
                                            <span className="ql-pill-name">{getTypeLabel(type, lang)}</span>
                                            <span className="ql-pill-sub">{t.sourceDone(progressByType[type] || 0)}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>

                        {/* The three settings of this quiz, one card: how it behaves
                            (mode), how long it is (count) and whether it is timed. */}
                        <section className="ql-card ql-settings">
                            {/* Mode. Applies to this quiz and is remembered for the
                                hub's quick start; the mock exam is always exam mode. */}
                            <div className="ql-setting" role="group" aria-label={t.modeGroupLabel}>
                                <h2 className="ql-card-title">
                                    <Icon name="lightbulb" size={15} /> {t.modeLegend}
                                </h2>
                                <div className="ql-pills">
                                    {[
                                        { key: STUDY, name: t.modeStudy },
                                        { key: EXAM, name: t.modeExam },
                                    ].map((mode) => (
                                        <button
                                            type="button"
                                            key={mode.key}
                                            className={`ql-pill${quizMode === mode.key ? ' is-active' : ''}`}
                                            aria-pressed={quizMode === mode.key}
                                            onClick={() => chooseMode(mode.key)}
                                        >
                                            <span className="ql-pill-name">{mode.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="ql-hint">{quizMode === STUDY ? t.modeStudyHint : t.modeExamHint}</p>
                            </div>

                            {/* Question count. Was its own modal with a slider. */}
                            <div className="ql-setting" role="group" aria-label={t.countLegend}>
                                <h2 className="ql-card-title">
                                    <Icon name="pen" size={15} /> {t.countLegend}
                                </h2>
                                <div className="ql-pills">
                                    {COUNT_PRESETS.map((n) => (
                                        <button
                                            type="button"
                                            key={n}
                                            className={`ql-pill${!customCount && numQuestions === n ? ' is-active' : ''}`}
                                            aria-pressed={!customCount && numQuestions === n}
                                            onClick={() => { setCustomCount(false); setNumQuestions(n); }}
                                        >
                                            <span className="ql-pill-name"><bdi>{fmt(n)}</bdi></span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`ql-pill${customCount ? ' is-active' : ''}`}
                                        aria-pressed={customCount}
                                        onClick={() => setCustomCount(true)}
                                    >
                                        <span className="ql-pill-name">{t.customCount}</span>
                                    </button>
                                </div>
                                {customCount && (
                                    <div className="ql-number">
                                        <label htmlFor="ql-count">{t.customQuestionsLabel}</label>
                                        <input
                                            id="ql-count"
                                            type="number"
                                            min="1"
                                            max={MAX_QUESTIONS}
                                            inputMode="numeric"
                                            value={numQuestions}
                                            onChange={(e) => setNumQuestions(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Timer. Was the third modal in the stack. */}
                            <div className="ql-setting" role="group" aria-label={t.timerLegend}>
                                <h2 className="ql-card-title">
                                    <Icon name="clock" size={15} /> {t.timerLegend}
                                </h2>
                                <div className="ql-pills">
                                    <button
                                        type="button"
                                        className={`ql-pill${selectedTimer === null ? ' is-active' : ''}`}
                                        aria-pressed={selectedTimer === null}
                                        onClick={() => setSelectedTimer(null)}
                                    >
                                        <span className="ql-pill-name">{t.noTimer}</span>
                                    </button>
                                    {timerOptions.map((timer) => (
                                        <button
                                            type="button"
                                            key={timer.value}
                                            className={`ql-pill${selectedTimer === timer.value ? ' is-active' : ''}`}
                                            aria-pressed={selectedTimer === timer.value}
                                            onClick={() => setSelectedTimer(timer.value)}
                                        >
                                            <span className="ql-pill-name">{timer.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {selectedTimer === 'custom' && (
                                    <div className="ql-number">
                                        <label htmlFor="ql-minutes">{t.customMinutesLabel}</label>
                                        <input
                                            id="ql-minutes"
                                            type="number"
                                            min="1"
                                            max="180"
                                            inputMode="numeric"
                                            value={customTimerMinutes}
                                            onChange={(e) => setCustomTimerMinutes(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* The quiz this form will start, and the button that starts it.
                        Beside the form on a wide screen (sticky), a bar pinned to the
                        bottom on a phone. */}
                    <aside className="ql-aside">
                        <div className="ql-summary-card">
                            <h2 className="ql-card-title">
                                <Icon name="rocket" size={15} /> {t.yourQuiz}
                            </h2>
                            <dl className="ql-summary-list">
                                {summaryRows.map((row) => (
                                    <div className="ql-summary-row" key={row.label}>
                                        <dt>{row.label}</dt>
                                        <dd><bdi>{row.value}</bdi></dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="ql-summary">{summaryParts.join(' · ')}</p>
                            <button type="button" className="ql-start" onClick={handleStart}>
                                <Icon name="rocket" size={18} />
                                {t.startQuiz}
                            </button>
                        </div>

                        {user && sessionToken && (
                            <button type="button" className="ql-final" onClick={() => setShowFinalQuizType(true)}>
                                <span className="ql-final-icon" aria-hidden="true"><Icon name="target" size={19} /></span>
                                <span className="ql-final-text">
                                    <strong>{t.finalQuiz}</strong>
                                    <span>{t.finalTypeDesc}</span>
                                </span>
                                <span className="ql-final-go" aria-hidden="true">
                                    <Icon name={dir === 'rtl' ? 'chevron-left' : 'chevron-right'} size={18} />
                                </span>
                            </button>
                        )}
                    </aside>
                </div>
            </div>

            {/* Final Quiz Type Selection Modal */}
            {showFinalQuizType && (
                <div className="custom-source-selector-modal" dir={dir}>
                    <div className="custom-modal-content">
                        <h2><Icon name="target" size={20} /> {t.finalTypeTitle}</h2>
                        <p className="final-quiz-description">{t.finalTypeDesc}</p>
                        <div className="custom-source-buttons">
                            {availableTypes.map((type) => (
                                <button key={type} onClick={() => handleFinalTypeSelect(type)} className="custom-source-btn">
                                    {getTypeLabel(type, lang)}
                                </button>
                            ))}
                        </div>
                        <div className="custom-modal-buttons">
                            <button onClick={() => setShowFinalQuizType(false)} className="custom-cancel-btn">{t.cancel}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Quiz Time Selection Modal */}
            {showFinalQuizTime && (
                <div className="custom-timer-selector-modal" dir={dir}>
                    <div className="custom-modal-content">
                        <h2><Icon name="target" size={20} /> {t.finalTimeTitle}</h2>
                        <p className="final-quiz-description">
                            {loadingFinalCount
                                ? t.finalCounting
                                : t.finalAvailable(finalQuizQuestionsCount, getTypeLabel(selectedFinalType, lang))}
                        </p>
                        {!loadingFinalCount && finalQuizQuestionsCount < 1 ? (
                            <>
                                <p className="final-quiz-note">{t.finalNotEnough}</p>
                                <div className="custom-modal-buttons">
                                    <button onClick={() => { setShowFinalQuizTime(false); setShowFinalQuizType(true); }} className="custom-cancel-btn">
                                        {t.finalPickOther}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="final-quiz-note">{t.finalIncludesAll}</p>
                                <div className="timer-options">
                                    <button onClick={() => handleFinalTimeSelect(30)} className="timer-option-btn" disabled={loadingFinalCount}>{t.final30}</button>
                                    <button onClick={() => handleFinalTimeSelect(60)} className="timer-option-btn" disabled={loadingFinalCount}>{t.final60}</button>
                                    <button onClick={() => handleFinalTimeSelect(90)} className="timer-option-btn" disabled={loadingFinalCount}>{t.final90}</button>
                                    <button onClick={() => handleFinalTimeSelect(120)} className="timer-option-btn" disabled={loadingFinalCount}>{t.final120}</button>
                                </div>
                                <div className="custom-timer-input">
                                    <label htmlFor="finalQuizTime">{t.finalCustomLabel}</label>
                                    <div className="timer-input-container">
                                        <input
                                            id="finalQuizTime"
                                            type="number"
                                            min="30"
                                            max="300"
                                            value={finalQuizTimeLimit}
                                            onChange={(e) => setFinalQuizTimeLimit(parseInt(e.target.value) || 30)}
                                            className="custom-timer-number-input"
                                            placeholder={t.finalCustomPlaceholder}
                                        />
                                        <span className="time-unit">{t.minutes}</span>
                                    </div>
                                </div>
                                <div className="custom-modal-buttons">
                                    <button onClick={handleFinalTimeConfirm} className="custom-start-btn" disabled={loadingFinalCount}>
                                        {t.startFinal}
                                    </button>
                                    <button onClick={() => setShowFinalQuizTime(false)} className="custom-cancel-btn">{t.cancel}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Congratulations Popup */}
            <CongratulationsPopup
                isOpen={showCongratulations}
                onClose={handleCloseCongratulations}
                onRestart={handleRestart}
                achievementName={congratulationsData ? t.achievementName(getTypeLabel(congratulationsData.type, lang), getSourceLabel(congratulationsData.source, lang)) : ''}
                achievementDescription={congratulationsData ? t.achievementDesc(getTypeLabel(congratulationsData.type, lang), getSourceLabel(congratulationsData.source, lang)) : ''}
                type={congratulationsData ? getTypeLabel(congratulationsData.type, lang) : ''}
                source={congratulationsData ? getSourceLabel(congratulationsData.source, lang) : ''}
            />
        </div>
    );
};

export default QuizLauncher;
