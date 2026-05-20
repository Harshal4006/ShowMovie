const { getAuth } = require('@clerk/express');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const VerifyAdmin = async (req, res, next) => {
  try {
    await ensureDbConnection();

    const { userId } = getAuth(req);
    
    console.log('[VerifyAdmin] userId from getAuth:', userId);
    
    if (!userId) {
      console.log('[VerifyAdmin] No userId - returning 401');
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }

    const user = await User.findOne({ clerkId: userId });
    
    console.log('[VerifyAdmin] User found:', user?._id, 'role:', user?.role);

    if (user?.role === 'admin') {
      req.user = user;
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  } catch (error) {
    console.log('[VerifyAdmin] Error:', error.message);
    return res.status(500).json({ message: 'Server error during authorization.' });
  }
};

module.exports = VerifyAdmin;