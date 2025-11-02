import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-200 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-teal-400 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

