import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Play, Star } from "lucide-react";
import toast from "react-hot-toast";
import { formatRuntime } from "../../lib/formatRuntime.js";
import { isFavoriteShow, toggleFavoriteShow } from "../../lib/favorites.js";

const FeatureCard = ({ movie, schedule }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle both old dummy data format and new API format
  const movieId = movie?._id || movie?.id || movie?.tmdbId;
  const title = movie?.title || movie?.title;

  const normalizeTmdbImage = (value, size) => {
    if (!value) return null;
    if (typeof value !== "string") return null;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return `https://image.tmdb.org/t/p/${size}${value}`;
    return value;
  };

  const posterUrl = normalizeTmdbImage(
    movie?.posterUrl || movie?.poster_path || movie?.posterPath,
    "w500"
  );
  const backdropUrl = normalizeTmdbImage(
    movie?.backdropUrl || movie?.backdrop_path || movie?.backdropPath,
    "w1280"
  );
  const releaseDate = movie?.releaseDate || movie?.release_date;
  const originalLanguage = movie?.language || movie?.original_language;
  const voteAverage = movie?.rating || movie?.vote_average;
  const runtime = movie?.runtime;
  const genres = movie?.genres;

  useEffect(() => {
    if (!movieId) return;

    const syncFavoriteState = () => {
      setIsFavorite(isFavoriteShow(movieId));
    };

    syncFavoriteState();
    window.addEventListener("favorites:changed", syncFavoriteState);

    return () => {
      window.removeEventListener("favorites:changed", syncFavoriteState);
    };
  }, [movieId]);

  if (!movie) return null;

  const releaseYear = releaseDate?.split("-")[0] || "2026";
  const genreNames = genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Action";
  const language = originalLanguage?.toUpperCase() || "EN";

  const formatShowTime = (dateTimeString) => {
    if (!dateTimeString) return null;
    return new Date(dateTimeString).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const showTimeLabel = formatShowTime(schedule?.dateTime);

  const handleFavoriteToggle = () => {
    if (!movieId) return;

    const result = toggleFavoriteShow(movieId);
    setIsFavorite(result.isFavorite);

    toast.success(
      result.isFavorite
        ? `${title} added to favorites`
        : `${title} removed from favorites`
    );
  };

  const imageSrc = backdropUrl || posterUrl || 'https://via.placeholder.com/500x300';

  return (
    <div data-reveal="zoom" className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-red-500/35 hover:shadow-[0_24px_55px_rgba(127,29,29,0.22)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_38%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#0f1117]">
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/35" />

        <button
          type="button"
          onClick={handleFavoriteToggle}
          className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition duration-300 ${
            isFavorite
              ? "border-red-400/60 bg-red-500/25 text-red-200"
              : "border-white/10 bg-black/45 text-white/80 hover:border-red-500/40 hover:bg-red-500/20 hover:text-white"
          }`}
          aria-label={`${isFavorite ? "Remove" : "Add"} ${title} ${isFavorite ? "from" : "to"} favorites`}
          aria-pressed={isFavorite}
        >
          <Heart className={`h-4 w-4 transition duration-300 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
          {language}
        </div>

        <Link to={`/movies/${movieId}`} className="relative block aspect-16/10 overflow-hidden p-3">
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            className="h-full w-full rounded-[1.05rem] object-contain transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">
              <Play className="h-4 w-4 fill-white text-white" />
              View Details
            </span>
          </div>
        </Link>
      </div>

      <div className="relative px-2 pb-2 pt-5">
        <Link to={`/movies/${movieId}`} className="block">
          <h3 className="line-clamp-2 text-[1.35rem] font-semibold leading-7 text-white">{title}</h3>
        </Link>

        <p className="mt-3 text-sm text-gray-400">
          {releaseYear} | {genreNames} | {formatRuntime(runtime)}
        </p>

        {showTimeLabel && (
          <p className="mt-2 text-sm font-semibold text-red-300">{showTimeLabel}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {genres?.slice(0, 3).map((genre) => (
            <span key={genre.id || genre.name} className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur">
              {genre.name}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-5">
          <Link to={`/movies/${movieId}`} className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)] transition duration-300 hover:bg-red-400">
            Buy Ticket
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-gray-200">
            <Star className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="font-medium">{voteAverage?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
