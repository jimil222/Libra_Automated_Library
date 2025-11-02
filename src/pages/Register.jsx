import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotifications';

const FIELDS_OF_STUDY = [
  'Computer Science',
  'AI & Data Science',
  'IoT',
  'Information Technology',
  'Mechanical Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Other'
];

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    field_of_study: ''
  });
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }

    if (role === 'student' && !formData.field_of_study) {
      addNotification('Please select your field of study', 'error');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await register({ 
        ...userData, 
        role,
        field_of_study: role === 'student' ? formData.field_of_study : null
      });
      navigate(role === 'admin' ? '/admin' : '/dashboard');
      addNotification('Registration successful!', 'success');
    } catch (error) {
      addNotification(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-sm sm:text-base text-gray-200">Register for a new account</p>
        </div>

        <div className="flex space-x-2 mb-6 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
              role === 'student'
                ? 'bg-gradient-to-r from-indigo-500 to-teal-400 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-indigo-500 to-teal-400 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="john.doe@student.edu"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm password"
            />
          </div>

          {role === 'student' && (
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Field of Study / Branch
              </label>
              <select
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select your field of study</option>
                {FIELDS_OF_STUDY.map((field) => (
                  <option key={field} value={field} className="bg-gray-800 text-white">
                    {field}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-teal-400 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 hover:text-white font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

