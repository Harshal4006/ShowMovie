import React from 'react';
import { Film } from 'lucide-react';
import TheaterDetailsMovieCard from './TheaterDetailsMovieCard.jsx';

const defaultShowTimings = ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:45 PM"];

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-[180px] sm:h-[260px] aspect-[2/3] sm:aspect-auto bg-gray-800/50" />
      <div className="p-4 space-y-3 flex-1">
        <div className="h-5 bg-gray-800/50 rounded w-3/4" />
        <div className="h-3 bg-gray-800/50 rounded w-1/2" />
        <div className="h-3 bg-gray-800/50 rounded w-1/3" />
        <div className="h-10 bg-gray-800/50 rounded w-full sm:w-40" />
      </div>
    </div>
  </div>
);

const TheaterDetailsNowShowing = ({ movies, moviesLoading, moviesError, showTimings }) => {
  const timings = showTimings?.length > 0 ? showTimings : defaultShowTimings;

  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="animate-fade-up flex items-center gap-2" style={{ animationDelay: "150ms" }}>
        <Film className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Now Showing</h2>
        <span className="ml-auto text-sm text-gray-500">{movies.length} movies</span>
      </div>

      {moviesLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : movies.length === 0 && !moviesError ? (
        <div className="animate-fade-up rounded-2xl border border-white/[0.06] p-8 text-center" style={{ animationDelay: "200ms" }}>
          <Film className="mx-auto mb-3 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-500">No movies currently showing at this theater.</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="flex flex-col gap-6">
          {[...movies].sort(() => Math.random() - 0.5).slice(0, 3).map((movie, mIndex) => (
            <TheaterDetailsMovieCard
              key={movie._id || movie.id}
              movie={movie}
              mIndex={mIndex}
              showTimings={timings}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TheaterDetailsNowShowing;
