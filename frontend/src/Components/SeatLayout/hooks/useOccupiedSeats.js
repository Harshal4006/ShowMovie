import { useMemo } from "react";

import { buildSeatIds } from "./seatLayoutUtils.js";

// Hook to get occupied seats from selected show, or empty set if none
export const useOccupiedSeats = ({ selectedShow, rows, seatsPerRow }) => {
  return useMemo(() => {
    const occupiedFromShow = selectedShow?.occupiedSeats ?? null;
    if (occupiedFromShow && typeof occupiedFromShow === "object") {
      return new Set(Object.keys(occupiedFromShow));
    }

    const allSeatIds = buildSeatIds(rows, seatsPerRow);
    return new Set(allSeatIds.slice(0, 0));
  }, [rows, seatsPerRow, selectedShow]);
};

