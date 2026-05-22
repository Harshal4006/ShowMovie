import { useMemo } from "react";
import { getShowTimeLabel, timeToMinutes } from "./seatLayoutUtils.js";
import { useSearchParams } from "react-router-dom";

export const useSelectedShow = ({ movieId, shows, date, time }) => {
  const [searchParams] = useSearchParams();
  const showIdFromUrl = searchParams.get("showId");

  return useMemo(() => {
    if (!movieId || !Array.isArray(shows)) return null;

    if (showIdFromUrl) {
      const found = shows.find((s) => s._id === showIdFromUrl || s.showId === showIdFromUrl);
      if (found) return found;
    }

    const forMovie = shows.filter((s) => s?.movie?._id === movieId || s?.movie === movieId);
    if (forMovie.length === 0) return null;

    if (!date) return forMovie[0];

    const pool = forMovie;
    if (pool.length === 0) return null;

    if (!time) return pool[0];

    const targetMinutes = timeToMinutes(time);
    if (targetMinutes == null) return pool[0];

    const exact = pool.find((show) => {
      const label = getShowTimeLabel(show?.showDateTime);
      const showMinutes = timeToMinutes(label);
      return showMinutes === targetMinutes;
    });

    return exact ?? pool[0];
  }, [date, movieId, shows, time, showIdFromUrl]);
};
