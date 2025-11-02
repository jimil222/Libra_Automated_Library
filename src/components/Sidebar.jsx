import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBook, FaBookOpen, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const { isAdmin, isStudent } = useAuth();

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FaBook },
    { path: '/issue-return', label: 'Issue/Return', icon: FaBookOpen }
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin Panel', icon: FaCog }
  ];

  const links = isAdmin ? adminLinks : isStudent ? studentLinks : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`
              }
            >
              <Icon className="text-xl" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

