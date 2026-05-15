// Auth Middleware for verifying Clerk authentication
const jwt = require('jsonwebtoken');

const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify Clerk JWT token
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = VerifyToken;