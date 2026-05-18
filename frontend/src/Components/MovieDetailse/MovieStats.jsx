import { Star, Clock, Calendar, Heart, Ticket, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRuntime } from "../../lib/formatRuntime.js";

const MovieStats = ({ movie, favorite, handleFavoriteToggle, onTrailerClick, language, selectedDate, showDates }) => {
  const normalizeTmdbImage = (value, size) => {
    if (!value || typeof value !== "string") return null;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return `https://image.tmdb.org/t/p/${size}${value}`;
    return value;
  };

  const posterSrc = normalizeTmdbImage(
    movie?.posterUrl || movie?.poster_path || movie?.posterPath,
    "w500"
  );
  const backdropSrc = normalizeTmdbImage(
    movie?.backdropUrl || movie?.backdrop_path || movie?.backdropPath,
    "w1280"
  );

const releaseDate = movie?.releaseDate || movie?.release_date;
  const releaseYear = (releaseDate && typeof releaseDate === 'string') ? releaseDate.split("-")[0] : "—";
  const voteAverage = movie?.rating ?? movie?.vote_average;
  const runtime = movie?.runtime || 0;
  const movieId = movie?._id || movie?.id || movie?.tmdbId;

  const defaultDate = selectedDate || showDates?.[0]?.date;
  const defaultTime = showDates?.find((d) => d.date === defaultDate)?.timeSlots?.[0] || "";
  const bookingUrl = defaultDate && defaultTime
    ? `/movies/${movieId}/${defaultDate}?time=${encodeURIComponent(defaultTime)}`
    : `/movies/${movieId}`;

  return (
    <div className="sticky top-24">
      <div className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={posterSrc || backdropSrc || "https://via.placeholder.com/600x900"}
            alt={movie.title}
            loading="lazy"
            className="h-auto w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          
          {/* Favorite button */}
          <button
            type="button"
            onClick={handleFavoriteToggle}
            className={`absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur transition duration-300 ${
              favorite
                ? "border-red-400/60 bg-red-500/25 text-red-200"
                : "border-white/10 bg-black/45 text-white/80 hover:border-red-500/40 hover:bg-red-500/20 hover:text-white"
            }`}
            aria-label={`${
              favorite ? "Remove" : "Add"
            } ${movie.title} ${favorite ? "from" : "to"} favorites`}
          >
            <Heart
              className={`h-5 w-5 transition duration-300 ${
                favorite ? "fill-current" : ""
              }`}
            />
          </button>

          {/* Language badge */}
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
            {language}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
            <Star className="mx-auto h-5 w-5 fill-red-500 text-red-500" />
            <p className="mt-2 text-2xl font-bold text-white">{Number(voteAverage || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
            <Clock className="mx-auto h-5 w-5 text-red-500" />
            <p className="mt-2 text-2xl font-bold text-white">{formatRuntime(runtime)}</p>
            <p className="text-xs text-gray-400">Runtime</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
            <Calendar className="mx-auto h-5 w-5 text-red-500" />
            <p className="mt-2 text-2xl font-bold text-white">{releaseYear}</p>
            <p className="text-xs text-gray-400">Year</p>
          </div>
        </div>

        {/* Book ticket button */}
        <Link
          to={bookingUrl}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition hover:bg-red-400"
        >
          <Ticket className="h-5 w-5" />
          Book Tickets Now
        </Link>

        {/* Watch trailer button */}
        <button
          onClick={onTrailerClick}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-blue-500/60 bg-transparent px-6 py-4 text-lg font-semibold text-blue-400 transition hover:bg-blue-500/10 hover:text-blue-300"
        >
          <PlayCircle className="h-5 w-5" />
          Watch Trailer
        </button>
      </div>
    </div>
  );
};

export default MovieStats;
