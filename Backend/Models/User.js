const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  img: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  favorites: [{ type: Number, required: true }]
}, { timestamps: true });

userSchema.index({ clerkId: 1 });
userSchema.index({ favorites: 1 });

module.exports = mongoose.model('User', userSchema);