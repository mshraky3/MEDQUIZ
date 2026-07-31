/**
 * Auth context — mirrors my-react-app/src/UserContext.jsx
 * Persists session across app restarts using SecureStore + AsyncStorage.
 */

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import {
    getStoredUser,
    setStoredUser,
    getSecureToken,
    setSecureToken,
    clearAllStorage,
} from '../utils/storage';

interface User {
    id: number;
    username: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    sessionToken: string | null;
    isLoading: boolean;
    setUser: (user: User | null, token: string | null) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    sessionToken: null,
    isLoading: true,
    setUser: () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [sessionToken, setSessionTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Bootstrap — load persisted session on mount
    useEffect(() => {
        (async () => {
            try {
                const [storedUser, storedToken] = await Promise.all([
                    getStoredUser(),
                    getSecureToken(),
                ]);
                if (storedUser && storedToken) {
                    setUserState(storedUser);
                    setSessionTokenState(storedToken);
                }
            } catch {
                // first launch or corrupt storage — start fresh
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const setUser = useCallback(async (userObj: User | null, token: string | null) => {
        setUserState(userObj);
        setSessionTokenState(token);

        if (userObj && token) {
            await Promise.all([setStoredUser(userObj), setSecureToken(token)]);
        } else {
            await clearAllStorage();
        }
    }, []);

    const logout = useCallback(async () => {
        setUserState(null);
        setSessionTokenState(null);
        await clearAllStorage();
    }, []);

    return (
        <AuthContext.Provider value={{ user, sessionToken, isLoading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
