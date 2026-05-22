import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Film, ChevronRight, X, Play, TrendingUp, Sparkles, CalendarDays, Loader2, AlertCircle } from "lucide-react";
import { request } from "../../services/authClient.js";

const TMDB_IMG = "https://image.tmdb.org/t/p";
const BACKDROP_BASE = `${TMDB_IMG}/w1280`;
const POSTER_BASE = `${TMDB_IMG}/w500`;

const genresList = ["Action", "Comedy", "Horror", "Sci-Fi", "Thriller", "Drama", "Romance", "Animation"];

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Releases = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerModal, setTrailerModal] = useState({ open: false, key: null });
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [nowPlayingRes, trendingRes, upcomingRes] = await Promise.all([
          request("/tmdb/now-playing?page=1"),
          request("/tmdb/trending?page=1"),
          request("/tmdb/upcoming?page=1"),
        ]);

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
        console.error("Failed to load releases", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleGenreFilter = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      setFilteredMovies(trending);
    } else {
      setSelectedGenre(genre);
      const filtered = trending.filter((m) =>
        m.genre_ids?.includes(genresList.indexOf(genre) + 1)
      );
      setFilteredMovies(filtered.length > 0 ? filtered : trending);
    }
  };

  const openTrailer = async (movieId) => {
    try {
      const data = await request(`/tmdb/movie/${movieId}/videos`);
      const results = data?.results || [];
      const trailer = results.find((v) => v.type === "Trailer" && v.site === "YouTube") || results[0];
      if (trailer) {
        setTrailerModal({ open: true, key: trailer.key });
      }
    } catch {
      // ignore
    }
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ───── Hero ───── */}
      {heroMovie && (
        <div className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${BACKDROP_BASE}${heroMovie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1),transparent_70%)]" />

          <div className="relative h-full min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center pt-20 sm:pt-24 lg:pt-28">
            <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
              <div className="max-w-3xl animate-fade-up">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="rounded-full bg-red-600/20 border border-red-500/30 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-red-400 backdrop-blur-sm">
                    Featured Release
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-yellow-400 backdrop-blur-sm">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400" />
                    {heroMovie.vote_average?.toFixed(1)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight break-words">
                  {heroMovie.title}
                </h1>

                <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                  {heroMovie.release_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 shrink-0" />
                      {formatDate(heroMovie.release_date)}
                    </span>
                  )}
                  {heroMovie.genre_ids && (
                    <span className="flex flex-wrap gap-1.5 sm:gap-2">
                      {heroMovie.genre_ids.slice(0, 3).map((id) => (
                        <span key={id} className="rounded-full bg-white/5 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs text-gray-300 ring-1 ring-white/10">
                          {genresList[id - 1] || `Genre ${id}`}
                        </span>
                      ))}
                    </span>
                  )}
                </div>

                {heroMovie.overview && (
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
                    {heroMovie.overview}
                  </p>
                )}

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => openTrailer(heroMovie.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97]"
                  >
                    <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
                    Watch Trailer
                  </button>
                  <Link
                    to="/movies"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                  >
                    Book Tickets
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── Sections Container ───── */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1400px] mx-auto pb-20 -mt-10 sm:-mt-12 md:-mt-16 lg:-mt-20 relative z-10 space-y-10 sm:space-y-12 md:space-y-14">

        {/* ─── Upcoming This Week ─── */}
        <section className="animate-fade-up">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Upcoming This Week</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scroll(-1)} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
              </button>
              <button onClick={() => scroll(1)} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-1 sm:mx-0 px-1 sm:px-0">
            {upcoming.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] snap-start rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)] shrink-0"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : ""}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {movie.vote_average > 0 && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1 rounded-full bg-black/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
                      <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
                  {movie.release_date && (
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-gray-500">{formatDate(movie.release_date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Trending Releases ─── */}
        <section className="animate-fade-up">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Trending Releases</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {trending.map((movie, i) => (
              <div
                key={movie.id}
                className="group rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)]"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : ""}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-col gap-1">
                    {i === 0 && (
                      <span className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Trending
                      </span>
                    )}
                    {i === 1 && (
                      <span className="rounded-full bg-blue-600/90 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white">
                        New
                      </span>
                    )}
                    {movie.vote_average >= 8 && (
                      <span className="rounded-full bg-yellow-500/90 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-black">
                        Fan Favorite
                      </span>
                    )}
                  </div>

                  {movie.vote_average > 0 && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1 rounded-full bg-black/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
                      <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3 lg:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
                  <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500">
                    {movie.release_date && <span className="truncate">{movie.release_date?.split("-")[0]}</span>}
                    {movie.genre_ids && movie.genre_ids.length > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-600 shrink-0" />
                        <span className="truncate">{movie.genre_ids.slice(0, 2).map((id) => genresList[id - 1] || `Genre ${id}`).join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Coming Soon ─── */}
        {comingSoon.length > 0 && (
          <section className="animate-fade-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Coming Soon</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {comingSoon.slice(0, 4).map((movie) => {
                const releaseDate = new Date(movie.release_date);
                const now = new Date();
                const diff = releaseDate - now;
                const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
                const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));

                return (
                  <div
                    key={movie.id}
                    className="rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : ""}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                        <div className="rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                          <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Releasing in</p>
                          <p className="text-sm sm:text-base lg:text-lg font-bold text-white">
                            {days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h` : "Today"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 lg:p-4">
                      <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-gray-500">{formatDate(movie.release_date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── Genre Filter ─── */}
        <section className="animate-fade-up">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
              <Film className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Browse by Genre</h2>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6">
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreFilter(genre)}
                className={`rounded-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${
                  selectedGenre === genre
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "border border-white/10 bg-white/5 text-gray-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredMovies.slice(0, 8).map((movie) => (
                <div
                  key={movie.id}
                  className="group rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.06)]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : ""}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {movie.vote_average > 0 && (
                      <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1 rounded-full bg-black/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
                        <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
                    <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500">
                      {movie.release_date && <span>{movie.release_date?.split("-")[0]}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">No movies found for this genre.</p>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-1">Try selecting a different genre.</p>
            </div>
          )}
        </section>
      </div>

      {/* ───── Trailer Modal ───── */}
      {trailerModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
          onClick={() => setTrailerModal({ open: false, key: null })}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTrailerModal({ open: false, key: null })}
              className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 z-10 rounded-full bg-black/80 border border-white/10 p-1.5 sm:p-2 transition-all hover:bg-red-600 hover:scale-110"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerModal.key}?autoplay=1&rel=0`}
              title="Trailer"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Releases;
