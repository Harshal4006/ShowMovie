import { useMemo } from "react";

import { useSeatLayoutMovie } from "./useSeatLayoutMovie.js";
import { useSeatLayoutStatus } from "./useSeatLayoutStatus.js";
import { useSelectedShow } from "./useSelectedShow.js";
import { useOccupiedSeats } from "./useOccupiedSeats.js";
import { useSeatSelection } from "./useSeatSelection.js";
import { useShowsByMovie } from "./useShowsByMovie.js";

export const useSeatLayoutModel = ({ id, date, time }) => {
  // create unique key for this show request
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
  const { status, errorMessage, isResolving } = useSeatLayoutStatus({
    requestKey,
    movie,
    date,
    time,
    onReset: clearSelection,
  });

  // calculate total price based on selected seats
  const subtotal = useMemo(() => {
    const seatPrice = selectedShow?.showPrice ?? 180;
    return selectedSeats.reduce((sum, seatId) => {
      if (!seatId) return sum;
      return sum + seatPrice;
    }, 0);
  }, [selectedSeats, selectedShow]);

  const computedStatus = isMovieLoading || isShowsLoading ? "loading" : status;
  const computedError = movieError || showsError || errorMessage;

  return {
    requestKey,
    status: computedStatus,
    errorMessage: computedError,
    isResolving,
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
