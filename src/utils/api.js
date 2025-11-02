// Mock API functions - replace with actual API calls when backend is ready
import { dummyBooks } from '../data/dummyBooks';
import { dummyRequests } from '../data/dummyRequests';
import { dummyRecommendations } from '../data/dummyRecommendations';
import { dummyRobotStatus } from '../data/dummyRobotStatus';
import { dummyUsers } from '../data/dummyUsers';

// Import dummyRequests to ensure we're modifying the actual array
// This is already imported above, but we need to make sure we're working with the actual reference

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Authentication
export const login = async (email, password) => {
  await delay();
  const user = dummyUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: `mock-jwt-token-${user.id}` };
};

export const register = async (userData) => {
  await delay();
  const newUser = {
    id: dummyUsers.length + 1,
    ...userData,
    created_at: new Date().toISOString()
  };
  // Store the new user in dummyUsers array
  dummyUsers.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token: `mock-jwt-token-${newUser.id}` };
};

// Books
export const getBooks = async (query = '') => {
  await delay();
  if (!query) return dummyBooks;
  const lowerQuery = query.toLowerCase();
  return dummyBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.book_id.toLowerCase().includes(lowerQuery)
  );
};

export const getBookById = async (id) => {
  await delay();
  return dummyBooks.find((book) => book.id === parseInt(id));
};

// Requests
export const getRequests = async (studentId = null, status = null) => {
  await delay();
  let requests = [...dummyRequests];
  if (studentId) {
    requests = requests.filter((req) => req.student_id === parseInt(studentId));
  }
  if (status) {
    requests = requests.filter((req) => req.status === status);
  }
  return requests;
};

export const createRequest = async (studentId, bookId) => {
  await delay();
  const newRequest = {
    id: dummyRequests.length + 1,
    student_id: studentId,
    book_id: bookId,
    status: 'pending',
    requested_at: new Date().toISOString(),
    approved_at: null,
    book: dummyBooks.find((b) => b.id === bookId)
  };
  dummyRequests.push(newRequest);
  return newRequest;
};

export const updateRequestStatus = async (requestId, status) => {
  await delay();
  const request = dummyRequests.find((req) => req.id === parseInt(requestId));
  if (request) {
    request.status = status;
    if (status === 'approved') {
      request.approved_at = new Date().toISOString();
    }
  }
  return request;
};

// Recommendations
export const getRecommendations = async (studentId, fieldOfStudy = null) => {
  await delay();
  // If field of study is provided, generate recommendations based on it
  if (fieldOfStudy) {
    const recommendedBooks = dummyBooks
      .filter(book => 
        book.genre === fieldOfStudy && 
        book.status === 'available'
      )
      .slice(0, 6)
      .map(book => ({
        id: book.id,
        book_id: book.book_id,
        title: book.title,
        author: book.author
      }));
    
    if (recommendedBooks.length > 0) {
      return {
        id: 1,
        student_id: parseInt(studentId),
        book_ids: recommendedBooks.map(b => b.id),
        generated_at: new Date().toISOString(),
        books: recommendedBooks
      };
    }
  }
  
  // Fallback to stored recommendations
  return dummyRecommendations.find((rec) => rec.student_id === parseInt(studentId)) || null;
};

// Get top books by genre
export const getTopBooksByGenre = async () => {
  await delay();
  const genreMap = {};
  
  dummyBooks.forEach(book => {
    if (!genreMap[book.genre]) {
      genreMap[book.genre] = [];
    }
    if (book.status === 'available') {
      genreMap[book.genre].push(book);
    }
  });
  
  // Get top 3 books from each genre
  const topByGenre = {};
  Object.keys(genreMap).forEach(genre => {
    topByGenre[genre] = genreMap[genre].slice(0, 3);
  });
  
  return topByGenre;
};

// Robot Status
export const getRobotStatus = async () => {
  await delay(200);
  return dummyRobotStatus;
};

// Admin
export const addBook = async (bookData) => {
  await delay();
  const newBook = {
    id: dummyBooks.length + 1,
    ...bookData,
    status: 'available',
    reserved_by: null,
    created_at: new Date().toISOString()
  };
  dummyBooks.push(newBook);
  return newBook;
};

// NFC Operations - can accept book ID or book name
export const nfcIssue = async (bookIdentifier, studentId) => {
  await delay(1000);
  // Try to find by book_id, id, or title (case insensitive)
  const book = dummyBooks.find((b) => 
    b.book_id === bookIdentifier || 
    b.id === parseInt(bookIdentifier) ||
    b.title.toLowerCase() === bookIdentifier.toLowerCase()
  );
  if (!book) throw new Error('Book not found. Please check the Book ID or Book Name.');
  
  // If book is available and being directly issued, create a request record for tracking
  if (book.status === 'available') {
    // Check if there's already a pending request for this book by this student
    const existingRequest = dummyRequests.find(
      req => req.book_id === book.id && req.student_id === studentId && req.status === 'pending'
    );
    
    if (!existingRequest) {
      // Create an auto-approved request for direct issue tracking
      const newRequest = {
        id: dummyRequests.length + 1,
        student_id: studentId,
        book_id: book.id,
        status: 'approved',
        requested_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        book: book
      };
      dummyRequests.push(newRequest);
    } else {
      // If there's a pending request, auto-approve it
      existingRequest.status = 'approved';
      existingRequest.approved_at = new Date().toISOString();
    }
  }
  
  if (book.status !== 'available' && book.status !== 'reserved') {
    throw new Error('Book is not available for issue');
  }
  book.status = 'issued';
  book.reserved_by = studentId;
  return { success: true, book, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) };
};

export const nfcReturn = async (bookIdentifier) => {
  await delay(1000);
  // Try to find by book_id, id, or title (case insensitive)
  const book = dummyBooks.find((b) => 
    b.book_id === bookIdentifier || 
    b.id === parseInt(bookIdentifier) ||
    b.title.toLowerCase() === bookIdentifier.toLowerCase()
  );
  if (!book) throw new Error('Book not found. Please check the Book ID or Book Name.');
  book.status = 'available';
  book.reserved_by = null;
  return { success: true, book };
};

