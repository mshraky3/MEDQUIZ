import React from 'react';
import Landing from './components/landing/Landing';
import Footer from './components/common/Footer.jsx';
import RouteSEO from './components/common/RouteSEO.jsx';

function App() {
    // Flex column, like .page-with-navbar. This wrapper was min-height:100vh
    // with the Footer as a plain sibling below it, so .landing-body's own
    // min-height:100vh (Landing.css) filled the wrapper exactly and the footer
    // was then appended underneath — the page was guaranteed to scroll by at
    // least a footer's height no matter how little content it had. As a column,
    // .landing-body's flex:1 shares the same 100vh with the footer instead of
    // adding to it.
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', margin: 0, padding: 0 }}>
            <RouteSEO />
            <Landing />
            <Footer />
        </div>
    );
}

export default App;
