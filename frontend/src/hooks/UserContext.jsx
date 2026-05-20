import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCountRef = useRef(0);

  const fetchUserData = useCallback(async () => {
    if (!clerkLoaded || !isSignedIn) {
      if (!isSignedIn) {
        setUser(null);
        setFavorites([]);
        setIsLoading(false);
      }
      return;
    }

    fetchCountRef.current += 1;
    const currentFetch = fetchCountRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      const [userData, favoritesData] = await Promise.all([
        request('/users/me', { token }),
        request('/users/favorites', { token })
      ]);

      if (currentFetch !== fetchCountRef.current) return;

      setUser(userData);
      setFavorites(favoritesData?.favorites || []);
    } catch (err) {
      if (currentFetch !== fetchCountRef.current) return;
      setError(err.message);
      setUser(null);
      setFavorites([]);
    } finally {
      if (currentFetch === fetchCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSignedIn, clerkLoaded, getToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const clearUser = useCallback(() => {
    setUser(null);
    setFavorites([]);
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!clerkLoaded || !isSignedIn) return;

    try {
      const token = await getToken();
      if (token) {
        const [userData, favoritesData] = await Promise.all([
          request('/users/me', { token }),
          request('/users/favorites', { token })
        ]);
        setUser(userData);
        setFavorites(favoritesData?.favorites || []);
      }
    } catch {
      // Silent fail
    }
  }, [clerkLoaded, isSignedIn, getToken]);

  const value = useMemo(() => ({
    user,
    favorites,
    role: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    isLoading,
    isAuthLoaded: clerkLoaded,
    error,
    isSignedIn,
    clearUser,
    refreshUser,
  }), [user, favorites, isLoading, clerkLoaded, error, isSignedIn, clearUser, refreshUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;