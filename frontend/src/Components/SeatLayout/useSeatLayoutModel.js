import { useEffect, useMemo, useRef } from "react";

import { useSeatLayoutMovie } from "./useSeatLayoutMovie.js";
import { useSelectedShow } from "./useSelectedShow.js";
import { useOccupiedSeats } from "./useOccupiedSeats.js";
import { useSeatSelection } from "./useSeatSelection.js";
import { useShowsByMovie } from "./useShowsByMovie.js";

export const useSeatLayoutModel = ({ id, date, time }) => {
  const requestKey = useMemo(() => `${id ?? ""}|${date ?? ""}|${time ?? ""}`, [date, id, time]);
  const { movie, isLoading: isMovieLoading, error: movieError } = useSeatLayoutMovie(id);
  const { shows, isLoading: isShowsLoading, error: showsError } = useShowsByMovie(id);

  const rows = useMemo(() => ["A", "B", "C", "D", "E", "F", "G", "H"], []);
  const seatsPerRow = 10;

  const selectedShow = useSelectedShow({ movieId: id, shows, date, time });
  const occupiedSeats = useOccupiedSeats({ selectedShow, rows, seatsPerRow });
  const {
    selectedSeats,
    selectedSeatsSet,
    clearSelection,
    toggleSeat,
    selectMultipleSeats
  } = useSeatSelection({
    occupiedSeats,
    maxSeats: 8,
  });

  const prevKeyRef = useRef(requestKey);
  useEffect(() => {
    if (prevKeyRef.current !== requestKey) {
      clearSelection();
      prevKeyRef.current = requestKey;
    }
  }, [requestKey, clearSelection]);

  const isLoading = isMovieLoading || isShowsLoading;
  const fetchError = movieError || showsError;

  let status, errorMessage;
  if (isLoading) {
    status = "loading";
    errorMessage = "";
  } else if (fetchError) {
    status = "error";
    errorMessage = fetchError;
  } else if (movie) {
    status = "ready";
    errorMessage = "";
  } else {
    status = "error";
    errorMessage = "Movie not found.";
  }

  const subtotal = useMemo(() => {
    const seatPrice = selectedShow?.showPrice ?? 180;
    return selectedSeats.reduce((sum, seatId) => {
      if (!seatId) return sum;
      return sum + seatPrice;
    }, 0);
  }, [selectedSeats, selectedShow]);

  return {
    status,
    errorMessage,
    movie,
    rows,
    seatsPerRow,
    selectedShow,
    occupiedSeats,
    selectedSeats,
    selectedSeatsSet,
    subtotal,
    toggleSeat,
    selectMultipleSeats,
  };
};
