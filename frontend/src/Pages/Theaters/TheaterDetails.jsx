import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Monitor, MapPin, Clock, Phone, Mail, Film,
  Volume2, Dices, ParkingCircle, Armchair, UtensilsCrossed, Crown,
  Ticket, ChevronRight
} from "lucide-react";
import theaters from "../../data/theaters.js";
import { dummyShowsData } from "../../assets/assets.js";
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

const showTimings = ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:45 PM"];

const galleryImages = [inoxImage, cinepolisImage, mirajImage, carnivalImage];

const TheaterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const theater = theaters.find((t) => t.id === Number(id));

  if (!theater) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-[#050505] px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
            <Film className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Theater Not Found</h1>
          <p className="mt-3 text-gray-500">
            The theater you're looking for doesn't exist or has been removed.
          </p>
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

  const theaterMovies = dummyShowsData.slice(
    ((theater.id - 1) * 3) % dummyShowsData.length,
    ((theater.id - 1) * 3 + 3) % dummyShowsData.length || undefined
  );

  const galleryLabel = ["Luxury Seats", "IMAX Hall", "Food Court", "Lobby"];

  return (
    <section className="relative min-h-screen w-full bg-[#050505]">
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
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={theater.image}
          alt={theater.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

        {/* Back button */}
        <button
          onClick={() => navigate("/theaters")}
          className="absolute top-24 left-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 backdrop-blur-md transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white sm:left-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="animate-fade-up">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 backdrop-blur-sm ring-1 ring-red-500/10">
                  <Star className="h-3.5 w-3.5 fill-red-400" />
                  {theater.rating} Rating
                </div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  {theater.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
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

              <div className="flex gap-3 animate-fade-up" style={{ animationDelay: "150ms" }}>
                <button className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97]">
                  View Movies
                </button>
                <button className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-[0.97]">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10 -mt-8">
        {/* Quick Info Strip */}
        <div className="relative z-10 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-6 py-5 backdrop-blur-xl sm:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <Star className="mb-1.5 h-5 w-5 text-yellow-400" />
                <div className="text-lg font-bold text-white">{theater.rating}</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Monitor className="mb-1.5 h-5 w-5 text-red-500" />
                <div className="text-lg font-bold text-white">{theater.screens}</div>
                <div className="text-xs text-gray-500">Screens</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Film className="mb-1.5 h-5 w-5 text-red-500" />
                <div className="text-lg font-bold text-white">{theater.facilities.length}</div>
                <div className="text-xs text-gray-500">Facilities</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <MapPin className="mb-1.5 h-5 w-5 text-red-500" />
                <div className="text-sm font-semibold text-white">{theater.city}</div>
                <div className="text-xs text-gray-500">City</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ───── Left Column ───── */}
          <div className="space-y-8 lg:col-span-1">
            {/* Facilities */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 sm:p-6" style={{ animationDelay: "150ms" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Facilities</h2>
              <div className="flex flex-wrap gap-2.5">
                {theater.facilities.map((f) => {
                  const Icon = facilityIconMap[f];
                  return (
                    <span
                      key={f}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3.5 py-2 text-sm text-gray-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                    >
                      {Icon && <Icon className="h-4 w-4 text-red-400" />}
                      {f}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Theater Info */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 sm:p-6" style={{ animationDelay: "200ms" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Theater Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Address</p>
                    <p className="text-sm text-gray-400">{theater.location}, {theater.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Opening Hours</p>
                    <p className="text-sm text-gray-400">10:00 AM - 11:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Phone</p>
                    <p className="text-sm text-gray-400">+91 22 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <p className="text-sm text-gray-400 lowercase">
                      info@{theater.name.toLowerCase().replace(/\s+/g, "")}.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Total Screens</p>
                    <p className="text-sm text-gray-400">{theater.screens} Screens</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 sm:p-6" style={{ animationDelay: "250ms" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl">
                    <img
                      src={img}
                      alt={galleryLabel[i]}
                      className="h-28 w-full object-cover transition-all duration-500 group-hover:scale-110 sm:h-32"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-2 left-2 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {galleryLabel[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ───── Right Column - Currently Running Movies ───── */}
          <div className="space-y-6 lg:col-span-2">
            <div className="animate-fade-up flex items-center gap-2" style={{ animationDelay: "150ms" }}>
              <Film className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Now Showing</h2>
              <span className="ml-auto text-sm text-gray-500">{theaterMovies.length} movies</span>
            </div>

            {theaterMovies.map((movie, mIndex) => {
              const movieTimings = showTimings.slice(
                ((theater.id + mIndex) * 2) % showTimings.length,
                ((theater.id + mIndex) * 2 + 4) % showTimings.length || undefined
              );

              return (
                <div
                  key={movie._id || movie.id}
                  className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] overflow-hidden transition-all duration-300 hover:border-red-500/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.06)]"
                  style={{ animationDelay: `${200 + mIndex * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Poster */}
                    <div className="relative w-full sm:w-40 shrink-0">
                      <img
                        src={movie.poster_path || movie.posterUrl}
                        alt={movie.title}
                        className="h-48 w-full object-cover transition-all duration-500 hover:scale-105 sm:h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-transparent sm:to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm sm:left-3 sm:right-auto">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {movie.title}
                          </h3>
                          <Link
                            to={`/movies/${movie._id || movie.id}`}
                            className="hidden shrink-0 rounded-full bg-red-600/10 px-3 py-1 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-600/20 sm:inline-flex"
                          >
                            Details <ChevronRight className="ml-0.5 h-3 w-3" />
                          </Link>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span>{movie.release_date?.split("-")[0]}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span>{movie.genres?.slice(0, 2).map((g) => g.name).join(", ")}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span>{formatRuntime(movie.runtime)}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span className="uppercase">{movie.original_language}</span>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
                          {movie.overview}
                        </p>
                      </div>

                      {/* Show Timings */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
                          <Clock className="h-3.5 w-3.5" />
                          Show Timings
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {movieTimings.map((time) => (
                            <button
                              key={time}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white hover:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Book Ticket */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <span className="text-xs text-gray-500">
                          Starting from ₹199
                        </span>
                        <Link
                          to={`/movies/${movie._id || movie.id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97]"
                        >
                          <Ticket className="h-4 w-4" />
                          Book Ticket
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheaterDetails;
