import React from "react";
import { Info } from "lucide-react";

import SeatGrid from "./SeatGrid.jsx";
import { getSeatTier } from "./seatLayoutUtils.js";

const SeatSelectionCard = ({
  rows,
  seatsPerRow,
  occupiedSeats,
  selectedSeats,
  onToggleSeat,
}) => {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-4 backdrop-blur-sm sm:rounded-4xl sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Select Seats</h2>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Tap on available seats to add/remove. Max 8 seats.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 sm:px-4 sm:py-2">
          <Info className="h-3 w-3 text-gray-400 sm:h-4 sm:w-4" />
          Prices vary by row
        </div>
      </div>

      <SeatGrid
        rows={rows}
        seatsPerRow={seatsPerRow}
        occupiedSeats={occupiedSeats}
        selectedSeats={selectedSeats}
        onToggleSeat={onToggleSeat}
        getSeatTier={getSeatTier}
      />
    </div>
  );
};

export default SeatSelectionCard;

