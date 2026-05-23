import { CalendarDays, ChevronRight, Star } from 'lucide-react';

const UpcomingCarousel = ({
  movies,
  scrollRef,
  isHovering, setIsHovering,
  onMovieClick,
  posterBase, formatDate,
  onScroll,
}) => {
  if (movies.length === 0) return null;

  return (
    <section className="animate-fade-up">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Upcoming This Week</h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => onScroll(-1)} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
          </button>
          <button onClick={() => onScroll(1)} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onMovieClick(movie.id, movie.title)}
            className="group w-[220px] sm:w-[260px] md:w-[300px] snap-start shrink-0 rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)] cursor-pointer"
          >
            <div className="relative overflow-hidden">
              <img
                src={movie.poster_path ? `${posterBase}${movie.poster_path}` : ""}
                alt={movie.title}
                className="h-[320px] sm:h-[360px] md:h-[420px] w-full object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {movie.vote_average > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            <div className="p-3 sm:p-3">
              <h3 className="text-sm font-semibold text-white truncate">{movie.title}</h3>
              {movie.release_date && (
                <p className="mt-0.5 text-[11px] text-gray-500">{formatDate(movie.release_date)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingCarousel;
