/**
 * Axios client mirroring my-react-app/src/utils/apiClient.js
 * - Injects session credentials into every request
 * - Auto-reports API errors
 */

import axios from 'axios';
import Config from '../constants/config';
import { getStoredUser, getSecureToken } from './storage';

const apiClient = axios.create({
    baseURL: Config.API_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inject session credentials
apiClient.interceptors.request.use(async (config) => {
    try {
        const user = await getStoredUser();
        const sessionToken = await getSecureToken();

        if (user?.username && sessionToken) {
            if (config.method === 'get') {
                config.params = {
                    ...config.params,
                    username: user.username,
                    sessionToken,
                };
            } else {
                config.data = {
                    ...config.data,
                    username: user.username,
                    sessionToken,
                };
            }
        }
    } catch {
        // storage unavailable — proceed unauthenticated
    }
    return config;
});

// Response interceptor — report errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        try {
            // @ts-ignore - dynamic import resolves at runtime
            const { reportApiError } = await import('./errorTracking');
            reportApiError(error, error.config, error.response);
        } catch {
            // error tracking unavailable — swallow
        }
        return Promise.reject(error);
    },
);

export default apiClient;

export const api = {
    get: (url: string, config = {}) => apiClient.get(url, config),
    post: (url: string, data = {}, config = {}) => apiClient.post(url, data, config),
    put: (url: string, data = {}, config = {}) => apiClient.put(url, data, config),
    delete: (url: string, config = {}) => apiClient.delete(url, config),
    patch: (url: string, data = {}, config = {}) => apiClient.patch(url, data, config),
};
