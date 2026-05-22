// Verifies Clerk session token on protected routes

const { getAuth } = require('@clerk/express');

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