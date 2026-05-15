import { useMemo } from "react";

import { dummyShowsData } from "../../assets/assets.js";

export const useSeatLayoutMovie = (id) => {
  return useMemo(() => {
    if (!id) return null;
    return dummyShowsData.find((m) => m.id === parseInt(id, 10) || m._id === id) ?? null;
  }, [id]);
};

