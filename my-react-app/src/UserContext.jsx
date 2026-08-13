import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/safeStorage.js';
// apiClient (and the 34KB axios it wraps) is dynamically imported inside
// logout() below, not here — UserProvider wraps the whole app from main.jsx,
// so a static import here put axios in the eager bundle every visitor
// downloads, including an anonymous landing-page visitor who never logs in.

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  // authReady stays false until we've finished reading localStorage on mount.
  // Route guards must wait for this before deciding to redirect, otherwise an
  // authenticated user is bounced to /login on the first render (token not yet
  // hydrated).
  const [authReady, setAuthReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = safeGetItem('user');
    const storedToken = safeGetItem('sessionToken');
    if (storedUser && storedToken) {
      try {
        setUserState(JSON.parse(storedUser));
        setSessionToken(storedToken);
      } catch (_) {
        setUserState(null);
        setSessionToken(null);
      }
    }
    setAuthReady(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (user && sessionToken) {
      safeSetItem('user', JSON.stringify(user));
      safeSetItem('sessionToken', sessionToken);
    } else {
      safeRemoveItem('user');
      safeRemoveItem('sessionToken');
    }
  }, [user, sessionToken]);

  // Helper to set user and token together. Memoized: several consumers put
  // setUser in their own useCallback/useEffect dependency arrays (QUIZS.jsx's
  // load(), for one) — a plain function recreated on every UserProvider
  // render gave every one of those a new identity every render too, for no
  // reason tied to an actual state change.
  const setUser = useCallback((userObj, token) => {
    setUserState(userObj);
    setSessionToken(token);
  }, []);

  // Clears the session everywhere: best-effort on the server (so the account
  // isn't left marked "logged" and blocking login elsewhere), then always
  // locally regardless of whether the server call succeeds — a user must be
  // able to log out even when offline.
  const logout = useCallback(async () => {
    const username = user?.username;
    try {
      if (username) {
        const { api } = await import('./utils/apiClient.js');
        await api.post('/logout', { username });
      }
    } catch (_) {
      // Ignore — local logout below still proceeds.
    } finally {
      setUserState(null);
      setSessionToken(null);
    }
  }, [user?.username]);

  // Memoized so a consumer that only reads e.g. `user` doesn't re-render just
  // because this provider re-rendered for an unrelated reason — without this,
  // {user, setUser, sessionToken, authReady, logout} was a new object every
  // single render.
  const value = useMemo(
    () => ({ user, setUser, sessionToken, authReady, logout }),
    [user, setUser, sessionToken, authReady, logout]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};