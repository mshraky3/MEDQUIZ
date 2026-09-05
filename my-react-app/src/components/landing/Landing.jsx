import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeTrack, trackFunnel, captureLandingAttribution } from '../../utils/analytics.js';
import Icon from '../common/Icon.jsx';
import HeroArt from './HeroArt.jsx';
import ExamCountdown from './ExamCountdown.jsx';
import InstallPrompt from '../common/InstallPrompt.jsx';
import { Reveal } from './useScrollReveal.jsx';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { TRACKS, MEDICAL, NURSING, pick } from '../../utils/tracks.js';
import { useCopy, useLang, LanguageToggle, LocaleLink as Link, formatNumber, formatDate } from '../../i18n';
import landingCopy from '../../i18n/copy/landing.js';
import './Landing.css';

/**
 * The worked example inside the explanations section — a shortened but
 * otherwise faithful copy of a real entry from the bank, including the four
 * section labels every imported explanation uses (see
 * backend/scripts/buildExplanationSet.js).
 *
 * It lives here rather than in the copy files because it is NOT translated:
 * explanations are study content and render in English under both site
 * languages, exactly as ExplanationPanel renders them in the app. Showing an
 * Arabic mock-up here would promise something the product does not do.
 */
const EXPLANATION_SAMPLE = {
  stem: 'Primary dysmenorrhea — why is this the answer?',
  blocks: [
    {
      label: 'Core Concept:',
      lines: [
        'Excess endometrial prostaglandin (PGF2α) drives uterine hypercontractility and ischaemia, with no underlying pelvic pathology.',
      ],
    },
    {
      label: 'Clinical Presentation:',
      lines: [
        'Crampy suprapubic pain starting with the flow, settling within 48–72 hours.',
        'Regular cycles, onset within a few years of menarche.',
      ],
    },
    {
      label: 'Diagnosis:',
      lines: [
        'Clinical, from the history and a normal examination.',
        'A normal pelvic ultrasound supports the diagnosis rather than making it — it is what separates this from endometriosis and adenomyosis.',
      ],
    },
    {
      label: 'Management:',
      lines: [
        'NSAIDs started at or just before the onset of flow, plus local heat.',
        'Combined hormonal contraception when ongoing suppression is needed.',
      ],
    },
  ],
};

