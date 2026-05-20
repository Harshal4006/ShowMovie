import { useMemo } from 'react';
import { useUserContext } from './UserContext';

const useIsAdmin = () => {
  const context = useUserContext();
  
  return useMemo(() => ({
    isAdmin: context.isAdmin,
    isLoading: context.isLoading,
    isSignedIn: context.isSignedIn,
    isAuthLoaded: context.isAuthLoaded,
  }), [context.isAdmin, context.isLoading, context.isSignedIn, context.isAuthLoaded]);
};

export default useIsAdmin;