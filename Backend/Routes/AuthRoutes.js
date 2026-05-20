const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { SyncUser } = require('../Controllers/AuthController');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { getClerkUserMetadata, extractRoleFromClerk } = require('../Utils/clerkSync');

router.post('/sync', requireAuth(), SyncUser);

router.get('/sync-role', requireAuth(), async (req, res) => {
  try {
    await ensureDbConnection();
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let role = 'user';
    try {
      const userMetadata = await getClerkUserMetadata(clerkUserId);
      role = extractRoleFromClerk(userMetadata);
    } catch (err) {
      console.warn('Failed to fetch Clerk metadata:', err.message);
    }

    const user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign in first.' });
    }

    if (user.role !== role) {
      console.log(`Role sync: ${user.role} -> ${role} for user ${clerkUserId}`);
      user.role = role;
      await user.save();
    }

    res.json({ role: user.role, clerkId: clerkUserId });
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