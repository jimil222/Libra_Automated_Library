import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookActions } from '../hooks/useBookActions';
import NFCScanner from '../components/NFCScanner';
import { FaCheck, FaTimes } from 'react-icons/fa';

const BookIssueReturn = () => {
  const { user } = useAuth();
  const { handleNfcIssue, handleNfcReturn, loading } = useBookActions();
  const [mode, setMode] = useState('issue');
  const [result, setResult] = useState(null);

  const handleScan = async (bookId) => {
    setResult(null);
    try {
      if (mode === 'issue') {
        const response = await handleNfcIssue(bookId, user?.id);
        setResult({
          success: true,
          message: `Book issued successfully! Due date: ${new Date(response.dueDate).toLocaleDateString()}`,
          book: response.book
        });
      } else {
        const response = await handleNfcReturn(bookId);
        setResult({
          success: true,
          message: 'Book returned successfully!',
          book: response.book
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.message || 'Operation failed'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue / Return Books</h1>
        <p className="text-gray-600">Use NFC to issue or return books from the library</p>
      </div>

      <div className="flex space-x-4 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        <button
          onClick={() => {
            setMode('issue');
            setResult(null);
          }}
          type="button"
          className={`flex-1 py-3 rounded-md font-semibold text-sm transition-all duration-200 ${
            mode === 'issue'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Issue Book
        </button>
        <button
          onClick={() => {
            setMode('return');
            setResult(null);
          }}
          type="button"
          className={`flex-1 py-3 rounded-md font-semibold text-sm transition-all duration-200 ${
            mode === 'return'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Return Book
        </button>
      </div>

      <NFCScanner mode={mode} onScan={handleScan} loading={loading} />

      {result && (
        <div
          className={`card ${
            result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                result.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {result.success ? <FaCheck className="text-xl" /> : <FaTimes className="text-xl" />}
            </div>
            <div className="flex-1">
              <h3
                className={`text-lg font-bold mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.success ? 'Success!' : 'Error'}
              </h3>
              <p className={`mb-3 ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.message}</p>
              {result.book && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Book:</span> {result.book.title}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Author:</span> {result.book.author}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">ID:</span> <span className="font-mono">{result.book.book_id}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookIssueReturn;

