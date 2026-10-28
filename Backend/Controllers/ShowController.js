const Show = require('../Models/Show');
const Movie = require('../Models/Movie');
const mongoose = require('mongoose');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { expireShowsNow } = require('../Utils/showExpiry');

// Fetch all active/bookable shows for a given movie
const GetShowsByMovie = async (req, res) => {
  try {
    await ensureDbConnection();
    await expireShowsNow();
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

    const now = new Date();
    const shows = await Show.find({
      movie: resolvedMovieId,
      status: { $in: ['active', 'upcoming'] },
      $or: [
        { endDateTime: { $gt: now } },
        { endDateTime: { $exists: false }, showDateTime: { $gt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } // keep for now, will be filtered by end calc if needed
      ]
    })
      .populate('movie', 'title posterUrl backdropUrl rating genres runtime')
      .sort({ showDateTime: 1 });

    const filtered = shows.filter((show) => {
      const runtime = show.movie && typeof show.movie === 'object' ? show.movie.runtime : null;
      const start = show.showDateTime ? new Date(show.showDateTime) : null;
      if (!start || Number.isNaN(start.getTime())) return false;
      let end = show.endDateTime ? new Date(show.endDateTime) : null;
      if (!end || Number.isNaN(end.getTime())) {
        if (runtime && runtime > 0) end = new Date(start.getTime() + runtime * 60 * 1000);
        else end = new Date(start.getTime() + 150 * 60 * 1000);
      }
      return end > now;
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single show by its ID with full movie details
const GetShowById = async (req, res) => {
  try {
    await ensureDbConnection();
    await expireShowsNow();
    const show = await Show.findById(req.params.id).populate('movie', 'title posterUrl backdropUrl rating genres runtime');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    // If expired, still return but status may be expired; booking will block
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
