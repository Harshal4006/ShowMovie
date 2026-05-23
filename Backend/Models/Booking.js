// Booking schema - stores seat reservations and payment status

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Relationships
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },

  // Booking details
  bookedSeats: [{ type: String }],
  amount: { type: Number, required: true },

  // Payment info
  isPaid: { type: Boolean, default: false },
  paymentId: { type: String },
  paymentMethod: { type: String },

  // Status tracking
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  emailSent: { type: String, enum: ['confirmed', 'pending', 'failed', null], default: null }
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ isPaid: 1 });

module.exports = mongoose.model('Booking', bookingSchema);