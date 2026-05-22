import React from 'react';
import { Star, CalendarDays, Play, ChevronRight, Loader2 } from 'lucide-react';

const HeroSection = ({
  movie,
  trailerLoading, bookingLoading,
  onWatchTrailer, onBookTickets,
  backdropBase, formatDate, genresList,
}) => {
  if (!movie) return null;

  return (
    <div className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${backdropBase}${movie.backdrop_path})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/70 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1),transparent_70%)]" />

      <div className="relative h-full min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center pt-20 sm:pt-24 lg:pt-28">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
          <div className="max-w-3xl animate-fade-up">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="rounded-full bg-red-600/20 border border-red-500/30 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-red-400 backdrop-blur-sm">
                Featured Release
              </span>
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-yellow-400 backdrop-blur-sm">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400" />
                  {movie.vote_average?.toFixed(1)}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight break-words">
              {movie.title}
            </h1>

            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
              {movie.release_date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 shrink-0" />
                  {formatDate(movie.release_date)}
                </span>
              )}
              {movie.genre_ids && (
                <span className="flex flex-wrap gap-1.5 sm:gap-2">
                  {movie.genre_ids.slice(0, 3).map((id) => (
                    <span key={id} className="rounded-full bg-white/5 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs text-gray-300 ring-1 ring-white/10">
                      {genresList[id - 1] || `Genre ${id}`}
                    </span>
                  ))}
                </span>
              )}
            </div>

            {movie.overview && (
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
                {movie.overview}
              </p>
            )}

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => onWatchTrailer(movie)}
                disabled={trailerLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {trailerLoading ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
                )}
                {trailerLoading ? "Loading..." : "Watch Trailer"}
              </button>
              <button
                onClick={() => onBookTickets(movie)}
                disabled={bookingLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
                {bookingLoading ? "Loading..." : "Book Tickets"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
