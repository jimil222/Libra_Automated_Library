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
    if (searchQuery) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.book_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
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

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
          <span>Welcome back, {user?.first_name}!</span>
          <FaHandPaper className="text-blue-600 text-xl sm:text-2xl" />
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Browse and request books from the library</p>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Field of Study Recommendations Section */}
      {recommendations && recommendations.books && recommendations.books.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <FaStar className="text-xl mr-2 text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Recommended for You {user?.field_of_study && <span className="hidden sm:inline">({user.field_of_study})</span>}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {recommendations.books.map((book) => (
              <RecommendationCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Top Books by Genre Section */}
      {Object.keys(topBooksByGenre).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Books by Genre</h2>
          <div className="space-y-8">
            {Object.entries(topBooksByGenre).map(([genre, genreBooks]) => {
              if (genreBooks.length === 0) return null;
              return (
                <div key={genre}>
                  <div className="flex items-center mb-4">
                    <FaBook className="text-xl mr-2 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">{genre}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {genreBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onRequest={handleRequest}
                        disabled={actionLoading}
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
        <div>
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-lg sm:text-xl mr-2 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Requests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {myRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {/* Books Section */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center">
            <FaBook className="text-lg sm:text-xl mr-2 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Available Books</h2>
          </div>
          {filteredBooks.length > 0 && (
            <span className="text-xs sm:text-sm text-gray-500">{filteredBooks.length} books available</span>
          )}
        </div>
        {filteredBooks.length === 0 ? (
          <div className="card text-center py-12">
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
                disabled={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

