const express = require('express');
const router = express.Router();
const { GetNowPlayingMovies, GetMovieDetails, GetMovieGenres, SearchMovies, GetMovieCredits, GetMovieVideos } = require('../Controllers/TMDBController');

router.get('/now-playing', GetNowPlayingMovies);
router.get('/search', SearchMovies);
router.get('/movie/:id', GetMovieDetails);
router.get('/movie/:id/credits', GetMovieCredits);
router.get('/movie/:id/videos', GetMovieVideos);
router.get('/genres', GetMovieGenres);

module.exports = router;