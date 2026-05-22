import { useEffect, useState } from "react";

import { getShowsByMovie } from "../../../services/api";

export const useShowsByMovie = (movieId) => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getShowsByMovie(movieId, { signal: controller.signal });
        setShows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setError(e?.message || "Failed to load shows");
          setShows([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [movieId]);

  return { shows, isLoading, error };
};

