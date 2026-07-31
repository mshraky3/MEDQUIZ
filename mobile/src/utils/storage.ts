/**
 * Storage abstraction layer
 * - SecureStore for sensitive data (session token)
 * - AsyncStorage for non-sensitive data (preferences, cache)
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    SESSION_TOKEN: 'sessionToken',
    USER: 'user',
    PREFERENCES: 'preferences',
    ERROR_QUEUE: 'errorQueue',
};

// ── Secure storage (session token) ──

export async function getSecureToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.SESSION_TOKEN);
}

export async function setSecureToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SESSION_TOKEN, token);
}

export async function removeSecureToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.SESSION_TOKEN);
}

// ── Async storage (user object, preferences) ──

export async function getStoredUser(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
}

export async function setStoredUser(user: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function removeStoredUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
}

// ── Error queue (offline error capture) ──

export async function getErrorQueue(): Promise<any[]> {
    const raw = await AsyncStorage.getItem(KEYS.ERROR_QUEUE);
    return raw ? JSON.parse(raw) : [];
}

export async function setErrorQueue(queue: any[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.ERROR_QUEUE, JSON.stringify(queue));
}

export async function clearErrorQueue(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.ERROR_QUEUE);
}

// ── Clear all storage (logout) ──

export async function clearAllStorage(): Promise<void> {
    await Promise.all([
        removeSecureToken(),
        removeStoredUser(),
        clearErrorQueue(),
    ]);
}
