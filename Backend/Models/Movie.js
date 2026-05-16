const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // TMDB fields
  tmdbId: { type: Number, index: true },
  title: { type: String, required: true, index: true },
  originalTitle: { type: String },
  overview: { type: String },
  posterPath: { type: String },
  backdropPath: { type: String },
  posterUrl: { type: String },
  backdropUrl: { type: String },
  releaseDate: { type: String, index: true },
  runtime: { type: Number },
  genres: [{
    id: Number,
    name: String
  }],
  rating: { type: Number, index: true },
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
    default: 'coming-soon',
    index: true
  },
  isFeatured: { type: Boolean, default: false, index: true },

  // Basic fields
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// Add compound indexes for better query performance
movieSchema.index({ isActive: 1, status: 1 });
movieSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Movie', movieSchema);