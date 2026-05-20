import React, { useState, useEffect } from "react";
import { Heart, AlertCircle } from "lucide-react";
import FeatureCard from "../../Components/FeatureSection/FeatureCard.jsx";
import { MovieGridSkeleton } from "../../Components/Skeletons";
import { useUserContext } from "../../hooks/UserContext";
import { getUserFavorites } from "../../services/api";
import { useAuth } from "@clerk/clerk-react";

const Favorite = () => {
  const { isLoading: userLoading, isSignedIn } = useUserContext();
  const { getToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userLoading) {
        setIsLoading(true);
        return;
      }

      if (!isSignedIn) {
        setIsLoading(false);
        setMovies([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) {
          setError("Authentication failed");
          setIsLoading(false);
          return;
        }

        const data = await getUserFavorites(token);
        const favoritesList = data?.favorites || [];
        setMovies(favoritesList);
      } catch (err) {
        setError(err?.message || "Failed to load favorites");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [userLoading, isSignedIn, getToken]);

  if (userLoading || isLoading) {
    return (
      <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Favorites</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Your saved movies stay here so you can jump back into booking anytime.
            </p>
          </div>
          <div className="mt-10">
            <MovieGridSkeleton count={4} />
          </div>
        </div>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Favorites</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Your saved movies stay here so you can jump back into booking anytime.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center rounded-4xl border border-white/10 bg-white/4 px-6 py-16 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Heart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Sign in to see your favorites</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Please sign in to save and view your favorite movies.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Favorites</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Your saved movies stay here so you can jump back into booking anytime.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center rounded-4xl border border-red-500/20 bg-red-500/10 px-6 py-16 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Favorites</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Your saved movies stay here so you can jump back into booking anytime.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center rounded-4xl border border-white/10 bg-white/4 px-6 py-16 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Heart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white">No favorites yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Tap the heart on any movie card and it will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Favorites</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Your saved movies stay here so you can jump back into booking anytime.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {movies.map((movie) => (
            <FeatureCard key={movie.tmdbId || movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Favorite;