import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/helpers';

const RequestCard = ({ request, onApprove, onReject, showActions = false }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{request.book?.title}</h3>
          <p className="text-gray-600 text-sm mb-2">by <span className="font-medium">{request.book?.author}</span></p>
          <p className="text-gray-500 text-xs font-mono mb-3">ID: {request.book?.book_id}</p>
          <div className="space-y-1">
            <p className="text-gray-500 text-xs">
              <span className="font-medium">Requested:</span> {formatDate(request.requested_at)}
            </p>
            {request.approved_at && (
              <p className="text-gray-500 text-xs">
                <span className="font-medium">Approved:</span> {formatDate(request.approved_at)}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {showActions && request.status === 'pending' && (
        <div className="flex space-x-3 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => onApprove?.(request.id)}
            className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 active:scale-[0.98] font-semibold text-sm shadow-sm hover:shadow-md"
          >
            Approve
          </button>
          <button
            onClick={() => onReject?.(request.id)}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 active:scale-[0.98] font-semibold text-sm shadow-sm hover:shadow-md"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;

