import React from 'react';
import { Search } from 'lucide-react';

const TheatersSearchFilter = ({
  search, onSearchChange,
  activeFilter, onFilterChange,
  allFacilities,
}) => (
  <div className="sticky top-20 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 backdrop-blur-2xl sm:px-6 sm:py-5 transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by theater name or location..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-white/[0.06] bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-red-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...allFacilities].map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === f
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20 ring-1 ring-red-500/30"
                  : "border border-white/[0.06] bg-white/[0.03] text-gray-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TheatersSearchFilter;
