import { request } from './authClient.js';

export const getMe = (token) => request('/users/me', { token });
export const updateUserProfile = (token, profileData) =>
  request('/users/me', { method: 'PUT', token, body: profileData });
export const toggleFavorite = (token, tmdbId) =>
  request('/users/favorites', { method: 'POST', token, body: { tmdbId } });
export const getUserFavorites = (token) => request('/users/favorites', { token });

export const getMyBookings = (token) => request('/bookings', { token });
export const createBooking = (token, bookingData) =>
  request('/bookings', { method: 'POST', token, body: bookingData });

export const syncUser = (token, userData) =>
  request('/auth/sync', { method: 'POST', token, body: userData });

export const getAllUsers = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/users?${query}`, { token });
};
export const getUserById = (token, id) => request(`/users/${id}`, { token });
export const updateUserRole = (token, id, role) =>
  request(`/users/${id}/role`, { method: 'PUT', token, body: { role } });
export const deleteUser = (token, id) =>
  request(`/users/${id}`, { method: 'DELETE', token });
export const getUserStats = (token, id) => request(`/users/${id}/stats`, { token });

export const getAdminMovies = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/movies?${query}`, { token });
};
export const importMovie = (token, movieData) =>
  request(`/admin/movies/import`, { method: 'POST', token, body: movieData });
export const updateMovie = (token, id, movieData) =>
  request(`/admin/movies/${id}`, { method: 'PATCH', token, body: movieData });
export const deleteMovie = (token, id) =>
  request(`/admin/movies/${id}`, { method: 'DELETE', token });

export const createShow = (token, showData) =>
  request(`/admin/shows`, { method: 'POST', token, body: showData });
export const updateShow = (token, id, showData) =>
  request(`/admin/shows/${id}`, { method: 'PUT', token, body: showData });
export const deleteShow = (token, id) =>
  request(`/admin/shows/${id}`, { method: 'DELETE', token });

export const getAdminDashboard = (token) => request(`/admin/dashboard`, { token });
export const getAdminBookings = (token) => request(`/admin/bookings`, { token });
export const getAdminShows = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/shows?${query}`, { token });
};

export const getNotifications = (token) => request(`/notifications`, { token });
export const markNotificationRead = (token, id) =>
  request(`/notifications/${id}/read`, { method: 'PATCH', token });
export const markAllNotificationsRead = (token) =>
  request(`/notifications/read-all`, { method: 'PATCH', token });
export const deleteNotification = (token, id) =>
  request(`/notifications/${id}`, { method: 'DELETE', token });
export const clearAllNotifications = (token) =>
  request(`/notifications`, { method: 'DELETE', token });

export const getMovies = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/movies?${query}`);
};
export const getMovieById = (id, options = {}) => request(`/movies/${id}`, options);
export const getFeaturedMovies = () => request(`/movies/featured`);
export const getTrendingMovies = () => request(`/movies/trending`);
export const getMostPopularMovies = () => request(`/movies/most-popular`);
export const getTrailerMovies = () => request(`/movies/trailers`);
export const getNowShowingMovies = () => request(`/movies/now-showing`);
export const getUpcomingMovies = () => request(`/movies/upcoming`);
export const getRelatedMovies = (id) => request(`/movies/${id}/related`);
export const getShowById = (id) => request(`/shows/${id}`);
export const getShows = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/shows?${query}`);
};
export const getShowsByMovie = (movieId, options = {}) => request(`/shows/movie/${movieId}`, options);
export const getOccupiedSeats = (showId) => request(`/shows/${showId}/occupied-seats`);

export const searchTmdbMovies = (query, page = 1) =>
  request(`/admin/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`);
export const getTmdbMovieDetails = (tmdbId) => request(`/admin/tmdb/movie/${tmdbId}`);
export const getTmdbNowPlaying = (page = 1) => request(`/admin/tmdb/now-playing?page=${page}`);
export const getTmdbUpcoming = (page = 1) => request(`/admin/tmdb/upcoming?page=${page}`);
export const getTmdbTrending = (page = 1) => request(`/admin/tmdb/trending?page=${page}`);
export const getTmdbPopular = (page = 1) => request(`/admin/tmdb/popular?page=${page}`);

export default {
  getMovies,
  getMovieById,
  getFeaturedMovies,
  getTrendingMovies,
  getMostPopularMovies,
  getNowShowingMovies,
  getUpcomingMovies,
  getRelatedMovies,
  getShows,
  getShowById,
  getShowsByMovie,
  getOccupiedSeats,
  getMyBookings,
  createBooking,
  syncUser,
  getMe,
  updateUserProfile,
  toggleFavorite,
  getUserFavorites,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
  searchTmdbMovies,
  getTmdbMovieDetails,
  getTmdbNowPlaying,
  getTmdbUpcoming,
  getAdminMovies,
  importMovie,
  updateMovie,
  deleteMovie,
  createShow,
  updateShow,
  deleteShow,
  getAdminDashboard,
  getAdminBookings,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
};