const express = require('express');
const router = express.Router();
const {
  GetShowsByMovie,
  GetShowById,
  GetAllShows,
  GetOccupiedSeats
} = require('../Controllers/ShowController');

// Public routes
router.get('/movie/:movieId', GetShowsByMovie);
router.get('/:id', GetShowById);
router.get('/:id/occupied-seats', GetOccupiedSeats);
router.get('/', GetAllShows);

module.exports = router;