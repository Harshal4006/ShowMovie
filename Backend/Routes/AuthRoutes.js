const express = require('express');
const router = express.Router();
const { getAuth } = require('@clerk/express');
const VerifyToken = require('../Middleware/AuthMiddleware');
const { SyncUser } = require('../Controllers/AuthController');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { getClerkUserMetadata, extractRoleFromClerk } = require('../Utils/clerkSync');

router.post('/sync', VerifyToken, SyncUser);

router.get('/sync-role', VerifyToken, async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    console.log('[sync-role] userId from getAuth:', userId);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let role = 'user';
    try {
      const userMetadata = await getClerkUserMetadata(userId);
      role = extractRoleFromClerk(userMetadata);
    } catch (err) {
      console.warn('Failed to fetch Clerk metadata:', err.message);
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign in first.' });
    }

    if (user.role !== role) {
      console.log(`Role sync: ${user.role} -> ${role} for user ${userId}`);
      user.role = role;
      await user.save();
    }

    res.json({ role: user.role, clerkId: userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/set-admin', async (req, res) => {
  try {
    await ensureDbConnection();
    const { email } = req.query;

    if (!email) {
      return res.json({ message: 'Provide email: /auth/set-admin?email=you@email.com' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({ message: 'User not found. Sign in via the app first.' });
    }

    user.role = 'admin';
    await user.save();

    res.json({ message: 'Admin set! Refresh the app and log in again.', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;