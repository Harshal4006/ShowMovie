const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // TMDB fields
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  originalTitle: { type: String },
  overview: { type: String },
  posterPath: { type: String },
  backdropPath: { type: String },
  posterUrl: { type: String },
  backdropUrl: { type: String },
  releaseDate: { type: String },
  runtime: { type: Number },
  genres: [{
    id: Number,
    name: String
  }],
  rating: { type: Number },
  voteCount: { type: Number },
  language: { type: String },
  tagline: { type: String },
  trailerKey: { type: String },
  cast: [{
    name: String,
    character: String,
    profilePath: String
  }],

  // App-specific fields
  price: { type: Number, default: 0 },
  movieLanguage: { type: String, default: 'English' },
  format: { type: String, default: '2D' },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming-soon'],
    default: 'coming-soon'
  },
  isFeatured: { type: Boolean, default: false },

  // Basic fields
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);