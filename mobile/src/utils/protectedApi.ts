/**
 * Protected API call helpers — mirrors protectedGet/protectedPost from web.
 * Auto-redirects to login on 401.
 */

import axios from 'axios';
import Config from '../constants/config';
import { clearAllStorage, getSecureToken, getStoredUser } from './storage';
import { router } from 'expo-router';

export async function protectedGet(url: string, config: any = {}) {
    const user = await getStoredUser();
    const sessionToken = await getSecureToken();
    if (!user || !sessionToken) throw new Error('Not authenticated');

    const sep = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${sep}username=${encodeURIComponent(user.username)}&sessionToken=${encodeURIComponent(sessionToken)}`;

    try {
        return await axios.get(fullUrl, config);
    } catch (err: any) {
        if (err.response?.status === 401) {
            await clearAllStorage();
            router.replace('/login');
            throw new Error('Session expired');
        }
        throw err;
    }
}

export async function protectedPost(url: string, data: any = {}, config: any = {}) {
    const user = await getStoredUser();
    const sessionToken = await getSecureToken();
    if (!user || !sessionToken) throw new Error('Not authenticated');

    const body = { ...data, username: user.username, sessionToken };

    try {
        return await axios.post(url, body, config);
    } catch (err: any) {
        if (err.response?.status === 401) {
            await clearAllStorage();
            router.replace('/login');
            throw new Error('Session expired');
        }
        throw err;
    }
}
