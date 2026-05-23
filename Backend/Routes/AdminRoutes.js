const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
const {
  validateImportMovie,
  validateCreateShow,
} = require('../Middleware/Validators');
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

// Admin dashboard
router.get('/dashboard', VerifyToken, VerifyAdmin, GetDashboardStats);

// TMDB proxy endpoints (admin only)
router.get('/tmdb/search', VerifyToken, VerifyAdmin, TmdbSearchMovies);
router.get('/tmdb/now-playing', VerifyToken, VerifyAdmin, TmdbGetNowPlaying);
router.get('/tmdb/upcoming', VerifyToken, VerifyAdmin, TmdbGetUpcoming);
router.get('/tmdb/trending', VerifyToken, VerifyAdmin, TmdbGetTrending);
router.get('/tmdb/popular', VerifyToken, VerifyAdmin, TmdbGetPopular);
router.get('/tmdb/movie/:tmdbId', VerifyToken, VerifyAdmin, TmdbGetMovieDetails);

// Movies management
router.post('/movies/import', VerifyToken, VerifyAdmin, validateImportMovie, ImportMovie);
router.get('/movies', VerifyToken, VerifyAdmin, GetAllMoviesAdmin);
router.patch('/movies/:id', VerifyToken, VerifyAdmin, UpdateMovie);
router.delete('/movies/:id', VerifyToken, VerifyAdmin, DeleteMovie);

// Show management
router.post('/shows', VerifyToken, VerifyAdmin, validateCreateShow, CreateShow);
router.put('/shows/:id', VerifyToken, VerifyAdmin, UpdateShow);
router.delete('/shows/:id', VerifyToken, VerifyAdmin, DeleteShow);

// Booking management
router.get('/bookings', VerifyToken, VerifyAdmin, GetAllBookings);

module.exports = router;