import { BellOff, Check, Trash2, X, Loader2 } from "lucide-react";
import NotificationItem from "./NotificationItem";

const NotificationPanel = ({
  notifications,
  unreadCount,
  isLoading,
  error,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
  onClose,
}) => (
  <>
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm sm:hidden"
      onClick={onClose}
    />
    <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] max-h-[70vh] sm:max-h-96 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl animate-dropdown origin-top-right">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        <h3 className="text-sm sm:text-base font-semibold text-white">Notifications</h3>
        <div className="flex gap-1.5 sm:gap-2">
          {notifications.length > 0 && (
            <>
          <button
            onClick={onMarkAllRead}
            className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Mark all as read"
            title="Mark all as read"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onClearAll}
            className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
            aria-label="Clear all notifications"
            title="Clear all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
            </>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(70vh-56px)] sm:max-h-80 scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-400">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-4">
            <BellOff className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" />
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="p-2 sm:p-3 space-y-2 sm:space-y-2.5">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);

export default NotificationPanel;
