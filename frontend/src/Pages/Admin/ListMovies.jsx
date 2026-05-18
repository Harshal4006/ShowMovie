import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import MovieHeader from "../../Components/Admin/ListMovies/MovieHeader";
import MovieTable from "../../Components/Admin/ListMovies/MovieTable";
import MovieEditModal from "../../Components/Admin/ListMovies/MovieEditModal";
import { getAdminMovies, updateMovie, deleteMovie } from "../../services/api";

const ListMovies = () => {
  const { getToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMovieId, setEditMovieId] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }
      const data = await getAdminMovies(token);
      setMovies(data.movies || []);
    } catch (error) {
      console.error("Failed to load movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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

          <MovieTable
            movies={movies}
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