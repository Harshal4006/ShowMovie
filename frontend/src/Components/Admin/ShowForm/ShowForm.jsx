import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Loader2, X, Film, Calendar } from "lucide-react";
import { searchTmdbMovies, getTmdbNowPlaying, getTmdbUpcoming } from "../../../services/api";

const ShowForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState("now-playing");

  const [formData, setFormData] = useState({
    movieName: initialData.movieName || "",
    movieId: initialData.movieId || "",
    poster: initialData.poster || "",
    poster2: initialData.poster2 || "",
    theater: initialData.theater || "",
    showtimes: initialData.showtimes || [{ date: "", time: "" }],
    price: initialData.price || "",
    screenType: initialData.screenType || "",
    description: initialData.description || "",
    status: initialData.status || "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === "now-playing") {
        data = await getTmdbNowPlaying();
      } else if (activeTab === "upcoming") {
        data = await getTmdbUpcoming();
      }
      if (data?.movies && data.movies.length > 0) {
        setTmdbMovies(data.movies);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTmdb = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchTmdbMovies(searchQuery);
      if (data.movies && data.movies.length > 0) {
        setTmdbMovies(data.movies);
        toast.success(`Found ${data.movies.length} movies`);
      } else {
        setTmdbMovies([]);
        toast.error("No movies found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search movies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData((prev) => ({
      ...prev,
      movieName: movie.title || movie.name,
      movieId: movie.tmdbId || movie.id,
      poster: movie.posterUrl || movie.poster_path,
      poster2: movie.backdropUrl || movie.backdrop_path,
      description: movie.overview,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.movieName.trim()) newErrors.movieName = "Movie name is required";
    if (!formData.movieId) newErrors.movieId = "Please select the movie from TMDB search";
    if (!formData.theater) newErrors.theater = "Theater is required";

    const invalidShowtimes = formData.showtimes.filter(st => !st.date || !st.time);
    if (invalidShowtimes.length > 0) {
      newErrors.showtimes = "All showtimes must have both date and time";
    }

    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.screenType) newErrors.screenType = "Screen type is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    onSubmit(formData);
  };

  const handleClearForm = () => {
    setFormData({
      movieName: "",
      movieId: "",
      poster: "",
      poster2: "",
      theater: "",
      showtimes: [{ date: "", time: "" }],
      price: "",
      screenType: "",
      description: "",
      status: "active",
    });
    setSelectedMovie(null);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Movie *</h3>

        <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("now-playing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "now-playing"
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Film className="h-4 w-4" />
            Now Playing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "upcoming"
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "search"
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {activeTab === "search" && (
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchTmdb(e))}
                placeholder="Search movies to add show..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchTmdb}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500"
            >
              Search
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">
              {activeTab === "now-playing" ? "Currently in theaters" : 
               activeTab === "upcoming" ? "Coming soon to theaters" : 
               "Search results"}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto">
              {tmdbMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className={`cursor-pointer group rounded-lg overflow-hidden border-2 transition ${
                    selectedMovie?.id === movie.id || selectedMovie?.tmdbId === movie.id
                      ? "border-red-500 bg-red-500/10"
                      : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <div className="aspect-[2/3] bg-gray-900">
                    {movie.poster_path || movie.posterUrl ? (
                      <img
                        src={movie.posterUrl || `https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No Poster
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-gray-900">
                    <p className="text-xs text-white truncate font-medium">{movie.title}</p>
                    <p className="text-xs text-gray-500">{movie.release_date?.split("-")[0]}</p>
                  </div>
                </div>
              ))}
              {tmdbMovies.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {activeTab === "search" ? "Search for a movie to add a show" : "No movies found"}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedMovie && (
        <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
          <img
            src={
              selectedMovie.posterUrl ||
              (selectedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`
                : "https://via.placeholder.com/100x150")
            }
            alt={selectedMovie.title}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-white text-lg">{selectedMovie.title}</h4>
            <p className="text-sm text-gray-400">{selectedMovie.release_date?.split("-")[0]} | {selectedMovie.runtime}min</p>
            <p className="text-xs text-gray-500 line-clamp-2">{selectedMovie.overview}</p>
          </div>
          <button
            type="button"
            onClick={() => { setSelectedMovie(null); setFormData((prev) => ({ ...prev, movieName: "", movieId: "" })); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {errors.movieId && (
        <p className="mt-4 text-sm text-red-400">
          {errors.movieId}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Theater *</label>
            <select
              name="theater"
              value={formData.theater}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-white focus:outline-none ${errors.theater ? "border-red-500" : "border-gray-700 focus:border-red-500"}`}
            >
              <option value="">Select Theater</option>
              <option value="Theater 1">Theater 1</option>
              <option value="Theater 2">Theater 2</option>
              <option value="Theater 3">Theater 3</option>
            </select>
            {errors.theater && <p className="mt-1 text-xs text-red-500">{errors.theater}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Screen Type *</label>
            <select
              name="screenType"
              value={formData.screenType}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-white focus:outline-none ${errors.screenType ? "border-red-500" : "border-gray-700 focus:border-red-500"}`}
            >
              <option value="">Select Screen</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Ticket Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className={`w-full pl-8 pr-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none ${errors.price ? "border-red-500" : "border-gray-700 focus:border-red-500"}`}
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Show Date & Time *</label>
            {formData.showtimes.map((st, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={st.date}
                  onChange={(e) => {
                    const newShowtimes = [...formData.showtimes];
                    newShowtimes[idx].date = e.target.value;
                    setFormData((prev) => ({ ...prev, showtimes: newShowtimes }));
                  }}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
                <input
                  type="time"
                  value={st.time}
                  onChange={(e) => {
                    const newShowtimes = [...formData.showtimes];
                    newShowtimes[idx].time = e.target.value;
                    setFormData((prev) => ({ ...prev, showtimes: newShowtimes }));
                  }}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
                {formData.showtimes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newShowtimes = formData.showtimes.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, showtimes: newShowtimes }));
                    }}
                    className="p-2 text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, showtimes: [...prev.showtimes, { date: "", time: "" }] }))}
              className="text-sm text-red-400 hover:text-red-300"
            >
              + Add Another Showtime
            </button>
            {errors.showtimes && <p className="mt-1 text-xs text-red-500">{errors.showtimes}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={handleClearForm}
          className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500"
        >
          {isEditing ? "Update Show" : "Add Show"}
        </button>
      </div>
    </form>
  );
};

export default ShowForm;