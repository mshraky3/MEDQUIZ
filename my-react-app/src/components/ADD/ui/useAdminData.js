import { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../../../utils/adminApi.js';

/**
 * Fetch hook for admin pages — replaces the copy-pasted
 * `useState/useEffect/try-catch` block that used to appear in five pages
 * (Admin.jsx, Accounting.jsx, EngagementPanel.jsx, AdminAnalytics.jsx, ADD.jsx).
 *
 * @param {string|null} url - full URL to GET, or null/undefined to skip fetching
 * @param {object} [options]
 * @param {object} [options.params] - axios query params
 * @param {number} [options.pollMs] - if set, refetch on this interval
 * @returns {{ data, loading, error, reload }}
 */
export function useAdminData(url, { params, pollMs } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState(null);
    // Params can be a fresh object each render; stringify so the effect only
    // re-runs when the actual query changes.
    const paramsKey = params ? JSON.stringify(params) : '';
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const load = useCallback(async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(url, paramsRef.current ? { params: paramsRef.current } : undefined);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, paramsKey]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        if (!pollMs || !url) return undefined;
        const id = setInterval(load, pollMs);
        return () => clearInterval(id);
    }, [pollMs, url, load]);

    return { data, loading, error, reload: load };
}

export default useAdminData;
