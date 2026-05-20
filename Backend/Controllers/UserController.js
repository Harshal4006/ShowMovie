const { getAuth } = require('@clerk/express');
const User = require('../Models/User');
const Movie = require('../Models/Movie');
const Booking = require('../Models/Booking');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const GetCurrentUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId: userId })
      .populate('bookings')
      .select('-favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateUserProfile = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, img } = req.body;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (img) user.img = img;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ToggleFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.body;
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!tmdbId) return res.status(400).json({ message: 'tmdbId is required' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const tmdbIdNum = Number(tmdbId);
    if (isNaN(tmdbIdNum)) return res.status(400).json({ message: 'Invalid tmdbId' });

    const index = user.favorites.indexOf(tmdbIdNum);
    
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(tmdbIdNum);
    }

    await user.save();
    res.json({ tmdbId: tmdbIdNum, action: index > -1 ? 'removed' : 'added', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetUserFavorites = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId }).select('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favorites = user.favorites || [];
    
    const movies = await Movie.find({ tmdbId: { $in: favorites } });
    
    const favoritesData = favorites.map(tmdbId => {
      const movie = movies.find(m => m.tmdbId === Number(tmdbId));
      if (movie) {
        return {
          tmdbId: movie.tmdbId,
          _id: movie._id,
          title: movie.title,
          originalTitle: movie.originalTitle,
          overview: movie.overview,
          posterPath: movie.posterPath,
          backdropPath: movie.backdropPath,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          releaseDate: movie.releaseDate,
          runtime: movie.runtime,
          genres: movie.genres,
          rating: movie.rating,
          voteCount: movie.voteCount,
          language: movie.language,
          tagline: movie.tagline,
          cast: movie.cast,
          status: movie.status,
          price: movie.price,
          movieLanguage: movie.movieLanguage,
          format: movie.format
        };
      }
      return null;
    }).filter(Boolean);

    res.json({ favorites: favoritesData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    await ensureDbConnection();
    const { page = 1, limit = 10, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-favorites -bookings')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetUserById = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findById(req.params.id)
      .populate('bookings')
      .select('-favorites');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateUserRole = async (req, res) => {
  try {
    await ensureDbConnection();
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Booking.deleteMany({ user: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetUserStats = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findById(req.params.id).select('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookingCount = await Booking.countDocuments({ user: req.params.id });

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bookingCount,
      favoriteCount: user.favorites?.length || 0,
      memberSince: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetCurrentUser,
  UpdateUserProfile,
  ToggleFavorite,
  GetUserFavorites,
  GetAllUsers,
  GetUserById,
  UpdateUserRole,
  DeleteUser,
  GetUserStats
};