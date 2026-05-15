import { useMemo } from "react";

import { readBookings, writeBookings } from "./seatLayoutStorage.js";
import { useSeatLayoutMovie } from "./useSeatLayoutMovie.js";
import { useSeatLayoutStatus } from "./useSeatLayoutStatus.js";
import { useSelectedShow } from "./useSelectedShow.js";
import { useOccupiedSeats } from "./useOccupiedSeats.js";
import { useSeatSelection } from "./useSeatSelection.js";

export const useSeatLayoutModel = ({ id, date, time }) => {
  // create unique key for this show request
  const requestKey = useMemo(() => `${id ?? ""}|${date ?? ""}|${time ?? ""}`, [date, id, time]);
  const movie = useSeatLayoutMovie(id);

  const rows = useMemo(() => ["A", "B", "C", "D", "E", "F", "G", "H"], []);
  const seatsPerRow = 10;

  const selectedShow = useSelectedShow({ movie, date, time });
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

  // create booking and save to local storage
  const confirmBooking = () => {
    if (!movie) return { ok: false, reason: "missing_movie" };
    if (selectedSeats.length === 0) return { ok: false, reason: "no_seats" };

    const booking = {
      id: `bk_${Date.now()}`,
      showId: selectedShow?._id ?? null,
      movieId: movie.id ?? movie._id,
      movieTitle: movie.title,
      poster: movie.poster_path ?? movie.backdrop_path ?? null,
      showDate: date,
      showTime: time,
      seats: [...selectedSeats].sort(),
      amount: subtotal,
      createdAt: new Date().toISOString(),
    };

    const current = readBookings();
    writeBookings([booking, ...current]);
    return { ok: true, booking };
  };

  return {
    requestKey,
    status,
    errorMessage,
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
    confirmBooking,
  };
};
