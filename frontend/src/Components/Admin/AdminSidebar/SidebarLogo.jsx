import { Film, X } from "lucide-react";

const SidebarLogo = ({ isMobile, onCloseMobile }) => (
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
);

export default SidebarLogo;
