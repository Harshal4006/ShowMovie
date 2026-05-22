import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Monitor, MapPin, Clock, Phone, Mail, Film,
  Volume2, Dices, ParkingCircle, Armchair, UtensilsCrossed, Crown,
  Ticket, Loader2
} from "lucide-react";
import { getTheaterById, getNowShowingMovies } from "../../services/api.js";
import { formatRuntime } from "../../lib/formatRuntime.js";
import inoxImage from "../../assets/Theaters Img/INOX.png";
import cinepolisImage from "../../assets/Theaters Img/Cinepolis.png";
import mirajImage from "../../assets/Theaters Img/Miraj Cinemas.png";
import carnivalImage from "../../assets/Theaters Img/Carnival Cinemas.png";

const facilityIconMap = {
  IMAX: Film,
  "Dolby Atmos": Volume2,
  "4DX": Dices,
  Parking: ParkingCircle,
  "Recliner Seats": Armchair,
  "Food Court": UtensilsCrossed,
  "VIP Lounge": Crown,
};

const defaultShowTimings = ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:45 PM"];
const fallbackGallery = [inoxImage, cinepolisImage, mirajImage, carnivalImage];
const galleryLabel = ["Luxury Seats", "IMAX Hall", "Food Court", "Lobby"];

const TheaterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moviesError, setMoviesError] = useState(false);

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        setLoading(true);
        const data = await getTheaterById(id);
        setTheater(data);
        if (data.movies && data.movies.length > 0) {
          setMovies(data.movies);
          setMoviesLoading(false);
        }
      } catch (err) {
        setError(err?.message || "Theater not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTheater();
  }, [id]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setMoviesLoading(true);
        const data = await getNowShowingMovies();
        if (Array.isArray(data)) {
          const existingIds = new Set(movies.map((m) => m._id || m.id));
          const fresh = data.filter((m) => !existingIds.has(m._id || m.id));
          setMovies((prev) => (prev.length > 0 ? [...prev, ...fresh] : fresh));
        }
      } catch {
        setMoviesError(true);
      } finally {
        setMoviesLoading(false);
      }
    };
    if (!theater) return;
    if (!theater.movies || theater.movies.length === 0) {
      fetchMovies();
    } else {
      setMoviesLoading(false);
    }
  }, [theater?.movies?.length]);

  const showTimings = theater?.showTimings?.length > 0 ? theater.showTimings : defaultShowTimings;
  const gallery = theater?.galleryImages?.length >= 4 ? theater.galleryImages.slice(0, 4) : fallbackGallery;

  if (loading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </section>
    );
  }

  if (error || !theater) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-[#050505] px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
            <Film className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Theater Not Found</h1>
          <p className="mt-3 text-gray-500">{error || "The theater you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/theaters")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Theaters
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
      `}</style>

      {/* ───── Hero ───── */}
      <div className="relative min-h-[420px] md:min-h-[560px] overflow-hidden pt-16 sm:pt-20">
        <img
          src={theater.image}
          alt={theater.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

        {/* Back Button - top left */}
        <div className="relative z-30 px-4 sm:px-6 ml-1 sm:ml-4">
          <button
            onClick={() => navigate("/theaters")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 backdrop-blur-md transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Hero Content - center */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pt-14 sm:pt-16">
          <div className="max-w-[80%] mx-auto px-4 text-center">
            <div className="animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 backdrop-blur-sm ring-1 ring-red-500/10">
                <Star className="h-3.5 w-3.5 fill-red-400" />
                {theater.rating} Rating
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {theater.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {theater.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Monitor className="h-4 w-4 text-red-500" />
                  {theater.screens} Screens
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Stats Strip ───── */}
      <div className="relative z-10 -translate-y-6 md:-translate-y-14 px-4 sm:px-6 mb-6 md:mb-0">
        <div className="mx-auto max-w-full sm:max-w-[80%]">
          <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-4 sm:px-8 py-4 sm:py-5 backdrop-blur-xl" style={{ animationDelay: "100ms" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex flex-col items-center text-center">
                <Star className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                <div className="text-base sm:text-lg font-bold text-white">{theater.rating}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Rating</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Monitor className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <div className="text-base sm:text-lg font-bold text-white">{theater.screens}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Screens</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Film className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <div className="text-base sm:text-lg font-bold text-white">{(theater.facilities || []).length}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Facilities</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <MapPin className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <div className="text-xs sm:text-sm font-semibold text-white">{theater.city}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">City</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="px-4 sm:px-6 pb-20 mx-auto max-w-full sm:max-w-[80%]">
        <div className="mt-6 space-y-6 md:mt-0 md:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* ───── Left Column ───── */}
          <div className="space-y-6 lg:col-span-1">
            {/* Facilities */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6" style={{ animationDelay: "150ms" }}>
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {(theater.facilities || []).map((f) => {
                  const Icon = facilityIconMap[f];
                  return (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />}
                      {f}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Theater Info */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6" style={{ animationDelay: "200ms" }}>
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Theater Information</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: `${theater.location}, ${theater.city}` },
                  { icon: Clock, label: "Opening Hours", value: theater.openingHours || "10:00 AM - 11:45 PM" },
                  { icon: Phone, label: "Phone", value: theater.contactNumber || "+91 22 1234 5678" },
                  { icon: Mail, label: "Email", value: theater.email || `info@${theater.name?.toLowerCase().replace(/\s+/g, "")}.com` },
                  { icon: Monitor, label: "Total Screens", value: `${theater.screens} Screens` },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-sm text-gray-400 break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6" style={{ animationDelay: "250ms" }}>
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Gallery</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl">
                    <img
                      src={img}
                      alt={galleryLabel[i] || `Gallery ${i + 1}`}
                      className="h-24 sm:h-28 w-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-2 left-2 text-[10px] sm:text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {galleryLabel[i] || `Gallery ${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ───── Right Column - Movies ───── */}
          <div className="space-y-6 lg:col-span-2">
            <div className="animate-fade-up flex items-center gap-2" style={{ animationDelay: "150ms" }}>
              <Film className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Now Showing</h2>
              <span className="ml-auto text-sm text-gray-500">{movies.length} movies</span>
            </div>

            {moviesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <div className="aspect-[2/3] bg-gray-800/50" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-800/50 rounded w-3/4" />
                      <div className="h-3 bg-gray-800/50 rounded w-1/2" />
                      <div className="h-8 bg-gray-800/50 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : movies.length === 0 && !moviesError ? (
              <div className="animate-fade-up rounded-2xl border border-white/[0.06] p-8 text-center" style={{ animationDelay: "200ms" }}>
                <Film className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">No movies currently showing at this theater.</p>
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.slice(0, 4).map((movie, mIndex) => (
                  <MovieCard
                    key={movie._id || movie.id}
                    movie={movie}
                    mIndex={mIndex}
                    showTimings={showTimings}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const MovieCard = ({ movie, mIndex, showTimings }) => {
  const timings = showTimings.slice(
    (mIndex * 2) % showTimings.length,
    ((mIndex * 2) + 3) % showTimings.length || undefined
  );

  const poster = movie.posterUrl || movie.posterPath || movie.poster_path || movie.backdropUrl || "";
  const rating = movie.rating || movie.vote_average;
  const year = movie.releaseDate?.split("-")[0] || movie.release_date?.split("-")[0];
  const genres = movie.genres || [];
  const runtime = movie.runtime;
  const movieId = movie._id || movie.id;
  const language = movie.originalLanguage || movie.original_language || movie.language;

  return (
    <div
      className="animate-fade-up rounded-xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.06)] hover:scale-[1.02] flex flex-col h-full"
      style={{ animationDelay: `${200 + mIndex * 100}ms` }}
    >
      {/* Poster - vertical cinematic ratio */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(280px, 45vw, 420px)" }}>
        <img
          src={poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-all duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/10">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
        )}
        {language && (
          <div className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-medium text-gray-300 backdrop-blur-sm ring-1 ring-white/10 uppercase">
            {language}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <h3 className="text-sm font-bold text-white leading-tight">{movie.title}</h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
          {year && <span>{year}</span>}
          {year && runtime && <span className="h-1 w-1 rounded-full bg-gray-600" />}
          {runtime && <span>{formatRuntime(runtime)}</span>}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genres.slice(0, 2).map((g) => (
              <span
                key={g.name || g}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-white/[0.06]"
              >
                {g.name || g}
              </span>
            ))}
          </div>
        )}

        {timings.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1.5">
              <Clock className="h-3 w-3" />
              Show Timings
            </div>
            <div className="flex flex-wrap gap-1">
              {timings.map((time) => (
                <span
                  key={time}
                  className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-gray-300"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-1">
          <Link
            to={`/movies/${movieId}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97]"
          >
            <Ticket className="h-3.5 w-3.5" />
            Book Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TheaterDetails;
