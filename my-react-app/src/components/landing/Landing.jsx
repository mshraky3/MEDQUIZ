import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Icon from '../common/Icon.jsx';
import HeroArt from './HeroArt.jsx';
import InstallPrompt, { InstallGuideSection } from '../common/InstallPrompt.jsx';
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

  const safeTrack = (eventName, payload) => {
    try {
      track(eventName, payload);
    } catch (error) {
      console.debug('Analytics track skipped:', error);
    }
  };

  const handleSignup = () => {
    safeTrack('landing_cta_signup_click', { section: 'landing' });
    navigate('/signup');
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
              <button className="btn ghost topbar-btn" onClick={handleLogin}>
                {t.topbar.login}
              </button>
            )}
          </div>
        </header>

        <section className="hero">
          <HeroArt />
          {isAuthenticated ? (
            <>
              <span className="pill">{t.heroReturning.pill}</span>
              <h1>
                {user?.username
                  ? <>{t.heroReturning.titlePrefix}<bdi>{user.username}</bdi></>
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
              <div className="cta-row">
                <button className="btn primary" onClick={handleSignup}>
                  {t.hero.primary}
                </button>
                <button className="btn ghost" onClick={handleLogin}>
                  {t.hero.secondary}
                </button>
              </div>
              <ul className="hero-trust">
                {t.hero.trust.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
        </section>

        <div className="landing-shell">

          <section className="stat-grid" aria-label={t.statsLabel}>
            {t.stats.map((item) => (
              <article key={item.label} className="stat-card">
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </article>
            ))}
          </section>

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
          </section>

          <section className="feature-section">
            <div className="section-head">
              <p className="pill subtle">{t.features.pill}</p>
              <h2>{t.features.title}</h2>
              <p>{t.features.body}</p>
            </div>
            <div className="feature-grid">
              {t.features.items.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <span className="feature-icon" aria-hidden="true"><Icon name={feature.icon} size={28} /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

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
                <button className="btn primary price-card-cta" onClick={handleSignup}>
                  {t.value.cta}
                </button>
                <p className="price-card-note">{t.value.note}</p>
              </aside>
            </div>
          </section>

          <section className="faq-section" aria-label={t.faq.sectionLabel}>
            <div className="section-head">
              <p className="pill subtle">{t.faq.pill}</p>
              <h2>{t.faq.title}</h2>
              <p>{t.faq.body}</p>
            </div>
            <div className="purchase-faq-grid">
              {t.faq.items.map((item) => (
                <article key={item.q} className="purchase-faq-card">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </article>
              ))}
            </div>
            <Link to="/faq" className="faq-preview-link">{t.faq.link}</Link>
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
          </section>

          <InstallGuideSection />

          <section className="resource-section">
            <div className="resource-card">
              <div className="section-head">
                <p className="pill subtle">{t.resources.pill}</p>
                <h2>{t.resources.title}</h2>
                <p>{t.resources.body}</p>
              </div>
              <div className="resource-links">
                {t.resources.links.map((link) => (
                  <Link key={link.to} to={link.to} className="resource-link-card">
                    <h3>{link.title}</h3>
                    <p>{link.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="seo-section">
            <div className="section-head">
              <p className="pill subtle">{t.seo.pill}</p>
              <h2>{t.seo.title}</h2>
              <p>{t.seo.body}</p>
            </div>
            <div className="seo-grid">
              {t.seo.topics.map((topic) => (
                <article key={topic.title} className="seo-card">
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                </article>
              ))}
            </div>
          </section>

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
                    <button className="btn primary" onClick={handleSignup}>
                      {t.ctaBand.visitor.primary}
                    </button>
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
              <button className="btn primary" onClick={handleSignup}>
                {t.mobileCta.tryFree}
              </button>
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
