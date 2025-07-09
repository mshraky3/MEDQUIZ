import React from 'react';
import Login from './components/login/Login';
import Landing from './components/landing/Landing';
import Globals from "./global.js"
import { Analytics } from "@vercel/analytics/react"

function App() {
    return (
        <div>
            <Analytics />
            <Landing />
        </div>
    );
}

export default App;