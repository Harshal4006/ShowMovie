const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
const {
  GetDashboardStats,
  CreateShow,
  UpdateShow,
  DeleteShow,
  GetAllBookings,
  GetAllMoviesAdmin,
  CreateMovie
} = require('../Controllers/AdminController');

// Dashboard
router.get('/dashboard', VerifyToken, VerifyAdmin, GetDashboardStats);

// Shows
router.post('/shows', VerifyToken, VerifyAdmin, CreateShow);
router.put('/shows/:id', VerifyToken, VerifyAdmin, UpdateShow);
router.delete('/shows/:id', VerifyToken, VerifyAdmin, DeleteShow);

// Bookings
router.get('/bookings', VerifyToken, VerifyAdmin, GetAllBookings);

// Movies
router.post('/movies', VerifyToken, VerifyAdmin, CreateMovie);
router.get('/movies', VerifyToken, VerifyAdmin, GetAllMoviesAdmin);

module.exports = router;