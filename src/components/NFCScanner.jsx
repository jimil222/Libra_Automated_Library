import { useState } from 'react';
import { FaMobileAlt } from 'react-icons/fa';

const NFCScanner = ({ onScan, mode = 'issue', loading = false }) => {
  const [bookId, setBookId] = useState('');

  const handleScan = () => {
    if (bookId.trim()) {
      onScan(bookId.trim());
      setBookId('');
    } else {
      // Simulate NFC scan
      const simulatedBookId = `NFC-${Math.floor(Math.random() * 900) + 100}`;
      onScan(simulatedBookId);
    }
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <FaMobileAlt className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          NFC {mode === 'issue' ? 'Issue' : 'Return'}
        </h2>
        <p className="text-gray-600 text-sm">Tap your book on the NFC reader or enter Book ID manually</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Book ID or Book Name
        </label>
        <input
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          placeholder="Enter Book ID (e.g., NFC-001) or Book Name"
          className="input-modern"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can enter either the Book ID or the full Book Name
        </p>
      </div>

      <button
        onClick={handleScan}
        disabled={loading}
        className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Tap to ${mode === 'issue' ? 'Issue' : 'Return'}`
        )}
      </button>

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm animate-pulse">Robot retrieving bin...</p>
        </div>
      )}
    </div>
  );
};

export default NFCScanner;

