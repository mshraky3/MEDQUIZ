import React from 'react';
import Navbar from './Navbar.jsx';
import './Navbar.css';

const Layout = ({ children }) => {
  return (
    <div className="page-with-navbar">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
