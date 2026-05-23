const Show = require('../Models/Show');
const Movie = require('../Models/Movie');
const mongoose = require('mongoose');
const ensureDbConnection = require('../Utils/ensureDbConnection');

// Fetch all active shows for a given movie
const GetShowsByMovie = async (req, res) => {
  try {
    await ensureDbConnection();
    const { movieId } = req.params;

    let resolvedMovieId = movieId;
    if (!mongoose.isValidObjectId(movieId)) {
      const tmdbId = Number(movieId);
      if (Number.isFinite(tmdbId)) {
        const movie = await Movie.findOne({ tmdbId }).select('_id').lean();
        resolvedMovieId = movie?._id?.toString() || null;
      } else {
        resolvedMovieId = null;
      }
    }

    if (!resolvedMovieId) return res.json([]);

    const shows = await Show.find({ movie: resolvedMovieId, status: 'active' })
      .populate('movie', 'title posterUrl backdropUrl rating genres runtime')
      .sort({ showDateTime: 1 });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single show by its ID with full movie details
const GetShowById = async (req, res) => {
  try {
    await ensureDbConnection();
    const show = await Show.findById(req.params.id).populate('movie', 'title posterUrl backdropUrl rating genres runtime');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all shows with optional status filter and pagination
const GetAllShows = async (req, res) => {
  try {
    await ensureDbConnection();
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl backdropUrl')
      .sort({ showDateTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Show.countDocuments(query);

    res.json({ shows, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get already booked seat numbers for a specific show
const GetOccupiedSeats = async (req, res) => {
  try {
    await ensureDbConnection();
    const show = await Show.findById(req.params.id).select('occupiedSeats');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    
    const occupiedSeats = show.occupiedSeats 
      ? Object.keys(show.occupiedSeats) 
      : [];
    
    res.json({ occupiedSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { GetShowsByMovie, GetShowById, GetAllShows, GetOccupiedSeats };
