const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const { validateCreateOrder } = require('../Middleware/Validators');
const { CreateOrder, VerifyPayment } = require('../Controllers/PaymentController');

// Auth required - create Razorpay order
router.post('/create-order', VerifyToken, validateCreateOrder, CreateOrder);
// Payment verification (no auth - uses signature)
router.post('/verify-payment', VerifyPayment);

module.exports = router;