const Landing = () => {
  const navigate = useNavigate();
  const { user, sessionToken, logout } = useContext(UserContext);
  const t = useCopy(landingCopy);
  const { lang, dir } = useLang();

  /**
   * The two student populations the platform serves. `ready` reflects whether
   * the track's question bank and summaries are actually loaded — stated
   * plainly rather than hidden, so nobody subscribes expecting content that
   * isn't there. Both tracks have been live since July 2026.
   *
   * Track and specialty names come from tracks.js so the landing page can never
   * drift from what the signup picker and the quiz launcher call them.
   */
  const studyTracks = [
    {
      key: MEDICAL,
      icon: TRACKS[MEDICAL].icon,
      title: pick(TRACKS[MEDICAL].label, lang),
      exam: pick(TRACKS[MEDICAL].exam, lang),
      desc: t.tracks.medicalDesc,
      specialties: TRACKS[MEDICAL].specialties.map((sp) => pick(sp.label, lang)),
      ready: true,
    },
    {
      key: NURSING,
      icon: TRACKS[NURSING].icon,
      title: pick(TRACKS[NURSING].label, lang),
      exam: pick(TRACKS[NURSING].exam, lang),
      desc: t.tracks.nursingDesc,
      specialties: TRACKS[NURSING].specialties.map((sp) => pick(sp.label, lang)),
      ready: true,
    },
  ];

  // The three columns of the "why SQB" comparison, rendered as cards rather
  // than a table. Icons only — the actual comparison values stay in
  // landing.js's compare.rows, keyed sqb/files/courses same as before, so no
  // copy restructuring was needed for the numbers themselves.
  const compareColumns = [
    { key: 'sqb', label: t.compare.colSqb, icon: 'sparkles', badge: t.compare.badge },
    { key: 'files', label: t.compare.colFiles, icon: 'folder' },
    { key: 'courses', label: t.compare.colCourses, icon: 'users' },
  ];

  // First-touch attribution — fires once per browser ever, not on every visit.
  useEffect(() => {
    captureLandingAttribution();
  }, []);

  // Bank size and deck count, counted from the database on request rather than
  // typed into the copy. /api/public/stats has existed (and been cached) for a
  // while with nothing calling it; this is the first consumer.
  //
  // Plain fetch, no apiClient: this page is the anonymous entry point and must
  // not pull axios into the landing bundle, and an anonymous visitor has no
  // session for the interceptor to attach anyway. Failure is silent — the
  // static trust list above already carries the page, and a broken number
  // would undo exactly the credibility this line is meant to build.
  const [liveStats, setLiveStats] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${Globals.URL}/api/public/stats`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && data.questionsTotal > 0) setLiveStats(data);
      })
      .catch(() => { /* the line simply does not render */ });
    return () => controller.abort();
  }, []);

  // Mirrors Navbar's definition so both agree on what counts as "logged in".
  const isAuthenticated = !!(user && user.id && sessionToken);

  // Usernames ARE email addresses on this platform, so greeting someone by
  // `user.username` printed "Welcome back, alshraky3@gmail.com" across the
  // hero. Take the local part, and only its first word, exactly as the study
  // hub already does.
  const displayName = user?.username
    ? String(user.username).split('@')[0].split(/[ _.]/).filter(Boolean)[0] || ''
    : '';

  // `placement` differentiates the signup CTAs (hero / tracks cards / price
  // card / CTA band / mobile bar), which previously all fired the exact same
  // event with the exact same payload — making it impossible to tell which
  // one converts.
  const trackSignupClick = (placement) => {
    trackFunnel('landing_cta_signup_click', { placement });
  };

  const handleLogin = () => {
    safeTrack('landing_cta_login_click', { section: 'landing' });
    navigate('/login');
  };

  const handleContinue = () => {
    safeTrack('landing_cta_continue_click', { section: 'landing' });
    navigate('/quizs');
  };

  const handleLogout = async () => {
    safeTrack('landing_cta_logout_click', { section: 'landing' });
    await logout();
  };

  return (
    <>
      {/* Explicit dir: index.css sets body{direction:ltr}, which would cancel
          the documentElement dir for everything inside. */}
      <div className="landing-body" dir={dir} lang={lang}>
        <header className="landing-topbar">
          <span className="landing-brand">SQB</span>
          <div className="landing-topbar-actions">
            {/* The landing page has its own topbar (no navbar on "/"), so the
                language switch has to live here too — it is the first thing a
                visitor in the wrong language needs. */}
            <LanguageToggle compact />
            {isAuthenticated ? (
              <button className="btn ghost topbar-btn" onClick={handleContinue}>
                {t.topbar.account}
              </button>
            ) : (
              <>
                <button className="btn ghost topbar-btn" onClick={handleLogin}>
                  {t.topbar.login}
                </button>
                {/* A visitor who scrolls back to the top should not have to
                    scroll down again to find a way in. Hidden on narrow
                    screens, where the fixed mobile bar already carries it. */}
                <Link
                  to="/signup"
                  className="btn primary topbar-btn topbar-cta"
                  onClick={() => trackSignupClick('topbar')}
                >
                  {t.topbar.signup}
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="hero">
          <HeroArt />
          {isAuthenticated ? (
            <>
              <span className="pill">{t.heroReturning.pill}</span>
              <h1>
                {displayName
                  ? <>{t.heroReturning.titlePrefix}<bdi>{displayName}</bdi></>
                  : t.heroReturning.title}
              </h1>
              <p>{t.heroReturning.body}</p>
              <div className="cta-row">
                <button className="btn primary" onClick={handleContinue}>
                  {t.heroReturning.primary}
                </button>
                <button className="btn ghost" onClick={handleLogout}>
                  {t.heroReturning.secondary}
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="pill">{t.hero.pill}</span>
              <h1>{t.hero.title}</h1>
              <p>{t.hero.body}</p>
              <ExamCountdown copy={t.hero.examCountdown} />
              <div className="cta-row">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('hero')}>
                  {t.hero.primary}
                </Link>
                <button className="btn ghost" onClick={handleLogin}>
                  {t.hero.secondary}
                </button>
              </div>
              <ul className="hero-trust">
                {t.hero.trust.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {/* Counted from the database, not typed here. Renders nothing
                  until the numbers arrive, so a slow or failed request costs a
                  line rather than showing a zero or a placeholder. */}
              {liveStats && (
                <p className="hero-live">
                  <span>{t.hero.liveQuestions(formatNumber(liveStats.questionsTotal, lang))}</span>
                  {liveStats.summaryDecks > 0 && (
                    <span>{t.hero.liveDecks(formatNumber(liveStats.summaryDecks, lang))}</span>
                  )}
                  {liveStats.contentUpdatedAt && (
                    <span>{t.hero.liveUpdated(formatDate(liveStats.contentUpdatedAt, lang))}</span>
                  )}
                </p>
              )}
            </>
          )}

          {/* The hero fills the viewport, so it needs to say that there is
              more below it — otherwise a full-screen first section reads as
              the whole page on a phone. */}
          <span className="hero-scroll" aria-hidden="true">
            {t.hero.scrollCue}
            <Icon name="chevron-down" size={16} />
          </span>
        </section>

        <div className="landing-shell">

          {/* Two tracks, one platform. Placed high on the page so a nursing
              student knows within seconds whether this is for them — and each
              card is now its own conversion point, not just a description,
              since the two tracks lead to different accounts. */}
          <Reveal as="section" className="tracks-section" aria-labelledby="tracks-h">
            <div className="section-head">
              <p className="pill subtle">{t.tracks.pill}</p>
              <h2 id="tracks-h">{t.tracks.title}</h2>
              <p>{t.tracks.body}</p>
            </div>
            <div className="tracks-grid">
              {studyTracks.map((st) => (
                <article key={st.key} className={`track-tile${st.ready ? '' : ' is-soon'}`}>
                  <div className="track-tile-head">
                    <span className="track-tile-icon"><Icon name={st.icon} size={22} /></span>
                    <div>
                      <h3>{st.title}</h3>
                      <span className="track-tile-exam">{st.exam}</span>
                    </div>
                    <span className={`track-tile-badge${st.ready ? '' : ' is-soon'}`}>
                      {st.ready ? t.tracks.ready : t.tracks.soon}
                    </span>
                  </div>
                  <p className="track-tile-desc">{st.desc}</p>
                  <ul className="track-tile-specs">
                    {st.specialties.map((sp) => <li key={sp}>{sp}</li>)}
                  </ul>
                  {!st.ready && <p className="track-tile-note">{t.tracks.soonNote}</p>}
                  {/* Pre-selects this track at signup and skips the picker
                      modal there — clicking here already was the deliberate
                      choice that modal exists to force. See Signup.jsx. */}
                  {!isAuthenticated && (
                    <Link
                      to={`/signup?track=${st.key}`}
                      className="btn primary track-tile-cta"
                      onClick={() => trackSignupClick(`tracks_${st.key}`)}
                    >
                      {t.tracks.cardCta(st.title)}
                    </Link>
                  )}
                </article>
              ))}
            </div>

            {!isAuthenticated && (
              <p className="section-cta-note tracks-note">{t.tracks.ctaNote}</p>
            )}
          </Reveal>

          {/* Moved directly after the tracks pick: the strongest objection a
              visitor has right after "which track is mine" is "why not just
              use free files", so it gets answered next, before anything else
              is asked of them. */}
          <Reveal as="section" className="compare-section" aria-label={t.compare.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.compare.pill}</p>
              <h2>{t.compare.title}</h2>
              <p>{t.compare.body}</p>
            </div>
            <div className="compare-cards">
              {compareColumns.map((col) => (
                <article key={col.key} className={`compare-card${col.key === 'sqb' ? ' is-featured' : ''}`}>
                  <div className="compare-card-head">
                    <span className="compare-card-icon" aria-hidden="true"><Icon name={col.icon} size={20} /></span>
                    <h3>{col.label}</h3>
                    {col.badge && <span className="compare-card-badge">{col.badge}</span>}
                  </div>
                  <ul className="compare-card-list">
                    {t.compare.rows.map((row) => (
                      <li key={row.label}>
                        <span className="compare-card-row-label">
                          {col.key === 'sqb' && <Icon name="check-circle" size={13} aria-hidden="true" />}
                          {row.label}
                        </span>
                        <span className="compare-card-row-value">{row[col.key]}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {/* Same reasoning as the tracks CTA: a comparison is a decision
                moment, and a decision moment needs a button. */}
            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('compare')}>
                  {t.compare.cta}
                </Link>
                <p className="section-cta-note">{t.compare.ctaNote}</p>
              </div>
            )}
          </Reveal>

          {/* Explanations get a section of their own — the single thing this
              bank has that the free PDF collections passed around in group
              chats do not, so it is made right after the comparison names the
              gap, while the reader is already thinking about it. */}
          <Reveal as="section" className="explain-section" aria-label={t.explain.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.explain.pill}</p>
              <h2>{t.explain.title}</h2>
              <p>{t.explain.body}</p>
            </div>

            <div className="explain-grid">
              <div className="explain-points">
                {t.explain.points.map((point) => (
                  <div key={point.title} className="explain-point">
                    <span className="feature-icon" aria-hidden="true"><Icon name={point.icon} size={22} /></span>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* A replica of the real explanation panel, down to the section
                  labels the imported content actually uses. Like the panel in
                  the app, the body stays English and LTR in both site
                  languages — explanations are study material, not UI. */}
              <figure className="explain-sample">
                <figcaption className="explain-sample-head">
                  <Icon name="lightbulb" size={16} />
                  <span>{t.explain.sampleTitle}</span>
                </figcaption>
                <p className="explain-sample-stem" dir="ltr">{EXPLANATION_SAMPLE.stem}</p>
                <div className="explain-sample-body" dir="ltr">
                  {EXPLANATION_SAMPLE.blocks.map((block) => (
                    <div key={block.label} className="explain-sample-block">
                      <strong>{block.label}</strong>
                      <ul>
                        {block.lines.map((line) => <li key={line}>{line}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </figure>
            </div>

            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('explain')}>
                  {t.explain.cta}
                </Link>
                <p className="section-cta-note">{t.explain.ctaNote}</p>
              </div>
            )}
          </Reveal>

          {/* How easy it is to actually start, placed right before the price
              — "here's how simple this is" immediately ahead of "here's what
              it costs" reads as a much shorter step than it did further up
              the page, before pricing. */}
          <Reveal as="section" className="flow-section">
            <div className="flow-card">
              <div className="flow-head">
                <p className="pill subtle">{t.flow.pill}</p>
                <h2>{t.flow.title}</h2>
                <p>{t.flow.body}</p>
              </div>
              <div className="steps">
                {t.flow.steps.map((step, index) => (
                  <div key={step.label} className="step">
                    <div className="step-index">0{index + 1}</div>
                    <div>
                      <h4>{step.label}</h4>
                      <p>{step.hint}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1 of the flow is "create your account" — so step 1 is
                  reachable from the card that describes it. */}
              {!isAuthenticated && (
                <div className="section-cta">
                  <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('flow')}>
                    {t.flow.cta}
                  </Link>
                  <p className="section-cta-note">{t.flow.ctaNote}</p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal as="section" className="value-section" aria-label={t.value.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.value.pill}</p>
              <h2>{t.value.title}</h2>
              <p>{t.value.body}</p>
            </div>

            {/* Short, scannable chips rather than four paragraphs — the case
                for subscribing is made by the heading above and the price
                card below; this row is a skim, not a second read. */}
            <div className="value-highlights">
              {t.value.points.map((point) => (
                <span key={point.title} className="value-highlight">
                  <Icon name={point.icon} size={16} aria-hidden="true" />
                  {point.title}
                </span>
              ))}
            </div>

            {/* Individual and group plans as two equal-weight cards, side by
                side — the group plan used to be a subdued band beneath the
                individual card and was easy to scroll past. /groups renders
                for logged-out visitors too, so the card can link there directly. */}
            <div className="pricing-cards">
              <aside className="price-card" aria-label={t.value.priceCardLabel}>
                <p className="price-card-plan">{t.value.plan}</p>
                <div className="price-card-amount">
                  <span className="price-card-value">{t.value.amount}</span>
                  <span className="price-card-cur">{t.value.currency}</span>
                </div>
                <p className="price-card-permonth">{t.value.perMonth}</p>
                <ul className="price-card-list">
                  {t.value.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link to="/signup" className="btn primary price-card-cta" onClick={() => trackSignupClick('price_card')}>
                  {t.value.cta}
                </Link>
                <p className="price-card-note">{t.value.note}</p>
              </aside>

              <aside className="price-card price-card-group" aria-label={t.value.group.title}>
                <span className="price-card-badge">{t.value.group.badge}</span>
                <p className="price-card-plan">{t.value.group.title}</p>
                <p className="price-card-group-body">{t.value.group.body}</p>
                <div className="price-card-group-tiers">
                  {t.value.group.tiers.map((tier) => (
                    <div key={tier.label} className="group-tier">
                      <span className="group-tier-label">{tier.label}</span>
                      <span className="group-tier-price">{tier.price}</span>
                      <span className="group-tier-each">{tier.each}</span>
                    </div>
                  ))}
                </div>
                <Link to="/groups" className="btn primary price-card-cta">{t.value.group.cta}</Link>
              </aside>
            </div>
          </Reveal>

          <Reveal as="section" className="cta-band">
            <div className="cta-band-content">
              <div>
                {isAuthenticated ? (
                  <>
                    <p className="pill subtle">{t.ctaBand.returning.pill}</p>
                    <h2>{t.ctaBand.returning.title}</h2>
                    <p>{t.ctaBand.returning.body}</p>
                  </>
                ) : (
                  <>
                    <p className="pill subtle">{t.ctaBand.visitor.pill}</p>
                    <h2>{t.ctaBand.visitor.title}</h2>
                    <p>{t.ctaBand.visitor.body}</p>
                  </>
                )}
              </div>
              <div className="cta-actions">
                {isAuthenticated ? (
                  <>
                    <button className="btn primary" onClick={handleContinue}>
                      {t.ctaBand.returning.primary}
                    </button>
                    <button className="btn outline" onClick={handleLogout}>
                      {t.ctaBand.returning.secondary}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('cta_band')}>
                      {t.ctaBand.visitor.primary}
                    </Link>
                    <button className="btn outline" onClick={handleLogin}>
                      {t.ctaBand.visitor.secondary}
                    </button>
                    <p className="cta-band-note">{t.ctaBand.visitor.note}</p>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mobile-cta">
          {isAuthenticated ? (
            <>
              <button className="btn primary" onClick={handleContinue}>
                {t.mobileCta.continue}
              </button>
              <button className="btn outline" onClick={handleLogout}>
                {t.mobileCta.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('mobile_bar')}>
                {t.mobileCta.tryFree}
              </Link>
              <button className="btn outline" onClick={handleLogin}>
                {t.mobileCta.login}
              </button>
            </>
          )}
        </div>

        {/* Floating, dismissible install banner (mobile only — it already
            returns null on desktop, so this is the "nudge, not a section"
            for every screen size). The full animated walkthrough now lives on
            /faq for whoever wants the step-by-step version. */}
        <InstallPrompt />
      </div>
    </>
  );
};

export default Landing;
