import { Calendar, Clock, Globe } from "lucide-react";
import { formatRuntime } from "../../lib/formatRuntime.js";

const MovieHeader = ({ movie, language, genres }) => {
  return (
    <>
      {/* Background blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={movie.backdrop_path}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/80" />
      </div>

      {/* Title and tagline */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
          {movie.title}
        </h1>
        {movie.tagline && (
          <p className="mt-3 text-xl text-red-300">{movie.tagline}</p>
        )}
        
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {movie.release_date || "Coming soon"}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            {language}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatRuntime(movie.runtime)}
          </span>
        </div>
      </div>

      {/* Genres */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-white">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-2xl font-semibold text-white">Overview</h2>
        <p className="leading-relaxed text-gray-300">{movie.overview}</p>
      </div>
    </>
  );
};

export default MovieHeader;