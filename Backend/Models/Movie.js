// Movie schema - stores TMDB data alongside app-specific fields
// Index recommendation for text search: movieSchema.index({ title: 'text', tagline: 'text', overview: 'text' });

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
  trailerUrl: String,
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
  
  // Section placement
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isMostPopular: { type: Boolean, default: false },

  // Basic fields
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

movieSchema.index({ tmdbId: 1 });
movieSchema.index({ status: 1, isActive: 1 });
movieSchema.index({ isFeatured: 1, isActive: 1 });
movieSchema.index({ isTrending: 1, isActive: 1 });
movieSchema.index({ isMostPopular: 1, isActive: 1 });
movieSchema.index({ title: 1 });
movieSchema.index({ 'genres.name': 1 });
movieSchema.index({ status: 1, isActive: 1, releaseDate: -1 });
movieSchema.index({ trailerUrl: 1, isActive: 1 });

module.exports = mongoose.model('Movie', movieSchema);