const { requireAuth } = require('@clerk/express');

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('[Auth] No authorization header found');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('[Auth] Invalid authorization format');
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  requireAuth()(req, res, (err) => {
    if (err) {
      console.log('[Auth] Clerk verification failed:', err.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
    console.log('[Auth] Token verified successfully for user:', req.auth?.userId);
    next();
  });
};

module.exports = VerifyToken;
