import { FaStar } from 'react-icons/fa';

const RecommendationCard = ({ book }) => {
  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-lg text-yellow-500" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Recommended</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm">by <span className="font-medium">{book.author}</span></p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-500 font-mono">ID: {book.book_id}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;

