import React from "react";
import { Ticket, IndianRupee, Clock, MapPin, Film, Shield, Star, Monitor, Languages, Info } from "lucide-react";

import { formatShowDate } from "./seatLayoutUtils.js";

const PLACEHOLDER = "https://via.placeholder.com/200x300?text=No+Image";

const normalizePoster = (movie) => {
  if (!movie) return PLACEHOLDER;
  if (movie.posterUrl) return movie.posterUrl;
  if (movie.posterPath) return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
  if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return PLACEHOLDER;
};

const SeatSummaryCard = ({
  date,
  time,
  selectedSeats,
  subtotal,
  showPrice,
  onConfirm,
  confirmDisabled,
  movie,
}) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4 backdrop-blur-sm sm:rounded-4xl sm:p-6 md:sticky md:top-24">
      {/* Movie Poster Mini */}
      {movie && (
        <div className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <img
            src={normalizePoster(movie)}
            alt={movie.title}
            loading="lazy"
            className="w-20 h-28 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white leading-tight">{movie.title}</h4>
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({movie.vote_count || 0})</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="truncate">{movie.theater || "PVR Cinemas"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Monitor className="w-3.5 h-3.5 text-red-400" />
                <span>{movie.screenType || "IMAX 3D"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Info Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
          <Film className="w-3.5 h-3.5 text-red-400" />
          {formatShowDate(date)}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
          <Languages className="w-3.5 h-3.5 text-red-400" />
          {movie?.original_language?.toUpperCase() || "EN"}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Booking Summary</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-gray-200">
          <Ticket className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-3xl sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-400">Selected seats</p>
            <span className="text-xs text-red-400 font-medium">{selectedSeats.length}/8</span>
          </div>
          <p className="text-sm font-semibold text-gray-100">
            {selectedSeats.length > 0 ? selectedSeats.slice().sort().join(", ") : "None selected"}
          </p>
          {selectedSeats.length > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              Row: {selectedSeats[0]?.charAt(0) || "-"} | {selectedSeats.length} seat{selectedSeats.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-3xl sm:p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-300">Subtotal</p>
            <p className="text-sm font-semibold text-gray-100"><IndianRupee size={14} className="inline self-center" />{subtotal}</p>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Per seat</span>
            <span><IndianRupee size={10} className="inline self-center" />{showPrice ?? 180}</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-red-400 mt-0.5" />
            <p className="text-xs text-gray-300">
              Show starts in 2h 30min. Tickets will be emailed to your registered address.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-400 hover:to-red-500 disabled:opacity-60"
        >
          {selectedSeats.length > 0 ? (
            <span className="flex items-center justify-center gap-1">
              Pay <IndianRupee size={14} className="inline self-center" />{subtotal}
            </span>
          ) : "Select Seats to Continue"}
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-green-400" />
            <span>100% Secure</span>
          </div>
          <span className="text-gray-600">•</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Best Experience</span>
          </div>
          <span className="text-gray-600">•</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Ticket className="w-4 h-4 text-red-400" />
            <span>E-Ticket</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSummaryCard;

