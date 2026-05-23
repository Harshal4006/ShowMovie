import { Clock } from 'lucide-react';

const ComingSoonGrid = ({ movies, onMovieClick, posterBase, formatDate }) => {
  if (movies.length === 0) return null;

  return (
    <section className="animate-fade-up">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Coming Soon</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {movies.slice(0, 4).map((movie) => {
          const releaseDate = new Date(movie.release_date);
          const now = new Date();
          const diff = releaseDate - now;
          const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
          const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));

          return (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                  <div className="rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                    <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Releasing in</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-white">
                      {days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h` : "Today"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:p-3 lg:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-gray-500">{formatDate(movie.release_date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ComingSoonGrid;
