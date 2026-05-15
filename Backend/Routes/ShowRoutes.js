const express = require('express');
const router = express.Router();
const { GetShowsByMovie, GetShowById, GetAllShows } = require('../Controllers/ShowController');

router.get('/movie/:movieId', GetShowsByMovie);
router.get('/:id', GetShowById);
router.get('/', GetAllShows);

module.exports = router;