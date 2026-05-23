import { memo } from 'react';
import { Monitor, Star, Film, Sparkles } from 'lucide-react';

const TheatersStatsStrip = ({ totalScreens, theaterCount, imaxCount, dxCount }) => (
  <div className="relative z-10 -mt-16 mb-8 animate-fade-up">
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-6 py-6 backdrop-blur-xl sm:px-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div className="flex flex-col items-center text-center">
          <Monitor className="mb-2 h-5 w-5 text-red-500" />
          <div className="text-2xl font-bold text-white">{totalScreens}+</div>
          <div className="mt-0.5 text-xs text-gray-500">Screens</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <Star className="mb-2 h-5 w-5 text-red-500" />
          <div className="text-2xl font-bold text-white">{theaterCount}</div>
          <div className="mt-0.5 text-xs text-gray-500">Premium Theaters</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <Film className="mb-2 h-5 w-5 text-red-500" />
          <div className="text-2xl font-bold text-white">{imaxCount}</div>
          <div className="mt-0.5 text-xs text-gray-500">IMAX Experiences</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <Sparkles className="mb-2 h-5 w-5 text-red-500" />
          <div className="text-2xl font-bold text-white">{dxCount}</div>
          <div className="mt-0.5 text-xs text-gray-500">4DX Available</div>
        </div>
      </div>
    </div>
  </div>
);

const MemoTheatersStatsStrip = memo(TheatersStatsStrip);
MemoTheatersStatsStrip.displayName = "TheatersStatsStrip";
export default MemoTheatersStatsStrip;
