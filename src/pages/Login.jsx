import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotifications';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      const userRole = response.user.role;
      navigate(userRole === 'admin' ? '/admin' : '/dashboard');
      addNotification('Login successful!', 'success');
    } catch (error) {
      addNotification(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Clear any invalid auth data on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // If user doesn't have valid structure, clear it
        if (!user || !user.id || !user.role) {
          console.log('Clearing invalid user data from localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.reload(); // Reload to reset app state
        }
      } catch (e) {
        console.log('Error parsing user data, clearing localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload(); // Reload to reset app state
      }
    }
  }, []);
  
  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to access your library account</p>
        </div>

        <div className="flex space-x-2 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setRole('student')}
            type="button"
            className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 ${
              role === 'student'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('admin')}
            type="button"
            className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 ${
              role === 'admin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-modern"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-modern"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Create account
          </Link>
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-medium">Student:</span> john.doe@student.edu / password123</p>
            <p><span className="font-medium">Admin:</span> admin@library.edu / admin123</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleClearStorage}
            className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            Clear Storage & Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

