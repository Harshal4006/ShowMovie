import { Film, Calendar, TrendingUp, Star, Search } from "lucide-react";

const tabs = [
  { key: "now-playing", label: "Now Playing", icon: Film },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
  { key: "trending", label: "Trending", icon: TrendingUp },
  { key: "popular", label: "Most Popular", icon: Star },
  { key: "search", label: "Search", icon: Search },
];

const MovieTabBar = ({ activeTab, onTabChange }) => (
  <div className="flex gap-1.5 sm:gap-2 mb-4 border-b border-gray-700 pb-2 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {tabs.map(({ key, label, icon: Icon }) => (
      <button
        key={key}
        type="button"
        onClick={() => onTabChange(key)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition shrink-0 ${
          activeTab === key
            ? "bg-red-600 text-white"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        {label}
      </button>
    ))}
  </div>
);

export default MovieTabBar;
