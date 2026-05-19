const User = require('../Models/User');
const Booking = require('../Models/Booking');
const ensureDbConnection = require('../Utils/ensureDbConnection');

// Get current user profile
const GetCurrentUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: clerkUserId })
      .populate('bookings')
      .populate('favorites');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update current user profile
const UpdateUserProfile = async (req, res) => {
  try {
    await ensureDbConnection();
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, img } = req.body;
    const user = await User.findOne({ clerkId: clerkUserId });
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

// Toggle favorite movie
const ToggleFavorite = async (req, res) => {
  try {
    const { movieId, tmdbId } = req.body;
    await ensureDbConnection();
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let movieObjectId = null;
    if (tmdbId) {
      const movie = await require('../Models/Movie').findOne({ tmdbId: Number(tmdbId) });
      if (movie) {
        movieObjectId = movie._id;
      }
    } else if (movieId) {
      movieObjectId = movieId;
    }

    if (!movieObjectId) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movieIdString = String(movieObjectId);
    const index = user.favorites.findIndex((id) => String(id) === movieIdString);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(movieObjectId);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user favorites
const GetUserFavorites = async (req, res) => {
  try {
    await ensureDbConnection();
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: clerkUserId }).populate({
      path: 'favorites',
      select: 'tmdbId title posterUrl backdropUrl overview releaseDate runtime rating language'
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all users (paginated)
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

// ADMIN: Get user by ID
const GetUserById = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findById(req.params.id)
      .populate('bookings')
      .populate('favorites');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Update user role
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

// ADMIN: Delete user
const DeleteUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Remove user from bookings
    await Booking.deleteMany({ user: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get user statistics
const GetUserStats = async (req, res) => {
  try {
    await ensureDbConnection();
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookingCount = await Booking.countDocuments({ user: req.params.id });
    const favoriteCount = user.favorites.length;

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bookingCount,
      favoriteCount,
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