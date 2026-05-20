import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useIsAdmin from '../hooks/useIsAdmin';
import PageLoader from './PageLoader/PageLoader';

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading, isSignedIn, isAuthLoaded } = useIsAdmin();

  if (!isAuthLoaded || isLoading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;