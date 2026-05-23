import { memo } from 'react';
import { Search } from 'lucide-react';

const TheatersEmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
      <Search className="h-8 w-8 text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-white">No theaters found</h3>
    <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters</p>
    <button
      onClick={onClear}
      className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
    >
      Clear Filters
    </button>
  </div>
);

const MemoTheatersEmptyState = memo(TheatersEmptyState);
MemoTheatersEmptyState.displayName = "TheatersEmptyState";
export default MemoTheatersEmptyState;
