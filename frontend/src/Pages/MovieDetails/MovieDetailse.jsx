// MovieDetailse page - single movie view with showtimes, cast, and related movies
import React, { useState, useEffect, useRef } from "react";

import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

import { useUserContext } from "../../hooks/UserContext";
import { MovieDetailsSkeleton } from "../../Components/Skeletons";
import MovieHeader from "../../Components/MovieDetailse/MovieHeader.jsx";
import MovieStats from "../../Components/MovieDetailse/MovieStats.jsx";
import ShowTimes from "../../Components/MovieDetailse/ShowTimes.jsx";
import CastGrid from "../../Components/MovieDetailse/CastGrid.jsx";
import RelatedMovies from "../../Components/MovieDetailse/RelatedMovies.jsx";

import { getMovieById, getRelatedMovies, getShowsByMovie } from "../../services/api";

// Helper: format ISO date to YYYY-MM-DD
const formatDateKey = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: format ISO time to 12-hour label
const formatTimeLabel = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const MovieDetailse = () => {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const { favoriteIds, toggleFavorite } = useUserContext();
  const toastIdRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [showDates, setShowDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tmdbId = movie?.tmdbId ? Number(movie.tmdbId) : null;
  const isFavorite = tmdbId != null && favoriteIds.includes(tmdbId);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMovieById(id);
        if (data.message && data.message.includes('not found')) {
          setError('Movie not found');
        } else {
          setMovie(data);
          const related = await getRelatedMovies(id);
          setRelatedMovies(related.movies || related || []);

          const movieId = data?._id || id;
          const nextShows = await getShowsByMovie(movieId);
          const showList = Array.isArray(nextShows) ? nextShows : (nextShows?.shows || []);

          const grouped = new Map();
          for (const s of showList) {
            const dateKey = formatDateKey(s.showDateTime);
            const time = formatTimeLabel(s.showDateTime);
            if (!dateKey || !time) continue;
            const ms = new Date(s.showDateTime).getTime();
            if (!grouped.has(dateKey)) grouped.set(dateKey, new Map());
            const existing = grouped.get(dateKey).get(time);
            if (existing == null) {
              grouped.get(dateKey).set(time, { ms, shows: [s] });
            } else {
              existing.shows.push(s);
            }
          }

          const nextShowDates = [...grouped.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, timeMap]) => ({
              date,
              day: new Date(date).toLocaleDateString("en-IN", { weekday: "short" }),
              timeSlots: [...timeMap.entries()]
                .sort((a, b) => a[1].ms - b[1].ms)
                .flatMap(([label, data]) => data.shows.map((show) => ({
                  label,
                  showId: show._id,
                  price: show.showPrice,
                  showDateTime: show.showDateTime
                }))),
            }));

          setShowDates(nextShowDates);
          setSelectedDate((prev) => prev || nextShowDates[0]?.date || null);
        }
      } catch {
        setError('Failed to load movie');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleTrailerClick = () => {
    if (movie?.trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailerKey}`, "_blank");
    }
  };

  const handleFavoriteClick = async () => {
    if (!movie?.tmdbId) return;

    if (!isSignedIn) {
      toast.error("Please login to add favorites");
      return;
    }

    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    const adding = !isFavorite;

    toastIdRef.current = toast.success(
      adding
        ? `${movie.title} added to favorites`
        : `${movie.title} removed from favorites`,
      { duration: 2000 }
    );

    await toggleFavorite(movie);
  };

  // Loading state
  if (isLoading) return <MovieDetailsSkeleton />;

  // Error state
  if (error || !movie) {
    return (
      <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-gray-100">{error || 'Movie not found'}</h1>
          <p className="mt-3 text-gray-400">The movie you're looking for doesn't exist.</p>
          <Link to="/movies" className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400">
            <ChevronLeft className="h-4 w-4" />
            Back to Movies
          </Link>
        </div>
      </section>
    );
  }

  const language = movie.language?.toUpperCase() || "EN";
  const genres = movie.genres?.map((g) => g.name) || [];
  const cast = movie.cast || [];

  // Render
  return (
    <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <Link to="/movies" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Back to Movies
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <MovieStats
              movie={movie}
              favorite={isFavorite}
              handleFavoriteToggle={handleFavoriteClick}
              onTrailerClick={handleTrailerClick}
              language={language}
              selectedDate={selectedDate}
              showDates={showDates}
            />
          </div>

          <div className="lg:col-span-2">
            <MovieHeader movie={movie} language={language} genres={genres} />
            <ShowTimes showDates={showDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} movie={movie} />
          </div>
        </div>

        <CastGrid cast={cast} />
        <RelatedMovies relatedMovies={relatedMovies} />
      </div>
    </section>
  );
};

export default MovieDetailse;