/**
 * Admin API client.
 * ------------------------------------------------------------------
 * Axios instance used by every admin page (Admin, ADD, ADDQ, Bank,
 * TempLinks, QuestionReports). Attaches the admin key — entered once on
 * the AdminGate screen and kept in localStorage — as an `x-admin-key`
 * header, which the backend's adminAuth middleware validates against
 * the ADMIN_KEY environment variable.
 *
 * Admin pages import this as `axios`, so call sites stay unchanged:
 *   import axios from '../../utils/adminApi.js';
 */
import axios from 'axios';

export const ADMIN_KEY_STORAGE = 'sqb_admin_key';

export function getAdminKey() {
    try {
        return localStorage.getItem(ADMIN_KEY_STORAGE) || '';
    } catch {
        return '';
    }
}

export function setAdminKey(key) {
    try {
        localStorage.setItem(ADMIN_KEY_STORAGE, key);
    } catch { /* storage unavailable — key just won't persist */ }
}

export function clearAdminKey() {
    try {
        localStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch { /* ignore */ }
}

const adminApi = axios.create();

adminApi.interceptors.request.use((config) => {
    const key = getAdminKey();
    if (key) config.headers['x-admin-key'] = key;
    return config;
});

export default adminApi;
