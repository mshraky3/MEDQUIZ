import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './QUIZS.css';
import './QuizsHub.css';
import Globals from '../../global.js';

import AchievementBadges from '../common/AchievementBadges.jsx';
import Icon from '../common/Icon.jsx';
import QuizLauncher from './QuizLauncher.jsx';
import { UserContext } from '../../UserContext';
import { getTypeLabel } from '../../utils/typeLabels';
import { specialtiesOf, userTrack, examLabel, bankLabel, trackLabel, normalizeTrack } from '../../utils/tracks.js';

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
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        return axios.get(urlWithUser, { headers: { Authorization: `Bearer ${sessionToken}` } });
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

    const load = React.useCallback(async () => {
        if (!id || !user || !sessionToken) { setState('error'); return; }
        setState('loading');
        const [analysisRes, streakRes, topicRes, contentRes] = await Promise.allSettled([
            protectedGet(`${Globals.URL}/user-analysis/${id}`),
            protectedGet(`${Globals.URL}/user-streaks/${id}`),
            protectedGet(`${Globals.URL}/topic-analysis/user/${id}`),
            protectedGet(`${Globals.URL}/api/track-content-status`)
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
            if (serverTrack && user && normalizeTrack(user.track) !== serverTrack) {
                setUser({ ...user, track: serverTrack }, sessionToken);
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
        if (streakRes.status === 'fulfilled') setStreak(streakRes.value.data.current_streak || 0);
        if (topicRes.status === 'fulfilled' && Array.isArray(topicRes.value.data)) setTopics(topicRes.value.data);
        setState(analysisRes.status === 'fulfilled' ? 'ready' : 'error');
    }, [id, user, setUser, sessionToken]);

    useEffect(() => { load(); }, [load]);

    const startQuiz = (types) => {
        try { track('hub_start_quiz', { types, source: SOURCE }); } catch (e) { /* analytics is best-effort */ }
        navigate('/quiz/10', { state: { id, types, source: SOURCE, timer: null } });
    };

    if (view === 'launcher') {
        return (
            <div className="quiz-selection">
                <QuizLauncher id={id} />
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
        return { key, icon, label: getTypeLabel(key), answered, accuracy, available };
    });
    // Content checks are advisory: until the request lands (or if it fails) we
    // assume content exists rather than flashing an empty state at everyone.
    const bankEmpty = content ? !content.hasQuestions : false;
    const summariesEmpty = content ? !content.hasSummaries : false;
    const attempted = rows.filter((r) => r.answered > 0);
    const weakestKey = attempted.length >= 2
        ? attempted.reduce((a, b) => (a.accuracy <= b.accuracy ? a : b)).key
        : null;

    const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

    /**
     * The three destinations, framed as one loop: understand → practise →
     * measure → back again. They stay equal-weight and always visible; the
     * "journey" is the ordering and the suggested entry point, not a wizard
     * that hides steps behind each other.
     */
    const steps = [
        {
            key: 'summaries', tone: 'sum', icon: 'book-open', kicker: 'افهم',
            title: 'الملخصات',
            desc: 'ملخصات مصوّرة تغطي كل تخصصات مسارك.',
            stat: summariesEmpty
                ? 'قيد الإعداد'
                : SPECIALTIES.map((sp) => getTypeLabel(sp.key)).join(' · '),
            cta: 'تصفّح الملخصات',
            onClick: () => navigate('/summaries')
        },
        {
            key: 'quiz', tone: 'quiz', icon: 'clipboard', kicker: 'ثبّت',
            title: 'الأسئلة',
            desc: `اختبارات تدريبية ونهائية من ${bankLabel(myTrack)}.`,
            stat: bankEmpty
                ? 'قيد الإعداد'
                : (hasHistory ? `${fmt(stats.total_quizzes)} اختبار مكتمل` : 'لم تبدأ بعد'),
            cta: 'ابدأ اختبار',
            onClick: openLauncher
        },
        {
            key: 'analysis', tone: 'ana', icon: 'bar-chart', kicker: 'قِس',
            title: 'تحليل الأداء',
            desc: 'دقتك، وأقوى وأضعف المواضيع لديك، وتقدّمك أسبوعاً بأسبوع.',
            stat: hasHistory ? `${Math.round(stats.avg_accuracy)}% دقة حالياً` : 'يظهر بعد أول اختبار',
            cta: 'افتح التقرير',
            onClick: () => navigate('/analysis', { state: { id } })
        }
    ];

    // Where to point someone next: a new user starts by reading; once there is
    // history, a weak specialty is the highest-value place to practise;
    // otherwise send them to review the numbers.
    const nextStep = bankEmpty && summariesEmpty
        ? null
        : (!hasHistory ? (summariesEmpty ? 'quiz' : 'summaries') : (weakestKey ? 'quiz' : 'analysis'));

    const tiles = [
        { k: 'acc', icon: 'target', value: hasHistory ? `${Math.round(stats.avg_accuracy)}%` : '—', label: 'الدقة' },
        { k: 'quiz', icon: 'clipboard', value: hasHistory ? fmt(stats.total_quizzes) : '—', label: 'اختبار' },
        { k: 'q', icon: 'check-circle', value: hasHistory ? fmt(stats.total_questions_answered) : '—', label: 'سؤال' },
        { k: 'streak', icon: 'flame', value: streak != null && streak > 0 ? fmt(streak) : '—', label: 'يوم متتالٍ' }
    ];

    return (
        <div className="quiz-selection hubx" dir="rtl">
            <header className="hubx-top">
                <div className="hubx-greet">
                    <h1>{firstName ? <>أهلاً <bdi>{firstName}</bdi> 👋</> : 'أهلاً بك 👋'}</h1>
                    <p>جاهز لجلسة اليوم؟ ابدأ فوراً أو اختر تخصصاً تريد تقويته.</p>
                </div>
                <div className="hubx-actions">
                    <button
                        type="button"
                        className="hubx-btn hubx-btn--primary"
                        onClick={() => startQuiz('mix')}
                        disabled={bankEmpty}
                    >
                        <Icon name="rocket" size={19} />
                        <span>ابدأ اختبار سريع</span>
                        <small>{bankEmpty ? 'غير متاح بعد' : '١٠ أسئلة مختلطة'}</small>
                    </button>
                    <button
                        type="button"
                        className="hubx-btn hubx-btn--ghost"
                        onClick={openLauncher}
                        disabled={bankEmpty}
                    >
                        <Icon name="settings" size={17} />
                        <span>خصّص الاختبار</span>
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
                                ? `محتوى مسار ${trackLabel(myTrack)} قيد الإعداد`
                                : bankEmpty
                                    ? `أسئلة مسار ${trackLabel(myTrack)} قيد الإعداد`
                                    : `ملخصات مسار ${trackLabel(myTrack)} قيد الإعداد`}
                        </strong>
                        <span>
                            نعمل على تجهيز المحتوى الخاص بـ{examLabel(myTrack)}.
                            {!bankEmpty && ' الأسئلة متاحة الآن ويمكنك البدء فوراً.'}
                            {!summariesEmpty && ' الملخصات متاحة الآن.'}
                            {bankEmpty && summariesEmpty && ' سنعلمك بالبريد فور جاهزيته.'}
                        </span>
                    </div>
                </section>
            )}

            <nav className="hubx-journey" aria-labelledby="hubx-journey-h">
                <div className="hubx-sec-head">
                    <h2 id="hubx-journey-h">رحلة المذاكرة</h2>
                    <span className="hubx-sec-note">افهم ← ثبّت ← قِس، ثم كرّر</span>
                </div>
                <ol className="hubx-steps">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <li className={`hubx-step hubx-step--${s.tone}${s.key === nextStep ? ' is-next' : ''}`}>
                                <button type="button" className="hubx-step-btn" onClick={s.onClick}>
                                    <span className="hubx-step-top">
                                        <span className="hubx-step-n">{i + 1}</span>
                                        <span className="hubx-step-kicker">{s.kicker}</span>
                                        {s.key === nextStep && <span className="hubx-step-flag">ابدأ من هنا</span>}
                                    </span>
                                    <span className="hubx-step-icon"><Icon name={s.icon} size={24} /></span>
                                    <strong className="hubx-step-title">{s.title}</strong>
                                    <span className="hubx-step-desc">{s.desc}</span>
                                    <span className="hubx-step-stat">{s.stat}</span>
                                    <span className="hubx-step-cta">{s.cta} <Icon name="chevron-left" size={15} /></span>
                                </button>
                            </li>
                            {i < steps.length - 1 && (
                                <li className="hubx-step-arrow" aria-hidden="true"><Icon name="chevron-left" size={20} /></li>
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </nav>

            {/* One performance panel: headline numbers on top, per-specialty
                rings below. These used to be two separate boxes that both
                showed the same story in different shapes. */}
            <section className="hubx-mastery" aria-labelledby="hubx-mastery-h">
                <div className="hubx-sec-head">
                    <h2 id="hubx-mastery-h">أداؤك</h2>
                    {weakestKey && <span className="hubx-sec-note">ابدأ بأضعف تخصص لأكبر أثر</span>}
                </div>

                <div className="hubx-kpis" aria-label="ملخص أدائك">
                    {tiles.map((t) => (
                        <div className={`hubx-kpi${loading ? ' is-loading' : ''}`} key={t.k}>
                            <span className="hubx-kpi-icon"><Icon name={t.icon} size={15} /></span>
                            <span className="hubx-kpi-value"><bdi>{loading ? '' : t.value}</bdi></span>
                            <span className="hubx-kpi-label">{t.label}</span>
                        </div>
                    ))}
                </div>

                {state === 'error' ? (
                    <div className="hubx-inline-error">
                        <p>تعذّر تحميل بياناتك.</p>
                        <button type="button" className="hubx-retry" onClick={load}>
                            <Icon name="refresh" size={15} /> إعادة المحاولة
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
                                        aria-label={started ? `${r.label}: دقة ${r.accuracy} بالمئة من ${r.answered} سؤال` : `${r.label}: لم تبدأ بعد`}>
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
                                        {loading ? <span className="hubx-skel" /> : started ? <><bdi>{fmt(r.answered)}</bdi> سؤال</> : 'لم تبدأ بعد'}
                                    </span>
                                    {isWeak && <span className="hubx-tag">أضعف تخصص</span>}
                                    <button
                                        type="button"
                                        className="hubx-practise"
                                        onClick={() => startQuiz(r.key)}
                                        disabled={!r.available}
                                    >
                                        {!r.available ? 'قريباً' : started ? 'تدرّب' : 'ابدأ'}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!loading && state !== 'error' && !hasHistory && (
                    <p className="hubx-empty">لم تبدأ أي اختبار بعد — أول اختبار يملأ هذه اللوحة ببياناتك.</p>
                )}
            </section>

            {id && <AchievementBadges userId={id} />}

            <button className="suggestions-btn" onClick={() => navigate('/suggestions')}>
                <span className="suggestions-icon"><Icon name="lightbulb" size={18} /></span>
                <span>الاقتراحات</span>
            </button>
        </div>
    );
};

export default QUIZS;
