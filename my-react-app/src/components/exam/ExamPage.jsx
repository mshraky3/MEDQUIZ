import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient.js';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import ThemeToggle from '../../theme/ThemeToggle.jsx';
import RouteSEO from '../common/RouteSEO.jsx';
import { UserContext } from '../../UserContext';
import { useCopy, useLang, LanguageToggle } from '../../i18n';
import examCopy from '../../i18n/copy/exam.js';
import {
    createExam, startPart, skipBreak, goTo, selectAnswer, toggleFlag, addSpent, openReview, closeReview,
    finishPart, reconcile, scoreExam, buildSubmission,
} from './examEngine.js';
import { saveExam, saveExamState, loadExam, clearExam } from './examStorage.js';
import ExamPick from './ExamPick.jsx';
import ExamRules from './ExamRules.jsx';
import ExamRunner from './ExamRunner.jsx';
import ExamBreak from './ExamBreak.jsx';
import ExamResult from './ExamResult.jsx';
import './exam.css';

/** POST with the same retry the practice quiz uses: a flaky network must not lose a finished exam. */
async function postWithRetry(url, body) {
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            return await apiClient.post(url, attempt === 0 ? body : { ...body, retry_attempt: attempt });
        } catch (err) {
            lastErr = err;
            const status = err?.response?.status;
            if (status && status >= 400 && status < 500) throw err;
            if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 800));
        }
    }
    throw lastErr;
}

/**
 * /exam: pick -> rules -> Part 1 -> break -> Part 2 -> review -> result.
 *
 * The exam lives in one object (examEngine.js), mirrored to sessionStorage on
 * every change so a reload resumes it, and `reconcile()` ends any part whose
 * absolute deadline has passed. Everything on screen is a function of that
 * state, so the stage the student sees can never disagree with the clock.
 */
