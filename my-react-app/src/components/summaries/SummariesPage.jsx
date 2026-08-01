import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findSubtopic } from './content/index.js';
import { loadPath, EMPTY_PATH_SHAPE } from './pathMeta.js';
import QuestionCard from './QuestionCard.jsx';
import PathCheckpoint from './PathCheckpoint.jsx';
import SummaryAnnotation from './SummaryAnnotation.jsx';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';
import { userTrack, trackLabel, examLabel } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import summariesCopy from '../../i18n/copy/summaries.js';
import Globals from '../../global.js';
import './Summaries.css';

/**
 * Guided summaries learning path.
 *
 * Language: the page CHROME (headings, stats, progress, buttons, search) is
 * Arabic/RTL to match the rest of the site; the study MATERIAL — step titles,
 * milestone names, summaries and questions — stays English, since that is the
 * language the content is authored and examined in. Elements that render
 * authored content carry dir="ltr" so they read correctly inside Arabic text.
 *
 *  The path — ordered milestones (specialties) made of numbered steps
 *             (sub-topics), each with a checkpoint at the end. Every step shows
 *             its state (done / current / upcoming) and a one-line reason to
 *             read it. Nothing is ever locked: "upcoming" is guidance about
 *             order, not a gate — any step can be opened at any time.
 *  The study modal — a FULL-SCREEN focused view (summary + interactive
 *             questions) with drawing tools (pen / highlighter / eraser).
 *
 * Progress and the resume point live in localStorage per user, so returning
 * students land on "continue where you left off".
 *
 * Deep links (/summaries/:slug) open the matching milestone and, when the slug
 * is a sub-topic, its study modal directly.
 */
// `labelKey` indexes into the summaries copy so the tool names follow the UI
// language; the ids are internal and never translated.
const TOOLS = [
    { id: 'move', icon: 'cursor', labelKey: 'move' },
    { id: 'pen', icon: 'pen', labelKey: 'pen' },
    { id: 'highlighter', icon: 'highlighter', labelKey: 'highlighter' },
    { id: 'eraser', icon: 'eraser', labelKey: 'eraser' },
];
const COLORS = ['#2563eb', '#ef4444', '#16a34a', '#f59e0b', '#0f172a'];

const EMPTY_PATH = { lastStepId: null, lastAt: 0, checkpoints: {} };

const cx = (...parts) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Each section/subtopic carries an Arabic `title` + English `title_en`. When the
// title is already English (e.g. OB/GYN), keep it as the heading and use title_en
// as a descriptive subtitle; otherwise show title_en as the (single) English name.
const enLabel = (item) => {
    const hasLatin = /[A-Za-z]/.test(item?.title || '');
    return {
        primary: hasLatin ? item.title : (item.title_en || item.title),
        secondary: hasLatin ? item.title_en : null,
    };
};

