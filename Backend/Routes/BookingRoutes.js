const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const { CreateBooking, GetUserBookings, GetBookingById } = require('../Controllers/BookingController');

router.get('/', VerifyToken, GetUserBookings);
router.post('/', VerifyToken, CreateBooking);
router.get('/my-bookings', VerifyToken, GetUserBookings);
router.get('/:id', VerifyToken, GetBookingById);

module.exports = router;