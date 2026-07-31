import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import RouteSEO from './RouteSEO.jsx';
import { startEngagementTracking, trackSection } from '../../utils/engagement.js';
import './Navbar.css';

const Layout = ({ children }) => {
  const location = useLocation();

  // Time-on-section tracking. Layout wraps every signed-in page, so this is
  // the one place that sees every route change. Only counts time while the
  // tab is visible — see utils/engagement.js.
  useEffect(() => { startEngagementTracking(); }, []);
  useEffect(() => { trackSection(location.pathname); }, [location.pathname]);

  return (
    <div className="page-with-navbar">
      <RouteSEO />
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
