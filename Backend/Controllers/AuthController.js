const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { getClerkUserMetadata, extractRoleFromClerk } = require('../Utils/clerkSync');

// Sync user from Clerk authentication to local database
const SyncUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const { clerkId, name, email } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: 'clerkId is required' });
    }

    let user = await User.findOne({ clerkId });

    let role = 'user';
    try {
      const userMetadata = await getClerkUserMetadata(clerkId);
      role = extractRoleFromClerk(userMetadata);
    } catch {
      console.warn('Failed to fetch Clerk metadata, defaulting to user role');
    }

    if (!user) {
      user = await User.create({ clerkId, name, email, role });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (user.role !== role) {
        user.role = role;
      }
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SyncUser };