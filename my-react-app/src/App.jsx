import React from 'react';
import Login from './components/login/Login';
import Globals from "./global.js"
import { Analytics } from "@vercel/analytics/react"

function App() {
    return (
        <div>
            <Analytics />
            <Login />
        </div>
    );
}

export default App;