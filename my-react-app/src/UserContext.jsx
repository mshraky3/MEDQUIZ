import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('sessionToken');
    if (storedUser && storedToken) {
      setUserState(JSON.parse(storedUser));
      setSessionToken(storedToken);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (user && sessionToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('sessionToken', sessionToken);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
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