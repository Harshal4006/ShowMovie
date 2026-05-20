import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { request } from '../services/authClient';

const UserContext = createContext(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

const normalizeFavorites = (favoritesData) => {
  const ids = [];
  const moviesMap = {};

  const list = Array.isArray(favoritesData)
    ? favoritesData
    : (favoritesData?.favorites || []);

  for (const item of list) {
    let tmdbId;
    if (typeof item === 'number' || typeof item === 'string') {
      tmdbId = Number(item);
    } else if (item?.tmdbId != null) {
      tmdbId = Number(item.tmdbId);
    } else {
      continue;
    }

    if (!Number.isFinite(tmdbId)) continue;
    if (ids.includes(tmdbId)) continue;

    ids.push(tmdbId);
    moviesMap[tmdbId] = typeof item === 'object' ? item : null;
  }

  return { ids, moviesMap };
};

export const UserProvider = ({ children }) => {
  const { isSignedIn, isLoaded: clerkLoaded, getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCountRef = useRef(0);

  const fetchUserData = useCallback(async () => {
    if (!clerkLoaded || !isSignedIn) {
      if (!isSignedIn) {
        setUser(null);
        setFavoriteIds([]);
        setFavoriteMovies({});
        setIsLoading(false);
      }
      return;
    }

    fetchCountRef.current += 1;
    const currentFetch = fetchCountRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        setFavoriteIds([]);
        setFavoriteMovies({});
        setIsLoading(false);
        return;
      }

      const [userData, favoritesData] = await Promise.all([
        request('/users/me', { token }),
        request('/users/favorites', { token })
      ]);

      if (currentFetch !== fetchCountRef.current) return;

      setUser(userData);

      const { ids, moviesMap } = normalizeFavorites(favoritesData);
      setFavoriteIds(ids);
      setFavoriteMovies(moviesMap);
    } catch (err) {
      if (currentFetch !== fetchCountRef.current) return;
      setError(err.message);
      setUser(null);
      setFavoriteIds([]);
      setFavoriteMovies({});
    } finally {
      if (currentFetch === fetchCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSignedIn, clerkLoaded, getToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const clearUser = useCallback(() => {
    setUser(null);
    setFavoriteIds([]);
    setFavoriteMovies({});
    setError(null);
  }, []);

  const toggleFavorite = useCallback(async (movie) => {
    const tmdbId = movie?.tmdbId ?? movie?.id ?? movie?._id;
    const numericId = Number(tmdbId);
    if (!Number.isFinite(numericId)) return;

    const isFavorite = favoriteIds.includes(numericId);

    setFavoriteIds((prev) => {
      if (isFavorite) return prev.filter((id) => id !== numericId);
      return prev.includes(numericId) ? prev : [...prev, numericId];
    });

    try {
      const token = await getToken();
      if (!token) return;
      await request('/users/favorites', { method: 'POST', token, body: { tmdbId: String(numericId) } });
    } catch {
      setFavoriteIds((prev) => {
        if (isFavorite) return [...prev, numericId];
        return prev.filter((id) => id !== numericId);
      });
    }
  }, [favoriteIds, getToken]);

  const refreshFavorites = useCallback(async () => {
    if (!clerkLoaded || !isSignedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const favoritesData = await request('/users/favorites', { token });
      const { ids, moviesMap } = normalizeFavorites(favoritesData);
      setFavoriteIds(ids);
      setFavoriteMovies(moviesMap);
    } catch {
      // silent fail
    }
  }, [clerkLoaded, isSignedIn, getToken]);

  const isMovieFavorite = useCallback((movie) => {
    const tmdbId = movie?.tmdbId ?? movie?.id ?? movie?._id;
    const numericId = Number(tmdbId);
    return Number.isFinite(numericId) && favoriteIds.includes(numericId);
  }, [favoriteIds]);

  const value = useMemo(() => ({
    user,
    favoriteIds,
    favoriteMovies,
    setFavoriteIds,
    setFavoriteMovies,
    isMovieFavorite,
    role: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    isLoading,
    isAuthLoaded: clerkLoaded,
    error,
    isSignedIn,
    clearUser,
    toggleFavorite,
    refreshFavorites,
  }), [user, favoriteIds, favoriteMovies, isLoading, clerkLoaded, error, isSignedIn, clearUser, isMovieFavorite, toggleFavorite, refreshFavorites]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;