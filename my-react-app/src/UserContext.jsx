import React, { createContext, useState, useEffect } from 'react';
import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/safeStorage.js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

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
    <UserContext.Provider value={{ user, setUser, sessionToken }}>
      {children}
    </UserContext.Provider>
  );
}; 