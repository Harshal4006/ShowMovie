const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { SyncUser } = require('../Controllers/AuthController');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

router.post('/sync', requireAuth(), SyncUser);

router.get('/setup-admin', requireAuth(), async (req, res) => {
  try {
    await ensureDbConnection();
    const clerkUserId = req.auth.userId;

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      user = await User.create({ clerkId: clerkUserId, name: '', email: '', role: 'admin' });
    } else {
      user.role = 'admin';
      await user.save();
    }

    res.json({
      clerkUserId,
      dbUserRole: user.role,
      isAdmin: user.role === 'admin',
      message: user.role === 'admin'
        ? 'SUCCESS! You are now an admin. Refresh the page to access admin dashboard.'
        : 'Something went wrong.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;