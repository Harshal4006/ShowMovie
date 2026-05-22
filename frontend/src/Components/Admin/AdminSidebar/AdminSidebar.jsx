import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Film,
  Ticket,
  Building2,
  LogOut,
  X,
  ChevronRight,
  Menu,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const pageTitleMap = {
  "/admin": "Dashboard",
  "/admin/add-show": "Add Show",
  "/admin/list-shows": "List Shows",
  "/admin/list-bookings": "List Bookings",
  "/admin/manage-theaters": "Manage Theaters",
  "/admin/list-movies": "Manage Movies",
};

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

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: PlusCircle, label: "Add Show", path: "/admin/add-show" },
    { icon: Film, label: "List Shows", path: "/admin/list-shows" },
    { icon: Ticket, label: "List Bookings", path: "/admin/list-bookings" },
    { icon: Building2, label: "Manage Theaters", path: "/admin/manage-theaters" },
    { icon: Film, label: "Manage Movies", path: "/admin/list-movies" },
  ];

  const currentPageTitle = pageTitleMap[location.pathname] || "Admin";

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
      {/* Mobile Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 shadow-sm shadow-red-600/20">
              <Film size={14} className="text-white" />
            </div>
            <h1 className="text-sm font-semibold text-white">{currentPageTitle}</h1>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-600 text-xs font-medium text-gray-300 ring-1 ring-white/10">
          A
        </div>
      </div>

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
            className="fixed left-0 top-0 z-50 h-screen bg-gray-950 border-r border-gray-800 shadow-2xl shadow-black/50 lg:hidden animate-slide-in pt-14"
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
