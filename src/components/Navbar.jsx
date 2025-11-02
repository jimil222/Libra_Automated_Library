import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-8">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base sm:text-lg">L</span>
              </div>
              <span className="text-gray-900 font-bold text-base sm:text-lg hidden xs:inline">Library System</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

