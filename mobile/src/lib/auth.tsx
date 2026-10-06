import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { api, setApiHandlers, setApiSession } from './api';
import { KEYS, getJson, getSecret, removeItem, removeSecret, setJson, setSecret } from './storage';

/**
 * The signed-in account, as the server returns it from /login. Only the fields
 * the app reads are named; the rest pass through untouched.
 */
export type SessionUser = {
  id: number;
  username: string;
  email?: string;
  track?: string;
  subscription_status?: string;
  subscription_expiry_date?: string | null;
  /** null = unlimited (paid, admin-created or grandfathered). */
  free_questions_remaining?: number | null;
  free_question_allowance?: number;
  accessAllowed?: boolean;
  terms_accepted?: boolean;
  [key: string]: unknown;
};

/**
 * /login answers with the whole accounts row, plaintext password and session
 * token included (the website keeps all of it in localStorage). The app keeps
 * only the fields it reads: the token has its own keystore slot, and nothing
 * else about the account needs to sit on the device.
 */
const USER_FIELDS = [
  'id',
  'username',
  'email',
  'track',
  'subscription_status',
  'subscription_expiry_date',
  'free_questions_remaining',
  'free_question_allowance',
  'accessAllowed',
  'terms_accepted',
  'account_type',
  'is_admin_created',
  'grandfathered_at',
  'preferred_lang',
] as const;

