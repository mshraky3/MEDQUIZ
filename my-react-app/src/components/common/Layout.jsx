import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import RouteSEO from './RouteSEO.jsx';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { useLang } from '../../i18n';
import { startEngagementTracking, trackSection } from '../../utils/engagement.js';
import './Navbar.css';

const Layout = ({ children }) => {
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
    axios.put(`${Globals.URL}/api/preferences/language`,
      { username: user.username, lang },
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    ).catch(() => { /* best-effort */ });
  }, [user?.username, sessionToken, lang]);

  return (
    <div className="page-with-navbar">
      <RouteSEO />
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
