import { memo } from 'react';
import { Bell, Check, X, Trash2 } from "lucide-react";

const NotificationItem = memo(({ notification, onMarkRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'payment_success':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'booking_cancelled':
      case 'payment_failed':
        return <X className="h-4 w-4 text-red-400" />;
      default:
        return <Bell className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 rounded-2xl border border-white/[0.04] p-3 sm:p-4 transition-all hover:bg-white/[0.03] hover:border-white/[0.08] ${
        !notification.isRead ? "border-l-2 border-red-500 bg-red-500/[0.04]" : ""
      }`}
    >
      <div className="mt-0.5 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/[0.08]">
        {getIcon(notification.type)}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className={`text-xs sm:text-sm font-medium leading-snug ${notification.isRead ? "text-gray-400" : "text-white"}`}>
          {notification.title}
        </p>
        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">{notification.message}</p>
        <p className="pt-0.5 text-[10px] sm:text-xs text-gray-600">
          {new Date(notification.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 shrink-0">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="rounded-full p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-green-400"
            aria-label="Mark notification as read"
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          className="rounded-full p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
          aria-label="Delete notification"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

export default NotificationItem;
