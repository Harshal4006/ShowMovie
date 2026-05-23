import { memo } from 'react';
import { Film } from 'lucide-react';

const TheatersErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
      <Film className="h-8 w-8 text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-white">Failed to load theaters</h3>
    <p className="mt-2 text-sm text-gray-500">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
    >
      Try Again
    </button>
  </div>
);

const MemoTheatersErrorState = memo(TheatersErrorState);
MemoTheatersErrorState.displayName = "TheatersErrorState";
export default MemoTheatersErrorState;
