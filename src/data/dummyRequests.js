export const dummyRequests = [
  {
    id: 1,
    student_id: 1,
    book_id: 3,
    status: 'pending',
    requested_at: '2024-01-23T09:00:00Z',
    approved_at: null,
    book: {
      id: 3,
      book_id: 'NFC-003',
      title: '1984',
      author: 'George Orwell'
    }
  },
  {
    id: 2,
    student_id: 1,
    book_id: 5,
    status: 'approved',
    requested_at: '2024-01-22T14:30:00Z',
    approved_at: '2024-01-22T15:00:00Z',
    book: {
      id: 5,
      book_id: 'NFC-005',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger'
    }
  },
  {
    id: 3,
    student_id: 2,
    book_id: 1,
    status: 'rejected',
    requested_at: '2024-01-21T11:00:00Z',
    approved_at: null,
    book: {
      id: 1,
      book_id: 'NFC-001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald'
    }
  }
];

