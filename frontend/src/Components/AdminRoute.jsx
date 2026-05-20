import { Navigate } from 'react-router-dom';
import useIsAdmin from '../hooks/useIsAdmin';
import PageLoader from './PageLoader/PageLoader';

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading, isSignedIn, isAuthLoaded } = useIsAdmin();

  if (!isAuthLoaded || isLoading) {
    console.log('[AdminRoute] Waiting for auth to load...', { isAuthLoaded, isLoading });
    return <PageLoader />;
  }

  console.log('[AdminRoute] Auth loaded', { isSignedIn, isAdmin });

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;