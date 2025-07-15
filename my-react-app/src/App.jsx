import React from 'react';
import Landing from './components/landing/Landing';
import Navbar from './components/common/Navbar.jsx';
import { useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"

function App() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', margin: 0, padding: 0 }}>
            <Analytics />
            {showNavbar && <Navbar />}
            <Landing />
        </div>
    );
}

export default App;