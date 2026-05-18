import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import MovieHeader from "../../Components/Admin/ListMovies/MovieHeader";
import MovieTable from "../../Components/Admin/ListMovies/MovieTable";
import MovieEditModal from "../../Components/Admin/ListMovies/MovieEditModal";
import { getAdminMovies, updateMovie, deleteMovie, searchTmdbMovies, getTmdbMovieDetails } from "../../services/api";

const ListMovies = () => {
  const { getToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMovieId, setEditMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await getAdminMovies(token, { status: statusFilter !== "all" ? statusFilter : undefined });
      setMovies(data.movies || []);
    } catch (error) {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async (movieId, updates) => {
    try {
      const token = await getToken();
      await updateMovie(token, movieId, updates);
      toast.success("Movie updated successfully");
      setEditMovieId(null);
      fetchMovies();
    } catch (error) {
      toast.error(error?.message || "Failed to update movie");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Delete this movie? This cannot be undone.")) return;
    try {
      const token = await getToken();
      await deleteMovie(token, id);
      setMovies((prev) => prev.filter((m) => m._id !== id));
      toast.success("Movie deleted");
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  const editMovie = movies.find((m) => m._id === editMovieId);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <MovieHeader onRefresh={fetchMovies} />
          
          <div className="mt-6 rounded-xl bg-gray-900/50 border border-gray-800 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white sm:max-w-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <MovieTable
            movies={movies.filter(m => 
              !searchQuery || m.title?.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            loading={loading}
            onEdit={(id) => setEditMovieId(id)}
            onDelete={handleDeleteMovie}
          />
        </div>
      </main>

      {editMovie && (
        <MovieEditModal
          movie={editMovie}
          onClose={() => setEditMovieId(null)}
          onSave={handleSaveMovie}
        />
      )}
    </div>
  );
};

export default ListMovies;