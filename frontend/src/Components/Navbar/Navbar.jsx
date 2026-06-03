import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, TicketPlus, LayoutDashboard } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import "./Navbar.css";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications } from "../../services/api";
import { useUserContext } from "../../hooks/UserContext";
import NavItem from "./NavItem";
import NotificationPanel from "./NotificationPanel";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
    if (!isSignedIn) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isSignedIn, fetchNotifications]);

  const handleClickOutside = useCallback((event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleMarkRead = useCallback(async (id) => {
    try {
      const token = await getToken();
      await markNotificationRead(token, id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  }, [getToken]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      const token = await getToken();
      await markAllNotificationsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  }, [getToken]);

  const handleDelete = useCallback(async (id) => {
    try {
      const token = await getToken();
      await deleteNotification(token, id);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  }, [getToken, notifications]);

  const handleClearAll = useCallback(async () => {
    try {
      const token = await getToken();
      await clearAllNotifications(token);
      setNotifications([]);
      setUnreadCount(0);
    } catch { /* silent */ }
  }, [getToken]);

  return (
    <div className={`${isScrolled ? "fixed" : "absolute"} top-0 left-0 z-50 flex w-full items-center justify-between gap-3 px-4 py-3 backdrop-blur transition-all duration-300 sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-24 2xl:px-36`}>
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
              onClick={() => setShowNotifications(prev => !prev)}
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
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                isLoading={isLoading}
                error={error}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onDelete={handleDelete}
                onClearAll={handleClearAll}
                onClose={() => setShowNotifications(false)}
              />
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
            appearance={{ elements: { avatarBox: "w-8 h-8 sm:w-9 sm:h-9" } }}
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
          onClick={() => setIsOpen(prev => !prev)}
          className="h-6 w-6 cursor-pointer text-red-800 sm:h-7 sm:w-7 xl:hidden"
          aria-label="Open menu"
        />
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Navbar;
