import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

