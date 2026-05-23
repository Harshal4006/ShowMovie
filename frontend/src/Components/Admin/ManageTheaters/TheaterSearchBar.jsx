import { Search } from 'lucide-react';

const TheaterSearchBar = ({ value, onChange }) => (
  <div className="relative mb-6 max-w-md">
    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    <input
      type="text"
      placeholder="Search theaters..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-800 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
    />
  </div>
);

export default TheaterSearchBar;
