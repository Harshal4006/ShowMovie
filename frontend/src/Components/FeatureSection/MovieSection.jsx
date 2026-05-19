import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import FeatureCard from "./FeatureCard.jsx";
import { MovieGridSkeleton } from "../Skeletons";

const MovieSection = ({ title, subtitle, fetchFn, sectionKey }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFn();
        if (data.movies) {
          setMovies(data.movies.slice(0, 8));
        } else if (Array.isArray(data)) {
          setMovies(data.slice(0, 8));
        }
      } catch (err) {
        console.error(`Failed to fetch ${title}:`, err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchFn, title]);

  if (loading) {
    return (
      <section className="relative w-full px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {title}
          </h2>
          <MovieGridSkeleton count={8} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {title}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
<section className="relative w-full px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-7 text-gray-400 sm:mt-3 sm:text-base">
              {subtitle}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 xl:grid-cols-4">
            {movies.map((movie) => (
              <FeatureCard key={movie._id || movie.tmdbId || movie.id} movie={movie} />
            ))}
          </div>

          <div className="mt-6 flex justify-center sm:mt-6">
            <Link
              to={`/movies?section=${sectionKey}`}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 font-medium text-white transition duration-300 hover:bg-red-500"
            >
              See More
            </Link>
          </div>
        </div>
      </section>
  );
};

export default MovieSection;