import { Navigate } from 'react-router-dom';
import useIsAdmin from '../hooks/useIsAdmin';
import PageLoader from './PageLoader/PageLoader';
import UnauthorizedPage from './AdminRoute/UnauthorizedPage';

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading, error, isSignedIn } = useIsAdmin();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (error || !isAdmin) {
    return <UnauthorizedPage />;
  }

  return children;
};

export default AdminRoute;