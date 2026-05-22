import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SidebarNav = ({ items, locationPath, onNavClick }) => (
  <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
    <div className="px-3 mb-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</span>
    </div>
    {items.map((item) => {
      const isActive =
        locationPath === item.path ||
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
            <ChevronRight
              size={14}
              className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            />
          )}
        </NavLink>
      );
    })}
  </nav>
);

export default SidebarNav;
