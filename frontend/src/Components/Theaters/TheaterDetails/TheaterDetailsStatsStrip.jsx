import React from 'react';
import { Star, Monitor, Film, MapPin } from 'lucide-react';

const TheaterDetailsStatsStrip = ({ theater }) => (
  <div className="relative z-10 -translate-y-6 md:-translate-y-14 px-4 sm:px-6 mb-6 md:mb-0">
    <div className="mx-auto max-w-full sm:max-w-[80%]">
      <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-4 sm:px-8 py-4 sm:py-5 backdrop-blur-xl" style={{ animationDelay: "100ms" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex flex-col items-center text-center">
            <Star className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            <div className="text-base sm:text-lg font-bold text-white">{theater.rating}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Rating</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Monitor className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <div className="text-base sm:text-lg font-bold text-white">{theater.screens}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Screens</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Film className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <div className="text-base sm:text-lg font-bold text-white">{(theater.facilities || []).length}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Facilities</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <div className="text-xs sm:text-sm font-semibold text-white">{theater.city}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">City</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TheaterDetailsStatsStrip;
