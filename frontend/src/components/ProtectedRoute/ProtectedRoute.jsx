import { useEffect } from 'react';
import { Navigate } from 'react-router';

import { getAuthToken } from '../../services/authStorage';
import { applyAppSettings } from '../../services/settingsStorage';

function ProtectedRoute({ children }) {
  const token = getAuthToken();

  useEffect(() => {
    if (token) {
      applyAppSettings();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;