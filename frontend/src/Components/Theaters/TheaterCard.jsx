import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Monitor, Film, Volume2, Dices, ParkingCircle, Armchair, UtensilsCrossed, Crown, ChevronRight } from "lucide-react";

const facilityIcons = {
  IMAX: Film,
  "Dolby Atmos": Volume2,
  "4DX": Dices,
  Parking: ParkingCircle,
  "Recliner Seats": Armchair,
  "Food Court": UtensilsCrossed,
  "VIP Lounge": Crown,
};

const TheaterCard = ({ theater }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(`/theaters/${theater.id}`), [navigate, theater.id]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/theaters/${theater.id}`);
    }
  }, [navigate, theater.id]);
  const handleViewMovies = useCallback((e) => {
    e.stopPropagation();
    navigate(`/theaters/${theater.id}`);
  }, [navigate, theater.id]);
  const handleShowtimes = useCallback((e) => {
    e.stopPropagation();
    navigate(`/theaters/${theater.id}`);
  }, [navigate, theater.id]);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-lg transition-all duration-500 hover:border-red-500/40 hover:shadow-[0_0_60px_rgba(239,68,68,0.15)] hover:-translate-y-1.5">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={theater.image}
          alt={theater.name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:-rotate-[1deg] group-hover:brightness-110"
          loading="lazy"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300 group-hover:ring-red-500/30 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-white">{theater.rating}</span>
        </div>

        {/* Screen Count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-500/25 backdrop-blur-sm">
          <Monitor className="h-3.5 w-3.5" />
          {theater.screens} Screens
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-red-400">
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
        <div className="mt-4 flex flex-wrap gap-1.5">
          {theater.facilities.map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs text-gray-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-gray-200"
            >
              {(() => { const Icon = facilityIcons[facility]; return Icon && <Icon className="h-3 w-3" />; })()}
              {facility}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleViewMovies}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.97]"
          >
            View Movies
          </button>
          <button
            onClick={handleShowtimes}
            className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-[0.97]"
          >
            Showtimes
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MemoTheaterCard = memo(TheaterCard);
MemoTheaterCard.displayName = "TheaterCard";
export default MemoTheaterCard;
