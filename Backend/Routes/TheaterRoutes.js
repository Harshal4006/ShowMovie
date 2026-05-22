const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
const {
  GetAllTheaters,
  GetTheaterById,
  GetAllTheatersAdmin,
  CreateTheater,
  UpdateTheater,
  DeleteTheater,
  AddMovieToTheater,
  RemoveMovieFromTheater,
} = require('../Controllers/TheaterController');

// Public routes
router.get('/', GetAllTheaters);
router.get('/:id', GetTheaterById);

// Admin-only routes
router.get('/admin/all', VerifyToken, VerifyAdmin, GetAllTheatersAdmin);
router.post('/', VerifyToken, VerifyAdmin, CreateTheater);
router.put('/:id', VerifyToken, VerifyAdmin, UpdateTheater);
router.delete('/:id', VerifyToken, VerifyAdmin, DeleteTheater);
router.post('/:id/movies', VerifyToken, VerifyAdmin, AddMovieToTheater);
router.delete('/:id/movies', VerifyToken, VerifyAdmin, RemoveMovieFromTheater);

module.exports = router;