const SummariesPage = () => {
    const { slug } = useParams();
    const { user, sessionToken } = useContext(UserContext);
    const t = useCopy(summariesCopy);
    const { lang, dir } = useLang();
    // "Forward along the path" is leftwards in Arabic, rightwards in English.
    const forwardChevron = dir === 'rtl' ? 'chevron-left' : 'chevron-right';

    // The guided path for this student's own track. `guide` is deliberately not
    // called `path` — that name is already taken by the stored resume point
    // below.
    //
    // The catalog is ~1.2 MB of authored prose split per track, so it arrives as
    // its own chunk rather than inside this one. Until it lands we hold the
    // empty-but-fully-shaped path, which every derived value below tolerates.
    // loadPath memoises per track, so a revisit resolves without a round-trip.
    const myTrack = userTrack(user);
    const [guide, setGuide] = useState(EMPTY_PATH_SHAPE);
    const [guideState, setGuideState] = useState('loading'); // loading | ready | error

    useEffect(() => {
        let alive = true;
        setGuideState('loading');
        loadPath(myTrack)
            .then((p) => { if (alive) { setGuide(p); setGuideState('ready'); } })
            .catch(() => { if (alive) setGuideState('error'); });
        return () => { alive = false; };
    }, [myTrack]);

    const {
        milestones: MILESTONES,
        steps: STEPS,
        stepById: STEP_BY_ID,
        totalSteps: TOTAL_STEPS,
        totalQuestions: TOTAL_QUESTIONS,
        ticks: TRACK_TICKS,
    } = guide;
    // A track whose summaries have not been authored yet. Only meaningful once
    // the catalog has actually loaded — before that, zero steps just means
    // "not here yet".
    const noContent = guideState === 'ready' && TOTAL_STEPS === 0;
    const [query, setQuery] = useState('');        // step search filter
    const [openSub, setOpenSub] = useState(null); // { section, subtopic }
    const [tab, setTab] = useState('summary');     // 'summary' | 'questions'
    const [tool, setTool] = useState('move');
    const [color, setColor] = useState(COLORS[0]);
    const [isFs, setIsFs] = useState(false);
    // Study (annotation) toolbar starts collapsed so it never obstructs reading;
    // the user expands it only when they want to draw/highlight.
    const [toolsOpen, setToolsOpen] = useState(false);

    // ---- path state -------------------------------------------------------
    // `done` is the long-standing per-topic completion map ({ [subtopicId]: true }).
    // `path` adds the resume point and the passed checkpoints. Both persist per
    // user in localStorage so the path picks up where the student left it.
    const who = user?.username || user?.email || 'guest';
    const progressKey = `summaries.progress.${who}`;
    const pathKey = `summaries.path.${who}`;
    const [done, setDone] = useState({});
    const [path, setPath] = useState(EMPTY_PATH);
    const [openMs, setOpenMs] = useState(() => new Set([MILESTONES[0]?.id]));
    const [celebrate, setCelebrate] = useState(null); // step id that just got ticked
    const [scrollTo, setScrollTo] = useState(null);   // dom id to bring into view
    const celebrateTimer = useRef(null);

    // Load stored progress, then open the milestone the student is currently in.
    useEffect(() => {
        let storedDone = {};
        try {
            const raw = safeGetItem(progressKey);
            storedDone = raw ? JSON.parse(raw) : {};
        } catch (_) {
            storedDone = {};
        }
        let storedPath = EMPTY_PATH;
        try {
            const raw = safeGetItem(pathKey);
            if (raw) storedPath = { ...EMPTY_PATH, ...JSON.parse(raw) };
        } catch (_) {
            storedPath = EMPTY_PATH;
        }
        setDone(storedDone);
        setPath(storedPath);

        const last = storedPath.lastStepId ? STEP_BY_ID[storedPath.lastStepId] : null;
        const focus = (last && !storedDone[last.id]) ? last : STEPS.find((s) => !storedDone[s.id]);
        setOpenMs(new Set([(focus || STEPS[0])?.milestoneId]));
        // myTrack, not STEPS/STEP_BY_ID: those are derived from it and are
        // stable per track, so this is the dependency that actually changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressKey, pathKey, myTrack]);

    useEffect(() => () => clearTimeout(celebrateTimer.current), []);

    const savePath = (updater) => setPath((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        safeSetItem(pathKey, JSON.stringify(next));
        return next;
    });

    const isDone = (subId) => !!done[subId];
    const toggleDone = (subId) => {
        const marking = !done[subId];
        setDone((prev) => {
            const next = { ...prev };
            if (next[subId]) delete next[subId];
            else next[subId] = true;
            safeSetItem(progressKey, JSON.stringify(next));
            return next;
        });
        // brief celebration on the path card so completing a step feels like progress
        if (marking) {
            clearTimeout(celebrateTimer.current);
            setCelebrate(subId);
            celebrateTimer.current = setTimeout(() => setCelebrate(null), 1500);
        }
    };

    // ---- derived path position -------------------------------------------
    const doneTotal = STEPS.reduce((n, s) => n + (done[s.id] ? 1 : 0), 0);
    const pct = TOTAL_STEPS ? Math.round((doneTotal / TOTAL_STEPS) * 100) : 0;
    const currentIdx = STEPS.findIndex((s) => !done[s.id]);
    const finished = currentIdx === -1;
    const currentStep = finished ? null : STEPS[currentIdx];
    const position = finished ? TOTAL_STEPS : currentIdx + 1;

    const lastStep = path.lastStepId ? STEP_BY_ID[path.lastStepId] : null;
    const resuming = !!(lastStep && !done[lastStep.id]);
    const resumeStep = resuming ? lastStep : currentStep;
    const freshStart = !resuming && doneTotal === 0;

    const stepState = (step) => {
        if (done[step.id]) return 'done';
        if (currentStep && step.id === currentStep.id) return 'current';
        return 'upcoming';
    };

    const msDoneCount = (m) => m.steps.reduce((n, s) => n + (done[s.id] ? 1 : 0), 0);

    // ---- step search ------------------------------------------------------
    // Matches a step on its title, the topics it covers, or its milestone name.
    // Results render as a flat list so a searched topic is one click away.
    const q = query.trim().toLowerCase();
    const searching = q.length > 0;
    const results = searching
        ? STEPS.filter((s) => [s.title, s.covers, s.section.title, s.section.title_en]
            .some((v) => (v || '').toLowerCase().includes(q)))
        : [];

    const panelRef = useRef(null);
    const bodyRef = useRef(null);
    const annotationRef = useRef(null);

    const openSubtopic = (section, subtopic) => {
        setOpenSub({ section, subtopic });
        setTab('summary');
        setTool('move');
        setToolsOpen(false);
        // remember the resume point for the next visit
        savePath((p) => ({ ...p, lastStepId: subtopic.id, lastAt: Date.now() }));
    };
    const openStep = (step) => openSubtopic(step.section, step.subtopic);

    const toggleMilestone = (id) => setOpenMs((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });

    // Expand the milestone that holds a target and bring it into view. The scroll
    // waits out the expand transition so it lands on the settled position.
    const revealStep = (step) => {
        setOpenMs((prev) => new Set(prev).add(step.milestoneId));
        setScrollTo(`step-${step.id}`);
    };

    useEffect(() => {
        if (!scrollTo) return undefined;
        const id = scrollTo;
        setScrollTo(null);
        const t = setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
                behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                block: 'center',
            });
        }, 380);
        return () => clearTimeout(t);
    }, [scrollTo]);

    const passCheckpoint = (milestone, next) => {
        savePath((p) => ({ ...p, checkpoints: { ...p.checkpoints, [milestone.id]: true } }));
        if (next) {
            setOpenMs((prev) => new Set(prev).add(next.id));
            setScrollTo(`ms-${next.id}`);
        }
    };
    const redoCheckpoint = (milestone) => savePath((p) => {
        const checkpoints = { ...p.checkpoints };
        delete checkpoints[milestone.id];
        return { ...p, checkpoints };
    });

    // Collapsing the toolbar also returns to browse mode so the page scrolls/clicks.
    const closeTools = () => { setToolsOpen(false); setTool('move'); };
    const closePanel = () => {
        if (document.fullscreenElement) document.exitFullscreen?.();
        setOpenSub(null);
    };
    // Switching tab resets to the browse tool so questions are clickable by default.
    const changeTab = (nextTab) => { setTab(nextTab); setTool('move'); };

    // Deep link → open the right milestone + sub-topic modal. Waits on the same
    // cached catalog promise as the path above, so it resolves as soon as the
    // track's chunk lands rather than fetching it a second time.
    useEffect(() => {
        if (!slug) return undefined;
        let alive = true;
        findSubtopic(slug, myTrack)
            .then((hit) => {
                if (!alive || !hit) return;
                setOpenMs((prev) => new Set(prev).add(hit.section.id));
                if (hit.subtopic) openSubtopic(hit.section, hit.subtopic);
            })
            .catch(() => { /* a bad slug is not an error worth surfacing */ });
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, myTrack]);

    // Esc closes the modal; lock background scroll while it's open.
    useEffect(() => {
        if (!openSub) return;
        const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [openSub]);

    // Track native fullscreen state.
    useEffect(() => {
        const onChange = () => setIsFs(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    // The summaries are table-dense; on narrow screens wide tables scroll
    // horizontally. Wrap each in a scroll container (with a non-scrolling outer
    // anchor for the edge shadow) and toggle `.can-scroll` while more is off-screen,
    // so the horizontal scroll is discoverable. Re-runs when the summary re-injects.
    useEffect(() => {
        if (!openSub || tab !== 'summary') return undefined;
        const root = bodyRef.current;
        if (!root) return undefined;
        const cleanups = [];
        root.querySelectorAll('.sub-summary table').forEach((table) => {
            if (table.closest('.table-scroll')) return;
            const outer = document.createElement('div');
            outer.className = 'table-scroll';
            const inner = document.createElement('div');
            inner.className = 'table-scroll-inner';
            table.parentNode.insertBefore(outer, table);
            inner.appendChild(table);
            outer.appendChild(inner);
            const update = () => {
                const more = inner.scrollWidth - inner.clientWidth - inner.scrollLeft > 1;
                outer.classList.toggle('can-scroll', more);
            };
            update();
            inner.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update);
            cleanups.push(() => {
                inner.removeEventListener('scroll', update);
                window.removeEventListener('resize', update);
            });
        });
        return () => cleanups.forEach((fn) => fn());
    }, [openSub, tab]);

    // Gated raster figures are embedded as <img data-figure-key="name.webp"> with
    // no src. A plain src can't send the Authorization header, so fetch each from
    // the gated endpoint as a blob and swap in an object URL; revoke on cleanup so
    // switching topics doesn't leak memory.
    useEffect(() => {
        if (!openSub || tab !== 'summary') return undefined;
        const root = bodyRef.current;
        if (!root || !user || !sessionToken) return undefined;
        const imgs = root.querySelectorAll('img[data-figure-key]:not([data-figure-loaded])');
        if (!imgs.length) return undefined;
        const urls = [];
        let cancelled = false;
        imgs.forEach((img) => {
            const key = img.getAttribute('data-figure-key');
            if (!key) return;
            img.setAttribute('data-figure-loaded', '1');
            img.classList.add('deck-img-loading');
            fetch(
                `${Globals.URL}/api/summaries/figure/${encodeURIComponent(key)}?username=${encodeURIComponent(user.username)}`,
                { headers: { Authorization: `Bearer ${sessionToken}` } }
            )
                .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
                .then((blob) => {
                    if (cancelled) return;
                    const url = URL.createObjectURL(blob);
                    urls.push(url);
                    img.src = url;
                    img.classList.remove('deck-img-loading');
                })
                .catch(() => {
                    if (cancelled) return;
                    img.classList.remove('deck-img-loading');
                    img.classList.add('deck-img-error');
                });
        });
        return () => {
            cancelled = true;
            urls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [openSub, tab, user, sessionToken]);

    const toggleFs = () => {
        if (!document.fullscreenElement) panelRef.current?.requestFullscreen?.();
        else document.exitFullscreen?.();
    };

    const pickColor = (c) => {
        setColor(c);
        if (tool === 'move' || tool === 'eraser') setTool('pen');
    };

    const questions = openSub?.subtopic.questions || [];

    /* ------------------------------------------------------------------ */
    /* One step on the path                                                */
    /* ------------------------------------------------------------------ */
    const renderStep = (step) => {
        const state = stepState(step);
        const isResumePoint = resuming && step.id === lastStep.id;
        return (
            <li
                key={step.id}
                id={`step-${step.id}`}
                className={cx(
                    'path-row path-step',
                    `is-${state}`,
                    isResumePoint && 'is-resume',
                    celebrate === step.id && 'is-celebrating',
                )}
            >
                <div className="path-rail">
                    <span className="path-node step-node" aria-hidden="true">
                        {state === 'done' ? <Icon name="check" size={14} /> : step.no}
                    </span>
                </div>

                <div className="step-card">
                    <div className="step-main">
                        <div className="step-tags">
                            <span className="step-no">{t.stepNo(step.no)}</span>
                            {state === 'done' && (
                                <span className="step-state is-done"><Icon name="check" size={12} /> {t.stateDone}</span>
                            )}
                            {state === 'current' && (
                                <span className="step-state is-current"><Icon name="zap" size={12} /> {t.stateCurrent}</span>
                            )}
                            {state === 'upcoming' && (
                                <span className="step-state is-upcoming">{t.stateUpcoming}</span>
                            )}
                            {isResumePoint && (
                                <span className="step-state is-resume"><Icon name="clock" size={12} /> {t.stateResume}</span>
                            )}
                        </div>

                        {/* Title, "why" and "covers" are authored study material —
                            English in both languages, so they carry dir="ltr". */}
                        <h4 className="step-title" dir="ltr">{step.title}</h4>
                        <p className="step-why" dir="ltr">{step.why}</p>
                        {step.covers && (
                            <p className="step-covers">
                                <span className="step-covers-label">{t.willLearn}</span> <span dir="ltr">{step.covers}</span>
                            </p>
                        )}

                        <div className="step-meta">
                            {step.questionCount > 0 && (
                                <span><Icon name="target" size={13} /> {step.questionCount} {t.practiceQuestions}</span>
                            )}
                        </div>
                    </div>

                    <div className="step-actions">
                        <button type="button" className="step-cta" onClick={() => openStep(step)}>
                            {state === 'done' ? t.ctaReview : state === 'current' ? t.ctaContinue : t.ctaOpen}
                            <Icon name={forwardChevron} size={16} />
                        </button>
                        <button
                            type="button"
                            className={`step-tick ${state === 'done' ? 'on' : ''}`}
                            onClick={() => toggleDone(step.id)}
                            aria-pressed={state === 'done'}
                            title={state === 'done' ? t.markedTitle : t.markTitle}
                        >
                            <Icon name={state === 'done' ? 'check' : 'circle'} size={13} />
                            {state === 'done' ? t.marked : t.markDone}
                        </button>
                    </div>
                </div>
            </li>
        );
    };

    // The catalog chunk for this track is still in flight.
    if (guideState === 'loading') {
        return (
            <div className="summaries-hub" dir={dir}>
                <Spinner fullScreen label={t.loading} />
            </div>
        );
    }

    // The chunk failed to load (offline, or a stale asset hash after a deploy).
    if (guideState === 'error') {
        return (
            <div className="summaries-hub" dir={dir}>
                <div className="hub-comingsoon">
                    <span className="hub-comingsoon-icon" aria-hidden="true"><Icon name="alert-triangle" size={34} /></span>
                    <h1>{t.errorTitle}</h1>
                    <p>{t.errorBody}</p>
                    <button type="button" className="hub-search-clear" onClick={() => window.location.reload()}>
                        {t.retry}
                    </button>
                </div>
            </div>
        );
    }

    // A track with no authored summaries gets an honest placeholder instead of
    // a study path with zero steps in it. Rendered before any of the path UI so
    // none of the progress/resume machinery has to cope with an empty set.
    if (noContent) {
        return (
            <div className="summaries-hub" dir={dir}>
                <div className="hub-comingsoon">
                    <span className="hub-comingsoon-icon" aria-hidden="true"><Icon name="hourglass" size={34} /></span>
                    <h1>{t.comingSoonTitle(trackLabel(myTrack, lang))}</h1>
                    <p>{t.comingSoonBody(examLabel(myTrack, lang))}</p>
                    <p className="hub-comingsoon-note">{t.comingSoonNote}</p>
                </div>
            </div>
        );
    }

    return (
        /* The page chrome follows the site language. The study material itself
           is English-only, so every element that renders authored content
           carries dir="ltr" explicitly. */
        <div className="summaries-hub" dir={dir}>
            {/* ---------------- header: what this path is, and where you are ------ */}
            <header className="hub-head">
                <span className="hub-eyebrow"><Icon name="rocket" size={14} /> {t.eyebrow}</span>
                <h1>{t.title}</h1>
                <div className="hub-facts">
                    <span className="hub-fact"><Icon name="flag" size={15} /><b>{MILESTONES.length}</b> {t.factMilestones}</span>
                    <span className="hub-fact"><Icon name="book-open" size={15} /><b>{TOTAL_STEPS}</b> {t.factSteps}</span>
                    <span className="hub-fact"><Icon name="target" size={15} /><b>{TOTAL_QUESTIONS}</b> {t.factQuestions}</span>
                </div>

                {/* position on the path */}
                <div className="hub-track">
                    <div className="hub-track-top">
                        <span className="hub-track-pos">
                            {finished
                                ? t.pathComplete
                                : <>{t.stepXofYBefore} <b>{position}</b> {t.stepXofYAfter(TOTAL_STEPS)}</>}
                        </span>
                        <span className="hub-track-sep" aria-hidden="true">·</span>
                        <span className="hub-track-pct"><b>{pct}%</b> {t.pctComplete}</span>
                        <span className="hub-track-done"><Icon name="check" size={12} /> {doneTotal} {t.stepsDone}</span>
                    </div>
                    <div
                        className="hub-track-bar"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={t.progressAria}
                    >
                        <div className="hub-track-fill" style={{ width: `${pct}%` }} />
                        {TRACK_TICKS.map((tick) => (
                            <span key={tick.id} className="hub-track-tick" style={{ insetInlineStart: `${tick.pos}%` }} />
                        ))}
                    </div>
                    <div className="hub-track-legend">
                        {MILESTONES.map((m) => {
                            const nDone = msDoneCount(m);
                            return (
                                <button
                                    type="button"
                                    key={m.id}
                                    className={`hub-leg ${nDone === m.steps.length ? 'is-complete' : ''}`}
                                    style={{ '--accent': m.accent }}
                                    onClick={() => {
                                        setOpenMs((prev) => new Set(prev).add(m.id));
                                        setScrollTo(`ms-${m.id}`);
                                    }}
                                >
                                    <i aria-hidden="true" /><span dir="ltr">{m.title}</span> <b>{nDone}/{m.steps.length}</b>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* start / continue */}
                {finished ? (
                    <div className="hub-resume is-finished">
                        <span className="hub-resume-node"><Icon name="trophy" size={22} /></span>
                        <div className="hub-resume-text">
                            <span className="hub-resume-kicker">{t.pathComplete}</span>
                            <strong className="hub-resume-title">{t.finishedTitle(TOTAL_STEPS)}</strong>
                            <span className="hub-resume-why">{t.finishedWhy}</span>
                        </div>
                    </div>
                ) : resumeStep && (
                    <div className={`hub-resume ${resuming ? 'is-resuming' : ''}`}>
                        <span className="hub-resume-node">
                            <Icon name={resuming ? 'clock' : freshStart ? 'flag' : 'zap'} size={20} />
                        </span>
                        <div className="hub-resume-text">
                            <span className="hub-resume-kicker">
                                {resuming ? t.resumeKicker : freshStart ? t.startKicker : t.nextKicker}
                            </span>
                            <strong className="hub-resume-title">
                                {t.resumeStepPrefix} {resumeStep.no} · <span dir="ltr">{resumeStep.title}</span>
                            </strong>
                            <span className="hub-resume-why" dir="ltr">{resumeStep.why}</span>
                            <span className="hub-resume-meta">
                                <span dir="ltr">{resumeStep.section.title}</span>
                                {resumeStep.questionCount > 0 ? ` · ${resumeStep.questionCount} ${t.questionsSuffix}` : ''}
                            </span>
                        </div>
                        <div className="hub-resume-actions">
                            <button type="button" className="hub-resume-cta" onClick={() => openStep(resumeStep)}>
                                {resuming || !freshStart ? t.resumeCta : t.startCta}
                                <Icon name={forwardChevron} size={17} />
                            </button>
                            <button type="button" className="hub-resume-link" onClick={() => revealStep(resumeStep)}>
                                {t.revealOnPath}
                            </button>
                        </div>
                    </div>
                )}

                {/* jump straight to a topic */}
                <div className="hub-search">
                    <Icon name="search" size={18} className="hub-search-icon" />
                    <input
                        type="text"
                        className="hub-search-input"
                        placeholder={t.searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label={t.searchAria}
                        dir="auto"
                    />
                    {query && (
                        <button type="button" className="hub-search-clear" onClick={() => setQuery('')} aria-label={t.clearSearch}>
                            <Icon name="x" size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* ---------------- search results ----------------------------------- */}
            {searching ? (
                <div className="path-search">
                    <p className="path-search-head">
                        {t.resultsCount(results.length)} &ldquo;<span dir="ltr">{query.trim()}</span>&rdquo;
                        <button type="button" className="path-search-back" onClick={() => setQuery('')}>
                            <Icon name="x" size={14} /> {t.backToPath}
                        </button>
                    </p>
                    {results.length === 0 ? (
                        <div className="hub-empty">
                            <Icon name="search" size={30} />
                            <p>{t.noResultsBefore} &ldquo;<span dir="ltr">{query.trim()}</span>&rdquo;.</p>
                            <button type="button" className="hub-empty-clear" onClick={() => setQuery('')}>{t.clearSearch}</button>
                        </div>
                    ) : (
                        <ul className="path-search-list">
                            {results.map((step) => {
                                const state = stepState(step);
                                return (
                                    <li key={step.id}>
                                        <button
                                            type="button"
                                            className={`search-step is-${state}`}
                                            style={{ '--accent': step.section.accent }}
                                            onClick={() => openStep(step)}
                                        >
                                            <span className="search-step-node">
                                                {state === 'done' ? <Icon name="check" size={13} /> : step.no}
                                            </span>
                                            <span className="search-step-text" dir="ltr">
                                                <span className="search-step-title">{step.title}</span>
                                                <span className="search-step-covers">{step.covers}</span>
                                            </span>
                                            <span className="search-step-spec" dir="ltr">
                                                <Icon name={step.section.icon} size={13} /> {step.section.title}
                                            </span>
                                            <Icon name={forwardChevron} size={16} className="search-step-chev" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            ) : (
                /* ---------------- the path ------------------------------------- */
                <ol className="path">
                    {MILESTONES.map((m, mi) => {
                        const nDone = msDoneCount(m);
                        const nTotal = m.steps.length;
                        const msPct = nTotal ? Math.round((nDone / nTotal) * 100) : 0;
                        const complete = nDone === nTotal;
                        const isOpen = openMs.has(m.id);
                        const isCurrent = !!currentStep && currentStep.milestoneId === m.id;
                        const next = MILESTONES[mi + 1] || null;
                        return (
                            <li
                                key={m.id}
                                id={`ms-${m.id}`}
                                className={cx('milestone', complete && 'is-complete', isCurrent && 'is-current')}
                                style={{ '--accent': m.accent }}
                            >
                                <div className="path-row ms-head-row">
                                    <div className="path-rail">
                                        <span className="path-node ms-node" aria-hidden="true">
                                            {complete ? <Icon name="check" size={18} /> : m.order}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="ms-head"
                                        aria-expanded={isOpen}
                                        aria-controls={`ms-body-${m.id}`}
                                        onClick={() => toggleMilestone(m.id)}
                                    >
                                        <span className="ms-head-main">
                                            <span className="ms-kicker">
                                                {t.milestoneKicker(m.order, MILESTONES.length)} · <span dir="ltr">{m.tagline}</span>
                                                {isCurrent && <em className="ms-here">{t.youAreHere}</em>}
                                            </span>
                                            <span className="ms-title" dir="ltr">
                                                <span className="ms-icon"><Icon name={m.icon} size={22} /></span>
                                                {m.title}
                                            </span>
                                            <span className="ms-goal" dir="ltr">{m.goal}</span>
                                            <span className="ms-meta">
                                                <span><Icon name="book-open" size={13} /> {nTotal} {t.milestoneSteps}</span>
                                                <span><Icon name="target" size={13} /> {m.questionCount} {t.milestoneQuestions}</span>
                                            </span>
                                        </span>

                                        <span className="ms-side">
                                            <span className="ms-ring" style={{ '--p': msPct }}>
                                                <i>{msPct}%</i>
                                            </span>
                                            <span className="ms-count">{nDone}/{nTotal} {t.milestoneDone}</span>
                                            <span className={`ms-chev ${isOpen ? 'open' : ''}`} aria-hidden="true">▾</span>
                                        </span>
                                    </button>
                                </div>

                                <div className={`ms-body ${isOpen ? 'open' : ''}`} id={`ms-body-${m.id}`}>
                                    <div className="ms-body-inner">
                                        <ol className="ms-steps">
                                            {m.steps.map(renderStep)}
                                        </ol>

                                        <PathCheckpoint
                                            milestone={m}
                                            nextMilestone={next}
                                            passed={!!path.checkpoints?.[m.id]}
                                            doneCount={nDone}
                                            onPass={() => passCheckpoint(m, next)}
                                            onRedo={() => redoCheckpoint(m)}
                                        />
                                    </div>
                                </div>
                            </li>
                        );
                    })}

                    <li className={cx('path-row path-end', finished && 'is-reached')}>
                        <div className="path-rail">
                            <span className="path-node end-node" aria-hidden="true"><Icon name="trophy" size={18} /></span>
                        </div>
                        <div className="end-card">
                            <h3>{finished ? t.endTitleDone : t.endTitle}</h3>
                            <p>
                                {finished
                                    ? t.endBodyDone(TOTAL_STEPS, MILESTONES.length)
                                    : t.endBody(TOTAL_STEPS - doneTotal)}
                            </p>
                        </div>
                    </li>
                </ol>
            )}

            {/* ---------------- full-screen focused study modal ------------------- */}
            {openSub && (
                <div
                    className="summary-panel"
                    dir={dir}
                    ref={panelRef}
                    style={openSub.section.accent ? { '--accent': openSub.section.accent } : undefined}
                >
                    <header className="panel-head">
                        <div className="panel-head-text">
                            <span className="panel-spec" dir="ltr">
                                <Icon name={openSub.section.icon} size={18} /> {enLabel(openSub.section).primary}
                            </span>
                            {STEP_BY_ID[openSub.subtopic.id] && (
                                <em className="panel-step">{t.panelStep(STEP_BY_ID[openSub.subtopic.id].no, TOTAL_STEPS)}</em>
                            )}
                            <h2 className="panel-title" dir="ltr">{enLabel(openSub.subtopic).primary}</h2>
                            {enLabel(openSub.subtopic).secondary && (
                                <span className="panel-title-en" dir="ltr">{enLabel(openSub.subtopic).secondary}</span>
                            )}
                        </div>
                        <button type="button" className="panel-close" onClick={closePanel} aria-label={t.close}>
                            <Icon name="x" size={20} />
                        </button>
                    </header>

                    <div className="panel-tabs">
                        <button
                            type="button"
                            className={`panel-tab ${tab === 'summary' ? 'active' : ''}`}
                            onClick={() => changeTab('summary')}
                        >
                            {t.tabSummary}
                        </button>
                        {questions.length > 0 && (
                            <button
                                type="button"
                                className={`panel-tab ${tab === 'questions' ? 'active' : ''}`}
                                onClick={() => changeTab('questions')}
                            >
                                {t.tabQuestions} <span className="panel-tab-badge">{questions.length}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className={`panel-done-btn ${isDone(openSub.subtopic.id) ? 'on' : ''}`}
                            onClick={() => toggleDone(openSub.subtopic.id)}
                            aria-pressed={isDone(openSub.subtopic.id)}
                            title={isDone(openSub.subtopic.id) ? t.markedTitle : t.markTitle}
                        >
                            <Icon name={isDone(openSub.subtopic.id) ? 'check' : 'circle'} size={16} />
                            <span className="label">{isDone(openSub.subtopic.id) ? t.panelStepDone : t.panelMarkDone}</span>
                        </button>
                    </div>

                    <div className="panel-body" ref={bodyRef}>
                        <div className="panel-inner">
                            {tab === 'summary' ? (
                                <div
                                    className="sum-doc sub-summary"
                                    dir="ltr"
                                    dangerouslySetInnerHTML={{ __html: openSub.subtopic.summaryHtml }}
                                />
                            ) : (
                                <div className="sub-questions">
                                    {questions.map((qq, i) => (
                                        <QuestionCard key={i} question={qq} number={i + 1} />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* drawing overlay — remounts (clears) per subtopic + tab */}
                        <SummaryAnnotation
                            key={`${openSub.subtopic.id}-${tab}`}
                            ref={annotationRef}
                            tool={tool}
                            color={color}
                            containerRef={bodyRef}
                        />
                    </div>

                    {/* floating study toolbar — collapsed to a compact trigger so it
                        never obstructs reading; expands on demand for active annotation */}
                    {!toolsOpen ? (
                        <button
                            type="button"
                            className="summary-fab-toggle"
                            onClick={() => setToolsOpen(true)}
                            aria-label={t.tools.openAria}
                            aria-expanded="false"
                            title={t.tools.openTitle}
                        >
                            <Icon name="pen" size={17} />
                            <span className="label">{t.tools.open}</span>
                        </button>
                    ) : (
                        <div className="summary-fab" role="toolbar" aria-label={t.tools.toolbar}>
                            <div className="stb-group">
                                {TOOLS.map((toolDef) => (
                                    <button
                                        key={toolDef.id}
                                        type="button"
                                        className={`stb-btn ${tool === toolDef.id ? 'on' : ''}`}
                                        title={t.tools[toolDef.labelKey]}
                                        aria-label={t.tools[toolDef.labelKey]}
                                        aria-pressed={tool === toolDef.id}
                                        onClick={() => setTool(toolDef.id)}
                                    ><Icon name={toolDef.icon} size={18} /></button>
                                ))}
                            </div>
                            <div className="stb-sep" />
                            <div className="stb-group">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`stb-color ${color === c ? 'on' : ''}`}
                                        style={{ background: c }}
                                        aria-label={t.tools.color(c)}
                                        aria-pressed={color === c}
                                        onClick={() => pickColor(c)}
                                    />
                                ))}
                            </div>
                            <div className="stb-sep" />
                            <div className="stb-group">
                                <button type="button" className="stb-btn" title={t.tools.undo} aria-label={t.tools.undo} onClick={() => annotationRef.current?.undo()}><Icon name="undo" size={18} /></button>
                                <button type="button" className="stb-btn" title={t.tools.clear} aria-label={t.tools.clear} onClick={() => annotationRef.current?.clear()}><Icon name="trash" size={18} /></button>
                                <button type="button" className="stb-btn" title={isFs ? t.tools.exitFullscreen : t.tools.fullscreen} aria-label={isFs ? t.tools.exitFullscreen : t.tools.fullscreen} onClick={toggleFs}><Icon name="maximize" size={18} /></button>
                            </div>
                            <div className="stb-sep" />
                            <button type="button" className="stb-btn stb-collapse" title={t.tools.hide} aria-label={t.tools.hide} onClick={closeTools}><Icon name="x" size={18} /></button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SummariesPage;
