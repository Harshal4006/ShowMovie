import React from "react";
import { MapPin, Star, Monitor, ChevronRight } from "lucide-react";

const facilityIcons = {
  IMAX: "🎬",
  "Dolby Atmos": "🔊",
  "4DX": "🎢",
  Parking: "🅿️",
  "Recliner Seats": "💺",
  "Food Court": "🍿",
  "VIP Lounge": "👑",
};

const TheaterCard = ({ theater }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] backdrop-blur-sm transition-all duration-500 hover:border-red-500/40 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={theater.image}
          alt={theater.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-white">{theater.rating}</span>
        </div>

        {/* Screen Count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white">
          <Monitor className="h-3.5 w-3.5" />
          {theater.screens} Screens
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
          {theater.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-gray-400">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-sm">{theater.location}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {theater.description}
        </p>

        {/* Facilities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {theater.facilities.map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-red-500/30 hover:bg-red-500/10"
            >
              <span>{facilityIcons[facility] || "✨"}</span>
              {facility}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95">
            View Movies
          </button>
          <button className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-95">
            Showtimes
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterCard;
