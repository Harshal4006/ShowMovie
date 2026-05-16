const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // TMDB fields
  tmdbId: Number,
  title: { type: String, required: true },
  originalTitle: String,
  overview: String,
  posterPath: String,
  backdropPath: String,
  posterUrl: String,
  backdropUrl: String,
  releaseDate: String,
  runtime: Number,
  genres: [{
    id: Number,
    name: String
  }],
  rating: Number,
  voteCount: Number,
  language: String,
  tagline: String,
  trailerKey: String,
  cast: [{
    name: String,
    character: String,
    profilePath: String
  }],

  // App-specific fields
  price: { type: Number, default: 0 },
  movieLanguage: { type: String, default: 'English' },
  format: { type: String, default: '2D' },
  status: { type: String, default: 'coming-soon' },
  isFeatured: { type: Boolean, default: false },

  // Basic fields
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);