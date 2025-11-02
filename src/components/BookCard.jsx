import { StatusBadge } from './StatusBadge';

const BookCard = ({ book, onRequest, showRequestButton = true, disabled = false }) => {
  const getButtonText = () => {
    if (book.status !== 'available') return 'Unavailable';
    if (disabled) return 'Requested';
    return 'Request';
  };

  return (
    <div className="card hover:border-gray-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">by <span className="font-medium">{book.author}</span></p>
          <p className="text-gray-500 text-xs font-mono">ID: {book.book_id}</p>
        </div>
        <StatusBadge status={book.status} />
      </div>
      
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Bin #{book.bin_id}
        </div>
        {showRequestButton && (
          <button
            onClick={() => onRequest?.(book.id)}
            disabled={disabled || book.status !== 'available'}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
              disabled || book.status !== 'available'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-primary text-sm py-2'
            }`}
            title={disabled && book.status === 'available' ? 'You have already requested this book' : ''}
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;

