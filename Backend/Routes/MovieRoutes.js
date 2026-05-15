const express = require('express');
const router = express.Router();
const { GetAllMovies, GetMovieById, GetRelatedMovies } = require('../Controllers/MovieController');

router.get('/', GetAllMovies);
router.get('/:id', GetMovieById);
router.get('/:id/related', GetRelatedMovies);

module.exports = router;