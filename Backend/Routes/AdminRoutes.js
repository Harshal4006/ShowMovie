const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
const {
  GetDashboardStats,
  TmdbSearchMovies,
  TmdbGetNowPlaying,
  TmdbGetUpcoming,
  TmdbGetTrending,
  TmdbGetPopular,
  TmdbGetMovieDetails,
  ImportMovie,
  GetAllMoviesAdmin,
  UpdateMovie,
  DeleteMovie,
  CreateShow,
  UpdateShow,
  DeleteShow,
  GetAllBookings
} = require('../Controllers/AdminController');

// Dashboard
router.get('/dashboard', VerifyToken, VerifyAdmin, GetDashboardStats);

// TMDB endpoints (public for admin search)
router.get('/tmdb/search', TmdbSearchMovies);
router.get('/tmdb/now-playing', TmdbGetNowPlaying);
router.get('/tmdb/upcoming', TmdbGetUpcoming);
router.get('/tmdb/trending', TmdbGetTrending);
router.get('/tmdb/popular', TmdbGetPopular);
router.get('/tmdb/movie/:tmdbId', TmdbGetMovieDetails);

// Movies management
router.post('/movies/import', VerifyToken, VerifyAdmin, ImportMovie);
router.get('/movies', VerifyToken, VerifyAdmin, GetAllMoviesAdmin);
router.patch('/movies/:id', VerifyToken, VerifyAdmin, UpdateMovie);
router.delete('/movies/:id', VerifyToken, VerifyAdmin, DeleteMovie);

// Shows
router.post('/shows', VerifyToken, VerifyAdmin, CreateShow);
router.put('/shows/:id', VerifyToken, VerifyAdmin, UpdateShow);
router.delete('/shows/:id', VerifyToken, VerifyAdmin, DeleteShow);

// Bookings
router.get('/bookings', VerifyToken, VerifyAdmin, GetAllBookings);

module.exports = router;