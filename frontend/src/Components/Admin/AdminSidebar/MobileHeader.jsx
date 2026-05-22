import { Menu, Film } from "lucide-react";

const MobileHeader = ({ pageTitle, onOpenMenu }) => (
  <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 lg:hidden">
    <div className="flex items-center gap-3">
      <button
        onClick={onOpenMenu}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 shadow-sm shadow-red-600/20">
          <Film size={14} className="text-white" />
        </div>
        <h1 className="text-sm font-semibold text-white">{pageTitle}</h1>
      </div>
    </div>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-600 text-xs font-medium text-gray-300 ring-1 ring-white/10">
      A
    </div>
  </div>
);

export default MobileHeader;
