import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { request } from "../../services/authClient.js";
import { getMovieById } from "../../services/api.js";

const useReleases = () => {
  const navigate = useNavigate();
  const [heroMovie, setHeroMovie] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [nowPlayingRes, trendingRes, upcomingRes] = await Promise.all([
          request("/tmdb/now-playing?page=1", { signal: controller.signal }),
          request("/tmdb/trending?page=1", { signal: controller.signal }),
          request("/tmdb/upcoming?page=1", { signal: controller.signal }),
        ]);

        if (controller.signal.aborted) return;

        const nowPlaying = nowPlayingRes?.movies || [];
        const trendingData = trendingRes?.movies || [];
        const upcomingData = upcomingRes?.movies || [];

        if (nowPlaying.length > 0) {
          const featured = nowPlaying[Math.floor(Math.random() * Math.min(5, nowPlaying.length))];
          setHeroMovie(featured);
        }

        setUpcoming(nowPlaying.slice(0, 12));
        setTrending(trendingData.slice(0, 12));

        const sorted = [...upcomingData].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        setComingSoon(sorted.slice(0, 8));
        setFilteredMovies(trendingData.slice(0, 12));
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (upcoming.length === 0) return;

    const interval = setInterval(() => {
      if (!scrollRef.current || isHovering) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 160, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [upcoming, isHovering]);

  const handleGenreFilter = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      setFilteredMovies(trending);
    } else {
      setSelectedGenre(genre);
      const genresList = ["Action", "Comedy", "Horror", "Sci-Fi", "Thriller", "Drama", "Romance", "Animation"];
      const filtered = trending.filter((m) =>
        m.genre_ids?.includes(genresList.indexOf(genre) + 1)
      );
      setFilteredMovies(filtered.length > 0 ? filtered : trending);
    }
  };

  const handleWatchTrailer = useCallback(async (movie) => {
    if (trailerLoading) return;
    setTrailerLoading(true);
    try {
      const data = await request(`/tmdb/movie/${movie.id}/videos`);
      const results = data?.results || [];
      const trailer = results.find((v) => v.type === "Trailer" && v.site === "YouTube") || results[0];
      if (trailer?.key) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Trailer not available right now.");
      }
    } catch {
      toast.error("Trailer not available right now.");
    } finally {
      setTrailerLoading(false);
    }
  }, [trailerLoading]);

  const navigateToMovie = useCallback(async (movieId, movieTitle) => {
    try {
      const movie = await getMovieById(movieId);
      navigate(`/movies/${movie._id || movieId}`);
    } catch {
      toast.error(`"${movieTitle || "This movie"}" is not available yet.`);
    }
  }, [navigate]);

  const handleMovieClick = useCallback(async (movieId, movieTitle) => {
    await navigateToMovie(movieId, movieTitle);
  }, [navigateToMovie]);

  const handleBookTickets = useCallback(async (movie) => {
    if (bookingLoading) return;
    setBookingLoading(true);
    await navigateToMovie(movie.id, movie.title);
    setBookingLoading(false);
  }, [bookingLoading, navigateToMovie]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return {
    heroMovie,
    upcoming,
    trending,
    comingSoon,
    filteredMovies,
    selectedGenre,
    loading,
    trailerLoading,
    bookingLoading,
    scrollRef,
    isHovering, setIsHovering,
    handleGenreFilter,
    handleWatchTrailer,
    handleMovieClick,
    handleBookTickets,
    scroll,
  };
};

export default useReleases;
