// Utility functions to manage localStorage for the library management system

/**
 * Clear all requests from localStorage
 * Use this if you want to start fresh with requests
 */
export const clearRequests = () => {
  try {
    localStorage.removeItem('libra_requests');
    console.log('Requests cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing requests:', error);
    return false;
  }
};

/**
 * Get all localStorage keys related to this app
 */
export const getAppStorageKeys = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('libra_') || key === 'user' || key === 'token')) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Clear all app-related data from localStorage
 * WARNING: This will log you out and clear all requests
 */
export const clearAllAppData = () => {
  try {
    const keys = getAppStorageKeys();
    keys.forEach(key => localStorage.removeItem(key));
    console.log('All app data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

/**
 * Check if localStorage has corrupted data
 */
export const validateStorage = () => {
  try {
    const requestsData = localStorage.getItem('libra_requests');
    if (requestsData) {
      const requests = JSON.parse(requestsData);
      if (!Array.isArray(requests)) {
        console.error('libra_requests is not an array, clearing...');
        clearRequests();
        return false;
      }
      // Validate each request has required fields
      const invalidRequests = requests.filter(req => 
        !req.id || !req.book_id || !req.student_id || !req.status
      );
      if (invalidRequests.length > 0) {
        console.warn('Found invalid requests:', invalidRequests.length);
        // Clean up invalid requests
        const validRequests = requests.filter(req => 
          req.id && req.book_id && req.student_id && req.status
        );
        localStorage.setItem('libra_requests', JSON.stringify(validRequests));
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error validating storage:', error);
    return false;
  }
};

