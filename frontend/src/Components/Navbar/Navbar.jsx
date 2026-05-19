import { Link, useNavigate } from "react-router-dom";
import { Bell, X, Menu, TicketPlus, Check, Trash2, BellOff, Loader2, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import "./Navbar.css";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications } from "../../services/api";
import useIsAdmin from "../../hooks/useIsAdmin";

const NavItem = ({ text, to }) => (
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
);

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
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
      className={`group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-white/5 ${
        !notification.isRead ? "border-l-2 border-red-500 bg-red-500/5" : ""
      }`}
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
        {getIcon(notification.type)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${notification.isRead ? "text-gray-400" : "text-white"}`}>
          {notification.title}
        </p>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{notification.message}</p>
        <p className="mt-2 text-xs text-gray-600">
          {new Date(notification.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-green-400"
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const fetchNotifications = async () => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await getNotifications(token);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const token = await getToken();
      await markNotificationRead(token, id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await getToken();
      await markAllNotificationsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await deleteNotification(token, id);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = await getToken();
      await clearAllNotifications(token);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleMobileClick = () => {
    setIsOpen(false);
  };

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
        <NavItem text="Theaters" to="/" />
        <NavItem text="Releases" to="/" />
        <NavItem text="Favorite" to="/favorite" />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
        <SignedIn>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
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
              <div className="absolute right-0 top-full mt-2 w-80 max-h-96 sm:w-96 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <div className="flex gap-2">
                    {notifications.length > 0 && (
                      <>
                        <button
                          onClick={handleMarkAllRead}
                          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                          title="Mark all as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
                          title="Clear all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-sm text-red-400">{error}</div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <BellOff className="h-10 w-10 text-gray-600" />
                      <p className="mt-3 text-sm text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="p-2">
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
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
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
              {!isAdminLoading && isAdmin && (
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
          onClick={openMenu}
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
          onClick={closeMenu}
          className="absolute top-5 right-5 h-6 w-6 cursor-pointer sm:top-6 sm:right-6 sm:h-7 sm:w-7"
          aria-label="Close menu"
        />

        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Movies
        </Link>
        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Theaters
        </Link>
        <Link
          to="/"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Releases
        </Link>
        <Link
          to="/favorite"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center"
          onClick={handleMobileClick}
        >
          Favorite
        </Link>
      </div>
    </div>
  );
};

export default Navbar;