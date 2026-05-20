const { requireAuth } = require('@clerk/express');

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('[AuthMiddleware] Request to:', req.path);
  console.log('[AuthMiddleware] Auth header present:', !!authHeader);
  if (authHeader) {
    console.log('[AuthMiddleware] Auth header format:', authHeader.substring(0, 20) + '...');
  }

  if (!authHeader) {
    console.log('[AuthMiddleware] No authorization header');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('[AuthMiddleware] Invalid authorization format');
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  requireAuth()(req, res, (err) => {
    if (err) {
      console.log('[AuthMiddleware] Clerk verification failed:', err.message);
      console.log('[AuthMiddleware] Error type:', err.name);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
    
    console.log('[AuthMiddleware] Token verified. User ID:', req.auth?.userId);
    next();
  });
};

module.exports = VerifyToken;
