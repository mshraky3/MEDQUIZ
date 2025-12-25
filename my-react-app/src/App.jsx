import React from 'react';
import Landing from './components/landing/Landing';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', margin: 0, padding: 0 }}>
            {process.env.NODE_ENV === 'production' && <Analytics />}
            {process.env.NODE_ENV === 'production' && <SpeedInsights />}
            <Landing />
        </div>
    );
}

export default App;