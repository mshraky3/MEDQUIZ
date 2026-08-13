import React from 'react';
import Landing from './components/landing/Landing';
import Footer from './components/common/Footer.jsx';
import RouteSEO from './components/common/RouteSEO.jsx';

function App() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', margin: 0, padding: 0 }}>
            <RouteSEO />
            <Landing />
            <Footer />
        </div>
    );
}

export default App;