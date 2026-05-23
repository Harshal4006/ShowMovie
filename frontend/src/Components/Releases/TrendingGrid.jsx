import { TrendingUp, Star, Sparkles } from 'lucide-react';

const TrendingGrid = ({ movies, onMovieClick, posterBase, genresList }) => {
  if (movies.length === 0) return null;

  return (
    <section className="animate-fade-up">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Trending Releases</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {movies.map((movie, i) => (
          <div
            key={movie.id}
            onClick={() => onMovieClick(movie.id, movie.title)}
            className="group rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)] cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={movie.poster_path ? `${posterBase}${movie.poster_path}` : ""}
                alt={movie.title}
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-col gap-1">
                {i === 0 && (
                  <span className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    Trending
                  </span>
                )}
                {i === 1 && (
                  <span className="rounded-full bg-blue-600/90 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white">
                    New
                  </span>
                )}
                {movie.vote_average >= 8 && (
                  <span className="rounded-full bg-yellow-500/90 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-black">
                    Fan Favorite
                  </span>
                )}
              </div>

              {movie.vote_average > 0 && (
                <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1 rounded-full bg-black/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
                  <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 lg:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
              <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500">
                {movie.release_date && <span className="truncate">{movie.release_date?.split("-")[0]}</span>}
                {movie.genre_ids && movie.genre_ids.length > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-600 shrink-0" />
                    <span className="truncate">{movie.genre_ids.slice(0, 2).map((id) => genresList[id - 1] || `Genre ${id}`).join(", ")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingGrid;
