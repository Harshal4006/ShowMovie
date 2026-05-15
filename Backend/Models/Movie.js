const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String },
  poster_path: { type: String },
  backdrop_path: { type: String },
  genres: [{
    id: Number,
    name: String
  }],
  casts: [{
    name: String,
    profile_path: String
  }],
  release_date: { type: String },
  original_language: { type: String },
  tagline: { type: String },
  vote_average: { type: Number },
  vote_count: { type: Number },
  runtime: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);