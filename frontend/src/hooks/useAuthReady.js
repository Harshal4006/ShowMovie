// Deprecated - kept for reference

import { useAuth } from '@clerk/clerk-react';

const useAuthReady = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  
  return {
    isReady: isLoaded && isSignedIn,
    isLoaded,
    isSignedIn,
    getToken,
  };
};

// Deprecated hook kept for reference
export default useAuthReady;