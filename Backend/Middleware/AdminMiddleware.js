const { getAuth } = require('@clerk/express');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

// Verify the authenticated user has admin role before proceeding
const VerifyAdmin = async (req, res, next) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }

    const user = await User.findOne({ clerkId: userId });

    if (user?.role === 'admin') {
      req.user = user;
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during authorization.' });
  }
};

module.exports = VerifyAdmin;