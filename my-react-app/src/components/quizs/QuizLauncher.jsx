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

// The whole bank is now a single unified source — "Midgard & GameBoy2026". There
// is no source-selection step any more; every quiz is launched against this
// sentinel and the backend resolves it to the full kept allowlist.
const SOURCE = 'MidgardGameBoy';

const availableTypes = [
    'pediatric',
    'obstetrics and gynecology',
    'medicine',
    'surgery'
];

const quizOptions = [10, 50, 'custom'];

const timerOptions = [
    { label: '5 دقائق', value: 5 },
    { label: '10 دقائق', value: 10 },
    { label: '30 دقيقة', value: 30 },
    { label: 'ساعة', value: 60 },
    { label: 'مخصص', value: 'custom' }
];

/**
 * The quiz launch flow, extracted from the old QUIZS page. Compared with the
 * original it drops the source-selection modal entirely — the bank is unified —
 * so the flow is simply: size → type → timer (and final quiz: type → time).
 */
const QuizLauncher = ({ id }) => {
    const { user, setUser, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();

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

    // ---- Regular quiz flow: size → type → timer ----
    const handleOptionClick = (num) => {
        if (num === 'custom') {
            setShowCustomQuestions(true);
        } else {
            setNumQuestions(num);
            setShowTypeSelector(true);
            if (id) checkCompletionForSource(SOURCE);
        }
    };

    const handleQuickStart = () => {
        try {
            track('quiz_quick_start_click', { questions: 10, source: SOURCE, types: 'mix' });
        } catch (error) {
            console.debug('Analytics track skipped:', error);
        }
        navigate('/quiz/10', { state: { id, types: 'mix', source: SOURCE, timer: null } });
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
        navigate(`/quiz/${numQuestions}`, { state: { id, types: typesStr, source: SOURCE, timer: timerMinutes } });
    };

    const handleCustomQuestionsConfirm = () => {
        const clamped = Math.min(500, Math.max(1, customQuestionsCount || 25));
        setCustomQuestionsCount(clamped);
        setNumQuestions(clamped);
        setShowCustomQuestions(false);
        setShowTypeSelector(true);
        if (id) checkCompletionForSource(SOURCE);
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
                `${Globals.URL}/final-quiz/questions-count?questionType=${encodeURIComponent(type)}&source=${encodeURIComponent(SOURCE)}`
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
            state: { id, types: selectedFinalType, source: SOURCE, timer: timeLimit, isFinalQuiz: true }
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
            const achievementName = `متمكن في ${getTypeLabel(type)} من ${getSourceLabel(source)}`;
            const achievementDescription = `أكملت جميع أسئلة ${getTypeLabel(type)} من مصدر ${getSourceLabel(source)}`;
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

    return (
        <div dir="rtl">
            <div className={`quiz-main${anyModalOpen ? ' is-dimmed' : ''}`}>
                <h1>اختر اختبارك</h1>
                <p className="quiz-subtitle">ابدأ سريعاً الآن أو خصّص الاختبار كما تريد — من بنك <bdi>Midgard &amp; GameBoy2026</bdi>.</p>

                <button className="quick-start-btn" onClick={handleQuickStart}>
                    ابدأ سريعاً: 10 أسئلة مختلطة
                </button>

                <div className="options-container">
                    {quizOptions.map((num, i) => (
                        <button
                            key={num}
                            className="quiz-option-btn"
                            style={{ animationDelay: `${0.28 + i * 0.08}s` }}
                            onClick={() => handleOptionClick(num)}
                        >
                            {num === 'custom' ? 'عدد مخصص' : `${num} سؤال`}
                        </button>
                    ))}
                    {user && sessionToken && (
                        <button
                            className="quiz-option-btn final-quiz-btn"
                            style={{ animationDelay: `${0.28 + quizOptions.length * 0.08}s` }}
                            onClick={handleFinalQuizClick}
                        >
                            <Icon name="target" size={18} /> اختبار نهائي
                        </button>
                    )}
                </div>
            </div>

            {/* Type Selector Modal */}
            {showTypeSelector && (
                <div className="custom-type-selector-modal" dir="rtl">
                    <div className="custom-modal-content">
                        <h2>اختر نوع الأسئلة</h2>
                        <p className="source-info">
                            <Icon name="book-open" size={16} /> البنك: <strong><bdi>{getSourceLabel(SOURCE)}</bdi></strong>
                        </p>
                        <div className="custom-checkbox-group">
                            {availableTypes.map((type) => (
                                <label key={type}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleCheckboxChange(type)}
                                    />
                                    {getTypeLabel(type)}
                                </label>
                            ))}
                        </div>
                        <div className="custom-modal-buttons">
                            <button onClick={handleStartQuiz} disabled={selectedTypes.length === 0} className="custom-start-btn">
                                ابدأ الاختبار
                            </button>
                            <button onClick={handleMixAll} className="custom-mix-btn">خلط جميع الأنواع</button>
                            <button onClick={() => setShowTypeSelector(false)} className="custom-cancel-btn">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Selector Modal */}
            {showTimerSelector && (
                <div className="custom-timer-selector-modal" dir="rtl">
                    <div className="custom-modal-content">
                        <h2>ضبط المؤقت</h2>
                        <p className="timer-info">
                            <Icon name="clock" size={16} /> اختر مدة المؤقت أو "بدون مؤقت" لوقت غير محدود
                        </p>
                        <div className="timer-options">
                            <button
                                className={`timer-option-btn ${selectedTimer === null ? 'selected' : ''}`}
                                onClick={() => handleTimerSelect(null)}
                            >
                                بدون مؤقت
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
                                <label htmlFor="customMinutes">مدة مخصصة (دقائق):</label>
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
                            <button onClick={handleTimerConfirm} className="custom-start-btn">ابدأ الاختبار</button>
                            <button onClick={() => setShowTimerSelector(false)} className="custom-cancel-btn">العودة للأنواع</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Questions Modal */}
            {showCustomQuestions && (
                <div className="custom-questions-modal" dir="rtl">
                    <div className="custom-modal-content">
                        <h2>عدد أسئلة مخصص</h2>
                        <p className="questions-info">
                            <Icon name="pen" size={16} /> أدخل عدد الأسئلة المطلوب (1-500)
                        </p>
                        <div className="custom-questions-input">
                            <label htmlFor="customQuestions">عدد الأسئلة:</label>
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
                                    placeholder="Enter number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                <div className="input-controls">
                                    <button type="button" className="control-btn minus" onClick={() => setCustomQuestionsCount(Math.max(1, customQuestionsCount - 1))}>−</button>
                                    <button type="button" className="control-btn plus" onClick={() => setCustomQuestionsCount(Math.min(500, customQuestionsCount + 1))}>+</button>
                                </div>
                            </div>
                            <div className="range-slider-container">
                                <label htmlFor="questionsRange">أو استخدم الشريط:</label>
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
                            <button onClick={handleCustomQuestionsConfirm} className="custom-start-btn">متابعة</button>
                            <button onClick={() => setShowCustomQuestions(false)} className="custom-cancel-btn">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Quiz Type Selection Modal */}
            {showFinalQuizType && (
                <div className="custom-source-selector-modal" dir="rtl">
                    <div className="custom-modal-content">
                        <h2><Icon name="target" size={20} /> اختبار نهائي - اختر النوع</h2>
                        <p className="final-quiz-description">مراجعة شاملة لجميع أسئلة النوع المختار</p>
                        <div className="custom-source-buttons">
                            {availableTypes.map((type) => (
                                <button key={type} onClick={() => handleFinalTypeSelect(type)} className="custom-source-btn">
                                    {getTypeLabel(type)}
                                </button>
                            ))}
                        </div>
                        <div className="custom-modal-buttons">
                            <button onClick={() => setShowFinalQuizType(false)} className="custom-cancel-btn">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Quiz Time Selection Modal */}
            {showFinalQuizTime && (
                <div className="custom-timer-selector-modal" dir="rtl">
                    <div className="custom-modal-content">
                        <h2><Icon name="target" size={20} /> اختبار نهائي - ضبط الوقت</h2>
                        <p className="final-quiz-description">
                            {loadingFinalCount
                                ? 'جارٍ حساب عدد الأسئلة…'
                                : `${finalQuizQuestionsCount} سؤال متاح من ${getTypeLabel(selectedFinalType)}`}
                        </p>
                        {!loadingFinalCount && finalQuizQuestionsCount < 1 ? (
                            <>
                                <p className="final-quiz-note">لا توجد أسئلة كافية لهذا النوع حالياً. جرّب نوعاً آخر.</p>
                                <div className="custom-modal-buttons">
                                    <button onClick={() => { setShowFinalQuizTime(false); setShowFinalQuizType(true); }} className="custom-cancel-btn">
                                        اختيار نوع آخر
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="final-quiz-note">سيشمل جميع الأسئلة، حتى التي أجبت عليها سابقاً.</p>
                                <div className="timer-options">
                                    <button onClick={() => handleFinalTimeSelect(30)} className="timer-option-btn" disabled={loadingFinalCount}>30 دقيقة</button>
                                    <button onClick={() => handleFinalTimeSelect(60)} className="timer-option-btn" disabled={loadingFinalCount}>ساعة</button>
                                    <button onClick={() => handleFinalTimeSelect(90)} className="timer-option-btn" disabled={loadingFinalCount}>ساعة ونص</button>
                                    <button onClick={() => handleFinalTimeSelect(120)} className="timer-option-btn" disabled={loadingFinalCount}>ساعتان</button>
                                </div>
                                <div className="custom-timer-input">
                                    <label htmlFor="finalQuizTime">أو حدد وقت مخصص (30 دقيقة كحد أدنى):</label>
                                    <div className="timer-input-container">
                                        <input
                                            id="finalQuizTime"
                                            type="number"
                                            min="30"
                                            max="300"
                                            value={finalQuizTimeLimit}
                                            onChange={(e) => setFinalQuizTimeLimit(parseInt(e.target.value) || 30)}
                                            className="custom-timer-number-input"
                                            placeholder="Enter minutes"
                                        />
                                        <span className="time-unit">دقيقة</span>
                                    </div>
                                </div>
                                <div className="custom-modal-buttons">
                                    <button onClick={handleFinalTimeConfirm} className="custom-start-btn" disabled={loadingFinalCount}>
                                        ابدأ الاختبار النهائي
                                    </button>
                                    <button onClick={() => setShowFinalQuizTime(false)} className="custom-cancel-btn">إلغاء</button>
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
                achievementName={congratulationsData ? `متمكن في ${getTypeLabel(congratulationsData.type)} من ${getSourceLabel(congratulationsData.source)}` : ''}
                achievementDescription={congratulationsData ? `أكملت جميع أسئلة ${getTypeLabel(congratulationsData.type)} من مصدر ${getSourceLabel(congratulationsData.source)}!` : ''}
                type={congratulationsData?.type || ''}
                source={congratulationsData?.source || ''}
            />
        </div>
    );
};

export default QuizLauncher;
