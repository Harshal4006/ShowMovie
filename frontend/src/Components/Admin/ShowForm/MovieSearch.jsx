import { Search } from "lucide-react";

const MovieSearch = ({ query, onQueryChange, onSearch }) => (
  <div className="flex gap-2 mb-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onSearch())}
        placeholder="Search movies to add show..."
        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
      />
    </div>
    <button
      type="button"
      onClick={onSearch}
      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500"
    >
      Search
    </button>
  </div>
);

export default MovieSearch;
