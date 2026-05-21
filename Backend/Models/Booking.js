const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  bookedSeats: [{ type: String }],
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paymentId: { type: String },
  paymentMethod: { type: String },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  emailSent: { type: String, enum: ['confirmed', 'pending', 'failed', null], default: null }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);