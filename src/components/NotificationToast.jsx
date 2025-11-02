import { useNotification } from '../hooks/useNotifications';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyles = (type) => {
    const styles = {
      success: 'bg-green-500 border-green-600',
      error: 'bg-red-500 border-red-600',
      info: 'bg-blue-500 border-blue-600',
      warning: 'bg-yellow-500 border-yellow-600'
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(
            notification.type
          )} text-white px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border min-w-[300px] max-w-md animate-slide-in-right`}
        >
          <div className="flex items-start justify-between">
            <p className="flex-1 pr-4">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;

