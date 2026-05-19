const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const SyncUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const { clerkId, name, email } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: 'clerkId is required' });
    }

    let role = 'user';
    try {
      const { clerkClient } = require('@clerk/clerk-sdk-node');
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const meta = clerkUser?.publicMetadata || {};
      role = meta.role === 'admin' ? 'admin' : 'user';
    } catch (clerkErr) {
      console.error('Clerk lookup failed:', clerkErr.message);
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, name, email, role });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (role === 'admin') user.role = 'admin';
      await user.save();
    }

    res.json({ ...user.toObject(), syncedRole: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SyncUser };