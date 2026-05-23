const express = require('express');
const router = express.Router();
const {
  GetNowPlayingMovies,
  GetMovieDetails,
  GetMovieGenres,
  SearchMovies,
  GetMovieCredits,
  GetMovieVideos,
  GetTrendingMovies,
  GetUpcomingMovies,
  GetPopularMovies
} = require('../Controllers/TMDBController');

// Public TMDB proxy routes
router.get('/now-playing', GetNowPlayingMovies);
router.get('/search', SearchMovies);
router.get('/movie/:id', GetMovieDetails);
router.get('/movie/:id/credits', GetMovieCredits);
router.get('/movie/:id/videos', GetMovieVideos);
router.get('/genres', GetMovieGenres);
router.get('/trending', GetTrendingMovies);
router.get('/upcoming', GetUpcomingMovies);
router.get('/popular', GetPopularMovies);

module.exports = router;