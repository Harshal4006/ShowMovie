import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getMe } from '../services/api';

const useIsAdmin = () => {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const fetchRoleFromBackend = async () => {
      try {
        const token = await getToken();
        const userData = await getMe(token);
        
        if (userData.user?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn('Failed to fetch role from backend:', err.message);
        
        const role = user.publicMetadata?.role;
        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleFromBackend();
  }, [clerkLoaded, isSignedIn, user, getToken]);

  return { isAdmin, isLoading, isSignedIn, getToken };
};

export default useIsAdmin;