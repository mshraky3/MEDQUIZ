/**
 * Axios Instance with Error Tracking
 * Pre-configured axios instance that automatically reports API errors
 */

import axios from 'axios';
import Globals from '../global.js';
import { setupAxiosInterceptor, reportApiError } from './errorTracking';
import { markNavigatingAway } from './navigationState.js';
import { safeRemoveItem } from './safeStorage.js';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: Globals.URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include session credentials
apiClient.interceptors.request.use(
    (config) => {
        // Try to get session credentials from localStorage
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const sessionToken = localStorage.getItem('sessionToken') || user.sessionToken;

            if (user.username && sessionToken) {
                // Session token goes in the Authorization header so it never
                // appears in the URL (which would leak into logs / history /
                // Referer). Username is not secret and is used as request data by
                // some routes, so it stays in the query params / body.
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${sessionToken}`
                };
                if (config.method === 'get') {
                    config.params = {
                        ...config.params,
                        username: user.username
                    };
                } else {
                    config.data = {
                        ...config.data,
                        username: user.username
                    };
                }
            }
        } catch (e) {
            // Ignore localStorage errors
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 402 = this specific feature needs a subscription (see the guards in
// middleware/subscriptionGuard.js). It is NOT a lockout, and must never be
// treated as one: a free-tier account that has spent its 40 questions still
// owns its analytics, its history and the free lessons.
//
// This used to redirect the whole window to /subscribe and stamp
// accessAllowed:false into localStorage, which turned one refused request into
// an app-wide eviction. Now the rejection simply propagates and the screen that
// made the call decides what to show — normally an upsell, in place.
//
// The one thing kept centrally is the record of remaining allowance, so any
// screen can read it without another round-trip.
function handleSubscriptionRequired(error) {
    if (error.response?.status !== 402) return;
    if (typeof window === 'undefined') return;

    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
            ...user,
            free_questions_remaining: error.response.data?.remaining ?? 0,
        }));
    } catch (e) {
        // Ignore localStorage errors
    }
}

// 401 = the session is gone (expired, or superseded by a login elsewhere —
// see requireSession/invalidateSessionCache on the backend). This was the one
// place apiClient.js was empty despite existing specifically to hold this;
// every caller instead carried its own copy-pasted try/catch for it. Matches
// the copy-pasted version exactly (clear storage, hard-redirect) — a full
// reload is required here because this file has no React Router context to
// call navigate() from, and a stale UserContext must not survive the client
// side of a session that no longer exists server-side.
function handleSessionExpired(error) {
    if (error.response?.status !== 401) return;
    if (typeof window === 'undefined') return;
    safeRemoveItem('user');
    safeRemoveItem('sessionToken');
    if (!window.location.pathname.startsWith('/login')) {
        // Assigning location aborts every other request the page has in
        // flight, and each abort surfaces to axios as a bare "Network Error"
        // that looks exactly like the API being down. Announce the navigation
        // FIRST, in this same tick, so those aborts are recognised for what
        // they are — the browser's own pagehide/beforeunload events fire far
        // too late to help (see markNavigatingAway).
        //
        // This one line is what was mailing five or six CRITICAL alerts every
        // time a student's session quietly expired.
        markNavigatingAway();
        window.location.href = '/login?session=expired';
    }
}

// Add response interceptor for error tracking
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Report the error to the error tracking system
        reportApiError(error, error.config, error.response);
        handleSubscriptionRequired(error);
        handleSessionExpired(error);

        // Re-throw to let the application handle it
        return Promise.reject(error);
    }
);

// Also set up the interceptor on the default axios instance
// This catches errors from components using axios directly
setupAxiosInterceptor(axios);
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        handleSubscriptionRequired(error);
        handleSessionExpired(error);
        return Promise.reject(error);
    }
);

export default apiClient;

// Export a function to make API calls with automatic error handling
export const api = {
    get: (url, config = {}) => apiClient.get(url, config),
    post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
    put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config),
    patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config)
};
