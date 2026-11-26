import { useContext, useEffect, useState } from 'react';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { landingView } from '../../utils/androidTesters.js';

/**
 * The Android testers offer as the landing page sees it, asked once and shared by
 * the hero teaser and the full section.
 *
 * The API is the switch. Signed out: GET /api/public/android-testers (404 while
 * the offer is off, open:false once full) and anything else draws nothing.
 * Signed in: GET /api/android-testers/status for this account.
 *
 * Plain fetch, no axios: this is part of the landing bundle (see Landing.jsx).
 */
export default function useAndroidOffer() {
    const { user, sessionToken, authReady } = useContext(UserContext);
    const signedIn = !!(user && user.username && sessionToken);
    const username = signedIn ? user.username : '';
    const [publicState, setPublicState] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!authReady) return undefined;
        const controller = new AbortController();
        setStatus(null);
        const request = signedIn
            ? fetch(`${Globals.URL}/api/android-testers/status?username=${encodeURIComponent(username)}`, {
                headers: { Authorization: `Bearer ${sessionToken}` },
                signal: controller.signal,
            })
            : fetch(`${Globals.URL}/api/public/android-testers`, { signal: controller.signal });
        request
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (controller.signal.aborted || !data) return;
                if (signedIn) setStatus(data); else setPublicState(data);
            })
            .catch(() => { /* off, not ready or offline: the offer stays hidden */ });
        return () => controller.abort();
    }, [authReady, signedIn, username, sessionToken]);

    return {
        view: landingView({ authReady, signedIn, publicState, status }),
        status,
        setStatus,
        username,
        sessionToken,
    };
}
