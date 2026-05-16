const VerifyAdmin = async (req, res, next) => {
  try {
    // For now, allow all requests through for development
    // TODO: Add proper admin role verification with Clerk
    // if (req.user?.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied. Admin only.' });
    // }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = VerifyAdmin;