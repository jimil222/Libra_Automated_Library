// Mock API functions - replace with actual API calls when backend is ready
import { dummyBooks } from '../data/dummyBooks';
import { dummyRequests } from '../data/dummyRequests';
import { dummyRecommendations } from '../data/dummyRecommendations';
import { dummyRobotStatus } from '../data/dummyRobotStatus';
import { dummyUsers } from '../data/dummyUsers';

// Import dummyRequests to ensure we're modifying the actual array
// This is already imported above, but we need to make sure we're working with the actual reference

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage keys
const STORAGE_KEY_REQUESTS = 'libra_requests';

// Helper functions for localStorage persistence
const getStoredRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading requests from localStorage:', error);
  }
  return null;
};

const saveRequestsToStorage = (requests) => {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  } catch (error) {
    console.error('Error saving requests to localStorage:', error);
  }
};

// Get current requests array (from localStorage or return empty array)
const getRequestsArray = () => {
  const stored = getStoredRequests();
  // Return stored requests if they exist, otherwise return empty array
  // Don't initialize with dummy data - start fresh for new installations
  if (stored !== null) {
    // Validate it's an array
    if (Array.isArray(stored)) {
      // Filter out any invalid requests (missing required fields)
      const validRequests = stored.filter(req => 
        req && 
        typeof req.id !== 'undefined' && 
        typeof req.book_id !== 'undefined' && 
        typeof req.student_id !== 'undefined' && 
        typeof req.status !== 'undefined'
      );
      // If we filtered out invalid requests, save the cleaned array
      if (validRequests.length !== stored.length) {
        console.warn(`Filtered out ${stored.length - validRequests.length} invalid requests`);
        saveRequestsToStorage(validRequests);
      }
      return validRequests;
    } else {
      // Not an array - clear it and return empty
      console.error('libra_requests is not an array, clearing...');
      localStorage.removeItem(STORAGE_KEY_REQUESTS);
      return [];
    }
  }
  // First time - return empty array, don't populate with dummy data
  return [];
};

// Helper to enrich request with book data
const enrichRequestWithBook = (request) => {
  // Try to find book by ID, handle both number and string comparisons
  const bookId = typeof request.book_id === 'string' ? parseInt(request.book_id) : request.book_id;
  const book = dummyBooks.find((b) => b.id === bookId || b.id === request.book_id);
  
  // If we found a book, use it. Otherwise, try to preserve the existing book data.
  // If no book data exists at all, create a minimal book object to prevent display issues
  const enrichedBook = book || request.book || { 
    id: bookId || request.book_id, 
    book_id: 'N/A', 
    title: 'Unknown Book', 
    author: 'Unknown Author' 
  };
  
  return {
    ...request,
    book_id: bookId || request.book_id, // Ensure book_id is consistently a number
    book: enrichedBook
  };
};

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
  let filteredBooks = dummyBooks;
  
  // Filter by query if provided
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredBooks = dummyBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.book_id.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Return all books (including issued ones) so students can see their own issued books
  // The BookCard component will handle disabling request buttons for non-available books
  return filteredBooks;
};

export const getBookById = async (id) => {
  await delay();
  return dummyBooks.find((book) => book.id === parseInt(id));
};

// Requests
export const getRequests = async (studentId = null, status = null) => {
  await delay();
  let requests = getRequestsArray();
  
  // Enrich requests with current book data (ensures book info is up-to-date)
  requests = requests.map(enrichRequestWithBook);
  
  // Filter by student ID if provided
  if (studentId !== null) {
    const studentIdNum = typeof studentId === 'string' ? parseInt(studentId) : studentId;
    requests = requests.filter((req) => {
      const reqStudentId = typeof req.student_id === 'string' ? parseInt(req.student_id) : req.student_id;
      return reqStudentId === studentIdNum;
    });
  }
  
  // Filter by status if provided
  if (status) {
    requests = requests.filter((req) => req.status === status);
  }
  
  return requests;
};

