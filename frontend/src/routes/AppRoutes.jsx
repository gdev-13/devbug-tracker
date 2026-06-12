import { BrowserRouter, Route, Routes } from 'react-router';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute/PublicOnlyRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <PublicOnlyRoute>
              <Home />
            </PublicOnlyRoute>
          }
        />

        <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;