import React, { useEffect, useState } from "react";
import FeatureCard from "../../Components/FeatureSection/FeatureCard.jsx";
import { MovieGridSkeleton } from "../../Components/Skeletons";
import { dummyDashboardData, dummyShowsData } from "../../assets/assets.js";
import { getFavoriteIds } from "../../lib/favorites.js";

const Favorite = () => {
  const [favoriteShows, setFavoriteShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scheduleByMovieId = new Map(
      dummyDashboardData.activeShows.map((activeShow) => [
        activeShow.movie.id,
        {
          dateTime: activeShow.showDateTime,
          price: activeShow.showPrice,
        },
      ]),
    );

    const syncFavorites = () => {
      const favoriteIds = getFavoriteIds();
      const nextFavoriteShows = dummyShowsData
        .filter((show) => favoriteIds.includes(show.id))
        .map((show) => ({
          ...show,
          schedule: scheduleByMovieId.get(show.id),
        }));

      setFavoriteShows(nextFavoriteShows);
      setTimeout(() => setIsLoading(false), 300);
    };

    syncFavorites();
    window.addEventListener("favorites:changed", syncFavorites);

    return () => {
      window.removeEventListener("favorites:changed", syncFavorites);
    };
  }, []);

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
        ) : favoriteShows.length ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {favoriteShows.map((show) => (
              <FeatureCard key={show.id} show={show} schedule={show.schedule} />
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
