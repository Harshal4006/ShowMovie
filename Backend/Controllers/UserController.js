const { getAuth } = require('@clerk/express');
const User = require('../Models/User');
const Booking = require('../Models/Booking');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const GetCurrentUser = async (req, res) => {
  try {
    await ensureDbConnection();
    
    console.log('[GetCurrentUser] req.auth:', req.auth);
    
    const { userId } = getAuth(req);
    console.log('[GetCurrentUser] userId from getAuth:', userId);
    
    if (!userId) {
      console.log('[GetCurrentUser] No userId - returning 401');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId: userId })
      .populate('bookings')
      .populate('favorites');

    if (!user) {
      console.log('[GetCurrentUser] User not found in database for clerkId:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('[GetCurrentUser] Found user:', { id: user._id, role: user.role });
    res.json(user);
  } catch (error) {
    console.error('[GetCurrentUser] Error:', error.message);
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
    const { movieId, tmdbId } = req.body;
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
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

const GetUserFavorites = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId }).populate({
      path: 'favorites',
      select: 'tmdbId title posterUrl backdropUrl overview releaseDate runtime rating language'
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ favorites: user.favorites });
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
      .populate('favorites');

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