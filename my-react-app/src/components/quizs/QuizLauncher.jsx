import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../../utils/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';

import CongratulationsPopup from '../common/CongratulationsPopup.jsx';
import Icon from '../common/Icon.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { getSourceLabel } from '../../utils/sourceLabels';
import { specialtyKeys, bankLabel, userTrack, trackLabel, examLabel } from '../../utils/tracks.js';
import { readQuizMode, writeQuizMode, STUDY, EXAM } from '../../utils/quizMode.js';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

// Sentinel meaning "the whole of my track's bank". The backend resolves it to
// all three medical sources, and to no source filter at all for nursing — so
// it is always the right thing to send when no collection is picked.
const WHOLE_BANK = 'MidgardGameBoy';

const quizOptions = [10, 50, 'custom'];

/**
 * The quiz launch flow, extracted from the old QUIZS page. Compared with the
 * original it drops the source-selection modal entirely — the bank is unified —
 * so the flow is simply: size → type → timer (and final quiz: type → time).
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
    // ([{key,total}], already filtered to ones that actually have questions).
    // The nursing bank has two — "Most Repeated" and "Confirmed" — and the
    // picker below only appears when there is genuinely a choice to make.
    const [sources, setSources] = useState(() =>
        Array.isArray(contentStatus?.selectableSources) ? contentStatus.selectableSources : []
    );
    // How much of each specialty this user has already answered, as a 0-100
    // percentage straight from the server ({type: pct}) — shown as a small
    // badge next to each checkbox so the user knows how much is left.
    const [progressByType, setProgressByType] = useState(() => contentStatus?.progressByType || {});
    // null = the whole bank (both collections mixed).
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

    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [numQuestions, setNumQuestions] = useState(10);
    const [showTimerSelector, setShowTimerSelector] = useState(false);
    const [selectedTimer, setSelectedTimer] = useState(null);
    const [customTimerMinutes, setCustomTimerMinutes] = useState(15);
    const [showCustomQuestions, setShowCustomQuestions] = useState(false);
    const [customQuestionsCount, setCustomQuestionsCount] = useState(25);

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

    // ---- Regular quiz flow: size → type → timer ----
    const handleOptionClick = (num) => {
        if (num === 'custom') {
            setShowCustomQuestions(true);
        } else {
            setNumQuestions(num);
            setShowTypeSelector(true);
            if (id) checkCompletionForSource(activeSource);
        }
    };

    const handleQuickStart = () => {
        try {
            track('quiz_quick_start_click', { questions: 10, source: activeSource, types: 'mix' });
        } catch (error) {
            console.debug('Analytics track skipped:', error);
        }
        navigate('/quiz/10', { state: { id, types: 'mix', source: activeSource, timer: null, mode: quizMode } });
    };

    const handleCheckboxChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleStartQuiz = () => {
        if (selectedTypes.length === 0) return;
        setShowTypeSelector(false);
        setShowTimerSelector(true);
    };

    const handleMixAll = () => {
        setSelectedTypes([]);
        setShowTypeSelector(false);
        setShowTimerSelector(true);
    };

    const handleTimerSelect = (timer) => setSelectedTimer(timer);

    const handleTimerConfirm = () => {
        if (selectedTimer === undefined) return;
        const typesStr = selectedTypes.length > 0 ? selectedTypes.join(',') : 'mix';
        const timerMinutes = selectedTimer === 'custom' ? customTimerMinutes : selectedTimer;
        setShowTimerSelector(false);
        navigate(`/quiz/${numQuestions}`, { state: { id, types: typesStr, source: activeSource, timer: timerMinutes, mode: quizMode } });
    };

    const handleCustomQuestionsConfirm = () => {
        const clamped = Math.min(500, Math.max(1, customQuestionsCount || 25));
        setCustomQuestionsCount(clamped);
        setNumQuestions(clamped);
        setShowCustomQuestions(false);
        setShowTypeSelector(true);
        if (id) checkCompletionForSource(activeSource);
    };

    // ---- Final quiz flow: type → time ----
    const handleFinalQuizClick = () => setShowFinalQuizType(true);

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

    const anyModalOpen = showTypeSelector || showTimerSelector || showCustomQuestions ||
        showFinalQuizType || showFinalQuizTime || showCongratulations;

    if (bankEmpty) {
        return (
            <div dir={dir}>
                <div className="quiz-main">
                    <h1>{t.emptyTitle(trackLabel(myTrack, lang))}</h1>
                    <p className="quiz-subtitle">{t.emptyBody(examLabel(myTrack, lang))}</p>
                    <button className="quick-start-btn" onClick={() => navigate('/quizs')}>
                        {t.emptyBack}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir={dir}>
            <div className={`quiz-main${anyModalOpen ? ' is-dimmed' : ''}`}>
                <h1>{t.title}</h1>
                <p className="quiz-subtitle">{t.subtitlePrefix}<bdi>{bankLabel(myTrack, lang)}</bdi>.</p>

                {/* Study vs exam mode. Applies to quick start and to custom
                    quizzes; the final quiz is always exam mode. Reuses the
                    source picker's chip styling so the two rows read as one
                    set of controls. */}
                <div className="bank-source-picker quiz-mode-picker" role="group" aria-label={t.modeGroupLabel}>
                    <span className="bank-source-legend">
                        <Icon name="lightbulb" size={15} /> {t.modeLegend}
                    </span>
                    <div className="bank-source-options">
                        {[
                            { key: STUDY, name: t.modeStudy, hint: t.modeStudyHint },
                            { key: EXAM, name: t.modeExam, hint: t.modeExamHint },
                        ].map((mode) => (
                            <button
                                type="button"
                                key={mode.key}
                                className={`bank-source-chip${quizMode === mode.key ? ' is-active' : ''}`}
                                aria-pressed={quizMode === mode.key}
                                onClick={() => chooseMode(mode.key)}
                            >
                                <span className="bank-source-chip-name">{mode.name}</span>
                                <span className="bank-source-chip-count">{mode.hint}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Collection picker. Only rendered when the track's bank really
                    has more than one collection to choose between, so the
                    medical (single unified bank) launcher is unchanged. The
                    choice applies to everything started from this screen —
                    quick start, custom quizzes and the final quiz. */}
                {sources.length > 1 && (
                    <div className="bank-source-picker" role="group" aria-label={t.sourceGroupLabel}>
                        <span className="bank-source-legend">
                            <Icon name="book-open" size={15} /> {t.sourceLegend}
                        </span>
                        <div className="bank-source-options">
                            <button
                                type="button"
                                className={`bank-source-chip${selectedSource === null ? ' is-active' : ''}`}
                                aria-pressed={selectedSource === null}
                                onClick={() => setSelectedSource(null)}
                            >
                                <span className="bank-source-chip-name">{t.sourceAll}</span>
                                <span className="bank-source-chip-count">
                                    <bdi>{totalSourceQuestions}</bdi> {t.questionsUnit}
                                </span>
                            </button>
                            {sources.map((s) => {
                                const donePct = Math.min(100, Math.max(0, s.completedPct || 0));
                                return (
                                    <button
                                        type="button"
                                        key={s.key}
                                        className={`bank-source-chip${selectedSource === s.key ? ' is-active' : ''}`}
                                        aria-pressed={selectedSource === s.key}
                                        onClick={() => setSelectedSource(s.key)}
                                    >
                                        <span className="bank-source-chip-name">
                                            <bdi>{getSourceLabel(s.key, lang)}</bdi>
                                        </span>
                                        <span className="bank-source-chip-count">
                                            <bdi>{s.total}</bdi> {t.questionsUnit}
                                        </span>
                                        {s.priority && (
                                            <span
                                                className="bank-source-chip-priority"
                                                aria-label={t.sourcePriorityLabel(s.priority)}
                                            >
                                                {t.sourcePriorityBadge(s.priority)}
                                            </span>
                                        )}
                                        {/* How much of THIS source has already been
                                            seen — the concrete answer to "will
                                            questions repeat", which used to be
                                            invisible until someone asked. */}
                                        <span className="bank-source-chip-progress" aria-label={t.sourceDoneLabel(donePct)}>
                                            <span className="bank-source-chip-bar">
                                                <span className="bank-source-chip-bar-fill" style={{ width: `${donePct}%` }} />
                                            </span>
                                            <span className="bank-source-chip-progress-text">{t.sourceDone(donePct)}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="bank-source-hint">{t.sourceRepeatHint}</p>
                    </div>
                )}

                <button className="quick-start-btn" onClick={handleQuickStart}>
                    {t.quickStart}
                </button>

                <div className="options-container">
                    {quizOptions.map((num, i) => (
                        <button
                            key={num}
                            className="quiz-option-btn"
                            style={{ animationDelay: `${0.28 + i * 0.08}s` }}
                            onClick={() => handleOptionClick(num)}
                        >
                            {num === 'custom' ? t.customCount : t.questionsCount(num)}
                        </button>
                    ))}
                    {user && sessionToken && (
                        <button
                            className="quiz-option-btn final-quiz-btn"
                            style={{ animationDelay: `${0.28 + quizOptions.length * 0.08}s` }}
                            onClick={handleFinalQuizClick}
                        >
                            <Icon name="target" size={18} /> {t.finalQuiz}
                        </button>
                    )}
                </div>
            </div>

            {/* Type Selector Modal */}
            {showTypeSelector && (
                <div className="custom-type-selector-modal" dir={dir}>
                    <div className="custom-modal-content">
                        <h2>{t.typeTitle}</h2>
                        <p className="source-info">
                            <Icon name="book-open" size={16} /> {t.bankLabel}{' '}
                            <strong>
                                <bdi>{selectedSource ? getSourceLabel(selectedSource, lang) : bankLabel(myTrack, lang)}</bdi>
                            </strong>
                        </p>
                        <div className="type-chip-group" role="group" aria-label={t.typeTitle}>
                            {availableTypes.map((type) => {
                                const checked = selectedTypes.includes(type);
                                return (
                                    <label key={type} className={`type-chip${checked ? ' is-active' : ''}`}>
                                        <input
                                            type="checkbox"
                                            className="type-chip-input"
                                            checked={checked}
                                            onChange={() => handleCheckboxChange(type)}
                                        />
                                        <span className="type-chip-name">{getTypeLabel(type, lang)}</span>
                                        <span className="type-chip-pct"><bdi>{progressByType[type] || 0}%</bdi></span>
                                    </label>
                                );
                            })}
                        </div>
                        <div className="custom-modal-buttons">
                            <button onClick={handleStartQuiz} disabled={selectedTypes.length === 0} className="custom-start-btn">
                                {t.startQuiz}
                            </button>
                            <button onClick={handleMixAll} className="custom-mix-btn">{t.mixAll}</button>
                            <button onClick={() => setShowTypeSelector(false)} className="custom-cancel-btn">{t.cancel}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Selector Modal */}
            {showTimerSelector && (
                <div className="custom-timer-selector-modal" dir={dir}>
                    <div className="custom-modal-content">
                        <h2>{t.timerTitle}</h2>
                        <p className="timer-info">
                            <Icon name="clock" size={16} /> {t.timerInfo}
                        </p>
                        <div className="timer-options">
                            <button
                                className={`timer-option-btn ${selectedTimer === null ? 'selected' : ''}`}
                                onClick={() => handleTimerSelect(null)}
                            >
                                {t.noTimer}
                            </button>
                            {timerOptions.map((timer) => (
                                <button
                                    key={timer.value}
                                    className={`timer-option-btn ${selectedTimer === timer.value ? 'selected' : ''}`}
                                    onClick={() => handleTimerSelect(timer.value)}
                                >
                                    {timer.label}
                                </button>
                            ))}
                        </div>
                        {selectedTimer === 'custom' && (
                            <div className="custom-timer-input">
                                <label htmlFor="customMinutes">{t.customMinutesLabel}</label>
                                <input
                                    id="customMinutes"
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={customTimerMinutes}
                                    onChange={(e) => setCustomTimerMinutes(parseInt(e.target.value) || 15)}
                                    className="custom-timer-number-input"
                                />
                            </div>
                        )}
                        <div className="custom-modal-buttons">
                            <button onClick={handleTimerConfirm} className="custom-start-btn">{t.startQuiz}</button>
                            <button onClick={() => setShowTimerSelector(false)} className="custom-cancel-btn">{t.backToTypes}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Questions Modal */}
            {showCustomQuestions && (
                <div className="custom-questions-modal" dir={dir}>
                    <div className="custom-modal-content">
                        <h2>{t.customQuestionsTitle}</h2>
                        <p className="questions-info">
                            <Icon name="pen" size={16} /> {t.customQuestionsInfo}
                        </p>
                        <div className="custom-questions-input">
                            <label htmlFor="customQuestions">{t.customQuestionsLabel}</label>
                            <div className="quick-preset-buttons">
                                {[15, 25, 50, 75].map((n) => (
                                    <button key={n} type="button" className="preset-btn" onClick={() => setCustomQuestionsCount(n)}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <div className="input-container">
                                <input
                                    id="customQuestions"
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={customQuestionsCount}
                                    onChange={(e) => setCustomQuestionsCount(parseInt(e.target.value) || 25)}
                                    className="custom-questions-number-input"
                                    placeholder={t.customQuestionsPlaceholder}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                <div className="input-controls">
                                    <button type="button" className="control-btn minus" onClick={() => setCustomQuestionsCount(Math.max(1, customQuestionsCount - 1))}>−</button>
                                    <button type="button" className="control-btn plus" onClick={() => setCustomQuestionsCount(Math.min(500, customQuestionsCount + 1))}>+</button>
                                </div>
                            </div>
                            <div className="range-slider-container">
                                <label htmlFor="questionsRange">{t.orUseSlider}</label>
                                <input
                                    id="questionsRange"
                                    type="range"
                                    min="1"
                                    max="500"
                                    value={customQuestionsCount}
                                    onChange={(e) => setCustomQuestionsCount(parseInt(e.target.value))}
                                    className="questions-range-slider"
                                />
                                <div className="range-labels"><span>1</span><span>250</span><span>500</span></div>
                            </div>
                        </div>
                        <div className="custom-modal-buttons">
                            <button onClick={handleCustomQuestionsConfirm} className="custom-start-btn">{t.continue}</button>
                            <button onClick={() => setShowCustomQuestions(false)} className="custom-cancel-btn">{t.cancel}</button>
                        </div>
                    </div>
                </div>
            )}

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
