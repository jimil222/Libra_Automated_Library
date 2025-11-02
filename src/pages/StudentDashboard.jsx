import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookContext } from '../context/BookContext';
import { useBookActions } from '../hooks/useBookActions';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import RequestCard from '../components/RequestCard';
import RecommendationCard from '../components/RecommendationCard';
import { FaBook, FaClipboardList, FaStar, FaHandPaper } from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { books, requests, recommendations, topBooksByGenre, loadBooks, loadRequests, loadRecommendations, loadTopBooksByGenre, loading: booksLoading } = useBookContext();
  const { requestBook, loading: actionLoading } = useBookActions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    loadBooks();
    loadTopBooksByGenre();
    if (user?.id) {
      loadRequests(user.id);
      loadRecommendations(user.id, user?.field_of_study);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.field_of_study]);

  useEffect(() => {
    // Filter books: show only available books in the main list
    // (students can see issued books in their "My Requests" section)
    const availableBooks = books.filter(book => book.status === 'available');
    
    if (searchQuery) {
      const filtered = availableBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.book_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(availableBooks);
    }
  }, [searchQuery, books]);

  // Show loading state AFTER all hooks
  if (booksLoading && books.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Loading books...</div>
        </div>
      </div>
    );
  }

  const handleRequest = async (bookId) => {
    if (user?.id) {
      await requestBook(user.id, bookId);
      loadRequests(user.id);
      loadBooks();
    }
  };

  const myRequests = requests.filter((req) => req.student_id === user?.id);

  // Helper: Get book status from books array
  const getBookStatus = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book?.status || 'unknown';
  };

  // Helper: Check if student has already requested a specific book (pending or approved)
  const isBookRequested = (bookId) => {
    if (!user?.id) return false;
    const request = myRequests.find(req => req.book_id === bookId);
    if (!request) return false;
    
    // If pending, it's requested
    if (request.status === 'pending') return true;
    
    // If approved, check if book is still issued (not available)
    if (request.status === 'approved') {
      const bookStatus = getBookStatus(bookId);
      return bookStatus !== 'available';
    }
    
    // If rejected, student can request again (return false)
    if (request.status === 'rejected') return false;
    
    return false;
  };

  // Helper: Count active requests (pending or approved where book is not available)
  const getActiveRequestsCount = () => {
    if (!user?.id) return 0;
    return myRequests.filter(req => {
      if (req.status === 'pending') return true;
      if (req.status === 'approved') {
        const bookStatus = getBookStatus(req.book_id);
        return bookStatus !== 'available';
      }
      return false;
    }).length;
  };

  const activeRequestsCount = getActiveRequestsCount();
  const maxBooksLimit = 5;
  const hasReachedLimit = activeRequestsCount >= maxBooksLimit;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
            <span>Welcome back, {user?.first_name}!</span>
            <FaHandPaper className="text-blue-600 text-xl sm:text-2xl" />
          </h1>
          {user?.id && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Active Requests: {activeRequestsCount}/{maxBooksLimit}</span>
              {hasReachedLimit && (
                <span className="ml-2 text-red-600 font-semibold">(Limit Reached)</span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-600">Browse and request books from the library</p>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Field of Study Recommendations Section */}
      {recommendations && recommendations.books && recommendations.books.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 sm:p-8 border-2 border-yellow-200 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-400 rounded-lg p-2 mr-3">
              <FaStar className="text-xl text-yellow-900" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recommended for You
              </h2>
              {user?.field_of_study && (
                <p className="text-sm text-gray-600 mt-1">{user.field_of_study} Books</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.books.map((book) => (
              <RecommendationCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Top Books by Genre Section */}
      {Object.keys(topBooksByGenre).length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 rounded-lg p-2 mr-3">
              <FaBook className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Top Books by Genre
              </h2>
              <p className="text-sm text-gray-600 mt-1">Popular books organized by category</p>
            </div>
          </div>
          <div className="space-y-8">
            {Object.entries(topBooksByGenre).map(([genre, genreBooks]) => {
              if (genreBooks.length === 0) return null;
              return (
                <div key={genre} className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-4 pb-3 border-b border-blue-100">
                    <FaBook className="text-lg mr-2 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">{genre}</h3>
                    <span className="ml-auto text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                      {genreBooks.length} {genreBooks.length === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {genreBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onRequest={handleRequest}
                        disabled={actionLoading || isBookRequested(book.id) || hasReachedLimit}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Requests Section */}
      {myRequests.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 sm:p-8 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-200">
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-lg p-2 mr-3">
                <FaClipboardList className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  My Requests
                </h2>
                <p className="text-sm text-gray-600 mt-1">Track your book requests and approvals</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center bg-purple-100 rounded-full px-4 py-2">
              <span className="text-sm font-semibold text-purple-700">
                {myRequests.length} {myRequests.length === 1 ? 'request' : 'requests'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {/* Books Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 border-2 border-green-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-200 flex-wrap gap-3">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-lg p-2 mr-3">
              <FaBook className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Available Books
              </h2>
              <p className="text-sm text-gray-600 mt-1">Browse and request from our library</p>
            </div>
          </div>
          {filteredBooks.length > 0 && (
            <div className="bg-green-100 rounded-full px-4 py-2">
              <span className="text-sm font-semibold text-green-700">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available
              </span>
            </div>
          )}
        </div>
        {filteredBooks.length === 0 ? (
          <div className="card text-center py-12 bg-white">
            <p className="text-gray-500 text-lg">No books found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRequest={handleRequest}
                disabled={actionLoading || isBookRequested(book.id) || hasReachedLimit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

