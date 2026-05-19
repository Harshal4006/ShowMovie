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

    // Check Clerk publicMetadata first (no backend needed)
    const clerkRole = user.publicMetadata?.role;
    if (clerkRole === 'admin') {
      setIsAdmin(true);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Fallback: check MongoDB role via API
    try {
      const token = await getToken();
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const userData = await getMe(token);
      const isUserAdmin = userData?.role === 'admin';

      // If DB says admin but Clerk doesn't, sync the role to Clerk
      if (isUserAdmin && clerkRole !== 'admin') {
        // Admin set via MongoDB directly - treat as admin
        setIsAdmin(true);
      } else {
        setIsAdmin(isUserAdmin);
      }
      setError(null);
    } catch (err) {
      // If backend is unreachable, trust Clerk metadata
      setError(err.message);
      // If we already know from Clerk they're not admin, keep false
      // If we don't know (Clerk says not admin), treat as not admin
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