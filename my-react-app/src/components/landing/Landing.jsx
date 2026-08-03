import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { safeTrack, trackFunnel } from '../../utils/analytics.js';
import Icon from '../common/Icon.jsx';
import HeroArt from './HeroArt.jsx';
import ExamCountdown from './ExamCountdown.jsx';
import ProductShowcase from './ProductShowcase.jsx';
import InstallPrompt from '../common/InstallPrompt.jsx';
import InstallShowcase from '../common/InstallShowcase.jsx';
import { UserContext } from '../../UserContext';
import { TRACKS, MEDICAL, NURSING, pick } from '../../utils/tracks.js';
import { useCopy, useLang, LanguageToggle } from '../../i18n';
import landingCopy from '../../i18n/copy/landing.js';
import './Landing.css';

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

  // Mirrors Navbar's definition so both agree on what counts as "logged in".
  const isAuthenticated = !!(user && user.id && sessionToken);

  // Usernames ARE email addresses on this platform, so greeting someone by
  // `user.username` printed "Welcome back, alshraky3@gmail.com" across the
  // hero. Take the local part, and only its first word, exactly as the study
  // hub already does.
  const displayName = user?.username
    ? String(user.username).split('@')[0].split(/[ _.]/).filter(Boolean)[0] || ''
    : '';

  // The specialty names shown inside the analytics replica, so the mock is
  // labelled with this visitor's own track rather than hardcoded English.
  const showcaseSpecialties = TRACKS[MEDICAL].specialties.map((sp) => pick(sp.label, lang));

  // `placement` differentiates the 4 signup CTAs (hero / price card / CTA
  // band / mobile bar), which previously all fired the exact same event with
  // the exact same payload — making it impossible to tell which one converts.
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
              student knows within seconds whether this is for them — and,
              just as importantly, what the current state of their content is. */}
          <section className="tracks-section" aria-labelledby="tracks-h">
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
                </article>
              ))}
            </div>

            {/* The section that makes someone decide "this is for me" is the
                one that has to let them act on it — previously the nearest
                signup button was two screens further down. */}
            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('tracks')}>
                  {t.tracks.cta}
                </Link>
                <p className="section-cta-note">{t.tracks.ctaNote}</p>
              </div>
            )}
          </section>

          {/* Replaces the old adjective grid: the product, shown working. */}
          <ProductShowcase copy={t.showcase} specialtyLabels={showcaseSpecialties} />

          {/* Seeing the product work is the moment the visitor stops reading
              and starts wanting it — so the tour ends with a way in. */}
          {!isAuthenticated && (
            <div className="section-cta">
              <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('showcase')}>
                {t.showcase.cta}
              </Link>
              <p className="section-cta-note">{t.showcase.ctaNote}</p>
            </div>
          )}

          <section className="compare-section" aria-label={t.compare.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.compare.pill}</p>
              <h2>{t.compare.title}</h2>
              <p>{t.compare.body}</p>
            </div>
            <div className="compare-scroll" role="region" aria-label={t.compare.tableLabel} tabIndex="0">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">{t.compare.colAspect}</th>
                    <th scope="col" className="compare-sqb-col">
                      {t.compare.colSqb} <span className="compare-badge">{t.compare.badge}</span>
                    </th>
                    <th scope="col">{t.compare.colFiles}</th>
                    <th scope="col">{t.compare.colCourses}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.compare.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td className="compare-sqb-col"><Icon name="check-circle" size={16} aria-hidden="true" /> {row.sqb}</td>
                      <td>{row.files}</td>
                      <td>{row.courses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="compare-hint" aria-hidden="true">{t.compare.hint}</p>

            {/* Same reasoning as the tracks CTA: a comparison table is a
                decision moment, and a decision moment needs a button. */}
            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('compare')}>
                  {t.compare.cta}
                </Link>
                <p className="section-cta-note">{t.compare.ctaNote}</p>
              </div>
            )}
          </section>

          <section className="cost-section" aria-label={t.costOfWaiting.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.costOfWaiting.pill}</p>
              <h2>{t.costOfWaiting.title}</h2>
              <p>{t.costOfWaiting.body}</p>
            </div>
            <div className="cost-grid">
              {t.costOfWaiting.items.map((item) => (
                <div key={item.title} className="cost-item">
                  <span className="cost-item-icon" aria-hidden="true"><Icon name={item.icon} size={24} /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="cost-note">{t.costOfWaiting.note}</p>

            {/* This section ends on the price of doing nothing; the button is
                the alternative to doing nothing. */}
            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('cost')}>
                  {t.costOfWaiting.cta}
                </Link>
                <p className="section-cta-note">{t.costOfWaiting.ctaNote}</p>
              </div>
            )}
          </section>

          <section className="value-section" aria-label={t.value.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.value.pill}</p>
              <h2>{t.value.title}</h2>
              <p>{t.value.body}</p>
            </div>

            <div className="value-grid">
              <div className="value-points">
                {t.value.points.map((point) => (
                  <div key={point.title} className="value-point">
                    <span className="feature-icon" aria-hidden="true"><Icon name={point.icon} size={24} /></span>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

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
            </div>
          </section>


          <section className="flow-section">
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
          </section>

          <section className="news-section" aria-label={t.news.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.news.pill}</p>
              <h2>{t.news.title}</h2>
              <p>{t.news.body}</p>
            </div>
            <div className="news-list">
              {t.news.items.map((item) => (
                <article key={item.title} className="news-item">
                  <span className="news-item-icon" aria-hidden="true"><Icon name={item.icon} size={22} /></span>
                  <div className="news-item-body">
                    <div className="news-item-top">
                      <h3>{item.title}</h3>
                      <time className="news-item-date">{item.date}</time>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Everything listed above is already included in the same
                subscription — say so where it is being read. */}
            {!isAuthenticated && (
              <div className="section-cta">
                <Link to="/signup" className="btn primary" onClick={() => trackSignupClick('news')}>
                  {t.news.cta}
                </Link>
                <p className="section-cta-note">{t.news.ctaNote}</p>
              </div>
            )}
          </section>

          {/* The steps, played on a phone rather than listed. */}
          <InstallShowcase />



          <section className="cta-band">
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
          </section>
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

        {/* Floating, dismissible install banner (mobile only) */}
        <InstallPrompt />
      </div>
    </>
  );
};

export default Landing;
