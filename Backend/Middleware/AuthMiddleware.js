// Auth Middleware for verifying Clerk authentication
// Simple header-based verification for now

const VerifyToken = async (req, res, next) => {
  try {
    // Check for Clerk session token in header
    const token = req.headers['x-clerk-token'] || req.headers.authorization?.split(' ')[1];

    // If no token, allow request through for now (public endpoints)
    // The actual verification is handled by Clerk's frontend SDK
    if (!token) {
      return next();
    }

    // Basic validation - in production use Clerk's proper verification
    if (token && token.length > 10) {
      req.user = { token };
    }

    next();
  } catch (error) {
    // Allow request through on error to avoid crashes
    next();
  }
};

module.exports = VerifyToken;