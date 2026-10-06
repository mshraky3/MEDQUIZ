import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Every read and write is wrapped: storage can be unavailable (web private
 * mode, a full disk, a corrupted keystore) and the app must still render.
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    /* best effort */
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* best effort */
  }
}

export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown): Promise<void> {
  await setItem(key, JSON.stringify(value));
}

/** The session token lives in the Android keystore; the web preview has none. */
const secureAvailable = Platform.OS !== 'web';

export async function getSecret(key: string): Promise<string | null> {
  try {
    return secureAvailable ? await SecureStore.getItemAsync(key) : await getItem(key);
  } catch {
    return null;
  }
}

export async function setSecret(key: string, value: string): Promise<void> {
  try {
    if (secureAvailable) await SecureStore.setItemAsync(key, value);
    else await setItem(key, value);
  } catch {
    /* best effort */
  }
}

export async function removeSecret(key: string): Promise<void> {
  try {
    if (secureAvailable) await SecureStore.deleteItemAsync(key);
    else await removeItem(key);
  } catch {
    /* best effort */
  }
}

export const KEYS = {
  user: 'sqb.user',
  token: 'sqb.sessionToken',
  lang: 'sqb_lang',
  quizMode: 'sqb_quiz_mode',
  cookieConsent: 'sqb.consent',
  quizSave: (slot: string) => `sqb_quiz_${slot}`,
  storyAsked: (username: string) => `sqb.storyAsked.${username}`,
} as const;
