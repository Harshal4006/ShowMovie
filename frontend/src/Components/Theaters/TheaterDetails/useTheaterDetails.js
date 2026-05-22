import { useState, useEffect } from "react";
import { getTheaterById, getNowShowingMovies } from "../../../services/api.js";

const useTheaterDetails = (id) => {
  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moviesError, setMoviesError] = useState(false);

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        setLoading(true);
        const data = await getTheaterById(id);
        setTheater(data);
        if (data.movies && data.movies.length > 0) {
          setMovies(data.movies);
          setMoviesLoading(false);
        }
      } catch (err) {
        setError(err?.message || "Theater not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTheater();
  }, [id]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setMoviesLoading(true);
        const data = await getNowShowingMovies();
        if (Array.isArray(data)) {
          const existingIds = new Set(movies.map((m) => m._id || m.id));
          const fresh = data.filter((m) => !existingIds.has(m._id || m.id));
          setMovies((prev) => (prev.length > 0 ? [...prev, ...fresh] : fresh));
        }
      } catch {
        setMoviesError(true);
      } finally {
        setMoviesLoading(false);
      }
    };
    if (!theater) return;
    if (!theater.movies || theater.movies.length === 0) {
      fetchMovies();
    } else {
      setMoviesLoading(false);
    }
  }, [theater?.movies?.length]);

  return {
    theater, movies, loading, moviesLoading, error, moviesError,
  };
};

export default useTheaterDetails;
