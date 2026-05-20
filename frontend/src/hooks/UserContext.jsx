import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getMe } from '../services/api';

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
    if (!clerkLoaded) {
      return;
    }

    if (!isSignedIn) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await getMe(token);
      setUser(userData);
    } catch (err) {
      console.warn('Failed to fetch user:', err.message);
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, clerkLoaded, getToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isSignedIn && user) {
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
        const userData = await getMe(token);
        setUser(userData);
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
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