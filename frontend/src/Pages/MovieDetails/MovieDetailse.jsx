import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { dummyShowsData, dummyTrailers } from "../../assets/assets.js";
import { isFavoriteShow, toggleFavoriteShow } from "../../lib/favorites.js";
import { MovieDetailsSkeleton } from "../../Components/Skeletons";

// Movie detail components
import MovieHeader from "../../Components/MovieDetailse/MovieHeader.jsx";
import MovieStats from "../../Components/MovieDetailse/MovieStats.jsx";
import ShowTimes from "../../Components/MovieDetailse/ShowTimes.jsx";
import CastGrid from "../../Components/MovieDetailse/CastGrid.jsx";
import RelatedMovies from "../../Components/MovieDetailse/RelatedMovies.jsx";

// Mock show dates for demo
const SHOW_DATES = [
  { date: "2026-08-01", day: "Sat", timeSlots: ["10:00 AM", "2:30 PM", "7:00 PM", "10:30 PM"] },
  { date: "2026-08-02", day: "Sun", timeSlots: ["11:00 AM", "3:30 PM", "8:00 PM"] },
  { date: "2026-08-03", day: "Mon", timeSlots: ["1:00 PM", "5:30 PM", "9:00 PM"] },
  { date: "2026-08-04", day: "Tue", timeSlots: ["12:00 PM", "4:30 PM", "8:30 PM"] },
];

const MovieDetailse = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(SHOW_DATES[0]?.date || null);
  const [favorite, setFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [id]);

  // Look up movie from dummy data
  const movie = useMemo(() => {
    return dummyShowsData.find(
      (m) => m.id === parseInt(id) || m._id === id
    );
  }, [id]);

  // Find similar movies by genre
  const relatedMovies = useMemo(() => {
    if (!movie?.genres) return [];
    const currentGenreIds = movie.genres.map(g => g.id);
    return dummyShowsData
      .filter(m => m.id !== movie.id)
      .filter(m =>
        m.genres?.some(g => currentGenreIds.includes(g.id))
      )
      .slice(0, 4); // Show up to 4
  }, [movie]);

  // Keep favorite status in sync with localStorage
  useEffect(() => {
    if (!movie?.id) return;

    const syncFavoriteState = () => {
      setFavorite(isFavoriteShow(movie.id));
    };

    syncFavoriteState();
    window.addEventListener("favorites:changed", syncFavoriteState);

    return () => {
      window.removeEventListener("favorites:changed", syncFavoriteState);
    };
  }, [movie]);

  const handleTrailerClick = () => {
    if (!movie) return;
    // Find trailer by matching movie title with dummyTrailers title
    const trailer = dummyTrailers.find(t => t.title === movie.title);
    const url = trailer ? trailer.videoUrl : dummyTrailers[0]?.videoUrl;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // add or remove movie from favorites
  const handleFavoriteToggle = () => {
    if (!movie?.id) return;

    const result = toggleFavoriteShow(movie.id);
    setFavorite(result.isFavorite);

    toast.success(
      result.isFavorite
        ? `${movie.title} added to favorites`
        : `${movie.title} removed from favorites`
    );
  };

  if (isLoading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) {
    return (
      <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-gray-100">Movie not found</h1>
          <p className="mt-3 text-gray-400">The movie you're looking for doesn't exist.</p>
          <Link
            to="/movies"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Movies
          </Link>
        </div>
      </section>
    );
  }

  const language = movie.original_language?.toUpperCase() || "EN";
  const genres = movie.genres?.map((g) => g.name) || [];
  const cast = movie.casts || [];

  return (
    <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Back button */}
        <Link
          to="/movies"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Movies
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left column - Poster and basic info */}
          <div className="lg:col-span-1">
            <MovieStats
              movie={movie}
              favorite={favorite}
              handleFavoriteToggle={handleFavoriteToggle}
              onTrailerClick={handleTrailerClick}
              language={language}
              selectedDate={selectedDate}
              SHOW_DATES={SHOW_DATES}
            />
          </div>

          {/* Right column - Details */}
          <div className="lg:col-span-2">
            <MovieHeader
              movie={movie}
              language={language}
              genres={genres}
            />

            <ShowTimes
              SHOW_DATES={SHOW_DATES}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              movie={movie}
            />
          </div>
        </div>

        {/* Cast */}
        <CastGrid cast={cast} />

        {/* Related Movies */}
        <RelatedMovies relatedMovies={relatedMovies} />
      </div>
    </section>
  );
};

export default MovieDetailse;