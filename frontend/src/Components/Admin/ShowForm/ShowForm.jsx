import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { searchTmdbMovies, getTmdbNowPlaying, getTmdbUpcoming, getTmdbTrending, getTmdbPopular } from "../../../services/api";
import MovieTabBar from "./MovieTabBar";
import MovieSearch from "./MovieSearch";
import MovieGrid from "./MovieGrid";
import SelectedMovieCard from "./SelectedMovieCard";
import ShowtimeFields from "./ShowtimeFields";

const emptyForm = {
  movieName: "", movieId: "", poster: "", poster2: "",
  theater: "", showtimes: [{ date: "", time: "" }],
  price: "", screenType: "", description: "", status: "active",
};

const ShowForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("now-playing");
  const [selectedMovie, setSelectedMovie] = useState(() => {
    if (isEditing && initialData.movieId) {
      return {
        id: initialData.movieId, tmdbId: initialData.movieId,
        title: initialData.movieName, poster_path: initialData.poster,
        backdrop_path: initialData.poster2, overview: initialData.description,
      };
    }
    return null;
  });
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

  useEffect(() => { fetchMovies(); }, [activeTab]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const map = {
        "now-playing": getTmdbNowPlaying,
        upcoming: getTmdbUpcoming,
        trending: getTmdbTrending,
        popular: getTmdbPopular,
      };
      const fn = map[activeTab];
      if (fn) {
        const data = await fn();
        if (data?.movies?.length) setTmdbMovies(data.movies);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTmdb = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchTmdbMovies(searchQuery);
      if (data.movies?.length) {
        setTmdbMovies(data.movies);
        toast.success(`Found ${data.movies.length} movies`);
      } else {
        setTmdbMovies([]);
        toast.error("No movies found");
      }
    } catch (err) {
      toast.error("Failed to search movies: " + err.message);
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.movieName.trim()) e.movieName = "Movie name is required";
    if (!isEditing && !formData.movieId) e.movieId = "Please select the movie from TMDB search";
    if (!formData.theater) e.theater = "Theater is required";
    if (formData.showtimes.some((st) => !st.date || !st.time)) e.showtimes = "All showtimes must have both date and time";
    if (!formData.price || Number(formData.price) <= 0) e.price = "Valid price is required";
    if (!formData.screenType) e.screenType = "Screen type is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }
    onSubmit(formData);
  };

  const handleClearForm = () => {
    setFormData(emptyForm);
    setSelectedMovie(null);
    setErrors({});
  };

  const clearSelectedMovie = () => {
    setSelectedMovie(null);
    setFormData((prev) => ({ ...prev, movieName: "", movieId: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Movie *</h3>
        <MovieTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "search" && (
          <MovieSearch query={searchQuery} onQueryChange={setSearchQuery} onSearch={handleSearchTmdb} />
        )}

        <MovieGrid
          movies={tmdbMovies}
          selectedMovie={selectedMovie}
          activeTab={activeTab}
          loading={loading}
          onSelect={handleSelectMovie}
        />
      </div>

      {selectedMovie && (
        <SelectedMovieCard movie={selectedMovie} onClear={clearSelectedMovie} />
      )}

      {errors.movieId && <p className="text-sm text-red-400">{errors.movieId}</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Theater *</label>
            <select
              name="theater" value={formData.theater} onChange={handleChange}
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
              name="screenType" value={formData.screenType} onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-white focus:outline-none ${errors.screenType ? "border-red-500" : "border-gray-700 focus:border-red-500"}`}
            >
              <option value="">Select Screen</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
            </select>
            {errors.screenType && <p className="mt-1 text-xs text-red-500">{errors.screenType}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Ticket Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input
                type="number" name="price" value={formData.price} onChange={handleChange}
                placeholder="0" min="1"
                className={`w-full pl-8 pr-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none ${errors.price ? "border-red-500" : "border-gray-700 focus:border-red-500"}`}
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>

          <ShowtimeFields
            showtimes={formData.showtimes}
            onUpdate={(next) => setFormData((prev) => ({ ...prev, showtimes: next }))}
            error={errors.showtimes}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button
          type="button" onClick={handleClearForm}
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
