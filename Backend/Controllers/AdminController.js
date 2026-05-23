const Movie = require('../Models/Movie');
const Show = require('../Models/Show');
const Booking = require('../Models/Booking');
const User = require('../Models/User');
const axios = require('axios');
const mongoose = require('mongoose');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { CreateNotification } = require('./NotificationController');
const { inngest } = require('../Inngest/Inngest');

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

// Fetch dashboard statistics for admin panel
const GetDashboardStats = async (req, res) => {
  try {
    await ensureDbConnection();
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

// Search movies on TMDB by query string
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

// Fetch currently playing movies from TMDB
const TmdbGetNowPlaying = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await callTmdb(`/movie/now_playing?language=en-US&page=${page}&region=US`);
    res.json({ movies: data.results, page: data.page, totalPages: data.total_pages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get now playing movies', error: error.message });
  }
};

// Fetch upcoming movies from TMDB
const TmdbGetUpcoming = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await callTmdb(`/movie/upcoming?language=en-US&page=${page}&region=US`);
    res.json({ movies: data.results, page: data.page, totalPages: data.total_pages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get upcoming movies', error: error.message });
  }
};

// Fetch trending movies from TMDB
const TmdbGetTrending = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await callTmdb(`/trending/movie/week?language=en-US&page=${page}`);
    res.json({ movies: data.results, page: data.page, totalPages: data.total_pages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get trending movies', error: error.message });
  }
};

// Fetch popular movies from TMDB
const TmdbGetPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await callTmdb(`/movie/popular?language=en-US&page=${page}&region=US`);
    res.json({ movies: data.results, page: data.page, totalPages: data.total_pages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get popular movies', error: error.message });
  }
};

// Fetch full movie details, credits, and trailer from TMDB
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

// Import a movie from TMDB into local database
const ImportMovie = async (req, res) => {
  try {
    await ensureDbConnection();
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
      status: status || 'active',
      isFeatured: isFeatured || false
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to import movie', error: error.message });
  }
};

// List all movies with optional filters and pagination
const GetAllMoviesAdmin = async (req, res) => {
  try {
    await ensureDbConnection();
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

// Update movie metadata and admin flags
const UpdateMovie = async (req, res) => {
  try {
    await ensureDbConnection();
    const { price, movieLanguage, format, status, isFeatured, isTrending, isMostPopular, trailerKey, trailerUrl, tagline } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { price, movieLanguage, format, status, isFeatured, isTrending, isMostPopular, trailerKey, trailerUrl, tagline },
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a movie from the database
const DeleteMovie = async (req, res) => {
  try {
    await ensureDbConnection();
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create one or more showings for a movie at a theater
const CreateShow = async (req, res) => {
  try {
    await ensureDbConnection();
    const {
      movieId,
      movieName,
      moviePoster,
      movieBackdrop,
      movieOverview,
      showDateTime,
      showDateTimes,
      showPrice,
      theater,
      screenType,
      language,
      genres,
      runtime,
      releaseDate,
      tagline,
      rating,
      voteCount,
      cast,
      trailerUrl,
    } = req.body;

    const dateTimes = Array.isArray(showDateTimes) && showDateTimes.length > 0
      ? showDateTimes
      : (showDateTime ? [showDateTime] : []);

    if (dateTimes.length === 0) {
      return res.status(400).json({ message: 'At least one showDateTime is required' });
    }

    // Validate date times early to avoid inserting bad shows
    const invalid = dateTimes.find((dt) => Number.isNaN(new Date(dt).getTime()));
    if (invalid) {
      return res.status(400).json({ message: 'Invalid showDateTime value', showDateTime: invalid });
    }

    // First check if movie already exists in Movie collection
    let movie;
    if (movieId) {
      // `movieId` can be either a Mongo ObjectId (existing movie) OR a numeric TMDB id (from TMDB search results)
      if (mongoose.isValidObjectId(movieId)) {
        movie = await Movie.findById(movieId);
      } else {
        const tmdbId = Number(movieId);
        if (Number.isFinite(tmdbId)) {
          movie = await Movie.findOne({ tmdbId });
        }
      }
    }

    // If TMDB id was provided but movie isn't in DB yet, import full details from TMDB now
    if (!movie && movieId && !mongoose.isValidObjectId(movieId)) {
      const tmdbId = Number(movieId);
      if (Number.isFinite(tmdbId)) {
        const existingByTmdb = await Movie.findOne({ tmdbId });
        if (existingByTmdb) {
          movie = existingByTmdb;
        } else {
          try {
            const { imageBaseUrl } = getTmdbConfig();
            const [tmdbMovie, credits, videos] = await Promise.all([
              callTmdb(`/movie/${tmdbId}?language=en-US`),
              callTmdb(`/movie/${tmdbId}/credits?language=en-US`),
              callTmdb(`/movie/${tmdbId}/videos?language=en-US`)
            ]);

            const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const tmdbCast = credits.cast?.slice(0, 10).map(c => ({
              name: c.name,
              character: c.character,
              profilePath: c.profile_path ? `${imageBaseUrl}/w200${c.profile_path}` : null
            }));

            movie = await Movie.create({
              tmdbId: tmdbMovie.id,
              title: tmdbMovie.title,
              originalTitle: tmdbMovie.original_title,
              overview: tmdbMovie.overview,
              posterPath: tmdbMovie.poster_path,
              backdropPath: tmdbMovie.backdrop_path,
              posterUrl: tmdbMovie.poster_path ? `${imageBaseUrl}/w500${tmdbMovie.poster_path}` : null,
              backdropUrl: tmdbMovie.backdrop_path ? `${imageBaseUrl}/w1280${tmdbMovie.backdrop_path}` : null,
              releaseDate: tmdbMovie.release_date,
              runtime: tmdbMovie.runtime,
              genres: tmdbMovie.genres,
              rating: tmdbMovie.vote_average,
              voteCount: tmdbMovie.vote_count,
              language: tmdbMovie.original_language,
              tagline: tmdbMovie.tagline,
              trailerKey: trailer?.key || null,
              trailerUrl: trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : trailerUrl || null,
              cast: tmdbCast,
              status: 'active',
              price: showPrice || 0,
              movieLanguage: language || 'English',
              format: screenType || '2D',
              isFeatured: false
            });
          } catch {
            // TMDB unavailable — will fall through to minimal creation below
          }
        }
      }
    }

    // If movie doesn't exist, create it
    if (!movie && movieName) {
      // If no TMDB id is provided, try to resolve the movie from TMDB by title to avoid empty cards
      try {
        const search = await callTmdb(`/search/movie?query=${encodeURIComponent(movieName)}&language=en-US&page=1`);
        const bestMatch = search.results?.[0];
        if (bestMatch?.id) {
          const { imageBaseUrl } = getTmdbConfig();
          const [tmdbMovie, credits, videos] = await Promise.all([
            callTmdb(`/movie/${bestMatch.id}?language=en-US`),
            callTmdb(`/movie/${bestMatch.id}/credits?language=en-US`),
            callTmdb(`/movie/${bestMatch.id}/videos?language=en-US`)
          ]);

          const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          const tmdbCast = credits.cast?.slice(0, 10).map(c => ({
            name: c.name,
            character: c.character,
            profilePath: c.profile_path ? `${imageBaseUrl}/w200${c.profile_path}` : null
          }));

          movie = await Movie.create({
            tmdbId: tmdbMovie.id,
            title: tmdbMovie.title,
            originalTitle: tmdbMovie.original_title,
            overview: tmdbMovie.overview,
            posterPath: tmdbMovie.poster_path,
            backdropPath: tmdbMovie.backdrop_path,
            posterUrl: tmdbMovie.poster_path ? `${imageBaseUrl}/w500${tmdbMovie.poster_path}` : null,
            backdropUrl: tmdbMovie.backdrop_path ? `${imageBaseUrl}/w1280${tmdbMovie.backdrop_path}` : null,
            releaseDate: tmdbMovie.release_date,
            runtime: tmdbMovie.runtime,
            genres: tmdbMovie.genres,
            rating: tmdbMovie.vote_average,
            voteCount: tmdbMovie.vote_count,
            language: tmdbMovie.original_language,
            tagline: tmdbMovie.tagline,
            trailerKey: trailer?.key || null,
            trailerUrl: trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : trailerUrl || null,
            cast: tmdbCast,
            status: 'active',
            price: showPrice || 0,
            movieLanguage: language || 'English',
            format: screenType || '2D',
            isFeatured: false
          });
        }
      } catch (e) {
        // fall back to minimal creation below
      }

      // Check if movie with similar title already exists
      if (!movie) movie = await Movie.findOne({ title: movieName });
      if (!movie) {
        const { imageBaseUrl } = getTmdbConfig();
        movie = await Movie.create({
          tmdbId: Number.isFinite(Number(movieId)) ? Number(movieId) : Math.floor(Date.now() / 1000),
          title: movieName,
          originalTitle: movieName,
          overview: movieOverview || '',
          posterPath: moviePoster || '',
          backdropPath: movieBackdrop || '',
          posterUrl: moviePoster ? (moviePoster.startsWith('http') ? moviePoster : `${imageBaseUrl}/w500${moviePoster}`) : null,
          backdropUrl: movieBackdrop ? (movieBackdrop.startsWith('http') ? movieBackdrop : `${imageBaseUrl}/w1280${movieBackdrop}`) : null,
          releaseDate: releaseDate || '',
          runtime: runtime || 0,
          genres: genres || [],
          rating: rating || 0,
          voteCount: voteCount || 0,
          language: language || 'English',
          tagline: tagline || '',
          trailerKey: null,
          trailerUrl: trailerUrl || null,
          cast: cast || [],
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

    const showsToCreate = dateTimes.map((dt) => ({
      movie: movie._id,
      showDateTime: dt,
      showPrice,
      theater,
      screenType,
      language,
      status: 'active'
    }));

    const createdShows = await Show.insertMany(showsToCreate, { ordered: true });
    const createdIds = createdShows.map((s) => s._id);
    const populated = await Show.find({ _id: { $in: createdIds } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    // Notify users who favorited this movie
    if (movie) {
      const favoritedUsers = await User.find({ favorites: movie.tmdbId }).select('_id');
      const showDate = new Date(dateTimes[0]).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      for (const user of favoritedUsers) {
        await CreateNotification(
          user._id,
          'show_added',
          'New Show Added!',
          `"${movie.title}" is now showing from ${showDate}`,
          movie._id,
          'Movie'
        );
      }
    }

    // Trigger email notification to all users
    const firstShowDate = new Date(dateTimes[0]);
    await inngest.send({
      name: 'show/added',
      data: {
        showId: createdShows[0]._id.toString(),
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        showDate: firstShowDate.toLocaleDateString('en-US', {
          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        }),
        showTime: firstShowDate.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit',
        }),
        theater,
        screenType,
        language,
        price: showPrice || 0,
      },
    });

    res.status(201).json({ shows: populated, movie });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create show',
      error: error.message,
    });
  }
};

// Update show details like time, price, or status
const UpdateShow = async (req, res) => {
  try {
    await ensureDbConnection();
    const allowed = ['showDateTime', 'showPrice', 'theater', 'screenType', 'language', 'status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const show = await Show.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('movie');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a show from the database
const DeleteShow = async (req, res) => {
  try {
    await ensureDbConnection();
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all bookings with show and movie details for admin review
const GetAllBookings = async (req, res) => {
  try {
    await ensureDbConnection();
    const bookings = await Booking.find()
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const enriched = bookings.map((booking) => ({
      _id: booking._id,
      bookedSeats: booking.bookedSeats,
      amount: booking.amount,
      isPaid: booking.isPaid,
      paymentId: booking.paymentId,
      status: booking.status,
      createdAt: booking.createdAt,
      show: booking.show ? {
        _id: booking.show._id,
        showDateTime: booking.show.showDateTime,
        showPrice: booking.show.showPrice,
        theater: booking.show.theater,
        screenType: booking.show.screenType,
        language: booking.show.language,
        movie: booking.show.movie ? {
          _id: booking.show.movie._id,
          tmdbId: booking.show.movie.tmdbId,
          title: booking.show.movie.title,
          posterPath: booking.show.movie.posterPath,
          backdropPath: booking.show.movie.backdropPath,
          posterUrl: booking.show.movie.posterUrl,
          backdropUrl: booking.show.movie.backdropUrl,
          releaseDate: booking.show.movie.releaseDate,
          runtime: booking.show.movie.runtime,
          genres: booking.show.movie.genres,
          rating: booking.show.movie.rating,
          language: booking.show.movie.language,
          status: booking.show.movie.status
        } : null
      } : null
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetDashboardStats,
  TmdbSearchMovies,
  TmdbGetNowPlaying,
  TmdbGetUpcoming,
  TmdbGetTrending,
  TmdbGetPopular,
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
