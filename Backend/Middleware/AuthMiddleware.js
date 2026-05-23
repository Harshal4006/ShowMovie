const { getAuth } = require('@clerk/express');

// Check that a valid Clerk user session exists on the request
const VerifyToken = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({
      message: 'Unauthorized: No valid user session',
    });
  }

  next();
};

module.exports = VerifyToken;