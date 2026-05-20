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

export default useAuthReady;