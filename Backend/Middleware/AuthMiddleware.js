const { getAuth } = require('@clerk/express');

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('[VerifyToken] Path:', req.path);
  console.log('[VerifyToken] Auth header:', authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : 'NONE');
  
  const auth = getAuth(req);
  
  console.log('[VerifyToken] getAuth result:', {
    userId: auth.userId,
    sessionId: auth.sessionId,
    organizationId: auth.organizationId
  });
  
  if (!auth.userId) {
    console.log('[VerifyToken] NO USER ID - returning 401');
    return res.status(401).json({ 
      message: 'Unauthorized: No valid user session',
      hint: 'Please sign in again'
    });
  }
  
  console.log('[VerifyToken] User authenticated:', auth.userId);
  next();
};

module.exports = VerifyToken;