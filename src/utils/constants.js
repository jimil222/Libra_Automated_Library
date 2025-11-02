export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const BOOK_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  ISSUED: 'issued'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const TRANSACTION_TYPE = {
  ISSUE: 'issue',
  RETURN: 'return'
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/dashboard',
  BOOK_ISSUE_RETURN: '/issue-return',
  ADMIN_PANEL: '/admin',
  NOT_FOUND: '/404'
};

