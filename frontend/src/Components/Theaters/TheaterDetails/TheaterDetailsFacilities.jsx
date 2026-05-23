import { Film, Volume2, Dices, ParkingCircle, Armchair, UtensilsCrossed, Crown } from 'lucide-react';

const facilityIconMap = {
  IMAX: Film,
  "Dolby Atmos": Volume2,
  "4DX": Dices,
  Parking: ParkingCircle,
  "Recliner Seats": Armchair,
  "Food Court": UtensilsCrossed,
  "VIP Lounge": Crown,
};

const TheaterDetailsFacilities = ({ facilities = [] }) => (
  <div className="animate-fade-up animate-delay-150 rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6">
    <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Facilities</h2>
    <div className="flex flex-wrap gap-2">
      {facilities.map((f) => {
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
);

export default TheaterDetailsFacilities;
