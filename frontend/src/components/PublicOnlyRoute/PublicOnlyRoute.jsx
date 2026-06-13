import { useEffect } from 'react';
import { Navigate } from 'react-router';

import { getAuthToken } from '../../services/authStorage';
import { applyDefaultPublicAppearance, getStartPage } from '../../services/settingsStorage';

function PublicOnlyRoute({ children }) {
  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      applyDefaultPublicAppearance();
    }
  }, [token]);

  if (token) {
    return <Navigate to={getStartPage()} replace />;
  }

  return children;
}

export default PublicOnlyRoute;