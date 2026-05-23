const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  // Movie reference
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },

  // Show timing
  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  theater: { type: String, required: true },
  screenType: { type: String },
  language: { type: String },

  // Seats and availability
  occupiedSeats: { type: Map, of: String, default: {} },
  status: { type: String, enum: ['active', 'sold-out', 'upcoming'], default: 'active' }
}, { timestamps: true });

showSchema.index({ movie: 1, status: 1 });
showSchema.index({ movie: 1, showDateTime: 1 });
showSchema.index({ movie: 1, status: 1, showDateTime: 1 });
showSchema.index({ status: 1 });
showSchema.index({ showDateTime: 1 });

module.exports = mongoose.model('Show', showSchema);