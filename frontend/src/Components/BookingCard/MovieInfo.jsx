import { Link } from "react-router-dom";
import { formatRuntime } from "../../lib/formatRuntime.js";

const MovieInfo = ({ movie }) => {
  const releaseYear = movie?.release_date?.split("-")[0] || "2026";
  const genres = movie?.genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Action";

  return (
    <Link to={`/movies/${movie?.id}`} className="block">
      <h3 className="line-clamp-2 text-[1.35rem] font-semibold leading-7 text-white">
        {movie?.title}
      </h3>
    </Link>
  );
};

const MovieMeta = ({ movie }) => {
  const releaseYear = movie?.release_date?.split("-")[0] || "2026";
  const genres = movie?.genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Action";

  return (
    <p className="mt-3 text-sm text-gray-400">
      {releaseYear} | {genres} | {formatRuntime(movie?.runtime)}
    </p>
  );
};

export { MovieInfo, MovieMeta };