const Movie = require('../Models/Movie');
const mongoose = require('mongoose');
const ensureDbConnection = require('../Utils/ensureDbConnection');

// List movies with filtering by genre, search, sort, and section
const GetAllMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const { genre, search, sort, page = 1, limit = 12, section } = req.query;
    let query = { isActive: true };

    // Section filter
    if (section === 'featured') query.isFeatured = true;
    else if (section === 'trending') query.isTrending = true;
    else if (section === 'mostPopular') query.isMostPopular = true;

    if (genre && genre !== 'all') {
      query['genres.name'] = genre;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'oldest') sortOption = { releaseDate: 1 };
    else sortOption = { releaseDate: -1 };

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await Movie.countDocuments(query);

    res.json({ movies, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [], total: 0 });
  }
};

// Get a single movie by MongoDB ID or TMDB ID
const GetMovieById = async (req, res) => {
  try {
    await ensureDbConnection();
    const { id } = req.params;

    let movie = null;
    if (mongoose.isValidObjectId(id)) {
      movie = await Movie.findById(id).lean();
    } else {
      const tmdbId = Number(id);
      if (Number.isFinite(tmdbId)) {
        movie = await Movie.findOne({ tmdbId }).lean();
      }
    }

    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch movies marked as featured for homepage carousel
const GetFeaturedMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ isFeatured: true, isActive: true })
      .sort({ rating: -1 })
      .limit(8)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Fetch movies marked as trending
const GetTrendingMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ isTrending: true, isActive: true })
      .sort({ rating: -1 })
      .limit(8)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Fetch movies marked as most popular by vote count
const GetMostPopularMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ isMostPopular: true, isActive: true })
      .sort({ voteCount: -1, rating: -1 })
      .limit(8)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Fetch movies that have an available trailer URL
const GetTrailerMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ 
      trailerUrl: { $exists: true, $ne: null, $ne: '' }, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Fetch movies currently active and showing in theaters
const GetNowShowingMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ status: 'active', isActive: true })
      .sort({ releaseDate: -1 })
      .limit(20)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Fetch movies with coming-soon status
const GetUpcomingMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const movies = await Movie.find({ status: 'coming-soon', isActive: true })
      .sort({ releaseDate: 1 })
      .limit(20)
      .lean();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

// Find movies related by shared genres
const GetRelatedMovies = async (req, res) => {
  try {
    await ensureDbConnection();
    const { id } = req.params;

    let movie = null;
    if (mongoose.isValidObjectId(id)) {
      movie = await Movie.findById(id).lean();
    } else {
      const tmdbId = Number(id);
      if (Number.isFinite(tmdbId)) {
        movie = await Movie.findOne({ tmdbId }).lean();
      }
    }

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const genreIds = movie.genres?.map(g => g.id) || [];
    const related = await Movie.find({
      _id: { $ne: movie._id },
      'genres.id': { $in: genreIds },
      isActive: true
    }).limit(4).lean();

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message, movies: [] });
  }
};

module.exports = { 
  GetAllMovies, 
  GetMovieById, 
  GetFeaturedMovies, 
  GetTrendingMovies, 
  GetMostPopularMovies,
  GetTrailerMovies,
  GetNowShowingMovies, 
  GetUpcomingMovies, 
  GetRelatedMovies 
};
