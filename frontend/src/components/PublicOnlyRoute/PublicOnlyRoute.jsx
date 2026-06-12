import { Navigate } from 'react-router';

import { getAuthToken } from '../../services/authStorage';

function PublicOnlyRoute({ children }) {
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicOnlyRoute;