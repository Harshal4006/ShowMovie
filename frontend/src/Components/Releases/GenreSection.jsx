import { Film, Star, AlertCircle } from 'lucide-react';

const GenreSection = ({
  selectedGenre, filteredMovies,
  onGenreFilter, onMovieClick,
  posterBase, genresList,
}) => (
  <section className="animate-fade-up">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
        <Film className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
      </div>
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Browse by Genre</h2>
    </div>

    <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6">
      {genresList.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreFilter(genre)}
          className={`rounded-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${
            selectedGenre === genre
              ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
              : "border border-white/10 bg-white/5 text-gray-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>

    {filteredMovies.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {filteredMovies.slice(0, 8).map((movie) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                {movie.release_date && <span>{movie.release_date?.split("-")[0]}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
        <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 mb-2 sm:mb-3" />
        <p className="text-xs sm:text-sm text-gray-500">No movies found for this genre.</p>
        <p className="text-[11px] sm:text-xs text-gray-600 mt-1">Try selecting a different genre.</p>
      </div>
    )}
  </section>
);

export default GenreSection;
