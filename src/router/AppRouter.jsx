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

const AppRouter = () => {
  let user, loading;
  
  try {
    const auth = useAuth();
    user = auth.user;
    loading = auth.loading;
  } catch (error) {
    console.error('Error in AppRouter useAuth:', error);
    return (
      <div style={{ padding: '50px', background: 'red', color: 'white' }}>
        <h1>Router Error</h1>
        <pre>{error.toString()}</pre>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          !user || !user.id ? (
            <Login />
          ) : (
            <Navigate 
              to={user.role === 'admin' ? '/admin' : '/dashboard'} 
              replace 
            />
          )
        } 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} 
      />
      
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
      
      <Route 
        path="/" 
        element={
          <Navigate 
            to={user && user.id ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} 
            replace 
          />
        } 
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

