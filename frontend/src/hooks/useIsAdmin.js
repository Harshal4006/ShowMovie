import { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { getMe } from '../services/api';

const useIsAdmin = () => {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAdminStatus = useCallback(async () => {
    if (!clerkLoaded) return;

    if (!isSignedIn || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    const clerkRole = user.publicMetadata?.role;
    if (clerkRole === 'admin') {
      setIsAdmin(true);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const userData = await getMe(token);
      setIsAdmin(userData?.role === 'admin');
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, clerkLoaded, getToken, user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { isAdmin, isLoading, error, isSignedIn, checkAdminStatus };
};

export default useIsAdmin;