import React, { createContext, useState, useEffect } from 'react';
import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/safeStorage.js';
import { api } from './utils/apiClient.js';

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

  // Helper to set user and token together
  const setUser = (userObj, token) => {
    setUserState(userObj);
    setSessionToken(token);
  };

  // Clears the session everywhere: best-effort on the server (so the account
  // isn't left marked "logged" and blocking login elsewhere), then always
  // locally regardless of whether the server call succeeds — a user must be
  // able to log out even when offline.
  const logout = async () => {
    const username = user?.username;
    try {
      if (username) {
        await api.post('/logout', { username });
      }
    } catch (_) {
      // Ignore — local logout below still proceeds.
    } finally {
      setUserState(null);
      setSessionToken(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, sessionToken, authReady, logout }}>
      {children}
    </UserContext.Provider>
  );
};