import React from 'react';
import Navbar from './Navbar.jsx';
import RouteSEO from './RouteSEO.jsx';
import './Navbar.css';

const Layout = ({ children }) => {
  return (
    <div className="page-with-navbar">
      <RouteSEO />
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
