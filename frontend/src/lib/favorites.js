import { toggleFavorite as apiToggleFavorite, getUserFavorites } from "../services/api";

const FAVORITES_STORAGE_KEY = "showmovie:favorites";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const getLocalFavoriteIds = () => {
  if (!canUseStorage()) return [];
  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const setLocalFavoriteIds = (ids) => {
  if (canUseStorage()) {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  }
};

export const getFavoriteIds = async (getToken) => {
  if (!getToken) {
    return getLocalFavoriteIds();
  }

  try {
    const token = await getToken();
    if (!token) {
      return getLocalFavoriteIds();
    }

    const data = await getUserFavorites(token);
    const backendFavorites = data?.favorites || [];
    const tmdbIds = backendFavorites.map((m) => String(m.tmdbId));

    setLocalFavoriteIds(tmdbIds);
    return tmdbIds;
  } catch (error) {
    console.error("Failed to fetch favorites from backend:", error);
    return getLocalFavoriteIds();
  }
};

export const isFavoriteShow = async (showId, getToken) => {
  const favorites = await getFavoriteIds(getToken);
  return favorites.includes(String(showId));
};

export const toggleFavoriteShow = async (showId, getToken) => {
  const currentLocalIds = getLocalFavoriteIds();
  const isFavorite = currentLocalIds.includes(String(showId));

  if (getToken) {
    try {
      const token = await getToken();
      if (token) {
        await apiToggleFavorite(token, showId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite on backend:", error);
    }
  }

  const nextFavoriteIds = isFavorite
    ? currentLocalIds.filter((id) => id !== String(showId))
    : [...currentLocalIds, String(showId)];

  setLocalFavoriteIds(nextFavoriteIds);
  window.dispatchEvent(new Event("favorites:changed"));

  return {
    isFavorite: !isFavorite,
    favoriteIds: nextFavoriteIds,
  };
};

export const fetchBackendFavorites = async (getToken) => {
  if (!getToken) return [];

  try {
    const token = await getToken();
    if (!token) return [];

    const data = await getUserFavorites(token);
    return data?.favorites || [];
  } catch (error) {
    console.error("Failed to fetch backend favorites:", error);
    return [];
  }
};