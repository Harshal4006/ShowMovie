const Movie = require('../Models/Movie');
const Show = require('../Models/Show');
const Booking = require('../Models/Booking');
const User = require('../Models/User');
const axios = require('axios');

// TMDB Helper Functions
const getTmdbConfig = () => {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
  const imageBaseUrl = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  return { accessToken, baseUrl, imageBaseUrl };
};

const callTmdb = async (endpoint) => {
  const { accessToken, baseUrl } = getTmdbConfig();
  if (!accessToken) throw new Error('TMDB not configured');

  const response = await axios.get(`${baseUrl}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

// Dashboard Stats
const GetDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const activeShows = await Show.find({ status: 'active' }).populate('movie');
    const totalUsers = await User.countDocuments();

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeShows: activeShows.length,
      totalUser: totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TMDB Search
const TmdbSearchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query required' });

    const data = await callTmdb(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
    res.json({ movies: data.results, page: data.page, totalPages: data.total_pages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search TMDB', error: error.message });
  }
};

// TMDB Get Movie Details
const TmdbGetMovieDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { imageBaseUrl } = getTmdbConfig();

    const [movie, credits, videos] = await Promise.all([
      callTmdb(`/movie/${tmdbId}?language=en-US`),
      callTmdb(`/movie/${tmdbId}/credits?language=en-US`),
      callTmdb(`/movie/${tmdbId}/videos?language=en-US`)
    ]);

    const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const cast = credits.cast?.slice(0, 10).map(c => ({
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? `${imageBaseUrl}/w200${c.profile_path}` : null
    }));

    res.json({
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      posterUrl: movie.poster_path ? `${imageBaseUrl}/w500${movie.poster_path}` : null,
      backdropUrl: movie.backdrop_path ? `${imageBaseUrl}/w1280${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      language: movie.original_language,
      tagline: movie.tagline,
      trailerKey: trailer?.key || null,
      cast
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get TMDB details', error: error.message });
  }
};

// Import Movie from TMDB
const ImportMovie = async (req, res) => {
  try {
    const { tmdbId, price, movieLanguage, format, status, isFeatured } = req.body;

    const existing = await Movie.findOne({ tmdbId });
    if (existing) {
      return res.status(400).json({ message: 'Movie already imported' });
    }

    const { imageBaseUrl } = getTmdbConfig();
    const [movie, credits, videos] = await Promise.all([
      callTmdb(`/movie/${tmdbId}?language=en-US`),
      callTmdb(`/movie/${tmdbId}/credits?language=en-US`),
      callTmdb(`/movie/${tmdbId}/videos?language=en-US`)
    ]);

    const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const cast = credits.cast?.slice(0, 10).map(c => ({
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? `${imageBaseUrl}/w200${c.profile_path}` : null
    }));

    const newMovie = await Movie.create({
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      posterUrl: movie.poster_path ? `${imageBaseUrl}/w500${movie.poster_path}` : null,
      backdropUrl: movie.backdrop_path ? `${imageBaseUrl}/w1280${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      language: movie.original_language,
      tagline: movie.tagline,
      trailerKey: trailer?.key || null,
      cast,
      price: price || 0,
      movieLanguage: movieLanguage || 'English',
      format: format || '2D',
      status: status || 'coming-soon',
      isFeatured: isFeatured || false
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to import movie', error: error.message });
  }
};

// Get All Movies (Admin)
const GetAllMoviesAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const movies = await Movie.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Movie.countDocuments(query);

    res.json({ movies, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Movie (Admin)
const UpdateMovie = async (req, res) => {
  try {
    const { price, movieLanguage, format, status, isFeatured } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { price, movieLanguage, format, status, isFeatured },
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Movie (Admin)
const DeleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Show
const CreateShow = async (req, res) => {
  try {
    const { movieId, movieName, moviePoster, movieBackdrop, movieOverview, showDateTime, showPrice, theater, screenType, language, genres, runtime } = req.body;

    // First check if movie already exists in Movie collection
    let movie;
    if (movieId) {
      movie = await Movie.findById(movieId);
    }

    // If movie doesn't exist, create it
    if (!movie && movieName) {
      // Check if movie with similar title already exists
      movie = await Movie.findOne({ title: movieName });
      if (!movie) {
        const { imageBaseUrl } = getTmdbConfig();
        movie = await Movie.create({
          tmdbId: Math.floor(Date.now() / 1000), // Use timestamp as fallback tmdbId
          title: movieName,
          overview: movieOverview || "",
          posterPath: moviePoster || "",
          backdropPath: movieBackdrop || "",
          posterUrl: moviePoster ? (moviePoster.startsWith('http') ? moviePoster : `${imageBaseUrl}/w500${moviePoster}`) : null,
          backdropUrl: movieBackdrop ? (movieBackdrop.startsWith('http') ? movieBackdrop : `${imageBaseUrl}/w1280${movieBackdrop}`) : null,
          genres: genres || [],
          runtime: runtime || 0,
          language: language || 'English',
          rating: 0,
          status: 'active',
          price: showPrice || 0,
          movieLanguage: language || 'English',
          format: screenType || '2D',
          isFeatured: false
        });
      }
    }

    if (!movie) {
      return res.status(400).json({ message: 'Movie not found and could not be created' });
    }

    const show = await Show.create({
      movie: movie._id,
      showDateTime,
      showPrice,
      theater,
      screenType,
      language,
      status: 'active'
    });

    const populated = await Show.findById(show._id).populate('movie');
    res.status(201).json(populated);
  } catch (error) {
    console.error('CreateShow error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Show
const UpdateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('movie');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Show
const DeleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin)
const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('show').populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetDashboardStats,
  TmdbSearchMovies,
  TmdbGetMovieDetails,
  ImportMovie,
  GetAllMoviesAdmin,
  UpdateMovie,
  DeleteMovie,
  CreateShow,
  UpdateShow,
  DeleteShow,
  GetAllBookings
};