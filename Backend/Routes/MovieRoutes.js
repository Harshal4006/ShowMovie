const express = require('express');
const router = express.Router();
const { sanitizeSearch } = require('../Middleware/Validators');
const {
  GetAllMovies,
  GetMovieById,
  GetFeaturedMovies,
  GetTrendingMovies,
  GetMostPopularMovies,
  GetTrailerMovies,
  GetNowShowingMovies,
  GetUpcomingMovies,
  GetRelatedMovies
} = require('../Controllers/MovieController');

// Public routes
router.get('/', sanitizeSearch, GetAllMovies);
router.get('/featured', GetFeaturedMovies);
router.get('/trending', GetTrendingMovies);
router.get('/most-popular', GetMostPopularMovies);
router.get('/trailers', GetTrailerMovies);
router.get('/now-showing', GetNowShowingMovies);
router.get('/upcoming', GetUpcomingMovies);
router.get('/:id', GetMovieById);
router.get('/:id/related', GetRelatedMovies);

module.exports = router;