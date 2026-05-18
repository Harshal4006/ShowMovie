import { Eye, Edit2, Trash2, Loader2, Star } from "lucide-react";
import { Link } from "react-router-dom";

const MovieTable = ({ movies, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="mt-6 flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-gray-900/50 border border-gray-800 p-8 text-center">
        <p className="text-gray-400">No movies found in database.</p>
        <p className="mt-2 text-xs text-gray-600">Add movies from the Add Show page.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Movie</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Featured</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Trending</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Popular</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rating</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      movie.posterUrl ||
                      (movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null) ||
                      "https://via.placeholder.com/50x75"
                    }
                    alt={movie.title}
                    className="h-12 w-8 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{movie.title}</p>
                    <p className="text-xs text-gray-500">{movie.releaseDate?.split("-")[0] || "—"}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  movie.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {movie.status === 'active' ? 'Active' : 'Coming Soon'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-lg ${movie.isFeatured ? 'text-red-500' : 'text-gray-600'}`}>
                  {movie.isFeatured ? '★' : '○'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-lg ${movie.isTrending ? 'text-red-500' : 'text-gray-600'}`}>
                  {movie.isTrending ? '★' : '○'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-lg ${movie.isMostPopular ? 'text-red-500' : 'text-gray-600'}`}>
                  {movie.isMostPopular ? '★' : '○'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                  <span className="text-sm">{movie.rating?.toFixed(1) || "—"}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/movies/${movie._id}`}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition"
                    title="View"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(movie._id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(movie._id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;