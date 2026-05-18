import { X, Loader2 } from "lucide-react";
import { useState } from "react";

const MovieEditModal = ({ movie, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    isFeatured: movie?.isFeatured || false,
    isTrending: movie?.isTrending || false,
    isMostPopular: movie?.isMostPopular || false,
    status: movie?.status || 'active',
    price: movie?.price || 0,
    movieLanguage: movie?.movieLanguage || 'English',
    format: movie?.format || '2D',
    trailerUrl: movie?.trailerUrl || '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(movie._id, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Movie</h2>
            <p className="text-sm text-gray-400 mt-1">{movie.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300 uppercase tracking-wide">Section Placement</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-4 cursor-pointer hover:border-gray-700 transition">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                />
                <div>
                  <p className="font-medium text-white">Featured</p>
                  <p className="text-xs text-gray-500">Show on home page featured section</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-4 cursor-pointer hover:border-gray-700 transition">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => handleChange('isTrending', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                />
                <div>
                  <p className="font-medium text-white">Trending</p>
                  <p className="text-xs text-gray-500">Show on home page trending section</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-4 cursor-pointer hover:border-gray-700 transition">
                <input
                  type="checkbox"
                  checked={formData.isMostPopular}
                  onChange={(e) => handleChange('isMostPopular', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                />
                <div>
                  <p className="font-medium text-white">Most Popular</p>
                  <p className="text-xs text-gray-500">Show on home page most popular section</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-4 cursor-pointer hover:border-gray-700 transition">
                <input
                  type="checkbox"
                  checked={formData.isTrendingTrailer}
                  onChange={(e) => handleChange('isTrendingTrailer', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                />
                <div>
                  <p className="font-medium text-white">Trending Trailer</p>
                  <p className="text-xs text-gray-500">Show on home page trending trailers section</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300 uppercase tracking-wide">Status</h3>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500"
            >
              <option value="active">Active (Now Showing)</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Format</label>
              <select
                value={formData.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Trailer URL (YouTube)</label>
            <input
              type="url"
              value={formData.trailerUrl}
              onChange={(e) => handleChange('trailerUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500"
            />
            <p className="mt-1 text-xs text-gray-500">Enter a YouTube URL to show this movie in Trending Trailers</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieEditModal;