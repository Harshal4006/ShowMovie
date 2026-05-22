import { LogOut } from "lucide-react";

const SidebarUserSection = ({ onLogout }) => (
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
);

export default SidebarUserSection;
