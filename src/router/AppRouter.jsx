import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import BookIssueReturn from '../pages/BookIssueReturn';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';
import TestPage from '../pages/TestPage';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Small delay to prevent redirect loop
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <Navigate to="/login" replace />
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children || <div className="text-white p-4">Protected route - no content</div>;
};

const LoginRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user && user.id) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <Login />;
};

const RegisterRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user && user.id) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <Register />;
};

const HomeRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user && user.id) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/issue-return"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout>
              <BookIssueReturn />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/test" element={<TestPage />} />
      
      <Route path="/" element={<HomeRoute />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

