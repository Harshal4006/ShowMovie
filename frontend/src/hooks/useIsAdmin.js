import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const useIsAdmin = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const role = user.publicMetadata?.role;
    setIsAdmin(role === 'admin');
    setIsLoading(false);
  }, [isLoaded, isSignedIn, user]);

  return { isAdmin, isLoading, isSignedIn };
};

export default useIsAdmin;