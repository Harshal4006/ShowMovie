import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Bell, X, Menu, TicketPlus, Check, Trash2, BellOff, Loader2, LayoutDashboard } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import "./Navbar.css";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications } from "../../services/api";
import { useUserContext } from "../../hooks/UserContext";

const NavItem = memo(({ text, to }) => (
  <Link
    to={to}
    className="relative h-6 overflow-hidden group cursor-pointer"
  >
    <span className="block text-white transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
    <span className="absolute left-0 top-full block text-red-600 transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
  </Link>
));

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
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 shrink-0">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="rounded-full p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-green-400"
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          className="rounded-full p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn, isLoading: isUserLoading, isAdmin } = useUserContext();
  
  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) return;
      
      const data = await getNotifications(token);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (isSignedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [isSignedIn, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = useCallback(async (id) => {
    try {
      const token = await getToken();
      await markNotificationRead(token, id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Silent fail
    }
  }, [getToken]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      const token = await getToken();
      await markAllNotificationsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silent fail
    }
  }, [getToken]);

  const handleDelete = useCallback(async (id) => {
    try {
      const token = await getToken();
      await deleteNotification(token, id);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // Silent fail
    }
  }, [getToken, notifications]);

  const handleClearAll = useCallback(async () => {
    try {
      const token = await getToken();
      await clearAllNotifications(token);
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      // Silent fail
    }
  }, [getToken]);

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-3 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-24 2xl:px-36">
      <Link to="/" className="inline-block shrink-0">
        <span className="animate-gradient bg-linear-to-r from-black via-red-600 to-black bg-size-[200%_200%] bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl md:text-3xl">
          ShowMovie
        </span>
      </Link>

      <div className="hidden xl:flex items-center gap-6 px-5 py-3 text-sm font-medium text-white 2xl:gap-8 2xl:px-6 md:text-base">
        <NavItem text="Home" to="/" />
        <NavItem text="Movies" to="/movies" />
        <NavItem text="Theaters" to="/theaters" />
        <NavItem text="Releases" to="/releases" />
        {isSignedIn && <NavItem text="Favorite" to="/favorite" />}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
        <SignedIn>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="relative rounded-full p-2 text-red-800 transition hover:bg-white/10 xl:block 2xl:p-2.5"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 2xl:h-6 2xl:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Mobile backdrop */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm sm:hidden"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] max-h-[70vh] sm:max-h-96 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl animate-dropdown origin-top-right">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
                    <h3 className="text-sm sm:text-base font-semibold text-white">Notifications</h3>
                    <div className="flex gap-1.5 sm:gap-2">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={handleMarkAllRead}
                            className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                            title="Mark all as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleClearAll}
                            className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
                            title="Clear all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={toggleNotifications}
                        className="rounded-full p-2 sm:p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
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
                            onMarkRead={handleMarkRead}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="redirect">
            <button className="whitespace-nowrap rounded-full bg-red-600 px-4 py-2 text-xs font-medium text-white transition duration-300 hover:bg-red-400 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:text-base">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus size={16} />}
                onClick={() => navigate("/my-booking")}
              />
              {!isUserLoading && isAdmin && (
                <UserButton.Action
                  label="Admin Dashboard"
                  labelIcon={<LayoutDashboard size={16} />}
                  onClick={() => navigate("/admin")}
                />
              )}
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        <Menu
          onClick={toggleMobileMenu}
          className="h-6 w-6 cursor-pointer text-red-800 sm:h-7 sm:w-7 xl:hidden"
          aria-label="Open menu"
        />
      </div>

      <div
        className={`fixed top-0 left-0 flex h-screen w-full flex-col items-center justify-center gap-6 bg-black/90 px-6 text-base font-medium text-white backdrop-blur transition-transform duration-300 sm:gap-8 sm:text-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <X
          onClick={toggleMobileMenu}
          className="absolute top-5 right-5 h-6 w-6 cursor-pointer sm:top-6 sm:right-6 sm:h-7 sm:w-7"
          aria-label="Close menu"
        />

        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={() => setIsOpen(false)}
        >
          Movies
        </Link>
        <Link
          to="/theaters"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={() => setIsOpen(false)}
        >
          Theaters
        </Link>
        <Link
          to="/releases"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={() => setIsOpen(false)}
        >
          Releases
        </Link>
        <Link
          to="/favorite"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={() => setIsOpen(false)}
        >
          Favorite
        </Link>
      </div>
    </div>
  );
};

export default Navbar;