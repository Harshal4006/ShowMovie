import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import FeatureCard from "./FeatureCard.jsx";

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
      <section className="relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {title}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white/5 h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {title}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center py-12">
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
    <section className="relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-gray-400 sm:mt-4 sm:text-base">
            {subtitle}
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
          {movies.map((movie) => (
            <FeatureCard key={movie._id || movie.tmdbId || movie.id} movie={movie} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
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