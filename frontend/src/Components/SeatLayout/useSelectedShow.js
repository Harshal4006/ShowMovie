import { useMemo } from "react";

import { dummyDashboardData } from "../../assets/assets.js";
import { getShowTimeLabel, timeToMinutes } from "./seatLayoutUtils.js";

export const useSelectedShow = ({ movie, date, time }) => {
  return useMemo(() => {
    const activeShows = dummyDashboardData?.activeShows ?? [];
    if (!movie || !date) return null;

    const forMovie = activeShows.filter((show) => {
      const showMovieId = show?.movie?.id ?? show?.movie?._id;
      const movieId = movie?.id ?? movie?._id;
      return showMovieId === movieId;
    });

    if (forMovie.length === 0) return null;

    const dateMatches = forMovie.filter((show) => {
      const showDate = new Date(show?.showDateTime ?? 0);
      if (Number.isNaN(showDate.getTime())) return false;
      const localDateString = showDate.toISOString().slice(0, 10);
      return localDateString === date;
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
  }, [date, movie, time]);
};