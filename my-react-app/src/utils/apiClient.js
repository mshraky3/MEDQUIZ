/**
 * Axios Instance with Error Tracking
 * Pre-configured axios instance that automatically reports API errors
 */

import axios from 'axios';
import Globals from '../global.js';
import { setupAxiosInterceptor, reportApiError } from './errorTracking';

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

// 402 = subscription required / trial ended (see subscriptionGuard on the
// backend). Route the user to the paywall from wherever the request fired,
// since components don't handle 402 individually. A client-side timer is
// only cosmetic — this is the real enforcement point.
function handleSubscriptionExpired(error) {
    if (error.response?.status !== 402) return;
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    if (path.startsWith('/subscribe') || path.startsWith('/payment')) return;

    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, accessAllowed: false }));
    } catch (e) {
        // Ignore localStorage errors
    }

    const reason = error.response.data?.reason || 'subscription_required';
    window.location.assign(`/subscribe?reason=${encodeURIComponent(reason)}`);
}

// Add response interceptor for error tracking
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Report the error to the error tracking system
        reportApiError(error, error.config, error.response);
        handleSubscriptionExpired(error);

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
        handleSubscriptionExpired(error);
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
