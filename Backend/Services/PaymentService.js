const razorpayInstance = require('../Config/Razorpay');

// Service kept for reference - not currently imported
class PaymentService {
  // Create a Razorpay payment order
  async CreatePayment(amount, currency = 'INR', receipt) {
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      status: 'pending',
    };
  }

  // Verify Razorpay payment signature to confirm authenticity
  async VerifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const crypto = require('crypto');
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    return {
      verified: isAuthentic,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
    };
  }

  // Process a refund for a given payment
  async Refund(paymentId, amount) {
    const refund = await razorpayInstance.payments.refund(paymentId, { amount });

    return {
      refundId: refund.id,
      paymentId,
      amount,
      status: refund.status,
    };
  }
}

module.exports = new PaymentService();
