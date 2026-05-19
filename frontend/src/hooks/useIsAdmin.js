import { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const useIsAdmin = () => {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    if (!clerkLoaded) return;

    if (!isSignedIn || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const clerkRole = user.publicMetadata?.role;
    if (clerkRole === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, [isSignedIn, clerkLoaded, user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { isAdmin, isLoading, error: null, isSignedIn, checkAdminStatus };
};

export default useIsAdmin;