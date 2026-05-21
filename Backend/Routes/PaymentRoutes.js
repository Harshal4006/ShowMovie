const express = require('express');
const router = express.Router();
const { CreateOrder, VerifyPayment } = require('../Controllers/PaymentController');

router.post('/create-order', CreateOrder);
router.post('/verify-payment', VerifyPayment);

module.exports = router;
