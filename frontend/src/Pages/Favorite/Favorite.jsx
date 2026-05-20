import React, { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import FeatureCard from "../../Components/FeatureSection/FeatureCard.jsx";
import { MovieGridSkeleton } from "../../Components/Skeletons";
import { useUserContext } from "../../hooks/UserContext";

const Favorite = () => {
  const { favorites, isLoading: userLoading, isSignedIn } = useUserContext();
  const [movieDetails, setMovieDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const favoriteTmdbIds = useMemo(
    () => new Set(favorites.map((id) => Number(id))),
    [favorites]
  );

  const visibleMovies = useMemo(
    () => movieDetails.filter((m) => favoriteTmdbIds.has(Number(m.tmdbId))),
    [movieDetails, favoriteTmdbIds]
  );

  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      return;
    }

    if (!isSignedIn) {
      setIsLoading(false);
      setMovieDetails([]);
      return;
    }

    if (favorites.length === 0) {
      setIsLoading(false);
      setMovieDetails([]);
      return;
    }

    const stored = sessionStorage.getItem("favoriteMovies");
    const parsed = stored ? JSON.parse(stored) : {};
    const cached = Object.values(parsed).filter(Boolean);

    if (cached.length > 0) {
      setMovieDetails(cached);
    }

    setIsLoading(false);
  }, [userLoading, isSignedIn, favorites.length]);

  const onMovieDataLoaded = (movie) => {
    if (!movie?.tmdbId) return;
    setMovieDetails((prev) => {
      const exists = prev.some((m) => Number(m.tmdbId) === Number(movie.tmdbId));
      if (exists) return prev;
      const updated = [...prev, movie];
      const asObj = {};
      updated.forEach((m) => { asObj[m.tmdbId] = m; });
      sessionStorage.setItem("favoriteMovies", JSON.stringify(asObj));
      return updated;
    });
  };

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

  if (visibleMovies.length === 0) {
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
          {visibleMovies.map((movie) => (
            <FeatureCard
              key={movie.tmdbId || movie._id}
              movie={movie}
              onDataLoaded={onMovieDataLoaded}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Favorite;