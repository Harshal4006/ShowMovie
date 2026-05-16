const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Public Movie APIs
export const getMovies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/movies?${query}`, { headers: getHeaders() });
  return res.json();
};

export const getMovieById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`, { headers: getHeaders() });
  return res.json();
};

export const getFeaturedMovies = async () => {
  const res = await fetch(`${API_BASE_URL}/movies/featured`, { headers: getHeaders() });
  return res.json();
};

export const getNowShowingMovies = async () => {
  const res = await fetch(`${API_BASE_URL}/movies/now-showing`, { headers: getHeaders() });
  return res.json();
};

export const getUpcomingMovies = async () => {
  const res = await fetch(`${API_BASE_URL}/movies/upcoming`, { headers: getHeaders() });
  return res.json();
};

export const getRelatedMovies = async (id) => {
  const res = await fetch(`${API_BASE_URL}/movies/${id}/related`, { headers: getHeaders() });
  return res.json();
};

// TMDB Search (Admin)
export const searchTmdbMovies = async (query, page = 1) => {
  const res = await fetch(`${API_BASE_URL}/admin/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`, {
    headers: getHeaders()
  });
  return res.json();
};

export const getTmdbMovieDetails = async (tmdbId) => {
  const res = await fetch(`${API_BASE_URL}/admin/tmdb/movie/${tmdbId}`, { headers: getHeaders() });
  return res.json();
};

// Admin Movie Management
export const getAdminMovies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/admin/movies?${query}`, { headers: getHeaders() });
  return res.json();
};

export const importMovie = async (movieData) => {
  const res = await fetch(`${API_BASE_URL}/admin/movies/import`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(movieData)
  });
  return res.json();
};

export const updateMovie = async (id, movieData) => {
  const res = await fetch(`${API_BASE_URL}/admin/movies/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(movieData)
  });
  return res.json();
};

export const deleteMovie = async (id) => {
  const res = await fetch(`${API_BASE_URL}/admin/movies/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};

export default {
  getMovies,
  getMovieById,
  getFeaturedMovies,
  getNowShowingMovies,
  getUpcomingMovies,
  getRelatedMovies,
  searchTmdbMovies,
  getTmdbMovieDetails,
  getAdminMovies,
  importMovie,
  updateMovie,
  deleteMovie
};