import { createContext, useContext, useState, useEffect } from 'react';
import { getBooks, getRequests, getRecommendations, getTopBooksByGenre } from '../utils/api';

const BookContext = createContext(null);

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [topBooksByGenre, setTopBooksByGenre] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBooks = async (query = '') => {
    setLoading(true);
    try {
      const data = await getBooks(query);
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async (studentId = null, status = null) => {
    setLoading(true);
    try {
      const data = await getRequests(studentId, status);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (studentId, fieldOfStudy = null) => {
    setLoading(true);
    try {
      const data = await getRecommendations(studentId, fieldOfStudy);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopBooksByGenre = async () => {
    setLoading(true);
    try {
      const data = await getTopBooksByGenre();
      setTopBooksByGenre(data);
    } catch (error) {
      console.error('Error loading top books by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        requests,
        recommendations,
        topBooksByGenre,
        loading,
        loadBooks,
        loadRequests,
        loadRecommendations,
        loadTopBooksByGenre,
        setBooks,
        setRequests,
        setRecommendations
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

