// Theater schema - cinemas with screens, facilities, and show timings

const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  galleryImages: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  screens: { type: Number, default: 1 },
  facilities: [{ type: String }],
  contactNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  openingHours: { type: String, default: '10:00 AM - 11:45 PM' },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  showTimings: [{ type: String }],
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

theaterSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

module.exports = mongoose.model('Theater', theaterSchema);
