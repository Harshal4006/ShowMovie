import { useMemo } from "react";

import { getShowTimeLabel, timeToMinutes } from "./seatLayoutUtils.js";

const formatDateKey = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const useSelectedShow = ({ movieId, shows, date, time }) => {
  return useMemo(() => {
    if (!movieId || !date || !Array.isArray(shows)) return null;
    const forMovie = shows.filter((s) => s?.movie?._id === movieId || s?.movie === movieId);

    if (forMovie.length === 0) return null;

    const dateMatches = forMovie.filter((show) => {
      const showDate = formatDateKey(show?.showDateTime ?? 0);
      return showDate === date;
    });

    const pool = dateMatches.length > 0 ? dateMatches : forMovie;
    if (pool.length === 0) return null;

    const targetMinutes = timeToMinutes(time);
    if (targetMinutes == null) return pool[0];

    const exact = pool.find((show) => {
      const label = getShowTimeLabel(show?.showDateTime);
      const showMinutes = timeToMinutes(label);
      return showMinutes === targetMinutes;
    });

    return exact ?? pool[0];
  }, [date, movieId, shows, time]);
};
