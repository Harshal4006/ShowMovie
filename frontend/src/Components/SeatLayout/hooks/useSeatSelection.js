import { useMemo, useState, useCallback } from "react";

export const useSeatSelection = ({ occupiedSeats, maxSeats = 8 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const selectedSeatsSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);

  // Clear all selected seats
  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  // Toggle a single seat selection
  const toggleSeat = useCallback((seatId) => {
    if (!seatId || typeof seatId !== 'string') {
      return { ok: false, reason: "invalid", message: "Invalid seat ID" };
    }
    
    if (occupiedSeats.has(seatId)) {
      return { ok: false, reason: "occupied", message: "Seat is already occupied" };
    }

    let result = { ok: true, reason: "toggled", message: "Seat toggled successfully" };
    
    setSelectedSeats((prev) => {
      const exists = prev.includes(seatId);
      
      // If seat is already selected, remove it
      if (exists) {
        return prev.filter((value) => value !== seatId);
      }
      
      // Check seat limit
      if (prev.length >= maxSeats) {
        result = {
          ok: false,
          reason: "limit",
          message: `Maximum ${maxSeats} seats allowed`
        };
        return prev;
      }
      
      // Add seat to selection
      return [...prev, seatId];
    });

    return result;
  }, [occupiedSeats, maxSeats]);

  // Select multiple seats at once
  const selectMultipleSeats = useCallback((seatIds) => {
    if (!Array.isArray(seatIds)) {
      return { ok: false, reason: "invalid", message: "Invalid seat IDs array" };
    }

    // Filter out invalid and occupied seats
    const validSeats = seatIds.filter(seatId =>
      seatId &&
      typeof seatId === 'string' &&
      !occupiedSeats.has(seatId)
    );

    // Check if adding these would exceed limit
    if (selectedSeats.length + validSeats.length > maxSeats) {
      return {
        ok: false,
        reason: "limit",
        message: `Cannot select ${validSeats.length} seats, would exceed maximum of ${maxSeats}`
      };
    }

    // Add unique seats only
    const newSeats = validSeats.filter(seatId => !selectedSeats.includes(seatId));
    if (newSeats.length > 0) {
      setSelectedSeats(prev => [...prev, ...newSeats]);
    }

    return {
      ok: true,
      reason: "added",
      message: `Added ${newSeats.length} seat(s)`
    };
  }, [selectedSeats, occupiedSeats, maxSeats]);

  const selectedCount = selectedSeats.length;

  return {
    selectedSeats,
    selectedSeatsSet,
    clearSelection,
    toggleSeat,
    selectMultipleSeats,
  };
};

