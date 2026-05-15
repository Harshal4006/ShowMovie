import React, { useMemo } from "react";
import { makeSeatId } from "./seatLayoutUtils";

const SeatPill = ({ label, className }) => (
  <span className={`inline-flex items-center gap-2 text-xs text-gray-400 ${className ?? ""}`}>
    <span className="h-3 w-3 rounded-full border border-white/10 bg-white/5" />
    {label}
  </span>
);

const SeatGrid = ({
  rows,
  seatsPerRow,
  occupiedSeats,
  selectedSeats,
  onToggleSeat,
  getSeatTier,
}) => {
  const seatNumbers = useMemo(
    () => Array.from({ length: seatsPerRow }, (_, i) => i + 1),
    [seatsPerRow]
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4" role="legend" aria-label="Seat status legend">
          <span className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span className="h-3 w-3 rounded-full border border-white/10 bg-white/5" />
            Available
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span className="h-3 w-3 rounded-full border border-white/10 bg-red-500/80" />
            Selected
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span className="h-3 w-3 rounded-full border border-white/10 bg-white/10" />
            Occupied
          </span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <SeatPill label="Premium" />
          <SeatPill label="Standard" />
          <SeatPill label="Economy" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-0 space-y-1.5 sm:space-y-2 md:space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="w-5 text-center text-xs font-semibold text-gray-400 sm:w-6">
                {row}
              </div>

              <div
                className="grid min-w-0 flex-1 gap-1 sm:gap-2 md:gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${seatsPerRow}, minmax(1.5rem, 1fr))`,
                }}
              >
                {seatNumbers.map((number) => {
                  const seatId = makeSeatId(row, number);
                  const isOccupied = occupiedSeats?.has(seatId);
                  const isSelected = selectedSeats?.has(seatId);

                  const base =
                    "h-6 w-6 rounded-md border text-[10px] font-semibold transition sm:h-7 sm:w-7 sm:rounded-lg md:h-9 md:w-9 md:rounded-xl md:text-xs";
                  const tier = getSeatTier ? getSeatTier(row) : "";

                  const tierGlow =
                    tier === "Premium"
                      ? "shadow-[0_0_0_1px_rgba(245,158,11,0.2)]"
                      : tier === "Standard"
                        ? "shadow-[0_0_0_1px_rgba(59,130,246,0.18)]"
                        : "shadow-[0_0_0_1px_rgba(16,185,129,0.16)]";

                  const stateClass = isOccupied
                    ? "cursor-not-allowed border-white/10 bg-white/10 text-gray-500"
                    : isSelected
                      ? "border-red-500/40 bg-red-500/80 text-white hover:bg-red-500"
                      : "border-white/10 bg-white/5 text-gray-200 hover:border-white/20 hover:bg-white/8";

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => onToggleSeat?.(seatId)}
                      title={`${seatId}${tier ? ` • ${tier}` : ""}`}
                      aria-label={`Seat ${seatId}${isOccupied ? ', occupied' : isSelected ? ', selected' : ', available'}${tier ? `, ${tier}` : ''}`}
                      className={`${base} ${tierGlow} ${stateClass}`}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>

              <div className="hidden w-16 text-right text-xs text-gray-500 sm:block sm:w-20">
                {getSeatTier ? getSeatTier(row) : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-7">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center text-xs font-semibold tracking-widest text-gray-300 sm:rounded-3xl sm:px-6 sm:py-3" aria-hidden="true">
          SCREEN THIS WAY
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
