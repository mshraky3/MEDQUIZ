import React, { createContext, useState, useEffect } from 'react';
import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/safeStorage.js';

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

  return (
    <UserContext.Provider value={{ user, setUser, sessionToken, authReady }}>
      {children}
    </UserContext.Provider>
  );
}; 