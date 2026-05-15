const User = require('../Models/User');

// Sync user from Clerk to MongoDB
const SyncUser = async (req, res) => {
  try {
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
    const user = await User.findOne({ clerkId: req.user.id })
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
    const { movieId } = req.body;
    const user = await User.findOne({ clerkId: req.user.id });

    const index = user.favorites.indexOf(movieId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(movieId);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SyncUser, GetCurrentUser, UpdateUserRole, ToggleFavorite };