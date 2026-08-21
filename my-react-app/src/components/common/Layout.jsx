import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import RouteSEO from './RouteSEO.jsx';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { useLang } from '../../i18n';
import { startEngagementTracking, trackSection } from '../../utils/engagement.js';
import './Navbar.css';

// Module-level, not component state: every route in main.jsx wraps its page
// in its own <Layout>, so navigating between two routes unmounts one Layout
// instance and mounts a fresh one — this effect's dependency array not
// changing doesn't stop it firing again on that remount, only tracking what
// was last actually synced (surviving across those remounts) does.
let lastSyncedLang = null;

const Layout = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const { user, sessionToken } = useContext(UserContext);
  const { lang } = useLang();

  // Time-on-section tracking. Layout wraps every signed-in page, so this is
  // the one place that sees every route change. Only counts time while the
  // tab is visible — see utils/engagement.js.
  useEffect(() => { startEngagementTracking(); }, []);
  useEffect(() => { trackSection(location.pathname); }, [location.pathname]);

  // Mirror the site language onto the account, so lifecycle email is written
  // in the language this student actually reads the product in. The preference
  // lives in localStorage, which the cron jobs obviously cannot see — this is
  // the only bridge. Fire-and-forget: the UPDATE is a no-op when unchanged,
  // and a failure costs nothing that the next page view won't retry.
  useEffect(() => {
    if (!user?.username || !sessionToken) return;
    const key = `${user.username}:${lang}`;
    if (lastSyncedLang === key) return; // already synced this pair — skip the write
    lastSyncedLang = key;
    // Plain fetch, not axios — Layout is eagerly bundled (every route wraps
    // its page in it from main.jsx), so a static axios import here put the
    // 34KB library in the bundle every visitor downloads, including an
    // anonymous landing-page visitor who never reaches an authenticated page.
    fetch(`${Globals.URL}/api/preferences/language`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify({ username: user.username, lang }),
    }).catch(() => { lastSyncedLang = null; /* let the next mount retry */ });
  }, [user?.username, sessionToken, lang]);

  return (
    <div className="page-with-navbar">
      <RouteSEO />
      <Navbar />
      {children}
      {/* Was App.jsx-only (the "/" landing route has its own shell) — every
          other page had no path to /terms, /privacy, /refund-policy or
          /suggestions, and Navbar.css:401 still described a footer that
          wasn't actually here. .page-with-navbar is already a flex column
          with the right min-height, and Footer's own margin-top:auto is
          exactly the sticky-footer pattern that needs.
          hideFooter opts a page out — Login/Signup use it: a footer full of
          site links adds a page-height of scroll to a form the visitor is
          mid-transaction on. */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