const ExamPage = () => {
    const t = useCopy(examCopy);
    const { dir } = useLang();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const accountId = user?.id;

    const [phase, setPhase] = useState('loading'); // loading | pick | starting | exam | error
    const [config, setConfig] = useState(null);
    const [error, setError] = useState(null);
    const [exam, setExam] = useState(null); // { state, questions }
    const [restored, setRestored] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | failed
    const savingRef = useRef(false);

    // ---- load: resume a stored exam, or fetch the exam templates
    const loadConfig = useCallback(async () => {
        setPhase('loading');
        setError(null);
        try {
            const res = await apiClient.get('/api/exam/config');
            setConfig(res.data);
            setPhase('pick');
        } catch {
            setError(t.errors.config);
            setPhase('error');
        }
    }, [t.errors.config]);

    useEffect(() => {
        const stored = accountId ? loadExam(accountId) : null;
        if (stored) {
            const state = reconcile(stored.state, Date.now());
            setExam({ state, questions: stored.questions });
            setRestored(state.stage === 'part' || state.stage === 'review' || state.stage === 'break');
            if (state.saved) setSaveStatus('saved');
            setPhase('exam');
            return;
        }
        loadConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountId]);

    // ---- mirror to sessionStorage
    useEffect(() => {
        if (exam && accountId) saveExamState(accountId, exam.state);
    }, [exam, accountId]);

    // ---- apply a pure transition; every result is reconciled with the clock
    const act = useCallback((fn) => {
        setExam((prev) => {
            if (!prev) return prev;
            const next = reconcile(fn(prev.state, prev.questions), Date.now());
            return next === prev.state ? prev : { ...prev, state: next };
        });
    }, []);

    // ---- start
    const start = useCallback(async () => {
        setPhase('starting');
        setError(null);
        try {
            const res = await apiClient.post('/api/exam/start');
            const state = createExam(res.data, Date.now());
            const questions = res.data.questions;
            if (accountId) {
                clearExam(accountId);
                saveExam(accountId, state, questions);
            }
            setSaveStatus('idle');
            setRestored(false);
            setExam({ state, questions });
            setPhase('exam');
        } catch (err) {
            const code = err?.response?.data?.code;
            setError(code === 'SUBSCRIPTION_REQUIRED' ? t.errors.subscribe : code === 'NO_QUESTIONS' ? t.errors.noQuestions : t.errors.start);
            setPhase('error');
            if (code === 'SUBSCRIPTION_REQUIRED') loadConfig();
        }
    }, [accountId, loadConfig, t.errors]);

    // ---- leave an exam that has not started, or finish with one
    const resetToPick = useCallback(() => {
        if (accountId) clearExam(accountId);
        setExam(null);
        setRestored(false);
        setSaveStatus('idle');
        loadConfig();
    }, [accountId, loadConfig]);

    // ---- saving the finished exam
    const state = exam?.state;
    const questions = exam?.questions;
    const score = useMemo(
        () => (state && state.stage === 'done' ? scoreExam(state, questions) : null),
        [state, questions]
    );

    const save = useCallback(async () => {
        if (!state || !questions || !score || savingRef.current) return;
        savingRef.current = true;
        setSaveStatus('saving');
        try {
            const body = buildSubmission(state, questions, score, { userId: user?.id });
            const res = await postWithRetry('/final-quiz/submit', body);
            const sessionId = res.data.sessionId;
            act((s) => ({ ...s, saved: { sessionId } }));
            setSaveStatus('saved');
        } catch {
            setSaveStatus('failed');
        } finally {
            savingRef.current = false;
        }
    }, [state, questions, score, user?.id, act]);

    useEffect(() => {
        if (state?.stage === 'done' && !state.saved && saveStatus === 'idle') save();
    }, [state?.stage, state?.saved, saveStatus, save]);

    // ---- screens
    let body;
    if (phase === 'loading' || phase === 'starting') {
        body = <div className="exm-center"><Spinner size="lg" label={t.loading} /></div>;
    } else if (phase === 'error') {
        body = (
            <div className="exm-center">
                <div className="exm-card exm-card-narrow" role="alert">
                    <p className="exm-error-text">{error}</p>
                    <div className="exm-actions">
                        <button type="button" className="exm-btn exm-btn-primary" onClick={loadConfig}>{t.retry}</button>
                        <button type="button" className="exm-btn" onClick={() => navigate('/quizs?view=custom')}>{t.pick.backToQuizzes}</button>
                    </div>
                </div>
            </div>
        );
    } else if (phase === 'pick') {
        body = <ExamPick config={config} onStart={start} />;
    } else if (exam) {
        const s = exam.state;
        if (s.stage === 'rules') {
            body = <ExamRules state={s} onBegin={() => act((x) => startPart(x, Date.now()))} onCancel={resetToPick} />;
        } else if (s.stage === 'part' || s.stage === 'review') {
            // The runner is a full-screen overlay (above the app bar), so it renders its own chrome.
            return (
                <ExamRunner
                    state={s}
                    questions={exam.questions}
                    restored={restored}
                    onDismissRestored={() => setRestored(false)}
                    onSelect={(index, option) => act((x, qs) => selectAnswer(x, qs, index, option))}
                    onFlag={(index) => act((x, qs) => toggleFlag(x, qs, index))}
                    onGo={(index) => act((x) => goTo(x, index))}
                    onSpent={(index, seconds) => act((x, qs) => addSpent(x, qs, index, seconds))}
                    onOpenReview={() => act((x) => openReview(x))}
                    onCloseReview={() => act((x) => closeReview(x))}
                    onFinishPart={() => act((x) => finishPart(x, Date.now(), 'user'))}
                    onExpire={() => act((x) => x)}
                />
            );
        } else if (s.stage === 'break') {
            body = (
                <ExamBreak
                    state={s}
                    onStart={() => act((x) => startPart(x, Date.now()))}
                    onSkip={() => act((x) => skipBreak(x, Date.now()))}
                />
            );
        } else {
            body = (
                <ExamResult
                    state={s}
                    score={score}
                    saveStatus={saveStatus}
                    onRetrySave={() => { setSaveStatus('idle'); }}
                    onNewExam={resetToPick}
                />
            );
        }
    }

    return (
        <div className="exm exm-page" dir={dir}>
            <RouteSEO />
            <header className="exm-top">
                <Link to="/quizs" className="exm-brand" aria-label={t.pick.backToQuizzes}>
                    <Icon name="target" size={18} />
                    <span className="exm-brand-name">SQB</span>
                    <span className="exm-brand-sep" aria-hidden="true" />
                    <span className="exm-brand-sub">{t.title}</span>
                </Link>
                <div className="exm-top-tools" role="group" aria-label={t.langTheme}>
                    <ThemeToggle className="exm-theme-toggle" />
                    <LanguageToggle className="exm-lang-toggle" />
                </div>
            </header>
            <main className="exm-content">{body}</main>
        </div>
    );
};

export default ExamPage;
