const { requireAuth } = require('@clerk/express');
const User = require('../Models/User');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const VerifyAdmin = async (req, res, next) => {
  try {
    await ensureDbConnection();

    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }

    let isClerkAdmin = false;
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      isClerkAdmin = clerkUser?.publicMetadata?.role === 'admin';
    } catch {
      // Fall back to DB if Clerk lookup fails
    }

    const user = await User.findOne({ clerkId: clerkUserId });

    if (isClerkAdmin || user?.role === 'admin') {
      req.user = user;
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during authorization.' });
  }
};

module.exports = VerifyAdmin;