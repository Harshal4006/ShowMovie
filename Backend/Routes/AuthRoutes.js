const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { SyncUser } = require('../Controllers/AuthController');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

router.post('/sync', requireAuth(), SyncUser);

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