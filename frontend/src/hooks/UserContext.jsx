import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { request } from '../services/authClient';

const UserContext = createContext(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    console.log('[UserContext] fetchUser called', { clerkLoaded, isSignedIn });

    if (!clerkLoaded) {
      console.log('[UserContext] Clerk not loaded yet, skipping');
      return;
    }

    if (!isSignedIn) {
      console.log('[UserContext] User not signed in, clearing user');
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[UserContext] Getting token...');
      const token = await getToken();
      console.log('[UserContext] Token:', token ? `received (${token.length} chars)` : 'null');

      if (!token) {
        console.log('[UserContext] No token available, clearing user');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[UserContext] Fetching /users/me...');
      const userData = await request('/users/me', { token });
      console.log('[UserContext] User data received:', { id: userData?._id, role: userData?.role });
      setUser(userData);
    } catch (err) {
      console.error('[UserContext] Failed to fetch user:', err.message, err.status);
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, clerkLoaded, getToken]);

  useEffect(() => {
    console.log('[UserContext] useEffect triggered', { clerkLoaded, isSignedIn });
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isSignedIn && user) {
      console.log('[UserContext] User signed out, clearing user');
      setUser(null);
      setError(null);
    }
  }, [isSignedIn, user]);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!clerkLoaded || !isSignedIn) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const userData = await request('/users/me', { token });
        setUser(userData);
      }
    } catch (err) {
      console.warn('[UserContext] Failed to refresh user:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [clerkLoaded, isSignedIn, getToken]);

  const value = {
    user,
    role: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    isLoading,
    isAuthLoaded: clerkLoaded,
    error,
    isSignedIn,
    clearUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;