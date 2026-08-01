import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';
import Globals from '../../global.js';

import CongratulationsPopup from '../common/CongratulationsPopup.jsx';
import Icon from '../common/Icon.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { getSourceLabel } from '../../utils/sourceLabels';
import { specialtyKeys, bankLabel, userTrack, trackLabel, examLabel } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

// Sentinel meaning "the whole of my track's bank". The backend resolves it to
// the medical kept-source allowlist, and to no source filter at all for other
// tracks — so it is always the right thing to send when no collection is picked.
const WHOLE_BANK = 'MidgardGameBoy';

const quizOptions = [10, 50, 'custom'];

/**
 * The quiz launch flow, extracted from the old QUIZS page. Compared with the
 * original it drops the source-selection modal entirely — the bank is unified —
 * so the flow is simply: size → type → timer (and final quiz: type → time).
 */
const QuizLauncher = ({ id }) => {
    const { user, setUser, sessionToken } = useContext(UserContext);
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
    const [bankEmpty, setBankEmpty] = useState(false);

    // The collections this track can be narrowed to, straight from the server
    // ([{key,total}], already filtered to ones that actually have questions).
    // The nursing bank has two — "Most Repeated" and "Confirmed" — and the
    // picker below only appears when there is genuinely a choice to make.
    const [sources, setSources] = useState([]);
    // null = the whole bank (both collections mixed).
    const [selectedSource, setSelectedSource] = useState(null);
    const activeSource = selectedSource || WHOLE_BANK;
    const totalSourceQuestions = React.useMemo(
        () => sources.reduce((sum, s) => sum + (s.total || 0), 0),
        [sources]
    );

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

    // ---- Protected request helpers (mirror the app's auth pattern) ----
    const protectedGet = async (url, config = {}) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        try {
            return await axios.get(urlWithUser, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setUser(null, null);
                localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
                window.location.href = '/login?session=expired';
                return;
            }
            throw err;
        }
    };

    const protectedPost = async (url, data, config = {}) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        try {
            return await axios.post(urlWithUser, data, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setUser(null, null);
                localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
                window.location.href = '/login?session=expired';
                return;
            }
            throw err;
        }
    };

    useEffect(() => {
        let alive = true;
        if (!user || !sessionToken) return undefined;
        protectedGet(`${Globals.URL}/api/track-content-status`)
            .then((res) => {
                if (!alive || !res) return;
                setBankEmpty(!res.data.hasQuestions);
                setSources(Array.isArray(res.data.selectableSources) ? res.data.selectableSources : []);
            })
            .catch(() => { /* advisory only — never block the launcher on this */ });
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username, sessionToken]);

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
        navigate('/quiz/10', { state: { id, types: 'mix', source: activeSource, timer: null } });
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
        navigate(`/quiz/${numQuestions}`, { state: { id, types: typesStr, source: activeSource, timer: timerMinutes } });
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
            const response = await protectedGet(
                `${Globals.URL}/final-quiz/questions-count?questionType=${encodeURIComponent(type)}&source=${encodeURIComponent(activeSource)}`
            );
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
            state: { id, types: selectedFinalType, source: activeSource, timer: timeLimit, isFinalQuiz: true }
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
            const response = await protectedGet(`${Globals.URL}/api/check-completion/${id}?type=${encodeURIComponent(type)}&source=${encodeURIComponent(source)}`);
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
            await protectedPost(`${Globals.URL}/api/award-achievement`, {
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
            await protectedPost(`${Globals.URL}/api/reset-progress`, {
                userId: id,
                type: congratulationsData.type,
                source: congratulationsData.source
            });
            setShowCongratulations(false);
            setCongratulationsData(null);
            window.location.reload();
        } catch (error) {
            console.error('Error resetting progress:', error);
        }
    };

    const handleCloseCongratulations = () => {
        setShowCongratulations(false);
        setCongratulationsData(null);
    };

    // Render the custom checkbox visual state for the type selector.
    useEffect(() => {
        if (!showTypeSelector) return;
        const listeners = [];
        const labels = document.querySelectorAll('.custom-checkbox-group label');
        labels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (!checkbox) return;
            let customBox = label.querySelector('.checkbox-custom');
            if (!customBox) {
                customBox = document.createElement('span');
                customBox.classList.add('checkbox-custom');
                label.insertBefore(customBox, checkbox);
            }
            if (checkbox.checked) customBox.classList.add('checked');
            else customBox.classList.remove('checked');
            const handler = () => {
                if (checkbox.checked) customBox.classList.add('checked');
                else customBox.classList.remove('checked');
            };
            checkbox.addEventListener('change', handler);
            listeners.push({ checkbox, handler });
        });
        return () => listeners.forEach(({ checkbox, handler }) => checkbox.removeEventListener('change', handler));
    }, [showTypeSelector, selectedTypes]);

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
                            {sources.map((s) => (
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
                                </button>
                            ))}
                        </div>
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
                        <div className="custom-checkbox-group">
                            {availableTypes.map((type) => (
                                <label key={type}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleCheckboxChange(type)}
                                    />
                                    {getTypeLabel(type, lang)}
                                </label>
                            ))}
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
