const express = require('express');
const router = express.Router();
const { GetAllMovies, GetMovieById, GetFeaturedMovies, GetTrendingMovies, GetMostPopularMovies, GetNowShowingMovies, GetUpcomingMovies, GetRelatedMovies } = require('../Controllers/MovieController');

router.get('/', GetAllMovies);
router.get('/featured', GetFeaturedMovies);
router.get('/trending', GetTrendingMovies);
router.get('/most-popular', GetMostPopularMovies);
router.get('/now-showing', GetNowShowingMovies);
router.get('/upcoming', GetUpcomingMovies);
router.get('/:id', GetMovieById);
router.get('/:id/related', GetRelatedMovies);

module.exports = router;