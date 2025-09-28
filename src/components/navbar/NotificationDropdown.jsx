import Portal from "../ui/Portal";

const NotificationDropdown = ({ notifications, onClose }) => {
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-11/12 max-w-md bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Notifications list */}
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {n.sender.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{n.sender}</span>{" "}
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
            <button
              onClick={onClose}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
      ,
    </Portal>
  );
};

export default NotificationDropdown;
