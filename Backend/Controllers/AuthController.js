const { getAuth } = require('@clerk/express');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { getClerkUserMetadata, extractRoleFromClerk } = require('../Utils/clerkSync');

const SyncUser = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const { userId } = getAuth(req);
    console.log('[SyncUser] userId from getAuth:', userId);
    
    const { clerkId, name, email } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: 'clerkId is required' });
    }

    let user = await User.findOne({ clerkId });

    let role = 'user';
    try {
      const userMetadata = await getClerkUserMetadata(clerkId);
      role = extractRoleFromClerk(userMetadata);
    } catch (err) {
      console.warn('Failed to fetch Clerk metadata, using default role:', err.message);
    }

    if (!user) {
      user = await User.create({ clerkId, name, email, role });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (user.role !== role) {
        console.log(`Role sync: ${user.role} -> ${role} for user ${clerkId}`);
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