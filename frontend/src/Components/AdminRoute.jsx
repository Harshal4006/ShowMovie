import { Navigate } from 'react-router-dom';
import useIsAdmin from '../hooks/useIsAdmin';
import PageLoader from './PageLoader/PageLoader';

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading, isSignedIn } = useIsAdmin();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;