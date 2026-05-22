import { useMemo, useState, useCallback } from "react";

/**
 * Custom hook for managing seat selection state
 * @param {Object} options
 * @param {Set} options.occupiedSeats - Set of already occupied seat IDs
 * @param {number} options.maxSeats - Maximum number of seats that can be selected (default: 8)
 * @returns {Object} Seat selection state and actions
 */
export const useSeatSelection = ({ occupiedSeats, maxSeats = 8 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Memoized Set for faster lookups
  const selectedSeatsSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);

  /**
   * Clear all selected seats
   */
  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  /**
   * Toggle seat selection
   * @param {string} seatId - ID of the seat to toggle
   * @returns {Object} Result object with ok boolean and reason string
   */
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

  /**
   * Select multiple seats at once
   * @param {Array} seatIds - Array of seat IDs to select
   * @returns {Object} Result object with ok boolean and reason string
   */
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

  // Count of selected seats for internal use
  const selectedCount = selectedSeats.length;

  return {
    // State
    selectedSeats,
    selectedSeatsSet,
    
    // Actions
    clearSelection,
    toggleSeat,
    selectMultipleSeats,
  };
};

