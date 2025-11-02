import { useState, useEffect } from 'react';
import { useBookContext } from '../context/BookContext';
import { useBookActions } from '../hooks/useBookActions';
import { addBook } from '../utils/api';
import RequestCard from '../components/RequestCard';
import RobotStatus from '../components/RobotStatus';
import Modal from '../components/Modal';
import { useNotification } from '../hooks/useNotifications';

const AdminPanel = () => {
  const { requests, loadRequests, loadBooks } = useBookContext();
  const { approveRequest, rejectRequest, loading: actionLoading } = useBookActions();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('requests');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    book_id: '',
    bin_id: ''
  });

  useEffect(() => {
    loadRequests(null, 'pending');
  }, []);

  // Reload requests when switching to requests tab
  useEffect(() => {
    if (activeTab === 'requests') {
      loadRequests(null, 'pending');
    }
  }, [activeTab, loadRequests]);

  const handleApprove = async (requestId) => {
    await approveRequest(requestId);
    loadRequests(null, 'pending');
    loadBooks();
  };

  const handleReject = async (requestId) => {
    await rejectRequest(requestId);
    loadRequests(null, 'pending');
    loadBooks(); // Reload books so rejected book appears as available again
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await addBook({
        ...newBook,
        bin_id: parseInt(newBook.bin_id)
      });
      addNotification('Book added successfully!', 'success');
      setIsAddBookOpen(false);
      setNewBook({ title: '', author: '', book_id: '', bin_id: '' });
      loadBooks();
    } catch (error) {
      addNotification(error.message || 'Failed to add book', 'error');
    }
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage library operations and requests</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        <button
          onClick={() => {
            setActiveTab('requests');
            loadRequests(null, 'pending');
          }}
          className={`flex-1 py-2 sm:py-2.5 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Pending Requests</span>
          <span className="sm:hidden">Requests</span>
          {pendingRequests.length > 0 && ` (${pendingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('add-book')}
          className={`flex-1 py-2 sm:py-2.5 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'add-book'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Add New Book</span>
          <span className="sm:hidden">Add Book</span>
        </button>
        <button
          onClick={() => setActiveTab('robot')}
          className={`flex-1 py-2 sm:py-2.5 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'robot'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Robot Status</span>
          <span className="sm:hidden">Robot</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pending Requests</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => loadRequests(null, 'pending')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
                title="Refresh requests"
              >
                ↻ Refresh
              </button>
              {pendingRequests.length > 0 && (
                <span className="text-xs sm:text-sm text-gray-500">{pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''} pending</span>
              )}
            </div>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No pending requests</p>
              <p className="text-gray-400 text-sm mt-2">All requests have been processed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add-book' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Book</h2>
              <p className="text-gray-500 text-sm mt-1">Add books to the library catalog</p>
            </div>
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="btn-primary"
            >
              + Add Book
            </button>
          </div>
        </div>
      )}

      {activeTab === 'robot' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Robot & Bin Monitoring</h2>
          <RobotStatus />
        </div>
      )}

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        title="Add New Book"
      >
        <form onSubmit={handleAddBook} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Book Title
            </label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
              className="input-modern"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Author
            </label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
              className="input-modern"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              NFC Book ID
            </label>
            <input
              type="text"
              value={newBook.book_id}
              onChange={(e) => setNewBook({ ...newBook, book_id: e.target.value })}
              required
              className="input-modern font-mono"
              placeholder="NFC-001"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Bin ID
            </label>
            <input
              type="number"
              value={newBook.bin_id}
              onChange={(e) => setNewBook({ ...newBook, bin_id: e.target.value })}
              required
              className="input-modern"
              placeholder="1"
              min="1"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddBookOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Add Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;

