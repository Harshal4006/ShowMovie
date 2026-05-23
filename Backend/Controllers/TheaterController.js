const Theater = require('../Models/Theater');
const Movie = require('../Models/Movie');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const cloudinary = require('../Config/Cloudinary');

const GetAllTheaters = async (req, res) => {
  try {
    await ensureDbConnection();
    const { search, facility, city } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }
    if (facility) {
      query.facilities = { $in: [facility] };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const theaters = await Theater.find(query)
      .populate('movies', 'title posterUrl rating genres runtime releaseDate originalLanguage')
      .sort({ createdAt: -1 });

    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get detailed info about a specific theater
const GetTheaterById = async (req, res) => {
  try {
    await ensureDbConnection();
    const theater = await Theater.findById(req.params.id)
      .populate('movies', 'title posterUrl backdropUrl rating genres runtime releaseDate originalLanguage overview tagline');

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all theaters including inactive ones for admin management
const GetAllTheatersAdmin = async (req, res) => {
  try {
    await ensureDbConnection();
    const theaters = await Theater.find({})
      .populate('movies', 'title posterUrl')
      .sort({ createdAt: -1 });
    res.json({ theaters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new theater with image uploads and slug generation
const CreateTheater = async (req, res) => {
  try {
    await ensureDbConnection();

    const { name, location, city, description, image, galleryImages, rating, screens, facilities, contactNumber, email, openingHours, movies, showTimings, featured } = req.body;

    if (!name || !location || !city) {
      return res.status(400).json({ message: 'Name, location, and city are required' });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await Theater.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A theater with this name already exists' });
    }

    let uploadedImage = image || '';
    let uploadedGallery = galleryImages || [];

    // Upload main image if it's a file (base64 or temp path)
    if (image && (image.startsWith('data:') || image.includes('temp'))) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'showmovie/theaters',
        });
        uploadedImage = result.secure_url;
      } catch (uploadErr) {
        // silent
      }
    }

    // Upload gallery images
    if (galleryImages && Array.isArray(galleryImages)) {
      const galleryUrls = [];
      for (const img of galleryImages) {
        if (img.startsWith('data:') || img.includes('temp')) {
          try {
            const result = await cloudinary.uploader.upload(img, {
              folder: 'showmovie/theaters/gallery',
            });
            galleryUrls.push(result.secure_url);
          } catch (uploadErr) {
            // silent
          }
        } else {
          galleryUrls.push(img);
        }
      }
      uploadedGallery = galleryUrls;
    }

    const theater = await Theater.create({
      name,
      slug,
      location,
      city,
      description: description || '',
      image: uploadedImage,
      galleryImages: uploadedGallery,
      rating: rating || 0,
      screens: screens || 1,
      facilities: facilities || [],
      contactNumber: contactNumber || '',
      email: email || '',
      openingHours: openingHours || '10:00 AM - 11:45 PM',
      movies: movies || [],
      showTimings: showTimings || [],
      featured: featured || false,
      createdBy: req.user?._id,
    });

    res.status(201).json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ALLOWED_THEATER_FIELDS = [
  'name', 'location', 'city', 'description', 'image', 'galleryImages',
  'rating', 'screens', 'facilities', 'contactNumber', 'email',
  'openingHours', 'movies', 'showTimings', 'featured',
];

// Update theater details, regenerate slug if name changes
const UpdateTheater = async (req, res) => {
  try {
    await ensureDbConnection();

    const updates = {};
    for (const key of ALLOWED_THEATER_FIELDS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Regenerate slug if name changed
    if (updates.name) {
      const newSlug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const existing = await Theater.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'A theater with this name already exists' });
      }
      updates.slug = newSlug;
    }

    // Handle image uploads
    if (updates.image && (updates.image.startsWith('data:') || updates.image.includes('temp'))) {
      try {
        const result = await cloudinary.uploader.upload(updates.image, {
          folder: 'showmovie/theaters',
        });
        updates.image = result.secure_url;
      } catch (uploadErr) {
        // silent
      }
    }

    if (updates.galleryImages && Array.isArray(updates.galleryImages)) {
      const galleryUrls = [];
      for (const img of updates.galleryImages) {
        if (img.startsWith('data:') || img.includes('temp')) {
          try {
            const result = await cloudinary.uploader.upload(img, {
              folder: 'showmovie/theaters/gallery',
            });
            galleryUrls.push(result.secure_url);
          } catch (uploadErr) {
            // silent
          }
        } else {
          galleryUrls.push(img);
        }
      }
      updates.galleryImages = galleryUrls;
    }

    const theater = await Theater.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('movies', 'title posterUrl rating genres runtime releaseDate originalLanguage');

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a theater from the database
const DeleteTheater = async (req, res) => {
  try {
    await ensureDbConnection();
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json({ message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AddMovieToTheater = async (req, res) => {
  try {
    await ensureDbConnection();
    const { movieId } = req.body;
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    if (!theater.movies.includes(movieId)) {
      theater.movies.push(movieId);
      await theater.save();
    }

    const populated = await Theater.findById(theater._id).populate('movies', 'title posterUrl rating genres runtime');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a movie from a theater's lineup
const RemoveMovieFromTheater = async (req, res) => {
  try {
    await ensureDbConnection();
    const { movieId } = req.body;
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });

    theater.movies = theater.movies.filter((m) => m.toString() !== movieId);
    await theater.save();

    const populated = await Theater.findById(theater._id).populate('movies', 'title posterUrl rating genres runtime');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetAllTheaters,
  GetTheaterById,
  GetAllTheatersAdmin,
  CreateTheater,
  UpdateTheater,
  DeleteTheater,
  AddMovieToTheater,
  RemoveMovieFromTheater,
};