export const createRequest = async (studentId, bookId) => {
  await delay();
  const currentRequests = getRequestsArray();
  
  // Get the book to check its current status
  const book = dummyBooks.find((b) => b.id === bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  
  // Check if student already has a pending or active request for this book
  // Note: Rejected requests allow re-requesting
  const existingRequest = currentRequests.find(req => {
    if (req.student_id !== studentId || req.book_id !== bookId) return false;
    if (req.status === 'pending') return true;
    // If approved, check if book is still issued (not available)
    if (req.status === 'approved' && book.status !== 'available') return true;
    // Rejected requests don't block new requests
    return false;
  });
  
  if (existingRequest) {
    throw new Error('You have already requested this book. Please wait for it to be processed or returned.');
  }
  
  // Check if student has reached the limit of 5 active requests
  const activeRequests = currentRequests.filter(req => {
    if (req.student_id !== studentId) return false;
    if (req.status === 'pending') return true;
    // If approved, check if the book is still issued
    if (req.status === 'approved') {
      const requestBook = dummyBooks.find((b) => b.id === req.book_id);
      return requestBook && requestBook.status !== 'available';
    }
    return false;
  });
  
  if (activeRequests.length >= 5) {
    throw new Error('You have reached the maximum limit of 5 active book requests. Please return a book before requesting another one.');
  }
  
  const maxId = currentRequests.length > 0 
    ? Math.max(...currentRequests.map(r => r.id || 0))
    : 0;
  
  // Find the book and ensure we have complete book data
  const bookData = dummyBooks.find((b) => b.id === bookId);
  if (!bookData) {
    throw new Error('Book not found');
  }
  
  // Create request with minimal book information (to reduce localStorage size)
  // Full book data will be enriched when loading requests
  const newRequest = {
    id: maxId + 1,
    student_id: studentId,
    book_id: bookId, // Store as number for consistency
    status: 'pending',
    requested_at: new Date().toISOString(),
    approved_at: null,
    // Store minimal book info for quick display (will be enriched on load)
    book: {
      id: bookData.id,
      book_id: bookData.book_id,
      title: bookData.title,
      author: bookData.author
    }
  };
  const updatedRequests = [...currentRequests, newRequest];
  saveRequestsToStorage(updatedRequests);
  return newRequest;
};

export const updateRequestStatus = async (requestId, status) => {
  await delay();
  const currentRequests = getRequestsArray();
  const requestIndex = currentRequests.findIndex((req) => req.id === parseInt(requestId));
  if (requestIndex !== -1) {
    const request = currentRequests[requestIndex];
    const bookId = request.book_id;
    
    // Find the book in dummyBooks array
    const book = dummyBooks.find((b) => b.id === bookId);
    
    if (status === 'approved') {
      // Approve the request
      request.status = 'approved';
      request.approved_at = new Date().toISOString();
      
      // Mark book as issued and assign to student
      if (book) {
        book.status = 'issued';
        book.reserved_by = request.student_id;
      }
    } else if (status === 'rejected') {
      // Reject the request
      request.status = 'rejected';
      
      // Keep book available (or make it available again if it was reserved)
      if (book) {
        book.status = 'available';
        book.reserved_by = null;
      }
    }
    
    saveRequestsToStorage(currentRequests);
    return enrichRequestWithBook(request);
  }
  return null;
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
    const currentRequests = getRequestsArray();
    // Check if there's already a pending request for this book by this student
    const existingRequestIndex = currentRequests.findIndex(
      req => req.book_id === book.id && req.student_id === studentId && req.status === 'pending'
    );
    
    if (existingRequestIndex === -1) {
      // Create an auto-approved request for direct issue tracking
      const maxId = currentRequests.length > 0 
        ? Math.max(...currentRequests.map(r => r.id || 0))
        : 0;
      const newRequest = {
        id: maxId + 1,
        student_id: studentId,
        book_id: book.id,
        status: 'approved',
        requested_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        book: book
      };
      const updatedRequests = [...currentRequests, newRequest];
      saveRequestsToStorage(updatedRequests);
    } else {
      // If there's a pending request, auto-approve it
      const existingRequest = currentRequests[existingRequestIndex];
      existingRequest.status = 'approved';
      existingRequest.approved_at = new Date().toISOString();
      saveRequestsToStorage(currentRequests);
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

