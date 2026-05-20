import { useUserContext } from './UserContext';

const useIsAdmin = () => {
  const { isAdmin, isLoading, isSignedIn, isAuthLoaded } = useUserContext();

  return { isAdmin, isLoading, isSignedIn, isAuthLoaded };
};

export default useIsAdmin;