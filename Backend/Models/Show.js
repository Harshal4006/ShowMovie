const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  theater: { type: String, required: true },
  screenType: { type: String },
  language: { type: String },
  occupiedSeats: { type: Map, of: String, default: {} },
  status: { type: String, enum: ['active', 'sold-out', 'upcoming'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema);