const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const { validateCreateBooking } = require('../Middleware/Validators');
const { CreateBooking, GetUserBookings, GetBookingById } = require('../Controllers/BookingController');

// Auth required - create, list, and get bookings
router.post('/', VerifyToken, validateCreateBooking, CreateBooking);
router.get('/', VerifyToken, GetUserBookings);
router.get('/my-bookings', VerifyToken, GetUserBookings);
router.get('/:id', VerifyToken, GetBookingById);

module.exports = router;