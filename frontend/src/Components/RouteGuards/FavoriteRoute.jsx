import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUserContext } from '../../hooks/UserContext';
import PageLoader from '../PageLoader/PageLoader';

const FavoriteRoute = ({ children }) => {
  const { isSignedIn, isAuthLoaded, isLoading } = useUserContext();

  if (!isAuthLoaded || isLoading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    toast.error('Please sign in to view your favorites');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default FavoriteRoute;