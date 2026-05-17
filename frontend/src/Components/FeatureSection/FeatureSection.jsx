import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard.jsx";
import { getNowShowingMovies } from "../../services/api";

const FeatureSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getNowShowingMovies();
        if (data.movies) {
          setMovies(data.movies.slice(0, 8));
        } else {
          setMovies(data.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            Featured Movies
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white/5 h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-reveal className="relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
          Featured Movies
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-gray-400 sm:mt-4 sm:text-base">
          Handpicked stories, crowd favorites, and fresh releases ready for your next movie night.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
          {movies.map((movie) => (
            <FeatureCard key={movie._id || movie.tmdbId} movie={movie} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            to="/movies"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 font-medium text-white transition duration-300 hover:bg-red-500"
          >
            Show More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
