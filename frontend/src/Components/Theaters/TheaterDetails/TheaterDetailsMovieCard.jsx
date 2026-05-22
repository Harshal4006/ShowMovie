import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';
import { formatRuntime } from '../../../lib/formatRuntime.js';

const TheaterDetailsMovieCard = ({ movie, mIndex, showTimings }) => {
  const timings = showTimings.slice(
    (mIndex * 2) % showTimings.length,
    ((mIndex * 2) + 3) % showTimings.length || undefined
  );

  const poster = movie.posterUrl || movie.posterPath || movie.poster_path || movie.backdropUrl || "";
  const rating = movie.rating || movie.vote_average;
  const year = movie.releaseDate?.split("-")[0] || movie.release_date?.split("-")[0];
  const genres = movie.genres || [];
  const runtime = movie.runtime;
  const movieId = movie._id || movie.id;
  const language = movie.originalLanguage || movie.original_language || movie.language;

  return (
    <div
      className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.06)]"
      style={{ animationDelay: `${200 + mIndex * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-[180px] sm:h-[260px] overflow-hidden shrink-0">
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-transparent sm:to-transparent" />
          {rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">{movie.title}</h3>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
              {year && <span>{year}</span>}
              {year && runtime && <span className="h-1 w-1 rounded-full bg-gray-600" />}
              {runtime && <span>{formatRuntime(runtime)}</span>}
              {runtime && language && <span className="h-1 w-1 rounded-full bg-gray-600" />}
              {language && <span className="uppercase">{language}</span>}
            </div>

            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {genres.slice(0, 3).map((g) => (
                  <span
                    key={g.name || g}
                    className="rounded-md bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-gray-400 ring-1 ring-white/[0.06]"
                  >
                    {g.name || g}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500 line-clamp-2">
                {movie.overview}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {timings.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Show Timings
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {timings.map((time) => (
                    <span
                      key={time}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-300"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={`/movies/${movieId}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97] shrink-0"
            >
              <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Book Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterDetailsMovieCard;
