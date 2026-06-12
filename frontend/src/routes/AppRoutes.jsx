import { BrowserRouter, Route, Routes } from 'react-router';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute/PublicOnlyRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Projects from '../pages/Projects/Projects';
import ProjectCreate from '../pages/ProjectCreate/ProjectCreate';
import ProjectDetails from '../pages/ProjectDetails/ProjectDetails';
import BugCreate from '../pages/BugCreate/BugCreate';
import BugDetails from '../pages/BugDetails/BugDetails';
import BugEdit from '../pages/BugEdit/BugEdit';
import ProjectEdit from '../pages/ProjectEdit/ProjectEdit';

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
        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
          }
        />
        <Route path="/projects/new" element={
          <ProtectedRoute>
            <ProjectCreate />
          </ProtectedRoute>
          }
        />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId/bugs/new" element={
          <ProtectedRoute>
            <BugCreate />
          </ProtectedRoute>
        } />
        <Route path="/bugs/:id" element={
          <ProtectedRoute>
            <BugDetails />
          </ProtectedRoute>
        } />
        <Route path="/bugs/:id/edit" element={
          <ProtectedRoute>
            <BugEdit />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id/edit" element={
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;