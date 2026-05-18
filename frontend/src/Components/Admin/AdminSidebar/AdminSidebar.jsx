import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Film,
  Ticket,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SidebarContent = ({ isMobile, navItems, locationPath, onNavClick, onCloseMobile, onLogout }) => (
  <div className={`flex h-full flex-col ${isMobile ? "w-72" : "w-64"}`}>
    {/* Logo Section */}
    <div className="flex items-center justify-between border-b border-gray-800 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/20">
          <Film size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">ShowMovie</h2>
          <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
        </div>
      </div>
      {isMobile && (
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
      <div className="px-3 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</span>
      </div>
      {navItems.map((item) => {
        const isActive = locationPath === item.path ||
          (item.path !== "/admin" && locationPath.startsWith(item.path));
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={onNavClick}
            className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-red-600 to-red-600/80 text-white shadow-lg shadow-red-600/25"
                : "text-gray-400 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <span className={`flex-shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`}>
              <Icon size={18} />
            </span>
            <span className="flex-1">{item.label}</span>
            {!isActive && (
              <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            )}
          </NavLink>
        );
      })}
    </nav>

    {/* Bottom Section */}
    <div className="border-t border-gray-800 p-3 space-y-1.5">
      {/* User Section */}
      <div className="mt-4 rounded-xl bg-gray-900/50 p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-medium text-gray-300">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@showmovie.com</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
);

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // sidebar navigation items
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: PlusCircle, label: "Add Show", path: "/admin/add-show" },
    { icon: Film, label: "List Shows", path: "/admin/list-shows" },
    { icon: Ticket, label: "List Bookings", path: "/admin/list-bookings" },
    { icon: Film, label: "Manage Movies", path: "/admin/list-movies" },
  ];

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed left-3 top-3 z-50 rounded-lg bg-gray-900/90 backdrop-blur-sm p-2.5 text-white shadow-lg shadow-black/20 lg:hidden border border-gray-800"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-gray-950 border-r border-gray-800">
        <SidebarContent
          isMobile={false}
          navItems={navItems}
          locationPath={location.pathname}
          onNavClick={handleNavClick}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            role="presentation"
          />
          <aside
            className="fixed left-0 top-0 z-50 h-screen bg-gray-950 border-r border-gray-800 shadow-2xl shadow-black/50 lg:hidden animate-slide-in"
            role="dialog"
            aria-modal="true"
            aria-label="Admin sidebar"
          >
            <SidebarContent
              isMobile={true}
              navItems={navItems}
              locationPath={location.pathname}
              onNavClick={handleNavClick}
              onCloseMobile={() => setIsMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
