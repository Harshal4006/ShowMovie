import { Link } from "react-router-dom";
import { Ticket, Star } from "lucide-react";

const PLACEHOLDER = "https://via.placeholder.com/500x300?text=No+Image";

const normalizePoster = (movie) => {
  if (!movie) return PLACEHOLDER;
  if (movie.posterUrl) return movie.posterUrl;
  if (movie.posterPath) return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
  if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return PLACEHOLDER;
};

const normalizeBackdrop = (movie) => {
  if (!movie) return PLACEHOLDER;
  if (movie.backdropUrl) return movie.backdropUrl;
  if (movie.backdropPath) return `https://image.tmdb.org/t/p/w1280${movie.backdropPath}`;
  if (movie.backdrop_path) return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
  return PLACEHOLDER;
};

const MoviePoster = ({ movie, isPaid }) => {
  const posterSrc = normalizePoster(movie);
  const backdropSrc = normalizeBackdrop(movie);
  const language = movie?.language?.toUpperCase() || movie?.original_language?.toUpperCase() || "EN";
  const rating = movie?.rating ?? movie?.vote_average;

  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#0f1117]">
      <img
        src={backdropSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/35" />

      <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
        {language}
      </div>

      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {isPaid !== undefined && (
          <div className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${
            isPaid
              ? "border-green-400/60 bg-green-500/25 text-green-200"
              : "border-yellow-400/60 bg-yellow-500/25 text-yellow-200"
          }`}>
            {isPaid ? (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Paid
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Pending
              </span>
            )}
          </div>
        )}
      </div>

      <Link
        to={`/movies/${movie?.tmdbId || movie?._id || movie?.id || ''}`}
        className="relative block aspect-16/10 overflow-hidden p-3"
      >
        <img
          src={posterSrc}
          alt={movie?.title || "Movie"}
          loading="lazy"
          className="h-full w-full rounded-[1.05rem] object-contain transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent opacity-80" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">
            <Ticket className="h-4 w-4 fill-white text-white" />
            View Movie
          </span>
        </div>
      </Link>

      {rating != null && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
          {Number(rating).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default MoviePoster;