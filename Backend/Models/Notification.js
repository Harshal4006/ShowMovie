const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Notification content
  type: {
    type: String,
    enum: ['booking_confirmed', 'booking_cancelled', 'payment_success', 'payment_failed', 'show_added', 'general'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },

  // Read status
  isRead: { type: Boolean, default: false },

  // Related entity reference
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedModel' },
  relatedModel: { type: String, enum: ['Booking', 'Show', 'Movie'] }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);