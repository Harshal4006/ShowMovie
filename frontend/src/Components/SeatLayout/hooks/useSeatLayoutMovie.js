import { useEffect, useState } from "react";

import { getMovieById } from "../../../services/api";

export const useSeatLayoutMovie = (id) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMovieById(id, { signal: controller.signal });
        setMovie(data?.message ? null : data);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setError(e?.message || "Failed to load movie");
          setMovie(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [id]);

  return { movie, isLoading, error };
};
