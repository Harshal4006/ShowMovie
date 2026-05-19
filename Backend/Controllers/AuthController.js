const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

// Sync user from Clerk to MongoDB
const SyncUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const { clerkId, name, email } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email,
        role: 'user'
      });
    } else {
      // Update user info
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
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

// Update user role (admin only)
const UpdateUserRole = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle favorite
const ToggleFavorite = async (req, res) => {
  try {
    const { movieId, tmdbId } = req.body;
    await ensureDbConnection();
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find movie by tmdbId if provided, otherwise use movieId as ObjectId
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

module.exports = { SyncUser, GetCurrentUser, UpdateUserRole, ToggleFavorite, GetUserFavorites };
