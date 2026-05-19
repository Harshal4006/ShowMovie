const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const SyncUser = async (req, res) => {
  try {
    await ensureDbConnection();
    const { clerkId, name, email } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: 'clerkId is required' });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, name, email, role: 'user' });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SyncUser };