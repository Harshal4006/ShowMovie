import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import FeatureCard from "../../Components/FeatureSection/FeatureCard.jsx";
import { MovieGridSkeleton } from "../../Components/Skeletons";
import { getMovieById } from "../../services/api";
import { getFavoriteIds, fetchBackendFavorites } from "../../lib/favorites.js";

const Favorite = () => {
  const { getToken, isSignedIn } = useUser();
  const [favoriteShows, setFavoriteShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncFavorites = () => {
      setIsLoading(true);
      setError(null);

      (async () => {
        try {
          if (isSignedIn) {
            const backendFavorites = await fetchBackendFavorites(getToken);
            if (backendFavorites.length > 0) {
              setFavoriteShows(backendFavorites);
              setIsLoading(false);
              return;
            }
          }

          const localIds = await getFavoriteIds(null);
          if (localIds.length === 0) {
            setFavoriteShows([]);
            setIsLoading(false);
            return;
          }

          const favoriteMovies = [];
          for (const tmdbId of localIds) {
            try {
              const movie = await getMovieById(String(tmdbId));
              if (movie && !movie.message) {
                favoriteMovies.push(movie);
              }
            } catch {
              // Movie may not exist in DB - skip
            }
          }
          setFavoriteShows(favoriteMovies);
        } catch (e) {
          console.error("Failed to load favorites:", e);
          setError(e?.message || "Failed to load favorites");
          setFavoriteShows([]);
        } finally {
          setIsLoading(false);
        }
      })();
    };

    syncFavorites();
    const handleChange = () => syncFavorites();
    window.addEventListener("favorites:changed", handleChange);

    return () => {
      window.removeEventListener("favorites:changed", handleChange);
    };
  }, [isSignedIn, getToken]);

  return (
    <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Favorites
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Your saved movies stay here so you can jump back into booking
            anytime.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <MovieGridSkeleton count={4} />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 px-6 py-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white">Couldn’t load favorites</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">{error}</p>
          </div>
        ) : favoriteShows.length ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {favoriteShows.map((movie) => (
              <FeatureCard key={movie._id || movie.tmdbId} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 px-6 py-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white">
              No favorites yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Tap the heart on any movie card and it will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorite;
