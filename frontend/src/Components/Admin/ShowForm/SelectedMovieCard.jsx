import { X } from "lucide-react";

const SelectedMovieCard = ({ movie, onClear }) => (
  <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
    <img
      src={
        movie.posterUrl ||
        (movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : "https://via.placeholder.com/100x150")
      }
      alt={movie.title}
      className="w-16 h-24 object-cover rounded"
    />
    <div className="flex-1">
      <h4 className="font-semibold text-white text-lg">{movie.title}</h4>
      <p className="text-sm text-gray-400">
        {movie.release_date?.split("-")[0]} | {movie.runtime}min
      </p>
      <p className="text-xs text-gray-500 line-clamp-2">{movie.overview}</p>
    </div>
    <button
      type="button"
      onClick={onClear}
      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

export default SelectedMovieCard;
