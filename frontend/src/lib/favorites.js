const FAVORITES_STORAGE_KEY = "showmovie:favorites";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

// get all favorite show ids from localstorage
export const getFavoriteIds = () => {
  if (!canUseStorage()) return [];

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const isFavoriteShow = (showId) => getFavoriteIds().includes(showId);

// add or remove show from favorites
export const toggleFavoriteShow = (showId) => {
  const currentFavoriteIds = getFavoriteIds();
  const isFavorite = currentFavoriteIds.includes(showId);

  const nextFavoriteIds = isFavorite
    ? currentFavoriteIds.filter((id) => id !== showId)
    : [...currentFavoriteIds, showId];

  if (canUseStorage()) {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(nextFavoriteIds)
    );
    window.dispatchEvent(new Event("favorites:changed"));
  }

  return {
    isFavorite: !isFavorite,
    favoriteIds: nextFavoriteIds,
  };
};
