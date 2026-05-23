// Theater schema - cinemas with screens, facilities, and show timings

const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  // Basic info
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, default: '' },

  // Media
  image: { type: String, default: '' },
  galleryImages: [{ type: String }],

  // Rating and facilities
  rating: { type: Number, default: 0, min: 0, max: 5 },
  screens: { type: Number, default: 1 },
  facilities: [{ type: String }],

  // Contact
  contactNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  openingHours: { type: String, default: '10:00 AM - 11:45 PM' },

  // Linked movies and timings
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  showTimings: [{ type: String }],

  // Flags
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

theaterSchema.index({ name: 1 });
theaterSchema.index({ city: 1 });
theaterSchema.index({ isActive: 1 });
theaterSchema.index({ featured: 1 });
theaterSchema.index({ facilities: 1 });

module.exports = mongoose.model('Theater', theaterSchema);
