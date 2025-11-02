export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-50 text-green-700 border border-green-200',
    reserved: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    issued: 'bg-blue-50 text-blue-700 border border-blue-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    idle: 'bg-gray-50 text-gray-700 border border-gray-200',
    moving: 'bg-blue-50 text-blue-700 border border-blue-200',
    retrieving: 'bg-purple-50 text-purple-700 border border-purple-200',
    available_bin: 'bg-green-50 text-green-700 border border-green-200',
    retrieving_bin: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

export const calculateDueDate = (days = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const searchBooks = (books, query) => {
  if (!query.trim()) return books;
  const lowerQuery = query.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.book_id.toLowerCase().includes(lowerQuery)
  );
};

