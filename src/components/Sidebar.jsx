import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBook, FaBookOpen, FaCog, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const { isAdmin, isStudent } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FaBook },
    { path: '/issue-return', label: 'Issue/Return', icon: FaBookOpen }
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin Panel', icon: FaCog }
  ];

  const links = isAdmin ? adminLinks : isStudent ? studentLinks : [];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-[3.75rem] sm:top-20 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FaTimes className="text-xl text-gray-700" /> : <FaBars className="text-xl text-gray-700" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-14 sm:top-16 left-0 z-30 w-64 bg-white border-r border-gray-200 min-h-screen lg:min-h-[calc(100vh-4rem)] p-4 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
                }
              >
                <Icon className="text-xl flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