export function sanitizeUser(raw: unknown): SessionUser {
  const src = (raw || {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  USER_FIELDS.forEach((field) => {
    if (src[field] !== undefined) out[field] = src[field];
  });
  return out as SessionUser;
}

type AuthValue = {
  user: SessionUser | null;
  token: string | null;
  /** false until the stored session has been read and (briefly) validated. */
  ready: boolean;
  /** True when the last sign-out was forced by the server (expired session). */
  sessionExpired: boolean;
  clearExpiredNotice: () => void;
  signIn: (user: unknown, token: string) => Promise<void>;
  updateUser: (patch: Partial<SessionUser>) => void;
  signOut: () => Promise<void>;
  /** Re-reads subscription state + free allowance from the server (throttled). */
  refreshSubscription: (force?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  token: null,
  ready: false,
  sessionExpired: false,
  clearExpiredNotice: () => {},
  signIn: async () => {},
  updateUser: () => {},
  signOut: async () => {},
  refreshSubscription: async () => {},
});

/**
 * Reads the account's subscription state and free allowance from the server.
 * Doubles as the "is this stored session still valid?" probe: it is an
 * authenticated read, so a replaced or expired token answers 401.
 */
async function fetchSubscriptionPatch(current: SessionUser): Promise<Partial<SessionUser> | null> {
  const data = await api.get(`/api/user-subscription/${current.id}`);
  if (!data) return null;
  if (!data.enforcement) return { free_questions_remaining: null };
  const left = data.user?.freeQuestionsRemaining;
  return {
    free_questions_remaining: typeof left === 'number' ? left : null,
    subscription_status: data.user?.subscription_status ?? current.subscription_status,
    subscription_expiry_date: data.user?.subscription_expiry_date ?? null,
    free_question_allowance: typeof data.allowance === 'number' ? data.allowance : current.free_question_allowance,
  };
}

const VALIDATE_BUDGET_MS = 3500;
const SUBSCRIPTION_REFETCH_MS = 20_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const lastSubscriptionFetch = useRef(0);
  const userRef = useRef<SessionUser | null>(null);
  userRef.current = user;

  const persist = useCallback(async (nextUser: SessionUser | null, nextToken: string | null) => {
    if (nextUser && nextToken) {
      await Promise.all([setJson(KEYS.user, nextUser), setSecret(KEYS.token, nextToken)]);
    } else {
      await Promise.all([removeItem(KEYS.user), removeSecret(KEYS.token)]);
    }
  }, []);

  const clearLocal = useCallback(
    async (expired: boolean) => {
      setApiSession(null);
      setUser(null);
      setToken(null);
      setSessionExpired(expired);
      await persist(null, null);
    },
    [persist]
  );

  // Hydrate from storage once.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [storedUser, storedToken] = await Promise.all([getJson<SessionUser>(KEYS.user), getSecret(KEYS.token)]);
      if (!alive) return;
      if (storedUser?.username && storedToken) {
        const clean = sanitizeUser(storedUser);
        setApiSession({ username: clean.username, token: storedToken });
        setUser(clean);
        setToken(storedToken);

        // A token that another device has since replaced would pass the local
        // check and then 401 on the first request ("signed in, instantly kicked
        // out"). Ask the server first, but never hold the splash for long and
        // never treat being offline as being signed out. This is an
        // authenticated read (a 401 signs the app out through the API handler),
        // not /session-validate: that endpoint compares a DATE column against a
        // 30-minute window and answers "expired" for nearly every real session.
        await Promise.race([
          fetchSubscriptionPatch(clean).then((patch) => {
            if (!patch || !alive) return;
            const merged = { ...clean, ...patch };
            setUser(merged);
            void setJson(KEYS.user, merged);
          }),
          new Promise<void>((resolve) => setTimeout(resolve, VALIDATE_BUDGET_MS)),
        ]).catch(() => {
          /* offline or server down: stay signed in */
        });
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [clearLocal]);

  // 401 / 402 from any request.
  useEffect(() => {
    setApiHandlers({
      onSessionExpired: () => {
        void clearLocal(true);
      },
      onPaymentRequired: (data) => {
        // Only a 402 that talks about the free allowance carries `remaining`
        // (the quiz paywall). A subscriber-only feature or a failed payment
        // verification is also a 402 and says nothing about the allowance, so
        // it must not zero the counter.
        if (typeof data?.remaining !== 'number') return;
        const remaining = data.remaining;
        setUser((current) => {
          if (!current) return current;
          const next = { ...current, free_questions_remaining: remaining };
          void setJson(KEYS.user, next);
          return next;
        });
      },
    });
  }, [clearLocal]);

  const signIn = useCallback(
    async (rawUser: unknown, nextToken: string) => {
      const clean = sanitizeUser(rawUser);
      setApiSession({ username: clean.username, token: nextToken });
      setUser(clean);
      setToken(nextToken);
      setSessionExpired(false);
      await persist(clean, nextToken);
    },
    [persist]
  );

  const updateUser = useCallback((patch: Partial<SessionUser>) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      void setJson(KEYS.user, next);
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    const username = userRef.current?.username;
    // Best effort on the server (so the account is not left marked "logged"),
    // then always locally: a student must be able to sign out while offline.
    try {
      if (username) await api.post('/logout', { username }, { timeoutMs: 6000 });
    } catch {
      /* ignore */
    }
    await clearLocal(false);
  }, [clearLocal]);

  const refreshSubscription = useCallback(
    async (force = false) => {
      const current = userRef.current;
      if (!current?.id) return;
      if (!force && Date.now() - lastSubscriptionFetch.current < SUBSCRIPTION_REFETCH_MS) return;
      lastSubscriptionFetch.current = Date.now();
      try {
        const patch = await fetchSubscriptionPatch(current);
        if (patch) updateUser(patch);
      } catch {
        /* a heads-up, not a gate: keep whatever we last knew */
      }
    },
    [updateUser]
  );

  // Coming back to the app after a while: the allowance may have changed.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshSubscription();
    });
    return () => sub.remove();
  }, [refreshSubscription]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      token,
      ready,
      sessionExpired,
      clearExpiredNotice: () => setSessionExpired(false),
      signIn,
      updateUser,
      signOut,
      refreshSubscription,
    }),
    [user, token, ready, sessionExpired, signIn, updateUser, signOut, refreshSubscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/** True when this account is on the free tier (paid / admin accounts are unlimited). */
export const isFreeTier = (user: SessionUser | null | undefined): boolean =>
  typeof user?.free_questions_remaining === 'number';
