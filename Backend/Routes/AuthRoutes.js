const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { SyncUser } = require('../Controllers/AuthController');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

router.post('/sync', requireAuth(), SyncUser);

// Set admin by email - call this once to grant yourself admin access
// Usage: /api/auth/set-admin?email=your@email.com
router.get('/set-admin', async (req, res) => {
  try {
    await ensureDbConnection();
    const { email } = req.query;

    if (!email) {
      return res.json({ message: 'Provide email as query param: ?email=your@email.com' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({ message: 'User not found in database. Sign in once via the app first.' });
    }

    user.role = 'admin';
    await user.save();

    res.json({
      message: 'SUCCESS! You are now an admin.',
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;