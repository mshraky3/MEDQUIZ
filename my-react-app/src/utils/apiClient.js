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
                // Add session credentials to query params for GET requests
                if (config.method === 'get') {
                    config.params = {
                        ...config.params,
                        username: user.username,
                        sessionToken: sessionToken
                    };
                } else {
                    // Add to body for other requests
                    config.data = {
                        ...config.data,
                        username: user.username,
                        sessionToken: sessionToken
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

// Add response interceptor for error tracking
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Report the error to the error tracking system
        reportApiError(error, error.config, error.response);

        // Re-throw to let the application handle it
        return Promise.reject(error);
    }
);

// Also set up the interceptor on the default axios instance
// This catches errors from components using axios directly
setupAxiosInterceptor(axios);

export default apiClient;

// Export a function to make API calls with automatic error handling
export const api = {
    get: (url, config = {}) => apiClient.get(url, config),
    post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
    put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config),
    patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config)
};
