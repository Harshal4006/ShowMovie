import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Film,
  Ticket,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SidebarContent from "./SidebarContent";
import MobileHeader from "./MobileHeader";

const pageTitleMap = {
  "/admin": "Dashboard",
  "/admin/add-show": "Add Show",
  "/admin/list-shows": "List Shows",
  "/admin/list-bookings": "List Bookings",
  "/admin/manage-theaters": "Manage Theaters",
  "/admin/list-movies": "Manage Movies",
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: PlusCircle, label: "Add Show", path: "/admin/add-show" },
  { icon: Film, label: "List Shows", path: "/admin/list-shows" },
  { icon: Ticket, label: "List Bookings", path: "/admin/list-bookings" },
  { icon: Building2, label: "Manage Theaters", path: "/admin/manage-theaters" },
  { icon: Film, label: "Manage Movies", path: "/admin/list-movies" },
];

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPageTitle = pageTitleMap[location.pathname] || "Admin";

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) setIsMobileOpen(false);
  };

  return (
    <>
      <MobileHeader
        pageTitle={currentPageTitle}
        onOpenMenu={() => setIsMobileOpen(true)}
      />

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
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
