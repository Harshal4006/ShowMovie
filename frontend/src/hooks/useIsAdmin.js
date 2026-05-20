import { useUserContext } from './UserContext';

const useIsAdmin = () => {
  const { isAdmin, isLoading, isSignedIn } = useUserContext();

  return { isAdmin, isLoading, isSignedIn };
};

export default useIsAdmin;