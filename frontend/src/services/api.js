import { request } from "./client.js";

// Public Movie APIs
export const getMovies = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/movies?${query}`);
};

export const getMovieById = (id, options = {}) => request(`/movies/${id}`, options);
export const getFeaturedMovies = () => request(`/movies/featured`);
export const getNowShowingMovies = () => request(`/movies/now-showing`);
export const getUpcomingMovies = () => request(`/movies/upcoming`);
export const getRelatedMovies = (id) => request(`/movies/${id}/related`);

// Public Shows APIs
export const getShows = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/shows?${query}`);
};
export const getShowById = (id) => request(`/shows/${id}`);
export const getShowsByMovie = (movieId, options = {}) => request(`/shows/movie/${movieId}`, options);

// Bookings (auth)
export const getMyBookings = (token) => request(`/bookings/my-bookings`, { token });
export const createBooking = (token, bookingData) =>
  request(`/bookings`, { method: "POST", token, body: bookingData });

// Auth (Clerk)
export const syncUser = (token, userData) =>
  request(`/auth/sync`, { method: "POST", token, body: userData });
export const getMe = (token) => request(`/auth/me`, { token });
export const toggleFavorite = (token, movieId) =>
  request(`/auth/favorites`, { method: "POST", token, body: { movieId } });

// TMDB Search (Admin)
export const searchTmdbMovies = (query, page = 1) =>
  request(`/admin/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`);
export const getTmdbMovieDetails = (tmdbId) => request(`/admin/tmdb/movie/${tmdbId}`);

// Admin Movie Management (auth)
export const getAdminMovies = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/movies?${query}`, { token });
};
export const importMovie = (token, movieData) =>
  request(`/admin/movies/import`, { method: "POST", token, body: movieData });
export const updateMovie = (token, id, movieData) =>
  request(`/admin/movies/${id}`, { method: "PATCH", token, body: movieData });
export const deleteMovie = (token, id) =>
  request(`/admin/movies/${id}`, { method: "DELETE", token });

// Admin Show Management (auth)
export const createShow = (token, showData) =>
  request(`/admin/shows`, { method: "POST", token, body: showData });
export const updateShow = (token, id, showData) =>
  request(`/admin/shows/${id}`, { method: "PUT", token, body: showData });
export const deleteShow = (token, id) =>
  request(`/admin/shows/${id}`, { method: "DELETE", token });

// Admin Bookings (auth)
export const getAdminDashboard = (token) => request(`/admin/dashboard`, { token });
export const getAdminBookings = (token) => request(`/admin/bookings`, { token });
export const getAdminShows = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/shows?${query}`, { token });
};

export default {
  getMovies,
  getMovieById,
  getFeaturedMovies,
  getNowShowingMovies,
  getUpcomingMovies,
  getRelatedMovies,
  getShows,
  getShowById,
  getShowsByMovie,
  getMyBookings,
  createBooking,
  syncUser,
  getMe,
  toggleFavorite,
  searchTmdbMovies,
  getTmdbMovieDetails,
  getAdminMovies,
  importMovie,
  updateMovie,
  deleteMovie,
  createShow,
  updateShow,
  deleteShow,
  getAdminDashboard,
  getAdminBookings,
};
